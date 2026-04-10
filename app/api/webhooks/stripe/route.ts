import { NextRequest, NextResponse } from "next/server"
import { getStripe } from "@/lib/stripe"
import { createAdminClient } from "@/lib/supabase/admin"
import { sendEmail, oseoOrderConfirmationEmail } from "@/lib/mailgun"

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get("stripe-signature")

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 })
  }

  let event
  try {
    const stripe = getStripe()
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error("Stripe webhook signature verification failed:", err)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object
    const orderId = session.metadata?.order_id
    const orderNumber = session.metadata?.order_number

    if (!orderId) {
      console.error("No order_id in session metadata")
      return NextResponse.json({ received: true })
    }

    const supabase = createAdminClient()

    // Idempotency — skip if already paid
    const { data: existingOrder } = await supabase
      .from("orders")
      .select("status")
      .eq("id", orderId)
      .single()

    if (existingOrder && ["paid", "processing", "shipped", "delivered"].includes(existingOrder.status)) {
      return NextResponse.json({ received: true })
    }

    // Mark as paid
    await supabase
      .from("orders")
      .update({
        status: "paid",
        stripe_session_id: session.id,
        paid_at: new Date().toISOString(),
      })
      .eq("id", orderId)

    // Decrement stock for order items
    const { data: orderItems } = await supabase
      .from("order_items")
      .select("product_id, quantity")
      .eq("order_id", orderId)

    if (orderItems) {
      for (const item of orderItems) {
        if (item.product_id) {
          await supabase.rpc("decrement_stock", {
            p_product_id: item.product_id,
            p_quantity: item.quantity,
          })
        }
      }
    }

    // Generate invoice
    const invoiceNumber = `INV-${orderNumber}`
    await supabase.from("invoices").insert({
      order_id: orderId,
      invoice_number: invoiceNumber,
      amount: (session.amount_total || 0) / 100,
      status: "paid",
      issued_at: new Date().toISOString(),
    })

    // Send confirmation email
    try {
      const { data: order } = await supabase
        .from("orders")
        .select("*, customer:customers(email, name), order_items(*)")
        .eq("id", orderId)
        .single()

      if (order?.customer?.email) {
        const items = (order.order_items || []).map((i: any) => ({
          name: i.product_name,
          quantity: i.quantity,
          price: Number(i.unit_price),
        }))

        const html = oseoOrderConfirmationEmail(
          orderNumber!,
          order.customer.name,
          items,
          Number(order.subtotal),
          Number(order.shipping_cost),
          Number(order.total)
        )

        const result = await sendEmail({
          to: order.customer.email,
          subject: `Order Confirmed #${orderNumber} - OseoVital`,
          html,
          fromName: "OseoVital",
        })

        await supabase.from("email_logs").insert({
          order_id: orderId,
          customer_id: order.customer_id,
          to_email: order.customer.email,
          subject: `Order Confirmed #${orderNumber} - OseoVital`,
          template: "oseo_order_confirmation",
          mailgun_message_id: result.id || null,
          status: "sent",
        })
      }
    } catch (emailErr) {
      console.error("Failed to send OseoVital confirmation email:", emailErr)
    }

    console.log(`Stripe payment confirmed for order ${orderNumber}`)
  }

  return NextResponse.json({ received: true })
}
