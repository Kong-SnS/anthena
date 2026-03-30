"use client"

import Link from "next/link"
import Image from "next/image"
import { useCart, useCartDrawer } from "@/hooks/use-cart"
import type { Product } from "@/types"

export function ProductCard({ product }: { product: Product }) {
  const addItem = useCart((s) => s.addItem)
  const openCartDrawer = useCartDrawer((s) => s.show)
  const price = Number(product.price)
  const comparePrice = product.compare_price ? Number(product.compare_price) : null
  const discount = comparePrice
    ? Math.round(((comparePrice - price) / comparePrice) * 100)
    : null

  const hasImage = product.images && product.images.length > 0 && product.images[0]

  return (
    <div className="group">
      <Link href={`/shop/${product.slug}`}>
        {/* Image */}
        <div className="relative aspect-[3/4] bg-[#f5f3f0] overflow-hidden mb-4">
          {hasImage ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-6xl font-extralight text-gold/10 transition-transform duration-700 group-hover:scale-110">
                {product.name.charAt(0)}
              </span>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {discount && (
              <span className="btn-rose-gold text-[10px] font-medium tracking-wider px-2.5 py-1">
                -{discount}%
              </span>
            )}
            {product.stock_count <= 5 && product.stock_count > 0 && (
              <span className="bg-amber-600 text-white text-[10px] font-medium tracking-wider px-2.5 py-1">
                LOW STOCK
              </span>
            )}
            {product.stock_count === 0 && (
              <span className="bg-red-600 text-white text-[10px] font-medium tracking-wider px-2.5 py-1">
                SOLD OUT
              </span>
            )}
          </div>

          {/* Quick add button */}
          <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
            <button
              className="w-full btn-rose-gold text-[11px] font-medium tracking-[0.15em] uppercase py-3 disabled:opacity-40"
              disabled={product.stock_count === 0}
              onClick={(e) => {
                e.preventDefault()
                addItem(product)
                openCartDrawer()
              }}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </Link>

      {/* Info */}
      <Link href={`/shop/${product.slug}`}>
        <p className="text-[10px] font-medium tracking-[0.15em] uppercase text-muted-foreground mb-1.5">
          {product.category}
        </p>
        <h3 className="font-medium text-sm tracking-wide leading-snug mb-2 group-hover:text-gold transition-colors duration-300">
          {product.name}
        </h3>
        <div className="flex items-center gap-2.5">
          <span className="text-sm font-medium">
            RM {price.toFixed(2)}
          </span>
          {comparePrice && (
            <span className="text-xs text-muted-foreground line-through">
              RM {comparePrice.toFixed(2)}
            </span>
          )}
        </div>
      </Link>
    </div>
  )
}
