import { NextRequest, NextResponse } from "next/server"
import { getStripe } from "@/lib/stripe"
import { createAdminClient } from "@/lib/supabase/admin"
import { calculatePriceSGD } from "@/lib/pricing-sg"
import { SG_SHIPPING_SGD } from "@/lib/shipping"
import { rateLimit, getIP } from "@/lib/rate-limit"

const CHECKOUT_LIMIT = 10
const CHECKOUT_WINDOW_MS = 10 * 60 * 1000

export async function POST(request: NextRequest) {
  const ip = getIP(request)
  const { allowed, retryAfterMs } = rateLimit(`stripe-checkout:${ip}`, CHECKOUT_LIMIT, CHECKOUT_WINDOW_MS)

  if (!allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429, headers: { "Retry-After": String(Math.ceil(retryAfterMs / 1000)) } }
    )
  }

  try {
    const { quantity, customer } = await request.json()

    if (!quantity || ![1, 2, 3].includes(quantity)) {
      return NextResponse.json({ error: "Invalid quantity" }, { status: 400 })
    }
    if (!customer?.name || !customer?.email || !customer?.phone || !customer?.address_line1 || !customer?.postcode) {
      return NextResponse.json({ error: "All customer fields are required" }, { status: 400 })
    }

    const pricing = calculatePriceSGD(quantity as 1 | 2 | 3)
    const supabase = createAdminClient()
    const orderNumber = `ANT-SG-${Date.now().toString(36).toUpperCase()}`

    // Upsert customer
    const { data: existingCustomer } = await supabase
      .from("customers")
      .select("id")
      .eq("email", customer.email)
      .single()

    let customerId: string

    if (existingCustomer) {
      customerId = existingCustomer.id
      await supabase
        .from("customers")
        .update({
          name: customer.name,
          phone: customer.phone,
          address_line1: customer.address_line1,
          address_line2: customer.address_line2 || null,
          city: "Singapore",
          state: "Singapore",
          postcode: customer.postcode,
          updated_at: new Date().toISOString(),
        })
        .eq("id", customerId)
    } else {
      const { data: newCustomer, error } = await supabase
        .from("customers")
        .insert({
          email: customer.email,
          name: customer.name,
          phone: customer.phone,
          address_line1: customer.address_line1,
          address_line2: customer.address_line2 || null,
          city: "Singapore",
          state: "Singapore",
          postcode: customer.postcode,
        })
        .select("id")
        .single()

      if (error || !newCustomer) {
        return NextResponse.json({ error: "Failed to create customer" }, { status: 500 })
      }
      customerId = newCustomer.id
    }

    // Create pending order
    const shippingCents = SG_SHIPPING_SGD * 100
    const subtotalCents = pricing.total
    const totalCents = subtotalCents + shippingCents
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        order_number: orderNumber,
        customer_id: customerId,
        status: "pending",
        subtotal: subtotalCents / 100,
        shipping_cost: SG_SHIPPING_SGD,
        total: totalCents / 100,
        payment_method: "stripe",
      })
      .select("id")
      .single()

    if (orderError || !order) {
      return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
    }

    // Create order items
    await supabase.from("order_items").insert({
      order_id: order.id,
      product_id: null,
      product_name: `Bloomie (${pricing.label})`,
      quantity: pricing.totalBoxes,
      unit_price: subtotalCents / 100 / pricing.totalBoxes,
    })

    // Create Stripe Checkout Session
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3002"

    const stripe = getStripe()
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      currency: "sgd",
      customer_email: customer.email,
      line_items: [
        {
          price_data: {
            currency: "sgd",
            product_data: {
              name: `Bloomie - ${pricing.shortLabel}`,
              description: `${pricing.totalBoxes} boxes of Bloomie Botanical Beverage (${pricing.label})`,
            },
            unit_amount: subtotalCents,
          },
          quantity: 1,
        },
        {
          price_data: {
            currency: "sgd",
            product_data: {
              name: "Shipping to Singapore",
            },
            unit_amount: shippingCents,
          },
          quantity: 1,
        },
      ],
      metadata: {
        order_id: order.id,
        order_number: orderNumber,
      },
      success_url: `${baseUrl}/sg/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/sg/cancel`,
    })

    // Save stripe session ID
    await supabase
      .from("orders")
      .update({ stripe_session_id: session.id })
      .eq("id", order.id)

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error("Stripe checkout error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
