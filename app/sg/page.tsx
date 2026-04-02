"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Loader2, Lock, Gift, Truck } from "lucide-react"
import type { SGQuantity } from "@/lib/pricing-sg"

const tiers = [
  { qty: 1 as SGQuantity, label: "Buy 1 Free 1", desc: "Free extra 5 sachets", sachets: "15 + 5 sachets", price: 188, badge: null },
  { qty: 2 as SGQuantity, label: "Buy 2 Free 2", desc: "Free extra 10 sachets", sachets: "30 + 10 sachets", price: 268, badge: "Popular" },
  { qty: 3 as SGQuantity, label: "Buy 3 Free 3", desc: "Free extra 15 sachets", sachets: "45 + 15 sachets", price: 358, badge: "Best Value" },
]

export default function SGCheckoutPage() {
  const [quantity, setQuantity] = useState<SGQuantity>(2)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address_line1: "",
    address_line2: "",
    postcode: "",
  })

  const shippingSGD = 10
  const selected = tiers.find((t) => t.qty === quantity)!
  const subtotal = selected.price
  const total = (subtotal + shippingSGD).toFixed(2)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity, customer: form }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Something went wrong")
        return
      }

      window.location.href = data.url
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }))

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#ffdde1] to-[#ee9ca7] py-4 text-center">
        <Link href="/" className="text-[25px] font-display tracking-[0.2em] uppercase text-white">
          Athena
        </Link>
        <p className="text-xs text-white/80 mt-1 tracking-wider">Singapore Store</p>
      </div>

      <div className="container mx-auto px-6 py-10 max-w-4xl">
        <div className="grid lg:grid-cols-2 gap-10">
          {/* Left — Product Selection */}
          <div>
            <h1 className="text-[40px] font-display font-normal tracking-tight mb-2">
              Bloomie
            </h1>
            <p className="text-xs text-muted-foreground mb-8">
              Botanical Beverage Mix Pomegranate — 12 Premium Botanicals
            </p>

            {/* Product Image */}
            <div className="aspect-square bg-[#faf8f5] relative overflow-hidden rounded-sm mb-8">
              <Image
                src="/images/products/bloomie-main.png"
                alt="Bloomie"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>

            {/* Pricing Options */}
            <div className="space-y-3">
              {tiers.map((tier) => (
                <button
                  key={tier.qty}
                  onClick={() => setQuantity(tier.qty)}
                  className={`w-full border-2 px-5 py-4 text-left transition-all relative flex items-center justify-between ${
                    quantity === tier.qty
                      ? "border-gold bg-gold/5"
                      : "border-gold/15 hover:border-gold/25"
                  }`}
                >
                  {tier.badge && (
                    <span className="absolute -top-3 left-4 btn-rose-gold text-xs font-medium tracking-wider px-3 py-0.5">
                      {tier.badge}
                    </span>
                  )}
                  <div className={tier.badge ? "mt-1" : ""}>
                    <p className="text-xs font-medium">{tier.label}</p>
                    <p className="text-xs text-muted-foreground">{tier.sachets}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Gift className="h-3 w-3 text-gold" />
                      <p className="text-xs text-gold font-medium">{tier.desc}</p>
                    </div>
                  </div>
                  <p className="text-[25px] font-light">S${tier.price}</p>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 mt-4 text-muted-foreground">
              <Truck className="h-3.5 w-3.5" />
              <p className="text-xs">Flat rate S$10 shipping to Singapore</p>
            </div>
          </div>

          {/* Right — Customer Form */}
          <div>
            <h2 className="text-xs font-medium tracking-[0.2em] uppercase text-muted-foreground mb-6">
              Shipping Details
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-medium tracking-wider uppercase text-muted-foreground">Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={update("name")}
                  className="w-full h-11 px-3 mt-1.5 border border-gold/15 bg-transparent text-xs focus:outline-none focus:border-gold"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-medium tracking-wider uppercase text-muted-foreground">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={update("email")}
                  className="w-full h-11 px-3 mt-1.5 border border-gold/15 bg-transparent text-xs focus:outline-none focus:border-gold"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-medium tracking-wider uppercase text-muted-foreground">Phone</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={update("phone")}
                  className="w-full h-11 px-3 mt-1.5 border border-gold/15 bg-transparent text-xs focus:outline-none focus:border-gold"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-medium tracking-wider uppercase text-muted-foreground">Address</label>
                <input
                  type="text"
                  value={form.address_line1}
                  onChange={update("address_line1")}
                  placeholder="Street address"
                  className="w-full h-11 px-3 mt-1.5 border border-gold/15 bg-transparent text-xs focus:outline-none focus:border-gold placeholder:text-muted-foreground/50"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-medium tracking-wider uppercase text-muted-foreground">Unit / Floor (optional)</label>
                <input
                  type="text"
                  value={form.address_line2}
                  onChange={update("address_line2")}
                  className="w-full h-11 px-3 mt-1.5 border border-gold/15 bg-transparent text-xs focus:outline-none focus:border-gold"
                />
              </div>
              <div>
                <label className="text-xs font-medium tracking-wider uppercase text-muted-foreground">Postal Code</label>
                <input
                  type="text"
                  value={form.postcode}
                  onChange={update("postcode")}
                  className="w-full h-11 px-3 mt-1.5 border border-gold/15 bg-transparent text-xs focus:outline-none focus:border-gold"
                  required
                />
              </div>

              {/* Order Summary */}
              <div className="border-t border-gold/10 pt-4 mt-6 space-y-2">
                <div className="flex justify-between text-xs">
                  <span>{selected.label}</span>
                  <span>S${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Shipping to Singapore</span>
                  <span>S${shippingSGD.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs font-medium pt-2 border-t border-gold/10">
                  <span>Total</span>
                  <span className="text-[25px] font-light">S${total}</span>
                </div>
              </div>

              {error && (
                <p className="text-xs text-red-500 text-center">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 btn-rose-gold text-xs font-medium tracking-[0.15em] uppercase flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Lock className="h-3.5 w-3.5" />
                    Pay S${total}
                  </>
                )}
              </button>

              <p className="text-xs text-muted-foreground text-center">
                Secure payment powered by Stripe
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
