"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"
import { DollarSign, ShoppingCart, Users, Package, AlertTriangle } from "lucide-react"

interface Stats {
  totalOrders: number
  totalRevenue: number
  totalCustomers: number
  totalProducts: number
  recentOrders: { id: string; order_number: string; total: number; status: string; created_at: string }[]
  lowStockProducts: { id: string; name: string; stock_count: number }[]
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  paid: "bg-blue-100 text-blue-800",
  processing: "bg-purple-100 text-purple-800",
  shipped: "bg-indigo-100 text-indigo-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    totalProducts: 0,
    recentOrders: [],
    lowStockProducts: [],
  })

  useEffect(() => {
    async function loadStats() {
      const supabase = createClient()

      const [orders, customers, products] = await Promise.all([
        supabase.from("orders").select("id, order_number, total, status, created_at").order("created_at", { ascending: false }),
        supabase.from("customers").select("id", { count: "exact", head: true }),
        supabase.from("products").select("id, name, stock_count").eq("is_active", true),
      ])

      const allOrders = orders.data || []
      const paidOrders = allOrders.filter((o) => o.status !== "pending" && o.status !== "cancelled")

      setStats({
        totalOrders: allOrders.length,
        totalRevenue: paidOrders.reduce((sum, o) => sum + Number(o.total), 0),
        totalCustomers: customers.count || 0,
        totalProducts: (products.data || []).length,
        recentOrders: allOrders.slice(0, 5),
        lowStockProducts: (products.data || []).filter((p) => p.stock_count <= 10),
      })
    }
    loadStats()
  }, [])

  const statCards = [
    { title: "Total Revenue", value: `RM ${stats.totalRevenue.toFixed(2)}`, icon: DollarSign, color: "text-green-600" },
    { title: "Total Orders", value: stats.totalOrders, icon: ShoppingCart, color: "text-blue-600" },
    { title: "Customers", value: stats.totalCustomers, icon: Users, color: "text-purple-600" },
    { title: "Products", value: stats.totalProducts, icon: Package, color: "text-orange-600" },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color} opacity-80`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.recentOrders.length === 0 ? (
              <p className="text-muted-foreground text-sm">No orders yet</p>
            ) : (
              <div className="space-y-3">
                {stats.recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between text-sm">
                    <div>
                      <span className="font-medium">#{order.order_number}</span>
                      <span className="text-muted-foreground ml-2">
                        RM {Number(order.total).toFixed(2)}
                      </span>
                    </div>
                    <Badge className={statusColors[order.status] || ""}>{order.status}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Low Stock Alert */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Low Stock Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.lowStockProducts.length === 0 ? (
              <p className="text-muted-foreground text-sm">All products are well stocked</p>
            ) : (
              <div className="space-y-3">
                {stats.lowStockProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between text-sm">
                    <span>{product.name}</span>
                    <Badge variant={product.stock_count <= 5 ? "destructive" : "secondary"}>
                      {product.stock_count} left
                    </Badge>
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
