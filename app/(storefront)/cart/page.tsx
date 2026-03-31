"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, ArrowRight, Gift } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { calculatePrice } from "@/lib/pricing"

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCart()

  if (items.length === 0) {
    return (
      <div className="pt-20">
        <div className="container mx-auto px-6 lg:px-8 py-32 text-center">
          <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground/30 mb-6" />
          <h1 className="text-[25px] font-display font-normal tracking-tight mb-2">
            Your cart is empty
          </h1>
          <p className="text-muted-foreground font-light text-xs mb-8">
            Discover our curated collection of premium supplements.
          </p>
          <Button
            className="btn-rose-gold rounded-none px-10 h-12 text-xs font-medium tracking-[0.15em] uppercase"
            render={<Link href="/shop" />}
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    )
  }

  // Calculate tiered pricing per product
  const cartPricing = items.map((item) => ({
    ...item,
    pricing: calculatePrice(item.quantity),
  }))
  const subtotal = cartPricing.reduce((sum, item) => sum + item.pricing.total, 0)
  const fullPrice = items.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0)
  const totalSavings = fullPrice - subtotal

  return (
    <div className="pt-20">
      {/* Header */}
      <div className="bg-gradient-to-b from-[#faf8f5] to-[#faf8f5] py-20 lg:py-24">
        <div className="container mx-auto px-6 lg:px-8 text-center">
          <span className="text-xs font-medium tracking-[0.35em] uppercase text-white/40">
            Shopping
          </span>
          <h1 className="text-[40px] font-display font-normal tracking-tight mt-3">
            Your Cart
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid lg:grid-cols-3 gap-12 lg:gap-20">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-0">
              {items.map((item, idx) => (
                <div key={item.product_id}>
                  <div className="flex gap-5 py-8">
                    {/* Image */}
                    <Link href={`/shop/${item.product.slug}`} className="shrink-0">
                      <div className="w-24 h-28 bg-[#faf8f5] relative overflow-hidden">
                        {item.product.images?.[0] ? (
                          <Image
                            src={item.product.images[0]}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                            sizes="96px"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <span className="text-[40px] font-display font-normal text-gold/10">
                              {item.product.name.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>
                    </Link>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-xs font-medium tracking-[0.15em] uppercase text-muted-foreground">
                            {item.product.category}
                          </p>
                          <Link
                            href={`/shop/${item.product.slug}`}
                            className="font-medium text-xs tracking-wide hover:text-emerald transition-colors"
                          >
                            {item.product.name}
                          </Link>
                        </div>
                        <button
                          className="text-muted-foreground hover:text-red-500 transition-colors p-1"
                          onClick={() => removeItem(item.product_id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="flex items-end justify-between mt-4">
                        <div className="flex items-center border border-gold/15">
                          <button
                            className="h-9 w-9 flex items-center justify-center hover:bg-gold/5 transition-colors"
                            onClick={() =>
                              updateQuantity(item.product_id, item.quantity - 1)
                            }
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-10 text-center text-xs font-medium">
                            {item.quantity}
                          </span>
                          <button
                            className="h-9 w-9 flex items-center justify-center hover:bg-gold/5 transition-colors"
                            onClick={() =>
                              updateQuantity(item.product_id, item.quantity + 1)
                            }
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-xs">
                            RM {calculatePrice(item.quantity).total.toFixed(2)}
                          </p>
                          {calculatePrice(item.quantity).savings > 0 && (
                            <p className="text-xs text-green-600 font-medium">
                              Save RM {calculatePrice(item.quantity).savings.toFixed(2)}
                            </p>
                          )}
                          {calculatePrice(item.quantity).freeBoxes > 0 && (
                            <p className="text-xs text-gold font-medium flex items-center gap-1 justify-end">
                              <Gift className="h-3 w-3" /> {calculatePrice(item.quantity).freeBoxes} FREE
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  {idx < items.length - 1 && <Separator className="bg-gold/5" />}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between mt-6 pt-6 border-t border-gold/10">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 text-xs font-medium tracking-[0.1em] uppercase text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Continue Shopping
              </Link>
              <button
                onClick={clearCart}
                className="text-xs font-medium tracking-[0.1em] uppercase text-muted-foreground hover:text-red-500 transition-colors"
              >
                Clear Cart
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-[#faf8f5] p-8 lg:p-10 sticky top-28">
              <h2 className="text-xs font-medium tracking-[0.2em] uppercase mb-8">
                Order Summary
              </h2>

              <div className="space-y-3 mb-6">
                {totalSavings > 0 && (
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground font-light line-through">Original</span>
                    <span className="text-muted-foreground font-light line-through">RM {fullPrice.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground font-light">Subtotal</span>
                  <span className="font-medium">RM {subtotal.toFixed(2)}</span>
                </div>
                {totalSavings > 0 && (
                  <div className="flex justify-between text-xs">
                    <span className="text-green-600 font-medium">Savings</span>
                    <span className="text-green-600 font-medium">-RM {totalSavings.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground font-light">Shipping</span>
                  <span className="text-muted-foreground text-xs font-light">
                    {subtotal >= 150 ? "FREE" : "Calculated at checkout"}
                  </span>
                </div>
              </div>

              <Separator className="bg-gold/5 my-6" />

              <div className="flex justify-between mb-8">
                <span className="text-xs font-medium tracking-wide">Total</span>
                <span className="text-[25px] font-light">
                  RM {subtotal.toFixed(2)}
                </span>
              </div>

              <Button
                className="w-full btn-rose-gold rounded-none h-12 text-xs font-medium tracking-[0.15em] uppercase"
                render={<Link href="/checkout" />}
              >
                Checkout
                <ArrowRight className="ml-2 h-3.5 w-3.5" />
              </Button>

              <p className="text-xs text-center text-muted-foreground mt-4 font-light">
                Secure payment via Billplz
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
