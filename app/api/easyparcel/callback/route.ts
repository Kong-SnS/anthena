import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code")

  if (!code) {
    return NextResponse.json({ error: "No authorization code received" }, { status: 400 })
  }

  // Exchange code for tokens
  const clientId = process.env.EASYPARCEL_CLIENT_ID || "be220dcd-0b09-49b7-a569-1b295cb3af52"
  const clientSecret = process.env.EASYPARCEL_CLIENT_SECRET || "01c25868-aeff-454e-99ef-c058f365eb61"

  const res = await fetch("https://api.easyparcel.com/oauth/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      grant_type: "authorization_code",
      code,
      redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3002"}/api/easyparcel/callback`,
    }),
  })

  const data = await res.json()

  if (!res.ok || !data.access_token) {
    return NextResponse.json({
      error: "Token exchange failed",
      details: data,
    }, { status: 500 })
  }

  // Show the tokens - copy refresh_token to .env.local
  return new NextResponse(`
    <html>
      <body style="font-family:sans-serif;padding:40px;max-width:600px;margin:0 auto">
        <h1>EasyParcel OAuth Success!</h1>
        <p>Copy these values to your <code>.env.local</code> file:</p>
        <pre style="background:#f5f5f5;padding:16px;border-radius:8px;overflow-x:auto">
EASYPARCEL_CLIENT_ID=${clientId}
EASYPARCEL_CLIENT_SECRET=${clientSecret}
EASYPARCEL_REFRESH_TOKEN=${data.refresh_token}
        </pre>
        <p><strong>Access Token:</strong> ${data.access_token?.substring(0, 20)}...</p>
        <p><strong>Expires In:</strong> ${data.expires_in}s</p>
        <p>After adding to .env.local, restart your dev server.</p>
      </body>
    </html>
  `, { headers: { "Content-Type": "text/html" } })
}
