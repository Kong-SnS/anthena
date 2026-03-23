"use client"

import { use, useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2, Save } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import type { Customer, Order } from "@/types"

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  paid: "bg-blue-100 text-blue-800",
  processing: "bg-purple-100 text-purple-800",
  shipped: "bg-indigo-100 text-indigo-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
}

export default function AdminCustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const [{ data: cust }, { data: ords }] = await Promise.all([
        supabase.from("customers").select("*").eq("id", id).single(),
        supabase
          .from("orders")
          .select("*, order_items(*)")
          .eq("customer_id", id)
          .order("created_at", { ascending: false }),
      ])
      setCustomer(cust)
      setNotes(cust?.notes || "")
      setOrders(ords || [])
      setLoading(false)
    }
    load()
  }, [id])

  const saveNotes = async () => {
    const supabase = createClient()
    const { error } = await supabase
      .from("customers")
      .update({ notes, updated_at: new Date().toISOString() })
      .eq("id", id)

    if (error) toast.error(error.message)
    else toast.success("Notes saved")
  }

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!customer) return <p className="text-muted-foreground">Customer not found</p>

  const totalSpent = orders
    .filter((o) => o.status !== "cancelled" && o.status !== "pending")
    .reduce((sum, o) => sum + Number(o.total), 0)

  return (
    <div className="max-w-3xl">
      <Link
        href="/admin/customers"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Customers
      </Link>

      <h1 className="text-2xl font-bold mb-6">{customer.name}</h1>

      <div className="grid gap-6">
        {/* Contact Info */}
        <Card>
          <CardHeader><CardTitle>Contact Info</CardTitle></CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Email</p>
                <p className="font-medium">{customer.email}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Phone</p>
                <p className="font-medium">{customer.phone || "N/A"}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-muted-foreground">Address</p>
                <p className="font-medium">
                  {customer.address_line1}
                  {customer.address_line2 ? `, ${customer.address_line2}` : ""}
                  <br />
                  {customer.city}, {customer.state} {customer.postcode}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">{orders.length}</p>
              <p className="text-sm text-muted-foreground">Total Orders</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">RM {totalSpent.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">Total Spent</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">
                {new Date(customer.created_at).toLocaleDateString("en-MY")}
              </p>
              <p className="text-sm text-muted-foreground">Customer Since</p>
            </CardContent>
          </Card>
        </div>

        {/* Notes */}
        <Card>
          <CardHeader><CardTitle>Notes</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes about this customer..."
              rows={3}
            />
            <Button size="sm" onClick={saveNotes} className="bg-green-600 hover:bg-green-700">
              <Save className="h-4 w-4 mr-2" /> Save Notes
            </Button>
          </CardContent>
        </Card>

        {/* Order History */}
        <Card>
          <CardHeader><CardTitle>Order History</CardTitle></CardHeader>
          <CardContent>
            {orders.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No orders</p>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => (
                  <Link
                    key={order.id}
                    href={`/admin/orders/${order.id}`}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div>
                      <span className="font-medium text-sm">#{order.order_number}</span>
                      <span className="text-sm text-muted-foreground ml-2">
                        {new Date(order.created_at).toLocaleDateString("en-MY")}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium">RM {Number(order.total).toFixed(2)}</span>
                      <Badge className={statusColors[order.status] || ""}>{order.status}</Badge>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
