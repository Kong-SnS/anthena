"use client"

import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { useCart, useCartDrawer } from "@/hooks/use-cart"

export function CartDrawer() {
  const { open, close } = useCartDrawer()
  const items = useCart((s) => s.items)
  const removeItem = useCart((s) => s.removeItem)
  const updateQuantity = useCart((s) => s.updateQuantity)

  const subtotal = items.reduce((sum, item) => {
    return sum + Number(item.product.price) * item.quantity
  }, 0)

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0)
  const freeShipping = totalQuantity >= 2

  return (
    <Sheet open={open} onOpenChange={(val) => !val && close()}>
      <SheetContent side="right" className="w-[90vw] max-w-md flex flex-col">
        <SheetHeader className="border-b border-gold/10 pb-4">
          <SheetTitle className="text-xs font-medium tracking-[0.15em] uppercase">
            Your Cart ({itemCount})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-5 text-center px-6">
            <ShoppingBag className="h-12 w-12 text-gold/30" />
            <div>
              <p className="text-xs font-medium mb-1">Your cart is empty</p>
              <p className="text-base text-muted-foreground font-light">
                Browse our products and add items to your cart
              </p>
            </div>
            <button
              onClick={close}
              className="w-full btn-rose-gold py-3 text-xs font-medium tracking-[0.15em] uppercase"
            >
              Continue Shopping
            </button>
            <div className="border-t border-gold/10 pt-4 w-full">
              <p className="text-base text-muted-foreground mb-3">
                Have an account? Log in for faster checkout
              </p>
              <Link
                href="/auth/login"
                onClick={close}
                className="block w-full border border-gold/20 py-2.5 text-xs font-medium tracking-[0.15em] uppercase text-center hover:bg-gold/5 transition-colors"
              >
                Log In
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-4 py-2 space-y-4">
              {items.map((item) => {
                const hasImage = item.product.images?.[0]

                return (
                  <div key={item.product_id} className="flex gap-4">
                    {/* Thumbnail */}
                    <div className="relative w-20 h-20 flex-shrink-0 bg-[#faf8f5] overflow-hidden">
                      {hasImage ? (
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-[25px] font-display text-gold/20">
                            {item.product.name.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">
                        {item.product.name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        RM {(Number(item.product.price) * item.quantity).toFixed(2)}
                        {item.quantity > 1 && (
                          <span className="text-muted-foreground/60"> (RM {Number(item.product.price).toFixed(2)} x {item.quantity})</span>
                        )}
                      </p>

                      {/* Quantity controls */}
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center border border-gold/15">
                          <button
                            className="h-7 w-7 flex items-center justify-center hover:bg-gold/5 transition-colors"
                            onClick={() =>
                              updateQuantity(
                                item.product_id,
                                Math.max(1, item.quantity - 1)
                              )
                            }
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-8 text-center text-xs font-medium">
                            {item.quantity}
                          </span>
                          <button
                            className="h-7 w-7 flex items-center justify-center hover:bg-gold/5 transition-colors"
                            onClick={() =>
                              updateQuantity(
                                item.product_id,
                                item.quantity + 1
                              )
                            }
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.product_id)}
                          className="text-muted-foreground hover:text-red-500 transition-colors ml-auto"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <SheetFooter className="border-t border-gold/10 pt-4 gap-3">
              {!freeShipping && (
                <p className="text-base text-center text-muted-foreground">
                  Buy 2 boxes for free shipping (Peninsular)
                </p>
              )}
              {freeShipping && (
                <p className="text-xs text-center text-gold font-medium">
                  Free shipping for Peninsular Malaysia!
                </p>
              )}

              <Separator className="bg-gold/5" />

              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">Subtotal</span>
                <span className="text-xs font-medium">
                  RM {subtotal.toFixed(2)}
                </span>
              </div>

              <Link
                href="/checkout"
                onClick={close}
                className="btn-rose-gold w-full h-11 flex items-center justify-center gap-2 text-xs font-medium tracking-[0.15em] uppercase"
              >
                Checkout
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>

              <button
                onClick={close}
                className="text-xs text-muted-foreground text-center hover:text-foreground transition-colors"
              >
                Continue Shopping
              </button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
