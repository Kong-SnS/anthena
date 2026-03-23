"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { createClient } from "@/lib/supabase/client"
import { Loader2, LogOut, Package } from "lucide-react"
import type { Order } from "@/types"

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  paid: "bg-blue-100 text-blue-800",
  processing: "bg-purple-100 text-purple-800",
  shipped: "bg-indigo-100 text-indigo-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
}

export default function AccountPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState<Order[]>([])
  const [user, setUser] = useState<{ email: string; name: string } | null>(null)

  useEffect(() => {
    async function loadData() {
      const supabase = createClient()
      const { data: { user: authUser } } = await supabase.auth.getUser()

      if (!authUser) {
        router.push("/auth/login")
        return
      }

      setUser({ email: authUser.email || "", name: authUser.user_metadata?.name || "" })

      // Look up customer by user_id first, then by email as fallback
      let customer = null
      const { data: byUserId } = await supabase
        .from("customers")
        .select("id")
        .eq("user_id", authUser.id)
        .single()

      if (byUserId) {
        customer = byUserId
      } else if (authUser.email) {
        const { data: byEmail } = await supabase
          .from("customers")
          .select("id")
          .eq("email", authUser.email)
          .single()
        customer = byEmail
      }

      if (customer) {
        const { data: orderData } = await supabase
          .from("orders")
          .select("*, order_items(*)")
          .eq("customer_id", customer.id)
          .order("created_at", { ascending: false })

        setOrders(orderData || [])
      }

      setLoading(false)
    }
    loadData()
  }, [router])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  if (loading) {
    return (
      <div className="pt-20 container mx-auto px-6 lg:px-8 py-16 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="pt-20">
      <div className="container mx-auto px-6 lg:px-8 py-10 max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display font-normal tracking-tight">My Account</h1>
          <p className="text-muted-foreground font-light text-sm mt-1">{user?.email}</p>
        </div>
        <Button variant="outline" onClick={handleLogout}>
          <LogOut className="h-4 w-4 mr-2" /> Logout
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" /> Order History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No orders yet</p>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">#{order.order_number}</span>
                    <Badge className={statusColors[order.status] || ""}>
                      {order.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">
                    {new Date(order.created_at).toLocaleDateString("en-MY", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                  {order.order_items && (
                    <div className="text-sm space-y-1">
                      {order.order_items.map((item) => (
                        <div key={item.id} className="flex justify-between">
                          <span>{item.product_name} x{item.quantity}</span>
                          <span>RM {(item.unit_price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  <Separator className="my-2" />
                  <div className="flex justify-between font-semibold text-sm">
                    <span>Total</span>
                    <span>RM {order.total.toFixed(2)}</span>
                  </div>
                  {order.tracking_number && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Tracking: {order.tracking_number}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
    </div>
  )
}
