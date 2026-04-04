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
      (sum: number, item: any) => sum + (Number(item.quantity) * 0.2),
      0
    )

    const result = await createOrder({
      reference: order.order_number,
      service_id,
      weight: Math.max(totalWeight, 0.5),
      sender: {
        name: "Athena Healthcare",
        phone: "0126431737",
        email: "woosisterstrading@gmail.com",
        address1: "Athena Warehouse",
        address2: "",
        city: "Batu 9 Cheras",
        state: "Selangor",
        postcode: "43200",
      },
      receiver: {
        name: order.customer.name,
        phone: order.customer.phone,
        email: order.customer.email,
        address1: order.customer.address_line1,
        address2: order.customer.address_line2 || "",
        city: order.customer.city,
        state: order.customer.state,
        postcode: order.customer.postcode,
      },
      items: order.order_items.map((item: any) => ({
        content: item.product_name,
        weight: Number(item.quantity) * 0.2,
        value: Number(item.unit_price) * Number(item.quantity),
        quantity: Number(item.quantity),
      })),
    })

    // Parse response from OpenAPI format
    const orderResult = result.data?.[0]
    const shipment = orderResult?.shipments?.[0]
    const easyparcelOrderId = orderResult?.order_details?.order_number || null
    const trackingNumber = shipment?.awb_number || null
    const trackingUrl = shipment?.tracking_url || null
    const awbUrl = shipment?.awb_url || null
    const courierName = shipment?.courier || null
    const courierLogo = shipment?.courier_logo || null

    await supabase
      .from("orders")
      .update({
        easyparcel_order_id: easyparcelOrderId,
        tracking_number: trackingNumber,
        tracking_url: trackingUrl,
        awb_url: awbUrl,
        shipping_courier_name: courierName,
        shipping_courier_logo: courierLogo,
        status: "shipped",
        shipping_method: service_id,
        updated_at: new Date().toISOString(),
      })
      .eq("id", order_id)

    return NextResponse.json({
      easyparcel_order_id: easyparcelOrderId,
      tracking_number: trackingNumber,
      tracking_url: trackingUrl,
      awb_url: awbUrl,
      shipping_courier_name: courierName,
      shipping_courier_logo: courierLogo,
    })
  } catch (err) {
    console.error("EasyParcel order error:", err)
    return NextResponse.json({ error: "Failed to create shipment" }, { status: 500 })
  }
}
