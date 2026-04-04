// EasyParcel OpenAPI (2026-03)
// Docs: https://easyparcel.github.io/OpenAPI/
// Auth: OAuth 2.0 Bearer Token (single-use refresh tokens)

import { writeFile, readFile } from "fs/promises"
import { join } from "path"

const EASYPARCEL_API = "https://api.easyparcel.com/open_api/2026-03"
const EASYPARCEL_AUTH = "https://api.easyparcel.com/oauth"
const FETCH_TIMEOUT = 15000
const TOKEN_FILE = join(process.cwd(), ".easyparcel-token.json")

// --- Token Management (single-use refresh tokens) ---

let cachedToken: { access_token: string; expires_at: number } | null = null

async function getAccessToken(): Promise<string> {
  if (cachedToken && cachedToken.expires_at > Date.now() + 60000) {
    return cachedToken.access_token
  }

  // Read latest refresh token (may have been rotated)
  let refreshToken = await getLatestRefreshToken()
  if (!refreshToken) throw new Error("No EasyParcel refresh token configured")

  const clientId = process.env.EASYPARCEL_CLIENT_ID!
  const clientSecret = process.env.EASYPARCEL_CLIENT_SECRET!

  const res = await fetch(`${EASYPARCEL_AUTH}/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
    signal: AbortSignal.timeout(FETCH_TIMEOUT),
  })

  const data = await res.json()

  if (!data.access_token) {
    throw new Error(`EasyParcel auth error: ${data.msg || data.message || "Unknown error"}`)
  }

  cachedToken = {
    access_token: data.access_token,
    expires_at: Date.now() + (data.expires_in || 3600) * 1000,
  }

  // Persist new refresh token (single-use rotation)
  if (data.refresh_token) {
    await saveRefreshToken(data.refresh_token)
  }

  return data.access_token
}

async function getLatestRefreshToken(): Promise<string | null> {
  try {
    const content = await readFile(TOKEN_FILE, "utf-8")
    const stored = JSON.parse(content)
    if (stored.refresh_token) return stored.refresh_token
  } catch {
    // File doesn't exist, use env var
  }
  return process.env.EASYPARCEL_REFRESH_TOKEN || null
}

async function saveRefreshToken(token: string): Promise<void> {
  try {
    await writeFile(TOKEN_FILE, JSON.stringify({ refresh_token: token, updated_at: new Date().toISOString() }))
  } catch (err) {
    console.error("Failed to save EasyParcel refresh token:", err)
  }
}

// --- Rate Checking ---

interface RateCheckParams {
  sender_postcode: string
  sender_state: string
  receiver_postcode: string
  receiver_state: string
  weight: number
}

export async function checkRates(params: RateCheckParams) {
  const token = await getAccessToken()

  const body = {
    shipment: [{
      weight: params.weight,
      sender: {
        postcode: params.sender_postcode,
        subdivision_code: `MY-${getStateCode(params.sender_state)}`,
        country: "MY",
      },
      receiver: {
        postcode: params.receiver_postcode,
        subdivision_code: `MY-${getStateCode(params.receiver_state)}`,
        country: "MY",
      },
    }],
  }

  const res = await fetch(`${EASYPARCEL_API}/shipment/quotations`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(FETCH_TIMEOUT),
  })

  if (!res.ok) {
    const error = await res.text()
    throw new Error(`EasyParcel rate check failed: ${error}`)
  }

  const data = await res.json()
  const result = data.data?.[0]
  if (result?.status === "error") {
    throw new Error(`EasyParcel: ${result.errors?.join(", ")}`)
  }
  return result?.quotations || []
}

// --- Create Order ---

interface CreateOrderParams {
  reference: string
  service_id: string
  collection_date?: string
  weight: number
  sender: { name: string; phone: string; email: string; address1: string; address2?: string; city: string; state: string; postcode: string }
  receiver: { name: string; phone: string; email: string; address1: string; address2?: string; city: string; state: string; postcode: string }
  items: { content: string; weight: number; value: number; quantity: number }[]
}

export async function createOrder(params: CreateOrderParams) {
  const token = await getAccessToken()

  const body = {
    shipment: [{
      reference: params.reference,
      service_id: params.service_id,
      collection_date: params.collection_date || new Date().toISOString().split("T")[0],
      weight: params.weight,
      height: 10,
      length: 20,
      width: 15,
      sender: {
        name: params.sender.name,
        phone_number_country_code: "MY",
        phone_number: params.sender.phone.replace(/[^0-9]/g, ""),
        email: params.sender.email,
        address_1: params.sender.address1,
        address_2: params.sender.address2 || "",
        city: params.sender.city,
        postcode: params.sender.postcode,
        subdivision_code: `MY-${getStateCode(params.sender.state)}`,
        country_code: "MY",
      },
      receiver: {
        name: params.receiver.name,
        phone_number_country_code: "MY",
        phone_number: params.receiver.phone.replace(/[^0-9]/g, ""),
        email: params.receiver.email,
        address_1: params.receiver.address1,
        address_2: params.receiver.address2 || "",
        city: params.receiver.city,
        postcode: params.receiver.postcode,
        subdivision_code: `MY-${getStateCode(params.receiver.state)}`,
        country_code: "MY",
      },
      item: params.items.map((i) => ({
        content: i.content,
        weight: i.weight,
        height: 10,
        length: 20,
        width: 15,
        currency_code: "MYR",
        value: i.value,
        quantity: i.quantity,
      })),
      feature: {
        sms_tracking: true,
        email_tracking: true,
        whatsapp_tracking: true,
      },
    }],
  }

  const res = await fetch(`${EASYPARCEL_API}/shipment/submit_orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(FETCH_TIMEOUT),
  })

  if (!res.ok) {
    const error = await res.text()
    throw new Error(`EasyParcel order failed: ${error}`)
  }

  return res.json()
}

// --- Tracking ---

export async function trackShipment(trackingNumber: string) {
  const token = await getAccessToken()
  const res = await fetch(`${EASYPARCEL_API}/shipment/tracking?tracking_number=${trackingNumber}`, {
    headers: { Authorization: `Bearer ${token}` },
    signal: AbortSignal.timeout(FETCH_TIMEOUT),
  })
  if (!res.ok) throw new Error("Tracking failed")
  return res.json()
}

// --- State Code Mapping (ISO 3166-2:MY) ---

function getStateCode(state: string): string {
  const map: Record<string, string> = {
    "Johor": "01",
    "Kedah": "02",
    "Kelantan": "03",
    "Melaka": "04",
    "Negeri Sembilan": "05",
    "Pahang": "06",
    "Pulau Pinang": "07",
    "Perak": "08",
    "Perlis": "09",
    "Selangor": "10",
    "Terengganu": "11",
    "Sabah": "12",
    "Sarawak": "13",
    "Kuala Lumpur": "14",
    "Labuan": "15",
    "Putrajaya": "16",
  }
  return map[state] || "14"
}
