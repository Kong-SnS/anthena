import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { sendEmail, shippingUpdateEmail } from "@/lib/mailgun"
import { verifyAdmin } from "@/lib/admin-auth"

export async function POST(request: NextRequest) {
  try {
    const auth = await verifyAdmin()
    if (!auth.authorized) return auth.response!

    const { order_id, tracking_number } = await request.json()

    const supabase = createAdminClient()
    const { data: order } = await supabase
      .from("orders")
      .select("*, customer:customers(email, name)")
      .eq("id", order_id)
      .single()

    if (!order || !order.customer?.email) {
      return NextResponse.json({ error: "Order or customer not found" }, { status: 404 })
    }

    const html = shippingUpdateEmail(
      order.order_number,
      tracking_number,
      order.shipping_method || "Courier"
    )

    const result = await sendEmail({
      to: order.customer.email,
      subject: `Your Order #${order.order_number} Has Been Shipped!`,
      html,
    })

    await supabase.from("email_logs").insert({
      order_id: order.id,
      customer_id: order.customer_id,
      to_email: order.customer.email,
      subject: `Your Order #${order.order_number} Has Been Shipped!`,
      template: "shipping_update",
      mailgun_message_id: result.id || null,
      status: "sent",
    })

    return NextResponse.json({ status: "sent" })
  } catch (err) {
    console.error("Shipping email error:", err)
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
  }
}
