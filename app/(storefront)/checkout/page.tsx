"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowLeft, Loader2, Lock } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { createClient } from "@/lib/supabase/client"
import { calculatePrice } from "@/lib/pricing"
import { toast } from "sonner"

const MY_STATES = [
  "Johor", "Kedah", "Kelantan", "Melaka", "Negeri Sembilan",
  "Pahang", "Perak", "Perlis", "Pulau Pinang", "Sabah",
  "Sarawak", "Selangor", "Terengganu", "Kuala Lumpur", "Putrajaya", "Labuan",
]

export default function CheckoutPage() {
  const { items, getTotal, clearCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    postcode: "",
  })

  // Autofill from logged-in user's profile + customer record
  useEffect(() => {
    async function loadUserInfo() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Get profile name
      const name = user.user_metadata?.name || ""
      const email = user.email || ""

      // Check if customer record exists with address
      const { data: customer } = await supabase
        .from("customers")
        .select("*")
        .eq("user_id", user.id)
        .single()

      if (customer) {
        setForm({
          name: customer.name || name,
          email: customer.email || email,
          phone: customer.phone || "",
          address_line1: customer.address_line1 || "",
          address_line2: customer.address_line2 || "",
          city: customer.city || "",
          state: customer.state || "",
          postcode: customer.postcode || "",
        })
      } else {
        // Try finding by email
        const { data: existingCustomer } = await supabase
          .from("customers")
          .select("*")
          .eq("email", email)
          .single()

        if (existingCustomer) {
          setForm({
            name: existingCustomer.name || name,
            email: existingCustomer.email || email,
            phone: existingCustomer.phone || "",
            address_line1: existingCustomer.address_line1 || "",
            address_line2: existingCustomer.address_line2 || "",
            city: existingCustomer.city || "",
            state: existingCustomer.state || "",
            postcode: existingCustomer.postcode || "",
          })
        } else {
          setForm((prev) => ({ ...prev, name, email }))
        }
      }
    }
    loadUserInfo()
  }, [])

  const subtotal = items.reduce((sum, item) => sum + calculatePrice(item.quantity).total, 0)
  const shippingCost = subtotal >= 150 ? 0 : 8.0
  const total = subtotal + shippingCost

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleCheckout = async () => {
    if (
      !form.name ||
      !form.email ||
      !form.phone ||
      !form.address_line1 ||
      !form.city ||
      !form.state ||
      !form.postcode
    ) {
      toast.error("Please fill in all required fields")
      return
    }
    if (items.length === 0) {
      toast.error("Your cart is empty")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: form,
          items: items.map((i) => ({
            product_id: i.product_id,
            product_name: i.product.name,
            quantity: i.quantity,
            unit_price: i.product.price,
          })),
          subtotal,
          shipping_cost: shippingCost,
          total,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Checkout failed")

      if (data.billplz_url) {
        clearCart()
        window.location.href = data.billplz_url
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="pt-20">
        <div className="container mx-auto px-6 lg:px-8 py-32 text-center">
          <h1 className="text-2xl font-display font-normal tracking-tight mb-2">
            Nothing to checkout
          </h1>
          <p className="text-muted-foreground font-light text-sm mb-8">
            Add some products to your cart first.
          </p>
          <Button
            className="btn-rose-gold rounded-none px-10 h-12 text-[12px] font-medium tracking-[0.15em] uppercase"
            render={<Link href="/shop" />}
          >
            Browse Products
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-20">
      {/* Header */}
      <div className="bg-gradient-to-b from-[#f5ece4] to-[#efe3d8] py-20 lg:py-24">
        <div className="container mx-auto px-6 lg:px-8 text-center">
          <span className="text-[11px] font-medium tracking-[0.35em] uppercase text-white/40">
            Secure
          </span>
          <h1 className="text-4xl md:text-5xl font-display font-normal tracking-tight mt-3">
            Checkout
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-6 lg:px-8 py-12 lg:py-16">
        <Link
          href="/cart"
          className="inline-flex items-center gap-2 text-[12px] font-medium tracking-[0.1em] uppercase text-muted-foreground hover:text-foreground transition-colors mb-10"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Cart
        </Link>

        <div className="grid lg:grid-cols-3 gap-12 lg:gap-20">
          {/* Form */}
          <div className="lg:col-span-2 space-y-10">
            {/* Contact */}
            <div>
              <h2 className="text-[11px] font-medium tracking-[0.2em] uppercase mb-6">
                Contact Information
              </h2>
              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs font-medium tracking-wider uppercase text-muted-foreground">
                      Full Name *
                    </Label>
                    <Input
                      value={form.name}
                      onChange={(e) => updateField("name", e.target.value)}
                      className="rounded-none border-gold/15 bg-transparent mt-1.5 h-11"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-medium tracking-wider uppercase text-muted-foreground">
                      Email *
                    </Label>
                    <Input
                      type="email"
                      value={form.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      className="rounded-none border-gold/15 bg-transparent mt-1.5 h-11"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-xs font-medium tracking-wider uppercase text-muted-foreground">
                    Phone *
                  </Label>
                  <Input
                    value={form.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    placeholder="012-3456789"
                    className="rounded-none border-gold/15 bg-transparent mt-1.5 h-11"
                  />
                </div>
              </div>
            </div>

            <Separator className="bg-gold/5" />

            {/* Shipping */}
            <div>
              <h2 className="text-[11px] font-medium tracking-[0.2em] uppercase mb-6">
                Shipping Address
              </h2>
              <div className="space-y-4">
                <div>
                  <Label className="text-xs font-medium tracking-wider uppercase text-muted-foreground">
                    Address Line 1 *
                  </Label>
                  <Input
                    value={form.address_line1}
                    onChange={(e) => updateField("address_line1", e.target.value)}
                    className="rounded-none border-gold/15 bg-transparent mt-1.5 h-11"
                  />
                </div>
                <div>
                  <Label className="text-xs font-medium tracking-wider uppercase text-muted-foreground">
                    Address Line 2
                  </Label>
                  <Input
                    value={form.address_line2}
                    onChange={(e) => updateField("address_line2", e.target.value)}
                    className="rounded-none border-gold/15 bg-transparent mt-1.5 h-11"
                  />
                </div>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-xs font-medium tracking-wider uppercase text-muted-foreground">
                      City *
                    </Label>
                    <Input
                      value={form.city}
                      onChange={(e) => updateField("city", e.target.value)}
                      className="rounded-none border-gold/15 bg-transparent mt-1.5 h-11"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-medium tracking-wider uppercase text-muted-foreground">
                      State *
                    </Label>
                    <Select
                      value={form.state}
                      onValueChange={(v) => updateField("state", v ?? "")}
                    >
                      <SelectTrigger className="rounded-none border-gold/15 bg-transparent mt-1.5 h-11">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {MY_STATES.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs font-medium tracking-wider uppercase text-muted-foreground">
                      Postcode *
                    </Label>
                    <Input
                      value={form.postcode}
                      onChange={(e) => updateField("postcode", e.target.value)}
                      className="rounded-none border-gold/15 bg-transparent mt-1.5 h-11"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-[#faf9f7] p-8 lg:p-10 sticky top-28">
              <h2 className="text-[11px] font-medium tracking-[0.2em] uppercase mb-8">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.product_id} className="text-sm">
                    <div className="flex justify-between gap-4">
                      <span className="text-muted-foreground font-light truncate flex-1">
                        {item.product.name}
                      </span>
                      <span className="font-medium whitespace-nowrap">
                        RM {calculatePrice(item.quantity).total.toFixed(2)}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">Qty: {item.quantity}</span>
                  </div>
                ))}
              </div>

              <Separator className="bg-gold/5 my-6" />

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground font-light">
                    Subtotal
                  </span>
                  <span>RM {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground font-light">
                    Shipping
                  </span>
                  <span>RM {shippingCost.toFixed(2)}</span>
                </div>
              </div>

              <Separator className="bg-gold/5 my-6" />

              <div className="flex justify-between mb-8">
                <span className="text-sm font-medium tracking-wide">Total</span>
                <span className="text-xl font-light">
                  RM {total.toFixed(2)}
                </span>
              </div>

              <button
                className="w-full h-12 btn-rose-gold text-[12px] font-medium tracking-[0.15em] uppercase flex items-center justify-center gap-2 disabled:opacity-50"
                onClick={handleCheckout}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Lock className="h-3.5 w-3.5" />
                    Pay RM {total.toFixed(2)}
                  </>
                )}
              </button>

              <p className="text-[10px] text-center text-muted-foreground mt-4 font-light">
                Secure payment powered by Billplz
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
