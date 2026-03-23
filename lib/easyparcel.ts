const EASYPARCEL_API_URL = process.env.EASYPARCEL_API_URL || "https://demo.connect.easyparcel.com/?ac"
const FETCH_TIMEOUT = 10000

interface RateCheckParams {
  pick_postcode: string
  pick_state: string
  send_postcode: string
  send_state: string
  weight: number // in kg
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

  const res = await fetch(`${EASYPARCEL_API_URL}=EPRateCheckingBulk`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(FETCH_TIMEOUT),
  })

  if (!res.ok) {
    throw new Error("EasyParcel rate check failed")
  }

  const data = await res.json()
  return data.result?.[0]?.rates || []
}

interface CreateOrderParams {
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
  service_id: string
}

export async function createOrder(params: CreateOrderParams) {
  const body = {
    api: process.env.EASYPARCEL_API_KEY,
    bulk: [
      {
        ...params,
        pick_country: "MY",
        send_country: "MY",
      },
    ],
  }

  const res = await fetch(`${EASYPARCEL_API_URL}=EPSubmitOrderBulk`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(FETCH_TIMEOUT),
  })

  if (!res.ok) {
    throw new Error("EasyParcel create order failed")
  }

  return res.json()
}
