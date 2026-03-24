// EasyParcel OpenAPI (2026-03)
// Docs: https://easyparcel.github.io/OpenAPI/
// Auth: OAuth 2.0 Bearer Token

const EASYPARCEL_API = "https://api.easyparcel.com/open_api/2026-03"
const EASYPARCEL_AUTH = "https://api.easyparcel.com/oauth"
const FETCH_TIMEOUT = 15000

// --- Token Management ---

let cachedToken: { access_token: string; expires_at: number } | null = null

async function getAccessToken(): Promise<string> {
  // Return cached token if still valid
  if (cachedToken && cachedToken.expires_at > Date.now() + 60000) {
    return cachedToken.access_token
  }

  // Try refresh token first
  const refreshToken = process.env.EASYPARCEL_REFRESH_TOKEN
  if (refreshToken) {
    try {
      const token = await refreshAccessToken(refreshToken)
      return token
    } catch {
      console.error("EasyParcel token refresh failed, using API key fallback")
    }
  }

  // Fallback to API key (v1.4 compat)
  const apiKey = process.env.EASYPARCEL_API_KEY
  if (apiKey) return apiKey

  throw new Error("No EasyParcel credentials configured")
}

async function refreshAccessToken(refreshToken: string): Promise<string> {
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

  if (!res.ok) throw new Error("Token refresh failed")

  const data = await res.json()
  cachedToken = {
    access_token: data.access_token,
    expires_at: Date.now() + (data.expires_in || 3600) * 1000,
  }
  return data.access_token
}

// --- Helper to detect which API to use ---

function isOAuthConfigured(): boolean {
  return !!(process.env.EASYPARCEL_CLIENT_ID && process.env.EASYPARCEL_REFRESH_TOKEN)
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
  if (isOAuthConfigured()) {
    return checkRatesOpenAPI(params)
  }
  return checkRatesV14(params)
}

async function checkRatesOpenAPI(params: RateCheckParams) {
  const token = await getAccessToken()

  const body = {
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
    parcel: {
      weight: params.weight,
    },
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
  return data.data || []
}

async function checkRatesV14(params: RateCheckParams) {
  const body = {
    api: process.env.EASYPARCEL_API_KEY,
    bulk: [
      {
        pick_code: params.sender_postcode,
        pick_state: params.sender_state,
        pick_country: "MY",
        send_code: params.receiver_postcode,
        send_state: params.receiver_state,
        send_country: "MY",
        weight: params.weight,
      },
    ],
  }

  const v14Url = process.env.EASYPARCEL_V14_URL || "https://connect.easyparcel.my/"
  const res = await fetch(`${v14Url}?ac=EPRateCheckingBulk`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(FETCH_TIMEOUT),
  })

  if (!res.ok) throw new Error("EasyParcel rate check failed")

  const data = await res.json()
  return data.result?.[0]?.rates || []
}

// --- Create Order ---

interface CreateOrderParams {
  reference: string
  service_id: string
  collection_date?: string
  weight: number
  sender: { name: string; contact: string; address1: string; city: string; state: string; postcode: string }
  receiver: { name: string; contact: string; address1: string; city: string; state: string; postcode: string }
  items: { content: string; weight: number; value: number }[]
}

export async function createOrder(params: CreateOrderParams) {
  if (isOAuthConfigured()) {
    return createOrderOpenAPI(params)
  }
  return createOrderV14(params)
}

async function createOrderOpenAPI(params: CreateOrderParams) {
  const token = await getAccessToken()

  const body = {
    reference: params.reference,
    service_id: params.service_id,
    collection_date: params.collection_date || new Date().toISOString().split("T")[0],
    weight: params.weight,
    height: 10,
    length: 20,
    width: 15,
    sender: {
      name: params.sender.name,
      contact: params.sender.contact,
      address1: params.sender.address1,
      city: params.sender.city,
      postcode: params.sender.postcode,
      subdivision_code: `MY-${getStateCode(params.sender.state)}`,
      country: "MY",
    },
    receiver: {
      name: params.receiver.name,
      contact: params.receiver.contact,
      address1: params.receiver.address1,
      city: params.receiver.city,
      postcode: params.receiver.postcode,
      subdivision_code: `MY-${getStateCode(params.receiver.state)}`,
      country: "MY",
    },
    item: params.items,
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

async function createOrderV14(params: CreateOrderParams) {
  const body = {
    api: process.env.EASYPARCEL_API_KEY,
    bulk: [
      {
        pick_name: params.sender.name,
        pick_contact: params.sender.contact,
        pick_addr1: params.sender.address1,
        pick_city: params.sender.city,
        pick_state: params.sender.state,
        pick_code: params.sender.postcode,
        pick_country: "MY",
        send_name: params.receiver.name,
        send_contact: params.receiver.contact,
        send_addr1: params.receiver.address1,
        send_city: params.receiver.city,
        send_state: params.receiver.state,
        send_code: params.receiver.postcode,
        send_country: "MY",
        weight: params.weight,
        content: params.items[0]?.content || "Parcel",
        value: params.items[0]?.value || 0,
        service_id: params.service_id,
        collect_date: params.collection_date || new Date().toISOString().split("T")[0],
      },
    ],
  }

  const v14Url = process.env.EASYPARCEL_V14_URL || "https://connect.easyparcel.my/"
  const res = await fetch(`${v14Url}?ac=EPSubmitOrderBulk`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(FETCH_TIMEOUT),
  })

  if (!res.ok) throw new Error("EasyParcel order failed")
  return res.json()
}

// --- Tracking ---

export async function trackShipment(trackingNumber: string) {
  if (isOAuthConfigured()) {
    const token = await getAccessToken()
    const res = await fetch(`${EASYPARCEL_API}/shipment/tracking?tracking_number=${trackingNumber}`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(FETCH_TIMEOUT),
    })
    if (!res.ok) throw new Error("Tracking failed")
    return res.json()
  }

  // V1.4 fallback
  const body = {
    api: process.env.EASYPARCEL_API_KEY,
    bulk: [{ tracking_number: trackingNumber }],
  }
  const v14Url = process.env.EASYPARCEL_V14_URL || "https://connect.easyparcel.my/"
  const res = await fetch(`${v14Url}?ac=EPTrackingBulk`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
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
