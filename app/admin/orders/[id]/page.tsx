"use client"

import { use, useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Loader2, Truck, Package } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import type { Order } from "@/types"

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  paid: "bg-blue-100 text-blue-800",
  processing: "bg-purple-100 text-purple-800",
  shipped: "bg-indigo-100 text-indigo-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
}

interface CarrierOption {
  service_id: string
  service_name: string
  courier_name: string
  courier_logo: string
  price: number
  is_pickup: boolean
  is_dropoff: boolean
}

export default function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [order, setOrder] = useState<Order & { customer: { name: string; email: string; phone: string; address_line1: string; city: string; state: string; postcode: string } | null } | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [trackingNumber, setTrackingNumber] = useState("")

  // EasyParcel carrier selection
  const [carriers, setCarriers] = useState<CarrierOption[]>([])
  const [loadingCarriers, setLoadingCarriers] = useState(false)
  const [selectedCarrier, setSelectedCarrier] = useState<string>("")
  const [showCarriers, setShowCarriers] = useState(false)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data } = await supabase
        .from("orders")
        .select("*, customer:customers(*), order_items(*)")
        .eq("id", id)
        .single()
      setOrder(data)
      setTrackingNumber(data?.tracking_number || "")
      setLoading(false)
    }
    load()
  }, [id])

  const updateStatus = async (status: string) => {
    setUpdating(true)
    const supabase = createClient()
    const { error } = await supabase
      .from("orders")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id)

    if (error) {
      toast.error(error.message)
    } else {
      toast.success(`Order updated to ${status}`)
      setOrder((prev) => prev ? { ...prev, status: status as Order["status"] } : null)
    }
    setUpdating(false)
  }

  const fetchCarriers = async () => {
    if (!order?.customer) return
    setLoadingCarriers(true)
    setShowCarriers(true)

    try {
      const totalWeight = order.order_items?.reduce((sum, item) => sum + item.quantity * 0.2, 0) || 0.5
      const res = await fetch("/api/shipping/rates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          send_postcode: order.customer.postcode,
          send_state: order.customer.state,
          weight: Math.max(totalWeight, 0.5),
        }),
      })
      const data = await res.json()
      if (data.rates) {
        setCarriers(data.rates)
        if (data.rates.length > 0) {
          setSelectedCarrier(data.rates[0].service_id)
        }
      }
    } catch {
      toast.error("Failed to fetch carriers from EasyParcel")
    } finally {
      setLoadingCarriers(false)
    }
  }

  const handleShipWithEasyParcel = async () => {
    if (!selectedCarrier) {
      toast.error("Select a carrier first")
      return
    }
    setUpdating(true)

    try {
      // Create EasyParcel shipment
      const res = await fetch("/api/admin/shipping/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: id,
          service_id: selectedCarrier,
        }),
      })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error || "Failed to create shipment")

      const newTracking = data.tracking_number || trackingNumber
      if (newTracking) setTrackingNumber(newTracking)

      toast.success(`Shipment created via ${data.shipping_courier_name || carriers.find(c => c.service_id === selectedCarrier)?.courier_name}`)
      setOrder((prev) => prev ? {
        ...prev,
        status: "shipped" as const,
        tracking_number: newTracking,
        tracking_url: data.tracking_url,
        awb_url: data.awb_url,
        easyparcel_order_id: data.easyparcel_order_id,
        shipping_method: selectedCarrier,
        shipping_courier_name: data.shipping_courier_name,
        shipping_courier_logo: data.shipping_courier_logo,
      } as any : null)
      setShowCarriers(false)

      // Trigger shipping email
      try {
        await fetch("/api/email/shipping-update", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order_id: id, tracking_number: newTracking }),
        })
      } catch {}
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create shipment")
    } finally {
      setUpdating(false)
    }
  }

  const handleManualShip = async () => {
    if (!trackingNumber) {
      toast.error("Enter a tracking number")
      return
    }
    setUpdating(true)
    const supabase = createClient()
    const { error } = await supabase
      .from("orders")
      .update({
        status: "shipped",
        tracking_number: trackingNumber,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)

    if (error) {
      toast.error(error.message)
    } else {
      toast.success("Order marked as shipped")
      setOrder((prev) => prev ? { ...prev, status: "shipped", tracking_number: trackingNumber } : null)

      try {
        await fetch("/api/email/shipping-update", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order_id: id, tracking_number: trackingNumber }),
        })
      } catch {}
    }
    setUpdating(false)
  }

  const handleCancel = async () => {
    if (!confirm("Cancel this order and restore stock?")) return
    setUpdating(true)
    const supabase = createClient()

    if (order?.order_items && (order.status === "paid" || order.status === "processing")) {
      for (const item of order.order_items) {
        await supabase.rpc("decrement_stock", {
          p_product_id: item.product_id,
          p_quantity: -item.quantity,
        })
      }
    }

    const { error } = await supabase
      .from("orders")
      .update({ status: "cancelled", updated_at: new Date().toISOString() })
      .eq("id", id)

    if (error) {
      toast.error(error.message)
    } else {
      toast.success("Order cancelled and stock restored")
      setOrder((prev) => prev ? { ...prev, status: "cancelled" } : null)
    }
    setUpdating(false)
  }

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!order) {
    return <p className="text-muted-foreground">Order not found</p>
  }

  const isSG = (order as any).payment_method === "stripe"
  const currency = isSG ? "S$" : "RM"
  const canShip = order.status === "paid" || order.status === "processing"

  return (
    <div className="max-w-3xl">
      <Link
        href="/admin/orders"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Orders
      </Link>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Order #{order.order_number}</h1>
          <p className="text-sm text-muted-foreground">
            {new Date(order.created_at).toLocaleDateString("en-MY", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
        <Badge className={`text-base px-3 py-1 ${statusColors[order.status] || ""}`}>
          {order.status}
        </Badge>
      </div>

      <div className="grid gap-6">
        {/* Status Actions */}
        <Card>
          <CardHeader><CardTitle>Update Status</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3 flex-wrap">
              {["paid", "processing", "shipped", "delivered"].map((s) => (
                <Button
                  key={s}
                  variant={order.status === s ? "default" : "outline"}
                  size="sm"
                  onClick={() => updateStatus(s)}
                  disabled={updating}
                >
                  {s}
                </Button>
              ))}
              {order.status !== "cancelled" && order.status !== "delivered" && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleCancel}
                  disabled={updating}
                >
                  Cancel Order
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Shipping / EasyParcel */}
        {canShip && (
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Package className="h-5 w-5" /> Ship Order</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {/* EasyParcel option */}
              <div>
                <Button
                  onClick={fetchCarriers}
                  disabled={loadingCarriers || updating}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {loadingCarriers ? (
                    <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Fetching carriers...</>
                  ) : (
                    <><Truck className="h-4 w-4 mr-2" /> Ship via EasyParcel</>
                  )}
                </Button>
              </div>

              {showCarriers && carriers.length > 0 && (
                <div className="space-y-3 pt-2">
                  <p className="text-sm font-medium">Select a carrier:</p>
                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {carriers.map((carrier) => (
                      <button
                        key={carrier.service_id}
                        onClick={() => setSelectedCarrier(carrier.service_id)}
                        className={`w-full flex items-center gap-3 p-3 border rounded-lg transition-all text-left text-sm ${
                          selectedCarrier === carrier.service_id
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        {carrier.courier_logo && (
                          <Image
                            src={carrier.courier_logo}
                            alt={carrier.courier_name}
                            width={32}
                            height={32}
                            className="w-8 h-8 object-contain rounded"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium">{carrier.courier_name}</p>
                          <p className="text-muted-foreground text-xs">
                            {carrier.service_name} · {carrier.is_pickup ? "Pick Up" : "Drop Off"}
                          </p>
                        </div>
                        <span className="font-medium whitespace-nowrap">RM {carrier.price.toFixed(2)}</span>
                      </button>
                    ))}
                  </div>
                  <Button
                    onClick={handleShipWithEasyParcel}
                    disabled={!selectedCarrier || updating}
                    className="bg-green-600 hover:bg-green-700 w-full"
                  >
                    {updating ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <><Truck className="h-4 w-4 mr-2" /> Create Shipment</>
                    )}
                  </Button>
                </div>
              )}

              {showCarriers && !loadingCarriers && carriers.length === 0 && (
                <p className="text-sm text-muted-foreground">No carriers available for this destination.</p>
              )}

              {/* Manual option */}
              <Separator />
              <p className="text-sm text-muted-foreground">Or ship manually:</p>
              <div className="flex gap-3 items-end">
                <div className="flex-1">
                  <Label>Tracking Number</Label>
                  <Input
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="Enter tracking number"
                  />
                </div>
                <Button onClick={handleManualShip} disabled={updating}>
                  <Truck className="h-4 w-4 mr-2" /> Ship Manually
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Shipping Info - shown when shipped */}
        {order.tracking_number && (
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Truck className="h-5 w-5" /> Shipping Info</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                {/* Courier logo + name */}
                {(order as any).shipping_courier_logo && (
                  <div className="flex items-center gap-3 pb-2">
                    <Image
                      src={(order as any).shipping_courier_logo}
                      alt={(order as any).shipping_courier_name || "Courier"}
                      width={40}
                      height={40}
                      className="w-10 h-10 object-contain rounded"
                    />
                    <span className="font-medium">{(order as any).shipping_courier_name}</span>
                  </div>
                )}
                {(order as any).easyparcel_order_id && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">EasyParcel Order</span>
                    <span className="font-medium">{(order as any).easyparcel_order_id}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tracking Number</span>
                  <span className="font-medium">{order.tracking_number}</span>
                </div>
                {(order as any).shipping_method && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Service ID</span>
                    <span className="font-medium">{(order as any).shipping_method}</span>
                  </div>
                )}
                <Separator />
                <div className="flex gap-3">
                  {(order as any).tracking_url && (
                    <a
                      href={(order as any).tracking_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                    >
                      Track Shipment
                    </a>
                  )}
                  {(order as any).awb_url && (
                    <a
                      href={(order as any).awb_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 text-white text-sm rounded hover:bg-gray-900 transition-colors"
                    >
                      Print AWB Label
                    </a>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Customer Info */}
        <Card>
          <CardHeader><CardTitle>Customer</CardTitle></CardHeader>
          <CardContent>
            {order.customer ? (
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium">{order.customer.name}</p>
                  <p className="text-muted-foreground">{order.customer.email}</p>
                  <p className="text-muted-foreground">{order.customer.phone}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">{order.customer.address_line1}</p>
                  <p className="text-muted-foreground">
                    {order.customer.city}, {order.customer.state} {order.customer.postcode}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">Customer info unavailable</p>
            )}
          </CardContent>
        </Card>

        {/* Order Items */}
        <Card>
          <CardHeader><CardTitle>Items</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {order.order_items?.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>
                    {item.product_name} <span className="text-muted-foreground">x{item.quantity}</span>
                  </span>
                  <span className="font-medium">{currency} {(item.unit_price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <Separator className="my-4" />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{currency} {Number(order.subtotal).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>{currency} {Number(order.shipping_cost).toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-base">
                <span>Total</span>
                <span>{currency} {Number(order.total).toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
