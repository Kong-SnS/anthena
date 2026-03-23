import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { createOrder } from "@/lib/easyparcel"
import { verifyAdmin } from "@/lib/admin-auth"

export async function POST(request: NextRequest) {
  try {
    const auth = await verifyAdmin()
    if (!auth.authorized) return auth.response!

    const { order_id, service_id } = await request.json()

    const supabase = createAdminClient()
    const { data: order } = await supabase
      .from("orders")
      .select("*, customer:customers(*), order_items(*)")
      .eq("id", order_id)
      .single()

    if (!order || !order.customer) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    const totalWeight = 0.5 // Default weight, ideally sum from products

    const result = await createOrder({
      pick_name: "Anthena Warehouse",
      pick_contact: "0123456789",
      pick_addr1: "Anthena HQ",
      pick_city: "Kuala Lumpur",
      pick_state: "Kuala Lumpur",
      pick_code: "50000",
      send_name: order.customer.name,
      send_contact: order.customer.phone,
      send_addr1: order.customer.address_line1,
      send_city: order.customer.city,
      send_state: order.customer.state,
      send_code: order.customer.postcode,
      weight: totalWeight,
      content: `Anthena Order #${order.order_number}`,
      value: order.total,
      service_id,
    })

    const easyparcelOrderId = result.result?.[0]?.order_number || null
    const trackingNumber = result.result?.[0]?.tracking_number || null

    await supabase
      .from("orders")
      .update({
        easyparcel_order_id: easyparcelOrderId,
        tracking_number: trackingNumber,
        status: "shipped",
        updated_at: new Date().toISOString(),
      })
      .eq("id", order_id)

    return NextResponse.json({
      easyparcel_order_id: easyparcelOrderId,
      tracking_number: trackingNumber,
    })
  } catch (err) {
    console.error("EasyParcel order error:", err)
    return NextResponse.json({ error: "Failed to create shipment" }, { status: 500 })
  }
}
