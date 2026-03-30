"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Minus, Plus, ArrowLeft, Truck, Shield, RotateCcw, Gift } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { ProductCard } from "@/components/shop/product-card"
import { calculatePrice } from "@/lib/pricing"
import { toast } from "sonner"
import type { Product } from "@/types"

function AccordionItem({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-gold/10">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-left"
      >
        <span className="text-[12px] font-medium tracking-[0.1em] uppercase">{title}</span>
        <span className={`text-gold transition-transform duration-300 ${open ? "rotate-45" : ""}`}>+</span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${open ? "max-h-96 pb-4" : "max-h-0"}`}
      >
        <p className="text-sm text-muted-foreground font-light leading-relaxed">{children}</p>
      </div>
    </div>
  )
}

export function ProductDetailContent({
  product,
  relatedProducts,
}: {
  product: Product
  relatedProducts: Product[]
}) {
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(0)
  const addItem = useCart((s) => s.addItem)

  const hasImages = product.images && product.images.length > 0 && product.images[0]
  const discount = product.compare_price
    ? Math.round(
        ((product.compare_price - product.price) / product.compare_price) * 100
      )
    : null

  return (
    <div className="pt-20">
      <div className="container mx-auto px-6 lg:px-8 py-10 lg:py-16">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-[12px] font-medium tracking-[0.1em] uppercase text-muted-foreground hover:text-foreground transition-colors mb-10"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Shop
        </Link>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Product Images */}
          <div>
            <div className="aspect-[3/4] bg-[#f5f3f0] relative overflow-hidden">
              {hasImages ? (
                <Image
                  src={product.images[activeImage]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[200px] font-display font-normal text-gold/10">
                    {product.name.charAt(0)}
                  </span>
                </div>
              )}
              {discount && (
                <span className="absolute top-4 left-4 btn-rose-gold text-[10px] font-medium tracking-wider px-3 py-1.5 z-10">
                  -{discount}%
                </span>
              )}
            </div>
            {/* Thumbnails */}
            {hasImages && product.images.length > 1 && (
              <div className="flex gap-3 mt-3">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`relative w-20 h-20 bg-[#f5f3f0] overflow-hidden transition-all ${
                      activeImage === idx
                        ? "ring-2 ring-foreground"
                        : "opacity-60 hover:opacity-100 hover:scale-110 transition-transform duration-300"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} ${idx + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-center">
            <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-muted-foreground mb-3">
              {product.category}
            </p>
            <h1 className="text-3xl md:text-4xl font-display font-normal tracking-tight mb-3">
              {product.name}
            </h1>
            <p className="text-muted-foreground font-light text-[15px] mb-6">
              {product.short_description}
            </p>

            {/* Pricing Tiers */}
            {(() => {
              const pricing = calculatePrice(quantity)
              return (
                <>
                  <div className="mb-4">
                    <div className="flex items-baseline gap-3">
                      <span className="text-2xl font-light">
                        RM {pricing.total.toFixed(2)}
                      </span>
                      {pricing.savings > 0 && (
                        <span className="text-base text-muted-foreground line-through">
                          RM {(quantity * Number(product.price)).toFixed(2)}
                        </span>
                      )}
                    </div>
                    {pricing.savings > 0 && (
                      <p className="text-xs font-medium text-green-600 mt-1">
                        You save RM {pricing.savings.toFixed(2)}
                      </p>
                    )}
                    {pricing.freeBoxes > 0 && (
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <Gift className="h-3.5 w-3.5 text-gold" />
                        <p className="text-xs font-medium text-gold">
                          {pricing.freeBoxes} FREE box{pricing.freeBoxes > 1 ? "es" : ""} — You get {pricing.totalBoxes} boxes!
                        </p>
                      </div>
                    )}
                    <p className="text-[10px] text-muted-foreground mt-1">{pricing.breakdown}</p>
                  </div>

                  {/* Quick tier buttons */}
                  <div className="flex gap-3 mb-4">
                    <button
                      onClick={() => setQuantity(1)}
                      className={`flex-1 border px-4 py-3 text-center transition-all ${
                        quantity === 1 ? "border-gold bg-gold/5" : "border-gold/15 hover:border-gold/25"
                      }`}
                    >
                      <span className="block text-xs font-medium">1 Box</span>
                      <span className="block text-lg font-light mt-0.5">RM 138</span>
                      <span className="block text-[10px] text-muted-foreground">15 sachets</span>
                    </button>
                    <button
                      onClick={() => setQuantity(2)}
                      className={`flex-1 border-2 px-4 py-3 text-center transition-all relative ${
                        quantity >= 2 ? "border-gold bg-gold/5" : "border-gold/40 hover:border-gold"
                      }`}
                    >
                      <Image src="/images/best-seller-logo.svg" alt="Best Seller" width={56} height={56} className="absolute -bottom-3 -right-3 w-12 h-12 drop-shadow-md" />
                      <span className="block text-xs font-medium">2 Boxes</span>
                      <span className="block text-lg font-light mt-0.5">RM 209</span>
                      <span className="block text-[10px] text-gold font-medium">+ 1 Box FREE</span>
                    </button>
                  </div>
                </>
              )
            })()}

            {/* Stock Status */}
            <div className="mb-4">
              {product.stock_count > 5 ? (
                <p className="text-xs font-medium tracking-wider uppercase text-gold">
                  In Stock
                </p>
              ) : product.stock_count > 0 ? (
                <p className="text-xs font-medium tracking-wider uppercase text-amber-600">
                  Only {product.stock_count} left
                </p>
              ) : (
                <p className="text-xs font-medium tracking-wider uppercase text-red-500">
                  Out of Stock
                </p>
              )}
            </div>

            {/* Quantity + Add to Cart */}
            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center border border-gold/15">
                <button
                  className="h-12 w-12 flex items-center justify-center hover:bg-gold/5 transition-colors"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="w-14 text-center text-sm font-medium">
                  {quantity}
                </span>
                <button
                  className="h-12 w-12 flex items-center justify-center hover:bg-gold/5 transition-colors"
                  onClick={() =>
                    setQuantity(Math.min(product.stock_count, quantity + 1))
                  }
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
              <button
                className="flex-1 h-12 btn-rose-gold text-[12px] font-medium tracking-[0.15em] uppercase disabled:opacity-40"
                disabled={product.stock_count === 0}
                onClick={() => {
                  addItem(product, quantity)
                  toast.success(`${quantity}x ${product.name} added to cart`)
                  setQuantity(1)
                }}
              >
                Add to Cart
              </button>
            </div>

            <Separator className="my-6 bg-gold/5" />

            {/* Features */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
              {[
                { icon: Truck, label: "Free Shipping", sub: "Orders over RM150" },
                { icon: Shield, label: "Quality Assured", sub: "GMP Certified" },
                { icon: RotateCcw, label: "Easy Returns", sub: "30-day policy" },
              ].map((f) => (
                <div key={f.label} className="text-center">
                  <f.icon className="h-4 w-4 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-[11px] font-medium tracking-wide">{f.label}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{f.sub}</p>
                </div>
              ))}
            </div>

            <Separator className="my-6 bg-gold/5" />

            {/* Collapsible Accordion Sections */}
            <div className="space-y-0">
              {[
                {
                  title: "WHAT'S INSIDE THAT COUNTS",
                  content: "12 premium botanicals: Ginfort Ginger, French Astaxanthin, Goji Berry, USA Ashwagandha, Dong Quai, USA Chamomile, Chasteberry, Magnesium Oxide, Cinnamon, Vitamin B Complex, Spanish Ferrous Fumarate, and Pomegranate extract.",
                },
                {
                  title: "DESCRIPTION",
                  content: product.description,
                },
                {
                  title: "INGREDIENTS",
                  content: "Pomegranate Juice Powder, Turmeric Extract Powder, Astaxanthin Powder, Ginfort Ginger Extract, Goji Berry Extract, Angelica Sinensis (Dong Quai), Ashwagandha Extract, Chamomile Extract, Chasteberry Extract, Magnesium Oxide, Cinnamon Extract, Ferrous Fumarate, Vitamin B Complex.",
                },
                {
                  title: "HOW TO USE",
                  content: "Tear open one sachet. Slowly pour into mouth to consume directly. Take 1 sachet daily, best in the morning. No water needed — enjoy anytime, anywhere.",
                },
              ].map((section) => (
                <AccordionItem key={section.title} title={section.title}>
                  {section.content}
                </AccordionItem>
              ))}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-24 lg:mt-32">
            <div className="text-center mb-12">
              <span className="text-[11px] font-medium tracking-[0.3em] uppercase text-muted-foreground">
                You May Also Like
              </span>
              <h2 className="text-2xl font-display font-normal tracking-tight mt-2">
                Related Products
              </h2>
              <div className="w-12 h-px line-rose-gold mx-auto mt-5" />
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-10">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sticky Add to Cart bar - mobile only */}
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white/95 backdrop-blur-md border-t border-gold/10 px-4 py-3 flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-display truncate">{product.name}</p>
          <p className="text-sm font-medium">RM {calculatePrice(quantity).total.toFixed(2)}</p>
        </div>
        <button
          className="btn-rose-gold px-6 py-2.5 text-[11px] font-medium tracking-[0.15em] uppercase whitespace-nowrap disabled:opacity-40"
          disabled={product.stock_count === 0}
          onClick={() => {
            addItem(product, quantity)
            toast.success(`${quantity}x ${product.name} added to cart`)
          }}
        >
          Add to Cart
        </button>
      </div>
    </div>
  )
}
