import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { createBill } from "@/lib/billplz"
import { calculatePrice } from "@/lib/pricing"

function parseCookies(cookieHeader: string) {
  return cookieHeader.split(";").map((c) => {
    const [name, ...rest] = c.trim().split("=")
    return { name, value: rest.join("=") }
  }).filter((c) => c.name)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { customer, items, shipping_cost } = body

    // --- Input validation ---
    if (!customer || !items || items.length === 0) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 })
    }

    if (!customer.name || !customer.email || !customer.phone || !customer.address_line1 || !customer.city || !customer.state || !customer.postcode) {
      return NextResponse.json({ error: "All customer fields are required" }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(customer.email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    const supabase = createAdminClient()

    // --- Server-side price recalculation (never trust client prices) ---
    let subtotal = 0
    const validatedItems: { product_id: string; product_name: string; quantity: number; unit_price: number }[] = []

    for (const item of items) {
      if (!item.product_id || !item.quantity || item.quantity < 1) {
        return NextResponse.json({ error: "Invalid item data" }, { status: 400 })
      }

      const { data: product } = await supabase
        .from("products")
        .select("id, name, price, stock_count")
        .eq("id", item.product_id)
        .eq("is_active", true)
        .single()

      if (!product) {
        return NextResponse.json({ error: `Product not found: ${item.product_id}` }, { status: 400 })
      }

      if (product.stock_count < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${product.name}. Only ${product.stock_count} available.` },
          { status: 400 }
        )
      }

      const unitPrice = Number(product.price)
      const tieredPrice = calculatePrice(item.quantity)
      subtotal += tieredPrice.total
      validatedItems.push({
        product_id: product.id,
        product_name: product.name,
        quantity: item.quantity,
        unit_price: tieredPrice.total / item.quantity, // effective unit price after discount
      })
    }

    // Free shipping for orders RM150+
    const validShippingCost = subtotal >= 150 ? 0 : Math.max(0, Number(shipping_cost) || 8)
    const total = subtotal + validShippingCost

    // --- Try to get logged-in user ID ---
    let authUserId: string | null = null
    try {
      const cookieHeader = request.headers.get("cookie") || ""
      // Extract user from auth if available (optional - guest checkout works too)
      const { createServerClient } = await import("@supabase/ssr")
      const authSupabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        { cookies: { getAll() { return parseCookies(cookieHeader) }, setAll() {} } }
      )
      const { data: { user } } = await authSupabase.auth.getUser()
      authUserId = user?.id || null
    } catch {}

    // --- Create or find customer ---
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
          city: customer.city,
          state: customer.state,
          postcode: customer.postcode,
          ...(authUserId ? { user_id: authUserId } : {}),
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
          city: customer.city,
          state: customer.state,
          postcode: customer.postcode,
          ...(authUserId ? { user_id: authUserId } : {}),
        })
        .select("id")
        .single()

      if (error || !newCustomer) {
        return NextResponse.json({ error: "Failed to create customer" }, { status: 500 })
      }
      customerId = newCustomer.id
    }

    // --- Generate order number ---
    const orderNumber = `ANT-${Date.now().toString(36).toUpperCase()}`

    // --- Create order (status: pending, stock NOT decremented yet) ---
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        order_number: orderNumber,
        customer_id: customerId,
        status: "pending",
        subtotal,
        shipping_cost: validShippingCost,
        total,
      })
      .select("id")
      .single()

    if (orderError || !order) {
      return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
    }

    // --- Create order items ---
    const orderItems = validatedItems.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      product_name: item.product_name,
      quantity: item.quantity,
      unit_price: item.unit_price,
    }))

    await supabase.from("order_items").insert(orderItems)

    // --- Create Billplz bill (with 10s timeout) ---
    const webhookUrl = process.env.WEBHOOK_BASE_URL || process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    const redirectUrl = process.env.REDIRECT_BASE_URL || "http://localhost:3002"

    const bill = await createBill({
      collection_id: process.env.BILLPLZ_COLLECTION_ID!,
      email: customer.email,
      name: customer.name,
      amount: Math.round(total * 100),
      description: `Athena Order #${orderNumber}`,
      callback_url: `${webhookUrl}/api/checkout/webhook`,
      redirect_url: `${redirectUrl}/api/checkout/callback`,
    })

    // --- Update order with billplz info ---
    await supabase
      .from("orders")
      .update({
        billplz_bill_id: bill.id,
        billplz_url: bill.url,
      })
      .eq("id", order.id)

    return NextResponse.json({
      order_id: order.id,
      order_number: orderNumber,
      billplz_url: bill.url,
    })
  } catch (err) {
    console.error("Checkout error:", err)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
