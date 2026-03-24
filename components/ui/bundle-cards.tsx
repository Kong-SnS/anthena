"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Gift } from "lucide-react"

export function BundleCards() {
  return (
    <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
      {/* 1 Box */}
      <Link href="/shop/bloomie" className="group">
        <div className="relative bg-gradient-to-br from-[#f5ece4] to-[#f0e4da] p-8 lg:p-10 overflow-hidden transition-all duration-500 hover:shadow-lg">
          <div className="flex items-center gap-6">
            <div className="w-24 h-32 relative shrink-0">
              <Image
                src="/images/products/bloomie-main.png"
                alt="Bloomie 1 Box"
                fill
                className="object-contain transition-transform duration-500 group-hover:scale-110"
                sizes="96px"
              />
            </div>
            <div>
              <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-gold mb-1">Starter</p>
              <h3 className="text-xl font-display tracking-wide mb-1">1 Box</h3>
              <p className="text-xs text-muted-foreground font-light mb-3">15 sachets · 1 month supply</p>
              <p className="text-2xl font-display text-foreground">RM 138</p>
            </div>
          </div>
          <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <ArrowRight className="h-5 w-5 text-gold" />
          </div>
        </div>
      </Link>

      {/* 2 Boxes Bundle */}
      <Link href="/shop/bloomie" className="group">
        <div className="relative bg-gradient-to-br from-[#1a1215] to-[#2a1f1f] text-white p-8 lg:p-10 overflow-hidden transition-all duration-500 hover:shadow-lg">
          {/* Best Value badge */}
          <div className="absolute top-0 right-0 bg-gold text-white text-[9px] font-medium tracking-wider uppercase px-3 py-1.5">
            Best Value
          </div>
          <div className="flex items-center gap-6">
            <div className="w-24 h-32 relative shrink-0">
              <Image
                src="/images/products/bloomie-main.png"
                alt="Bloomie 2 Boxes"
                fill
                className="object-contain transition-transform duration-500 group-hover:scale-110"
                sizes="96px"
              />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-gold">Buy 2 Free 1</p>
                <Gift className="h-3.5 w-3.5 text-gold" />
              </div>
              <h3 className="text-xl font-display tracking-wide mb-1">2 Boxes</h3>
              <p className="text-xs text-white/50 font-light mb-3">Get 3 boxes · 3 month supply</p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-display">RM 209</p>
                <p className="text-sm text-white/40 line-through">RM 414</p>
              </div>
              <p className="text-[10px] text-gold font-medium mt-1">Save RM 205</p>
            </div>
          </div>
          <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <ArrowRight className="h-5 w-5 text-gold" />
          </div>
        </div>
      </Link>
    </div>
  )
}
