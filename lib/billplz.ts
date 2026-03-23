import crypto from "crypto"

const BILLPLZ_API_URL = process.env.BILLPLZ_API_URL || "https://www.billplz-sandbox.com/api/v3"
const FETCH_TIMEOUT = 30000 // 30 seconds

function getAuthHeader() {
  return `Basic ${Buffer.from(process.env.BILLPLZ_API_KEY + ":").toString("base64")}`
}

interface CreateBillParams {
  collection_id: string
  email: string
  name: string
  amount: number
  description: string
  callback_url: string
  redirect_url: string
}

export async function createBill(params: CreateBillParams) {
  const res = await fetch(`${BILLPLZ_API_URL}/bills`, {
    method: "POST",
    headers: {
      Authorization: getAuthHeader(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
    signal: AbortSignal.timeout(FETCH_TIMEOUT),
  })

  if (!res.ok) {
    const error = await res.text()
    throw new Error(`Billplz create bill failed: ${error}`)
  }

  return res.json()
}

export async function getBill(billId: string) {
  const res = await fetch(`${BILLPLZ_API_URL}/bills/${billId}`, {
    headers: { Authorization: getAuthHeader() },
    signal: AbortSignal.timeout(FETCH_TIMEOUT),
  })

  if (!res.ok) {
    throw new Error("Billplz get bill failed")
  }

  return res.json()
}

export function verifyWebhookSignature(payload: Record<string, string>, xSignature: string): boolean {
  if (!xSignature || !process.env.BILLPLZ_X_SIGNATURE_KEY) {
    console.error("Webhook signature verification: missing xSignature or key")
    return false
  }

  try {
    const keys = Object.keys(payload).filter(k => k !== "x_signature").sort()
    const source = keys.map(k => `${k}${payload[k]}`).join("|")
    const hash = crypto.createHmac("sha256", process.env.BILLPLZ_X_SIGNATURE_KEY).update(source).digest("hex")

    if (hash.length !== xSignature.length) return false
    return crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(xSignature, "hex"))
  } catch (err) {
    console.error("Webhook signature verification error:", err)
    return false
  }
}
