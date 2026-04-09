"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Loader2, Lock, Gift, Truck, Shield, Star, Quote, Plus, Minus, Instagram, Facebook } from "lucide-react"
import type { SGQuantity } from "@/lib/pricing-sg"

const NAVY = "#00007b"
const GOLD_GRADIENT = "linear-gradient(135deg, #b8860b, #d4af37, #f0c75e, #d4af37, #b8860b)"

const tiers = [
  { qty: 1 as SGQuantity, label: "Buy 1 Free 1", desc: "Free extra 5 sachets", sachets: "15 + 15 sachets", price: 188, badge: null },
  { qty: 2 as SGQuantity, label: "Buy 2 Free 2", desc: "Free extra 10 sachets", sachets: "30 + 30 sachets", price: 268, badge: "Popular" },
  { qty: 3 as SGQuantity, label: "Buy 3 Free 3", desc: "Free extra 15 sachets", sachets: "45 + 45 sachets", price: 358, badge: "Best Value" },
]

const functions = [
  "Joint Pain / Stiff / Numb / Swelling / Weak",
  "Osteoarthritis / Bone on Bone",
  "Slipped Disc / Joint Degeneration",
  "Sciatica / Nerve-Related Problems",
  "Trigger Finger / Hand Pain or Numb",
  "Back / Waist Pain",
  "Manage Bad Cholesterol",
  "Manage High Blood Pressure / Sugar (Diabetic)",
  "Sleep Difficulty",
  "Sport-Related or Physical Injuries",
  "Tearing of Ligament / Meniscus / Tendon",
]

const accordionSections = [
  {
    title: "What's Inside That Counts",
    content: null,
  },
  {
    title: "Description",
    content: (
      <div className="space-y-2">
        <p>Made using real orange fruit powder (Orange Flavour)</p>
        <p>✨ For All Joint-related Problems: Bone, Nerve & Muscle</p>
        <p>✨ Treat Joint Pain, Weakness, Stiffness, Numbness, Swelling</p>
      </div>
    ),
  },
  {
    title: "Ingredients",
    content: (
      <p className="leading-relaxed">
        Orange Juice Powder, Passion Fruit Powder, Boswellia Serrata Extract, Glycostat® Wild Bitter Melon Extract, Colla2gen™ (Chicken Cartilage), Elderberry Extract, Cactus Extract, Multivitamin (Vitamin A, Vitamin D3, Vitamin E, Vitamin B1, Vitamin B2, Vitamin B3, Vitamin B5, Vitamin B6, Vitamin B7, Vitamin B9, Vitamin B12 and Vitamin C) and Multimineral (Potassium, Calcium, Magnesium, Iron, Zinc, Copper, Iodine, Selenium, Chromium, Molybdenum).
      </p>
    ),
  },
  {
    title: "Key Science-backed Ingredients",
    content: null,
  },
  {
    title: "Nutritional Facts",
    content: null,
  },
  {
    title: "How to Consume",
    content: (
      <p>
        Take 1 sachet daily after breakfast / lunch. Consume directly OR mix in half cup of room temperature water to drink.
      </p>
    ),
  },
]

const testimonials = [
  { name: "Caroline Yew", title: "Long Term Sciatica (L4-L5) Sufferer", text: "I suffered from sciatica pain for 5 long years — every step was torture and painkillers never gave lasting relief. After just 3 boxes of OseoVital, the pain finally eased. Even my doctor was shocked at how fast it worked! I'm so glad I took that first step to try it.", rating: 5 },
  { name: "Michelle Tan", title: "Active in Sports", text: "I love jogging, but my sciatica pain stopped me for months. The sharp pain shot from my back to my foot every time I moved. With 4 boxes of OseoVital, I'm finally back on track and enjoying my runs again.", rating: 5 },
  { name: "Jason Lim", title: "Office Worker", text: "Sitting for hours at work was unbearable — the shooting pain down my leg made it impossible to focus. After 2 boxes of OseoVital, my sciatica eased so much I can finally sit and work without constant pain.", rating: 5 },
  { name: "Mdm. Lee S.M.", title: "Retired Teacher", text: "My knee and back pain made daily tasks a struggle. After trying OseoVital for just 2 weeks, I noticed a real difference. Now I can walk to the market and carry groceries without wincing. This product truly changed my quality of life.", rating: 5 },
]

function AccordionItem({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b" style={{ borderColor: "#e5e7eb" }}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left"
      >
        <span className="text-xs font-bold tracking-[0.1em] uppercase" style={{ color: NAVY }}>{title}</span>
        {open ? <Minus className="h-4 w-4" style={{ color: NAVY }} /> : <Plus className="h-4 w-4" style={{ color: NAVY }} />}
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? "max-h-[1000px] pb-5" : "max-h-0"}`}>
        <div className="text-sm text-gray-600 leading-relaxed">{children}</div>
      </div>
    </div>
  )
}

const bannerMessages = [
  "Specially Made for Joint (Bone, Nerve, Muscle) Problems",
  "Science-backed Ingredients",
  "Swiss Formulated",
]

function OseoBanner() {
  const [index, setIndex] = useState(0)
  const [fade, setFade] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false)
      setTimeout(() => {
        setIndex((i) => (i + 1) % bannerMessages.length)
        setFade(true)
      }, 300)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{ background: NAVY }} className="py-2.5 text-center overflow-hidden">
      <p
        className="text-xs font-medium tracking-wider uppercase text-white transition-opacity duration-300"
        style={{ opacity: fade ? 1 : 0 }}
      >
        {bannerMessages[index]}
      </p>
    </div>
  )
}

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

  const shippingSGD = 0
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
      <OseoBanner />

      {/* Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-100 py-4 text-center">
        <Link href="/oseovital" className="text-[25px] font-bold tracking-[0.15em] uppercase" style={{ color: NAVY }}>
          OseoVital
        </Link>
      </div>

      {/* Hero Section */}
      <div style={{ background: NAVY }} className="py-16 text-center text-white relative overflow-hidden">
        {/* Gold accent line */}
        <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: GOLD_GRADIENT }} />
        <div className="relative z-10 px-6">
          <p className="text-xs tracking-[0.3em] uppercase mb-3" style={{ background: GOLD_GRADIENT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Premium Joint & Bone Health</p>
          <h1 className="text-[40px] font-bold tracking-tight mb-4">OseoVital</h1>
          <p className="text-sm text-white/80 max-w-lg mx-auto leading-relaxed mb-8">
            Advanced botanical formula for joint comfort, bone strength, and mobility. Clinically proven ingredients from Switzerland and Japan.
          </p>
          <button onClick={scrollToOrder} className="inline-block px-8 py-3 text-xs font-bold tracking-[0.15em] uppercase text-white border-2 transition-all hover:opacity-90" style={{ background: GOLD_GRADIENT, borderColor: "#d4af37" }}>
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
        {/* Gold accent line bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-[3px]" style={{ background: GOLD_GRADIENT }} />
      </div>

      {/* Product Image + Package Selector + Accordion */}
      <div className="container mx-auto px-6 py-12 max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left: Product Image (sticky) */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="aspect-square relative overflow-hidden bg-gray-50">
              <Image src="/images/oseo-vital-product.png" alt="OseoVital Product" fill className="object-contain" sizes="(max-width: 1024px) 100vw, 50vw" priority />
            </div>
          </div>

          {/* Right: Package Selector + Accordion */}
          <div>
            <h2 className="text-[25px] font-bold mb-2" style={{ color: NAVY }}>OseoVital</h2>
            <p className="text-sm text-gray-500 mb-6">Joint • Bone • Nerve • Muscle Health</p>

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
                    <span className="absolute -top-3 left-4 text-xs font-bold tracking-wider px-3 py-0.5" style={{ background: GOLD_GRADIENT, color: NAVY }}>
                      {tier.badge}
                    </span>
                  )}
                  <div className={tier.badge ? "mt-1" : ""}>
                    <p className="text-sm font-bold">{tier.label}</p>
                    <p className="text-sm text-gray-500">{tier.sachets}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Gift className="h-3 w-3" style={{ color: NAVY }} />
                      <p className="text-sm font-medium" style={{ color: NAVY }}>{tier.desc}</p>
                    </div>
                  </div>
                  <p className="text-[25px] font-bold" style={{ color: NAVY }}>S${tier.price}</p>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 mt-4 text-gray-500">
              <Truck className="h-3.5 w-3.5" />
              <p className="text-sm text-green-600 font-medium">Free Shipping</p>
            </div>

            <button onClick={scrollToOrder} className="mt-6 w-full py-4 text-white text-xs font-bold tracking-[0.15em] uppercase" style={{ background: NAVY }}>
              Order Now
            </button>

            {/* Accordion */}
            <div className="mt-10">
              {accordionSections.map((section) => (
                <AccordionItem key={section.title} title={section.title}>
                  {section.title === "What's Inside That Counts" ? (
                    <div className="relative w-full" style={{ aspectRatio: "1/1.4" }}>
                      <Image src="/images/Oseo 4 Major Functions.png" alt="OseoVital 4 Major Functions" fill className="object-contain" sizes="(max-width: 768px) 100vw, 50vw" />
                    </div>
                  ) : section.title === "Key Science-backed Ingredients" ? (
                    <div className="relative w-full" style={{ aspectRatio: "1/1.4" }}>
                      <Image src="/images/key.png" alt="OseoVital Key Ingredients" fill className="object-contain" sizes="(max-width: 768px) 100vw, 50vw" />
                    </div>
                  ) : section.title === "Nutritional Facts" ? (
                    <div className="relative w-full" style={{ aspectRatio: "1/1.4" }}>
                      <Image src="/images/Oseo Nutritional Facts.png" alt="OseoVital Nutritional Facts" fill className="object-contain" sizes="(max-width: 768px) 100vw, 50vw" />
                    </div>
                  ) : (
                    section.content
                  )}
                </AccordionItem>
              ))}
            </div>
          </div>
        </div>
      </div>


      {/* Functions of OseoVital */}
      <div className="py-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-12">
            <p className="text-xs tracking-[0.3em] uppercase mb-3" style={{ color: NAVY }}>Benefits</p>
            <h2 className="text-[25px] font-bold">Functions of OseoVital</h2>
            <div className="w-16 h-[2px] mx-auto mt-4" style={{ background: GOLD_GRADIENT }} />
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            {functions.map((f, i) => (
              <div key={i} className="flex items-center gap-4 p-4 border border-gray-100 bg-gray-50">
                <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-white text-xs font-bold" style={{ background: GOLD_GRADIENT, color: NAVY }}>
                  {i + 1}
                </span>
                <p className="text-sm font-medium">{f}</p>
              </div>
            ))}
          </div>
        </div>
      </div>


      {/* Customer Reviews */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-12">
            <p className="text-xs tracking-[0.3em] uppercase mb-3" style={{ color: NAVY }}>Real Stories</p>
            <h2 className="text-[25px] font-bold">What Our Customers Say</h2>
            <div className="w-16 h-[2px] mx-auto mt-4" style={{ background: GOLD_GRADIENT }} />
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white p-6 border border-gray-100">
                <Quote className="h-5 w-5 mb-3" style={{ color: NAVY }} />
                <p className="text-sm leading-relaxed mb-4 text-gray-600">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold">{t.name}</p>
                    <p className="text-sm text-gray-400">{t.title}</p>
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

      {/* Checkout Form */}
      <div ref={orderRef} className="py-16" id="order">
        <div className="container mx-auto px-6 max-w-2xl">
          <div className="text-center mb-12">
            <h2 className="text-[25px] font-bold">Complete Your Order</h2>
            <div className="w-16 h-[2px] mx-auto mt-4" style={{ background: GOLD_GRADIENT }} />
            <p className="text-sm text-gray-500 mt-4">Selected: <strong style={{ color: NAVY }}>{selected.label}</strong> · {selected.sachets}</p>
          </div>

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
                      className="w-full h-11 px-3 mt-1.5 border border-gray-200 bg-white text-sm focus:outline-none"
                      onFocus={(e) => e.target.style.borderColor = NAVY}
                      onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
                      required
                    />
                  </div>
                ))}
                <div>
                  <label className="text-xs font-bold tracking-wider uppercase text-gray-400">Address</label>
                  <input type="text" value={form.address_line1} onChange={update("address_line1")} placeholder="Street address" className="w-full h-11 px-3 mt-1.5 border border-gray-200 bg-white text-sm focus:outline-none placeholder:text-gray-300" onFocus={(e) => e.target.style.borderColor = NAVY} onBlur={(e) => e.target.style.borderColor = "#e5e7eb"} required />
                </div>
                <div>
                  <label className="text-xs font-bold tracking-wider uppercase text-gray-400">Unit / Floor (optional)</label>
                  <input type="text" value={form.address_line2} onChange={update("address_line2")} className="w-full h-11 px-3 mt-1.5 border border-gray-200 bg-white text-sm focus:outline-none" onFocus={(e) => e.target.style.borderColor = NAVY} onBlur={(e) => e.target.style.borderColor = "#e5e7eb"} />
                </div>
                <div>
                  <label className="text-xs font-bold tracking-wider uppercase text-gray-400">Postal Code</label>
                  <input type="text" value={form.postcode} onChange={update("postcode")} className="w-full h-11 px-3 mt-1.5 border border-gray-200 bg-white text-sm focus:outline-none" onFocus={(e) => e.target.style.borderColor = NAVY} onBlur={(e) => e.target.style.borderColor = "#e5e7eb"} required />
                </div>

                {/* Order Summary */}
                <div className="border-t border-gray-200 pt-4 mt-6 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{selected.label}</span>
                    <span>S${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>S${shippingSGD.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold pt-2 border-t border-gray-200">
                    <span>Total</span>
                    <span className="text-[25px]" style={{ color: NAVY }}>S${total}</span>
                  </div>
                </div>

                {error && <p className="text-sm text-red-500 text-center">{error}</p>}

                <button type="submit" disabled={loading} className="w-full h-12 text-white text-xs font-bold tracking-[0.15em] uppercase flex items-center justify-center gap-2 disabled:opacity-50 transition-opacity" style={{ background: NAVY }}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Lock className="h-3.5 w-3.5" /> Pay S${total}</>}
                </button>
                <p className="text-sm text-gray-400 text-center">Secure payment powered by Stripe</p>
              </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ background: NAVY }} className="py-12 text-center text-white relative">
        <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: GOLD_GRADIENT }} />
        <div className="container mx-auto px-6">
          <h3 className="text-[25px] font-bold mb-2" style={{ background: GOLD_GRADIENT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Follow Us</h3>
          <a href="https://www.instagram.com/oseovital_sg/" target="_blank" rel="noopener noreferrer" className="text-sm text-white/70 hover:text-white transition-colors mb-6 inline-block">@oseovital_sg</a>
          <div className="flex justify-center gap-4 mb-8">
            <a
              href="https://www.instagram.com/oseovital_sg/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="h-5 w-5 text-white" />
            </a>
            <a
              href="https://www.facebook.com/OseoVitalSG/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="h-5 w-5 text-white" />
            </a>
          </div>
          <div className="border-t border-white/10 pt-6">
            <p className="text-xs text-white/60">&copy; {new Date().getFullYear()} OseoVital. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
