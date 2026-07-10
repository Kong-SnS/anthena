"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { createClient } from "@/lib/supabase/client"
import { Loader2, LogOut, Package, Truck } from "lucide-react"
import type { Order } from "@/types"

const statusConfig: Record<string, { label: string; color: string }> = {
  pending: { label: "Pending", color: "bg-amber-50 text-amber-700 border-amber-200" },
  paid: { label: "Paid", color: "bg-blue-50 text-blue-700 border-blue-200" },
  processing: { label: "Processing", color: "bg-purple-50 text-purple-700 border-purple-200" },
  shipped: { label: "Shipped", color: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  delivered: { label: "Delivered", color: "bg-green-50 text-green-700 border-green-200" },
  cancelled: { label: "Cancelled", color: "bg-red-50 text-red-700 border-red-200" },
}

export default function AccountPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState<Order[]>([])
  const [user, setUser] = useState<{ email: string; name: string } | null>(null)

  useEffect(() => {
    async function loadData() {
      const supabase = createClient()
      const { data: claimsData } = await supabase.auth.getClaims()
      const claims = claimsData?.claims

      if (!claims) {
        router.push("/auth/login")
        return
      }

      const email = (claims.email as string) || ""
      setUser({ email, name: (claims.user_metadata?.name as string) || "" })

      let customer = null
      const { data: byUserId } = await supabase
        .from("customers")
        .select("id")
        .eq("user_id", claims.sub)
        .single()

      if (byUserId) {
        customer = byUserId
      } else if (email) {
        const { data: byEmail } = await supabase
          .from("customers")
          .select("id")
          .eq("email", email)
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
      {/* Header */}
      <div className="bg-[#faf8f5] py-16 lg:py-20">
        <div className="container mx-auto px-6 lg:px-8 text-center">
          <span className="text-xs font-medium tracking-[0.35em] uppercase text-rose-gold">
            Welcome Back
          </span>
          <h1 className="text-[40px] font-display font-normal tracking-tight mt-3">
            My Account
          </h1>
          <p className="text-muted-foreground font-light text-base mt-2">{user?.email}</p>
        </div>
      </div>

      <div className="container mx-auto px-6 lg:px-8 py-12 lg:py-16 max-w-3xl">
        {/* Logout */}
        <div className="flex justify-end mb-8">
          <Button
            variant="outline"
            className="rounded-none border-gold/15 text-xs font-medium tracking-[0.1em] uppercase h-10 px-6"
            onClick={handleLogout}
          >
            <LogOut className="h-3.5 w-3.5 mr-2" /> Logout
          </Button>
        </div>

        {/* Order History */}
        <div>
          <div className="flex items-center gap-2 mb-8">
            <Package className="h-4 w-4 text-rose-gold" />
            <h2 className="text-xs font-medium tracking-[0.2em] uppercase">Order History</h2>
          </div>

          {orders.length === 0 ? (
            <div className="bg-[#faf8f5] py-16 text-center">
              <p className="text-muted-foreground font-light">No orders yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const status = statusConfig[order.status] || statusConfig.pending
                return (
                  <div key={order.id} className="border border-gold/10 p-6 hover:border-gold/20 transition-colors">
                    {/* Order header */}
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="text-xs font-medium tracking-wide">#{order.order_number}</span>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(order.created_at).toLocaleDateString("en-MY", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      <span className={`text-xs font-medium tracking-wider uppercase px-3 py-1 border ${status.color}`}>
                        {status.label}
                      </span>
                    </div>

                    {/* Items */}
                    {order.order_items && (
                      <div className="space-y-2 mb-4">
                        {order.order_items.map((item) => (
                          <div key={item.id} className="flex justify-between text-xs">
                            <span className="text-muted-foreground font-light">
                              {item.product_name} <span className="text-muted-foreground/60">x{item.quantity}</span>
                            </span>
                            <span>RM {(item.unit_price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <Separator className="bg-gold/5 my-4" />

                    {/* Total + Tracking */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex justify-between text-xs">
                          <span className="font-medium">Total</span>
                        </div>
                        {order.tracking_number && (
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Truck className="h-3 w-3" />
                            <span>{order.tracking_number}</span>
                          </div>
                        )}
                      </div>
                      <span className="text-sm font-medium text-rose-gold">RM {order.total.toFixed(2)}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
