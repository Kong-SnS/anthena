"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { Loader2, Lock, Gift, Truck, Shield, Star, AlertTriangle, Clock, Quote } from "lucide-react"
import type { SGQuantity } from "@/lib/pricing-sg"

const NAVY = "#00007b"

const tiers = [
  { qty: 1 as SGQuantity, label: "Buy 1 Free 1", desc: "Free extra 5 sachets", sachets: "15 + 5 sachets", price: 188, badge: null },
  { qty: 2 as SGQuantity, label: "Buy 2 Free 2", desc: "Free extra 10 sachets", sachets: "30 + 10 sachets", price: 268, badge: "Popular" },
  { qty: 3 as SGQuantity, label: "Buy 3 Free 3", desc: "Free extra 15 sachets", sachets: "45 + 15 sachets", price: 358, badge: "Best Value" },
]

const situations = [
  { icon: "🦵", title: "Knee Pain", desc: "Difficulty climbing stairs or standing up from sitting" },
  { icon: "🏃", title: "Joint Stiffness", desc: "Morning stiffness that limits your daily activities" },
  { icon: "💪", title: "Weak Bones", desc: "Concerns about bone density and fracture risk" },
  { icon: "🔄", title: "Back Pain", desc: "Chronic lower back discomfort affecting your posture" },
  { icon: "🖐️", title: "Swollen Joints", desc: "Inflammation and swelling in fingers, wrists, or ankles" },
  { icon: "😴", title: "Sleepless Nights", desc: "Joint pain keeping you awake at night" },
]

const consequences = [
  "Joint damage becomes irreversible over time",
  "Simple daily tasks become increasingly difficult",
  "Dependence on painkillers with harmful side effects",
  "Reduced mobility leads to muscle weakness",
  "Higher risk of falls and fractures",
  "Declining quality of life and independence",
]

const testimonials = [
  { name: "Mr. Tan K.H.", age: 62, text: "After 2 weeks of OseoVital, my knee pain reduced significantly. I can now climb stairs without holding the railing.", rating: 5 },
  { name: "Mdm. Lee S.M.", age: 55, text: "I was skeptical at first but the results speak for themselves. My morning stiffness is almost gone after just 10 days.", rating: 5 },
  { name: "Mr. Ahmad R.", age: 68, text: "My doctor noticed improvement in my joint mobility. I've been taking OseoVital for 3 months now and won't stop.", rating: 5 },
  { name: "Mrs. Wong Y.L.", age: 59, text: "The back pain that troubled me for years has improved drastically. I can finally enjoy gardening again!", rating: 5 },
]

export default function OseoVitalPage() {
  const [quantity, setQuantity] = useState<SGQuantity>(2)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const orderRef = useRef<HTMLDivElement>(null)
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

  const scrollToOrder = () => orderRef.current?.scrollIntoView({ behavior: "smooth" })

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
      if (!res.ok) { setError(data.error || "Something went wrong"); return }
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
    <div className="min-h-screen bg-white" style={{ fontFamily: "Arial, Helvetica, sans-serif" }}>
      {/* Announcement Bar */}
      <div style={{ background: NAVY }} className="py-2.5 text-center">
        <p className="text-xs font-medium tracking-wider uppercase text-white">
          Free Shipping Singapore — Min Purchase 2 Boxes
        </p>
      </div>

      {/* Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-100 py-4 text-center">
        <Link href="/oseovital" className="text-[25px] font-bold tracking-[0.15em] uppercase" style={{ color: NAVY }}>
          OseoVital
        </Link>
      </div>

      {/* Hero Section */}
      <div style={{ background: NAVY }} className="py-16 text-center text-white relative overflow-hidden">
        <div className="relative z-10 px-6">
          <p className="text-xs tracking-[0.3em] uppercase mb-3 text-white/70">Premium Joint & Bone Health</p>
          <h1 className="text-[40px] font-bold tracking-tight mb-4">OseoVital</h1>
          <p className="text-xs text-white/80 max-w-lg mx-auto leading-relaxed mb-8">
            Advanced botanical formula for joint comfort, bone strength, and mobility. Clinically proven ingredients from Switzerland and Japan.
          </p>
          <button onClick={scrollToOrder} className="inline-block px-8 py-3 border-2 border-white text-white text-xs font-bold tracking-[0.15em] uppercase hover:bg-white hover:text-[#00007b] transition-all">
            Order Now
          </button>
          <div className="flex justify-center gap-8 mt-8">
            {[
              { icon: Shield, text: "Clinically Proven" },
              { icon: Star, text: "Premium Formula" },
              { icon: Truck, text: "Free Shipping" },
            ].map((item) => (
              <div key={item.text} className="flex flex-col items-center gap-1.5">
                <item.icon className="h-4 w-4 text-white/60" />
                <span className="text-xs text-white/60">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Product Images */}
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <div className="grid grid-cols-2 gap-4">
          <div className="aspect-square relative overflow-hidden bg-gray-50">
            <Image src="/images/products/oseovital-main.jpg" alt="OseoVital Product" fill className="object-cover" sizes="50vw" />
          </div>
          <div className="aspect-square relative overflow-hidden bg-gray-50">
            <Image src="/images/products/oseovital-product.jpg" alt="OseoVital Box" fill className="object-cover" sizes="50vw" />
          </div>
        </div>
      </div>

      {/* Have You Experienced These Situations? */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-12">
            <p className="text-xs tracking-[0.3em] uppercase mb-3" style={{ color: NAVY }}>Common Signs</p>
            <h2 className="text-[25px] font-bold">Have You Experienced These Situations?</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {situations.map((s) => (
              <div key={s.title} className="bg-white p-5 text-center border border-gray-100">
                <span className="text-[25px] block mb-3">{s.icon}</span>
                <h3 className="text-xs font-bold mb-1">{s.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Consequences of Delayed Treatment */}
      <div className="py-16">
        <div className="container mx-auto px-6 max-w-3xl">
          <div className="text-center mb-12">
            <AlertTriangle className="h-8 w-8 mx-auto mb-3" style={{ color: NAVY }} />
            <h2 className="text-[25px] font-bold">Consequences of Delayed Treatment</h2>
            <p className="text-xs text-gray-500 mt-2">Don&apos;t wait until it&apos;s too late</p>
          </div>
          <div className="space-y-3">
            {consequences.map((c, i) => (
              <div key={i} className="flex items-center gap-4 p-4 border border-gray-100 bg-gray-50">
                <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-white text-xs font-bold" style={{ background: NAVY }}>
                  {i + 1}
                </span>
                <p className="text-xs font-medium">{c}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <button onClick={scrollToOrder} className="px-8 py-3 text-white text-xs font-bold tracking-[0.15em] uppercase" style={{ background: NAVY }}>
              Take Action Now
            </button>
          </div>
        </div>
      </div>

      {/* Results Timeline */}
      <div style={{ background: NAVY }} className="py-16 text-white">
        <div className="container mx-auto px-6 max-w-3xl text-center">
          <Clock className="h-8 w-8 mx-auto mb-3 text-white/60" />
          <h2 className="text-[25px] font-bold mb-8">See Results in Just Weeks</h2>
          <div className="grid grid-cols-3 gap-6">
            {[
              { day: "Day 7", text: "Pain starts to reduce" },
              { day: "Day 14", text: "Noticeable improvement in mobility" },
              { day: "Day 21", text: "Significant joint comfort restored" },
            ].map((r) => (
              <div key={r.day} className="text-center">
                <p className="text-[25px] font-bold mb-2">{r.day}</p>
                <p className="text-xs text-white/70">{r.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Testimonials */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-12">
            <p className="text-xs tracking-[0.3em] uppercase mb-3" style={{ color: NAVY }}>Real Stories</p>
            <h2 className="text-[25px] font-bold">Featured Testimonials</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white p-6 border border-gray-100">
                <Quote className="h-5 w-5 mb-3" style={{ color: NAVY }} />
                <p className="text-xs leading-relaxed mb-4 text-gray-600">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold">{t.name}</p>
                    <p className="text-xs text-gray-400">Age {t.age}</p>
                  </div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Choose Your Package + Checkout Form */}
      <div ref={orderRef} className="py-16" id="order">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-12">
            <p className="text-xs tracking-[0.3em] uppercase mb-3" style={{ color: NAVY }}>Choose Your Package</p>
            <h2 className="text-[25px] font-bold">Choose Your OseoVital Package</h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left — Pricing */}
            <div>
              <div className="space-y-3">
                {tiers.map((tier) => (
                  <button
                    key={tier.qty}
                    onClick={() => setQuantity(tier.qty)}
                    className="w-full px-5 py-4 text-left transition-all relative flex items-center justify-between"
                    style={{
                      border: quantity === tier.qty ? `2px solid ${NAVY}` : "2px solid #e5e7eb",
                      background: quantity === tier.qty ? `${NAVY}08` : "white",
                    }}
                  >
                    {tier.badge && (
                      <span className="absolute -top-3 left-4 text-xs font-bold tracking-wider px-3 py-0.5 text-white" style={{ background: NAVY }}>
                        {tier.badge}
                      </span>
                    )}
                    <div className={tier.badge ? "mt-1" : ""}>
                      <p className="text-xs font-bold">{tier.label}</p>
                      <p className="text-xs text-gray-500">{tier.sachets}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Gift className="h-3 w-3" style={{ color: NAVY }} />
                        <p className="text-xs font-medium" style={{ color: NAVY }}>{tier.desc}</p>
                      </div>
                    </div>
                    <p className="text-[25px] font-bold" style={{ color: NAVY }}>S${tier.price}</p>
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2 mt-4 text-gray-500">
                <Truck className="h-3.5 w-3.5" />
                <p className="text-xs">Flat rate S$10 shipping to Singapore</p>
              </div>
            </div>

            {/* Right — Form */}
            <div>
              <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-gray-400 mb-6">Shipping Details</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                {[
                  { label: "Name", field: "name", type: "text" },
                  { label: "Email", field: "email", type: "email" },
                  { label: "Phone", field: "phone", type: "tel" },
                ].map((f) => (
                  <div key={f.field}>
                    <label className="text-xs font-bold tracking-wider uppercase text-gray-400">{f.label}</label>
                    <input
                      type={f.type}
                      value={(form as any)[f.field]}
                      onChange={update(f.field)}
                      className="w-full h-11 px-3 mt-1.5 border border-gray-200 bg-white text-xs focus:outline-none"
                      onFocus={(e) => e.target.style.borderColor = NAVY}
                      onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
                      required
                    />
                  </div>
                ))}
                <div>
                  <label className="text-xs font-bold tracking-wider uppercase text-gray-400">Address</label>
                  <input type="text" value={form.address_line1} onChange={update("address_line1")} placeholder="Street address" className="w-full h-11 px-3 mt-1.5 border border-gray-200 bg-white text-xs focus:outline-none placeholder:text-gray-300" onFocus={(e) => e.target.style.borderColor = NAVY} onBlur={(e) => e.target.style.borderColor = "#e5e7eb"} required />
                </div>
                <div>
                  <label className="text-xs font-bold tracking-wider uppercase text-gray-400">Unit / Floor (optional)</label>
                  <input type="text" value={form.address_line2} onChange={update("address_line2")} className="w-full h-11 px-3 mt-1.5 border border-gray-200 bg-white text-xs focus:outline-none" onFocus={(e) => e.target.style.borderColor = NAVY} onBlur={(e) => e.target.style.borderColor = "#e5e7eb"} />
                </div>
                <div>
                  <label className="text-xs font-bold tracking-wider uppercase text-gray-400">Postal Code</label>
                  <input type="text" value={form.postcode} onChange={update("postcode")} className="w-full h-11 px-3 mt-1.5 border border-gray-200 bg-white text-xs focus:outline-none" onFocus={(e) => e.target.style.borderColor = NAVY} onBlur={(e) => e.target.style.borderColor = "#e5e7eb"} required />
                </div>

                {/* Order Summary */}
                <div className="border-t border-gray-100 pt-4 mt-6 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>{selected.label}</span>
                    <span>S${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Shipping to Singapore</span>
                    <span>S${shippingSGD.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold pt-2 border-t border-gray-100">
                    <span>Total</span>
                    <span className="text-[25px]" style={{ color: NAVY }}>S${total}</span>
                  </div>
                </div>

                {error && <p className="text-xs text-red-500 text-center">{error}</p>}

                <button type="submit" disabled={loading} className="w-full h-12 text-white text-xs font-bold tracking-[0.15em] uppercase flex items-center justify-center gap-2 disabled:opacity-50 transition-opacity" style={{ background: NAVY }}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Lock className="h-3.5 w-3.5" /> Pay S${total}</>}
                </button>
                <p className="text-xs text-gray-400 text-center">Secure payment powered by Stripe</p>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ background: NAVY }} className="py-8 text-center text-white/60">
        <p className="text-xs">&copy; {new Date().getFullYear()} OseoVital. All rights reserved.</p>
      </div>
    </div>
  )
}
