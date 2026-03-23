import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { sendEmail } from "@/lib/mailgun"
import { verifyAdmin } from "@/lib/admin-auth"

export async function POST(request: NextRequest) {
  try {
    const auth = await verifyAdmin()
    if (!auth.authorized) return auth.response!

    const { email_log_id } = await request.json()

    const supabase = createAdminClient()
    const { data: emailLog } = await supabase
      .from("email_logs")
      .select("*")
      .eq("id", email_log_id)
      .single()

    if (!emailLog) {
      return NextResponse.json({ error: "Email log not found" }, { status: 404 })
    }

    // Re-send the email - for now just send a simple notification
    const result = await sendEmail({
      to: emailLog.to_email,
      subject: `[Resend] ${emailLog.subject}`,
      html: `<p>This is a resend of the email: ${emailLog.subject}</p>`,
    })

    // Log the resend
    await supabase.from("email_logs").insert({
      order_id: emailLog.order_id,
      customer_id: emailLog.customer_id,
      to_email: emailLog.to_email,
      subject: `[Resend] ${emailLog.subject}`,
      template: `${emailLog.template}_resend`,
      mailgun_message_id: result.id || null,
      status: "sent",
    })

    return NextResponse.json({ status: "resent" })
  } catch (err) {
    console.error("Resend email error:", err)
    return NextResponse.json({ error: "Failed to resend" }, { status: 500 })
  }
}
