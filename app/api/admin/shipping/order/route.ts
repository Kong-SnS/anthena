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

    const totalWeight = order.order_items.reduce(
      (sum: number, item: any) => sum + (Number(item.quantity) * 0.1),
      0.3 // minimum weight
    )

    const result = await createOrder({
      service_id,
      pick_name: "Anthena Healthcare",
      pick_contact: "0126431737",
      pick_addr1: "Anthena Warehouse",
      pick_city: "Batu 9 Cheras",
      pick_state: "Selangor",
      pick_code: "43200",
      send_name: order.customer.name,
      send_contact: order.customer.phone,
      send_addr1: order.customer.address_line1,
      send_city: order.customer.city,
      send_state: order.customer.state,
      send_code: order.customer.postcode,
      weight: totalWeight,
      content: `Anthena Order #${order.order_number}`,
      value: Number(order.total),
    })

    const orderResult = result.result?.[0]
    const easyparcelOrderId = orderResult?.order_number || null
    const trackingNumber = orderResult?.tracking_number || null

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
