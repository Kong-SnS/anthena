// EasyParcel Individual API v1.4.0.0 (Malaysia)
// Demo: http://demo.connect.easyparcel.my/
// Live: https://connect.easyparcel.my/

const EASYPARCEL_BASE = process.env.EASYPARCEL_API_URL || "https://connect.easyparcel.my/"
const FETCH_TIMEOUT = 15000

interface RateCheckParams {
  pick_postcode: string
  pick_state: string
  send_postcode: string
  send_state: string
  weight: number
}

export async function checkRates(params: RateCheckParams) {
  const body = {
    api: process.env.EASYPARCEL_API_KEY,
    bulk: [
      {
        pick_code: params.pick_postcode,
        pick_state: params.pick_state,
        pick_country: "MY",
        send_code: params.send_postcode,
        send_state: params.send_state,
        send_country: "MY",
        weight: params.weight,
      },
    ],
  }

  const res = await fetch(`${EASYPARCEL_BASE}?ac=EPRateCheckingBulk`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(FETCH_TIMEOUT),
  })

  if (!res.ok) {
    const error = await res.text()
    throw new Error(`EasyParcel rate check failed: ${error}`)
  }

  const data = await res.json()
  return data.result?.[0]?.rates || []
}

interface MakeOrderParams {
  service_id: string
  pick_name: string
  pick_contact: string
  pick_addr1: string
  pick_city: string
  pick_state: string
  pick_code: string
  send_name: string
  send_contact: string
  send_addr1: string
  send_city: string
  send_state: string
  send_code: string
  weight: number
  content: string
  value: number
  collect_date?: string
}

export async function createOrder(params: MakeOrderParams) {
  const body = {
    api: process.env.EASYPARCEL_API_KEY,
    bulk: [
      {
        pick_name: params.pick_name,
        pick_contact: params.pick_contact,
        pick_addr1: params.pick_addr1,
        pick_city: params.pick_city,
        pick_state: params.pick_state,
        pick_code: params.pick_code,
        pick_country: "MY",
        send_name: params.send_name,
        send_contact: params.send_contact,
        send_addr1: params.send_addr1,
        send_city: params.send_city,
        send_state: params.send_state,
        send_code: params.send_code,
        send_country: "MY",
        weight: params.weight,
        content: params.content,
        value: params.value,
        service_id: params.service_id,
        collect_date: params.collect_date || new Date().toISOString().split("T")[0],
      },
    ],
  }

  const res = await fetch(`${EASYPARCEL_BASE}?ac=EPSubmitOrderBulk`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(FETCH_TIMEOUT),
  })

  if (!res.ok) {
    const error = await res.text()
    throw new Error(`EasyParcel create order failed: ${error}`)
  }

  return res.json()
}

export async function checkOrderStatus(orderNo: string) {
  const body = {
    api: process.env.EASYPARCEL_API_KEY,
    bulk: [{ order_no: orderNo }],
  }

  const res = await fetch(`${EASYPARCEL_BASE}?ac=EPOrderStatusBulk`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(FETCH_TIMEOUT),
  })

  if (!res.ok) throw new Error("EasyParcel status check failed")
  return res.json()
}

export async function trackParcel(trackingNumber: string) {
  const body = {
    api: process.env.EASYPARCEL_API_KEY,
    bulk: [{ tracking_number: trackingNumber }],
  }

  const res = await fetch(`${EASYPARCEL_BASE}?ac=EPTrackingBulk`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(FETCH_TIMEOUT),
  })

  if (!res.ok) throw new Error("EasyParcel tracking failed")
  return res.json()
}
