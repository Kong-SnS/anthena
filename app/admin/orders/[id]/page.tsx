"use client"

import { use, useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Loader2, Truck } from "lucide-react"
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

export default function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [order, setOrder] = useState<Order & { customer: { name: string; email: string; phone: string; address_line1: string; city: string; state: string; postcode: string } | null } | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [trackingNumber, setTrackingNumber] = useState("")

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

  const handleShip = async () => {
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

      // Trigger shipping email
      try {
        await fetch("/api/email/shipping-update", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            order_id: id,
            tracking_number: trackingNumber,
          }),
        })
      } catch {
        console.error("Failed to send shipping email")
      }
    }
    setUpdating(false)
  }

  const handleCancel = async () => {
    if (!confirm("Cancel this order and restore stock?")) return
    setUpdating(true)
    const supabase = createClient()

    // Restore stock for each item
    if (order?.order_items && (order.status === "paid" || order.status === "processing")) {
      for (const item of order.order_items) {
        await supabase.rpc("decrement_stock", {
          p_product_id: item.product_id,
          p_quantity: -item.quantity, // negative = restore
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

            {(order.status === "paid" || order.status === "processing") && (
              <div className="flex gap-3 items-end pt-4 border-t">
                <div className="flex-1">
                  <Label>Tracking Number</Label>
                  <Input
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="Enter tracking number"
                  />
                </div>
                <Button onClick={handleShip} disabled={updating} className="bg-green-600 hover:bg-green-700">
                  <Truck className="h-4 w-4 mr-2" /> Ship Order
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

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
                  <span className="font-medium">RM {(item.unit_price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <Separator className="my-4" />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>RM {Number(order.subtotal).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>RM {Number(order.shipping_cost).toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-base">
                <span>Total</span>
                <span>RM {Number(order.total).toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
