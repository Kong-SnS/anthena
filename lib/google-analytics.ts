import crypto from "crypto"

// Minimal GA4 Data API client — no SDK dependency. Authenticates with a Google
// service account (JWT bearer flow) and calls the Analytics Data API directly.
//
// Required env vars (server-side only, never NEXT_PUBLIC_):
//   GA_PROPERTY_ID              e.g. "123456789" (numeric GA4 property ID)
//   GOOGLE_SERVICE_ACCOUNT_KEY  the full service-account JSON key, as one string
//
// The service account must be added as a Viewer on the GA4 property.

const TOKEN_URL = "https://oauth2.googleapis.com/token"
const DATA_API = "https://analyticsdata.googleapis.com/v1beta"
const SCOPE = "https://www.googleapis.com/auth/analytics.readonly"

interface ServiceAccount {
  client_email: string
  private_key: string
}

/** Returns null when credentials aren't configured, so callers can show setup UI. */
export function analyticsConfigured(): boolean {
  return Boolean(process.env.GA_PROPERTY_ID && process.env.GOOGLE_SERVICE_ACCOUNT_KEY)
}

function loadServiceAccount(): ServiceAccount {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_KEY
  if (!raw) throw new Error("GOOGLE_SERVICE_ACCOUNT_KEY is not set")
  let parsed: ServiceAccount
  try {
    parsed = JSON.parse(raw)
  } catch {
    throw new Error("GOOGLE_SERVICE_ACCOUNT_KEY is not valid JSON")
  }
  if (!parsed.client_email || !parsed.private_key) {
    throw new Error("Service account key is missing client_email / private_key")
  }
  return parsed
}

const base64url = (input: Buffer | string) =>
  Buffer.from(input).toString("base64url")

// Cache the access token in module memory until shortly before it expires.
// Fluid Compute reuses instances, so this avoids re-signing on every request.
let cachedToken: { value: string; expiresAt: number } | null = null

async function getAccessToken(): Promise<string> {
  const now = Math.floor(Date.now() / 1000)
  if (cachedToken && cachedToken.expiresAt > now + 60) {
    return cachedToken.value
  }

  const sa = loadServiceAccount()
  const header = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }))
  const claims = base64url(
    JSON.stringify({
      iss: sa.client_email,
      scope: SCOPE,
      aud: TOKEN_URL,
      iat: now,
      exp: now + 3600,
    })
  )
  const signingInput = `${header}.${claims}`
  const signature = crypto
    .createSign("RSA-SHA256")
    .update(signingInput)
    .sign(sa.private_key)
  const assertion = `${signingInput}.${base64url(signature)}`

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
  })

  if (!res.ok) {
    throw new Error(`Google token exchange failed: ${res.status} ${await res.text()}`)
  }

  const json = (await res.json()) as { access_token: string; expires_in: number }
  cachedToken = {
    value: json.access_token,
    expiresAt: now + json.expires_in,
  }
  return json.access_token
}

interface ReportRequest {
  dimensions?: { name: string }[]
  metrics: { name: string }[]
  dateRanges: { startDate: string; endDate: string }[]
  orderBys?: unknown[]
  limit?: number
}

interface ReportRow {
  dimensionValues?: { value: string }[]
  metricValues?: { value: string }[]
}

export interface ReportResult {
  rows: ReportRow[]
}

/** Run several GA4 reports in a single HTTP call. */
export async function batchRunReports(
  requests: ReportRequest[]
): Promise<ReportResult[]> {
  const token = await getAccessToken()
  const propertyId = process.env.GA_PROPERTY_ID

  const res = await fetch(
    `${DATA_API}/properties/${propertyId}:batchRunReports`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ requests }),
      // Ask Google not to cache; we cache the shaped response ourselves.
      cache: "no-store",
    }
  )

  if (!res.ok) {
    throw new Error(`GA4 batchRunReports failed: ${res.status} ${await res.text()}`)
  }

  const json = (await res.json()) as { reports?: ReportResult[] }
  return json.reports ?? []
}
