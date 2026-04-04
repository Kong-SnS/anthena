import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { sendEmail, invoiceEmail } from "@/lib/mailgun"
import { verifyAdmin } from "@/lib/admin-auth"

export async function POST(request: NextRequest) {
  try {
    const auth = await verifyAdmin()
    if (!auth.authorized) return auth.response!

    const { invoice_id } = await request.json()

    const supabase = createAdminClient()
    const { data: invoice } = await supabase
      .from("invoices")
      .select("*, order:orders(*, customer:customers(email, name), order_items(*))")
      .eq("id", invoice_id)
      .single()

    if (!invoice || !invoice.order?.customer?.email) {
      return NextResponse.json({ error: "Invoice or customer not found" }, { status: 404 })
    }

    const order = invoice.order
    const items = (order.order_items || []).map((i: any) => ({
      name: i.product_name,
      quantity: i.quantity,
      price: Number(i.unit_price),
    }))

    const html = invoiceEmail(
      invoice.invoice_number,
      order.order_number,
      order.customer.name,
      new Date(invoice.issued_at).toLocaleDateString("en-MY", { year: "numeric", month: "long", day: "numeric" }),
      items,
      Number(order.subtotal),
      Number(order.shipping_cost),
      Number(order.total)
    )

    const result = await sendEmail({
      to: order.customer.email,
      subject: `Invoice ${invoice.invoice_number} - Athena`,
      html,
    })

    await supabase.from("email_logs").insert({
      order_id: order.id,
      customer_id: order.customer_id,
      to_email: order.customer.email,
      subject: `Invoice ${invoice.invoice_number} - Athena`,
      template: "invoice",
      mailgun_message_id: result.id || null,
      status: "sent",
    })

    await supabase
      .from("invoices")
      .update({ sent_at: new Date().toISOString() })
      .eq("id", invoice_id)

    return NextResponse.json({ status: "sent" })
  } catch (err) {
    console.error("Invoice email error:", err)
    return NextResponse.json({ error: "Failed to send invoice" }, { status: 500 })
  }
}
