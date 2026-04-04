import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { verifyWebhookSignature, getBill } from "@/lib/billplz"
import { sendEmail, orderConfirmationEmail } from "@/lib/mailgun"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const payload: Record<string, string> = {}
    formData.forEach((value, key) => {
      payload[key] = value.toString()
    })

    console.log("Webhook received for bill:", payload.id)

    // --- Verify webhook: check signature first, fallback to API verification ---
    const xSignature = payload.x_signature
    const signatureValid = verifyWebhookSignature(payload, xSignature)

    if (!signatureValid) {
      // Fallback: verify payment status directly from Billplz API
      console.warn("Signature mismatch, verifying via Billplz API...")
      try {
        const bill = await getBill(payload.id)
        if (!bill || !bill.paid) {
          console.error("Billplz API verification failed: bill not paid")
          return NextResponse.json({ error: "Payment not verified" }, { status: 401 })
        }
        console.log("Payment verified via Billplz API")
      } catch (err) {
        console.error("Billplz API verification error:", err)
        return NextResponse.json({ error: "Verification failed" }, { status: 401 })
      }
    }

    const billId = payload.id
    const paid = payload.paid === "true"

    if (!paid) {
      return NextResponse.json({ status: "not paid" })
    }

    const supabase = createAdminClient()

    // --- Find order by billplz_bill_id ---
    const { data: order } = await supabase
      .from("orders")
      .select("*, customer:customers(*), order_items(*)")
      .eq("billplz_bill_id", billId)
      .single()

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    // --- Idempotency check: skip if already paid ---
    if (order.status === "paid" || order.status === "processing" || order.status === "shipped" || order.status === "delivered") {
      return NextResponse.json({ status: "already processed" })
    }

    // --- Decrement stock atomically (only after confirmed payment) ---
    for (const item of order.order_items) {
      await supabase.rpc("decrement_stock", {
        p_product_id: item.product_id,
        p_quantity: item.quantity,
      })
    }

    // --- Update order status to paid ---
    await supabase
      .from("orders")
      .update({ status: "paid", updated_at: new Date().toISOString() })
      .eq("id", order.id)

    console.log("Order", order.order_number, "marked as paid")

    // --- Auto-generate invoice ---
    const invoiceNumber = `INV-${Date.now().toString(36).toUpperCase()}`
    await supabase.from("invoices").insert({
      order_id: order.id,
      invoice_number: invoiceNumber,
      issued_at: new Date().toISOString(),
    })
    console.log("Invoice", invoiceNumber, "generated")

    // --- Send order confirmation email ---
    if (order.customer?.email) {
      try {
        const emailHtml = orderConfirmationEmail(
          order.order_number,
          order.order_items.map((i: { product_name: string; quantity: number; unit_price: number }) => ({
            name: i.product_name,
            quantity: i.quantity,
            price: i.unit_price * i.quantity,
          })),
          Number(order.subtotal),
          Number(order.shipping_cost),
          Number(order.total)
        )

        const result = await sendEmail({
          to: order.customer.email,
          subject: `Order Confirmed - #${order.order_number}`,
          html: emailHtml,
        })

        await supabase.from("email_logs").insert({
          order_id: order.id,
          customer_id: order.customer_id,
          to_email: order.customer.email,
          subject: `Order Confirmed - #${order.order_number}`,
          template: "order_confirmation",
          mailgun_message_id: result.id || null,
          status: "sent",
        })

        console.log("Confirmation email sent to", order.customer.email)
      } catch (emailErr) {
        console.error("Email send error:", emailErr)
        await supabase.from("email_logs").insert({
          order_id: order.id,
          customer_id: order.customer_id,
          to_email: order.customer.email,
          subject: `Order Confirmed - #${order.order_number}`,
          template: "order_confirmation",
          status: "failed",
        })
      }
    }

    return NextResponse.json({ status: "ok" })
  } catch (err) {
    console.error("Webhook error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
