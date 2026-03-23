const MAILGUN_API_URL = process.env.MAILGUN_BASE_URL || "https://api.mailgun.net/v3"
const FETCH_TIMEOUT = 10000

interface SendEmailParams {
  to: string
  subject: string
  html: string
}

export async function sendEmail(params: SendEmailParams) {
  const domain = process.env.MAILGUN_DOMAIN!
  const fromName = process.env.MAILGUN_FROM_NAME || "Anthena"
  const fromEmail = process.env.MAILGUN_FROM_EMAIL || `noreply@${domain}`
  const form = new URLSearchParams()
  form.append("from", `${fromName} <${fromEmail}>`)
  form.append("to", params.to)
  form.append("subject", params.subject)
  form.append("html", params.html)

  const res = await fetch(`${MAILGUN_API_URL}/${domain}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from("api:" + process.env.MAILGUN_API_KEY!).toString("base64")}`,
    },
    body: form,
    signal: AbortSignal.timeout(FETCH_TIMEOUT),
  })

  if (!res.ok) {
    const error = await res.text()
    throw new Error(`Mailgun send failed: ${error}`)
  }

  return res.json()
}

export async function getEmailEvents(messageId?: string) {
  const domain = process.env.MAILGUN_DOMAIN!
  const url = new URL(`${MAILGUN_API_URL}/${domain}/events`)
  if (messageId) {
    url.searchParams.set("message-id", messageId)
  }
  url.searchParams.set("limit", "100")

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Basic ${Buffer.from("api:" + process.env.MAILGUN_API_KEY!).toString("base64")}`,
    },
  })

  if (!res.ok) {
    throw new Error("Mailgun get events failed")
  }

  return res.json()
}

const emailWrapper = (content: string) => `
  <div style="font-family:'Georgia',serif;max-width:600px;margin:0 auto;background:#faf8f5">
    <div style="background:linear-gradient(135deg,#c4a07c,#d4a89a);padding:24px;text-align:center">
      <h1 style="color:white;font-size:28px;font-weight:400;letter-spacing:0.15em;margin:0">ANTHENA</h1>
    </div>
    <div style="padding:32px 24px">
      ${content}
    </div>
    <div style="border-top:1px solid #e8ddd4;padding:20px 24px;text-align:center">
      <p style="color:#a09080;font-size:12px;margin:0">Athena Healthcare (PG0565925W)</p>
      <p style="color:#a09080;font-size:12px;margin:4px 0 0">WhatsApp: 012-643 1737 | woosisterstrading@gmail.com</p>
    </div>
  </div>
`

export function orderConfirmationEmail(orderNumber: string, items: { name: string; quantity: number; price: number }[], total: number) {
  const itemRows = items
    .map(i => `<tr><td style="padding:12px 8px;border-bottom:1px solid #e8ddd4;font-family:sans-serif;font-size:14px">${i.name}</td><td style="padding:12px 8px;border-bottom:1px solid #e8ddd4;text-align:center;font-family:sans-serif;font-size:14px">${i.quantity}</td><td style="padding:12px 8px;border-bottom:1px solid #e8ddd4;text-align:right;font-family:sans-serif;font-size:14px">RM ${i.price.toFixed(2)}</td></tr>`)
    .join("")

  return emailWrapper(`
    <div style="text-align:center;margin-bottom:24px">
      <div style="width:48px;height:48px;border-radius:50%;background:linear-gradient(135deg,#c4a07c,#d4a89a);margin:0 auto 16px;line-height:48px;color:white;font-size:20px">✓</div>
      <h2 style="font-family:'Georgia',serif;font-size:24px;font-weight:400;color:#1a1215;margin:0">Order Confirmed</h2>
      <p style="color:#8a7a6a;font-size:14px;margin:8px 0 0">Thank you for your order <strong>#${orderNumber}</strong></p>
    </div>
    <table style="width:100%;border-collapse:collapse;margin:24px 0">
      <thead><tr style="background:#f5ece4"><th style="padding:10px 8px;text-align:left;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#8a7a6a;font-family:sans-serif">Product</th><th style="padding:10px 8px;text-align:center;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#8a7a6a;font-family:sans-serif">Qty</th><th style="padding:10px 8px;text-align:right;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#8a7a6a;font-family:sans-serif">Price</th></tr></thead>
      <tbody>${itemRows}</tbody>
    </table>
    <div style="text-align:right;border-top:2px solid #c4a07c;padding-top:12px;margin-top:8px">
      <p style="font-family:'Georgia',serif;font-size:20px;color:#1a1215;margin:0"><strong>Total: RM ${total.toFixed(2)}</strong></p>
    </div>
    <p style="color:#8a7a6a;font-size:13px;margin-top:24px;line-height:1.6">We will notify you once your order has been shipped. If you have any questions, feel free to WhatsApp us at 012-643 1737.</p>
  `)
}

export function shippingUpdateEmail(orderNumber: string, trackingNumber: string, courierName: string) {
  return emailWrapper(`
    <div style="text-align:center;margin-bottom:24px">
      <div style="width:48px;height:48px;border-radius:50%;background:linear-gradient(135deg,#c4a07c,#d4a89a);margin:0 auto 16px;line-height:48px;color:white;font-size:20px">📦</div>
      <h2 style="font-family:'Georgia',serif;font-size:24px;font-weight:400;color:#1a1215;margin:0">Order Shipped!</h2>
      <p style="color:#8a7a6a;font-size:14px;margin:8px 0 0">Your order <strong>#${orderNumber}</strong> is on its way</p>
    </div>
    <div style="background:#f5ece4;padding:20px;border-radius:4px;margin:24px 0">
      <p style="margin:0 0 8px;font-family:sans-serif;font-size:14px"><strong>Courier:</strong> ${courierName}</p>
      <p style="margin:0;font-family:sans-serif;font-size:14px"><strong>Tracking Number:</strong> ${trackingNumber}</p>
    </div>
    <p style="color:#8a7a6a;font-size:13px;line-height:1.6">You can track your parcel using the tracking number above on the courier's website. If you have any questions, WhatsApp us at 012-643 1737.</p>
  `)
}
