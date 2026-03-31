"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Gift } from "lucide-react"

export function BundleCards() {
  return (
    <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
      {/* 1 Box */}
      <Link href="/shop/bloomie" className="group">
        <div className="relative bg-gradient-to-br from-[#faf8f5] to-[#faf8f5] p-8 lg:p-10 overflow-hidden transition-all duration-500 hover:shadow-lg">
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
              <p className="text-xs font-medium tracking-[0.2em] uppercase text-gold mb-1">Starter</p>
              <h3 className="text-[25px] font-display tracking-wide mb-1">1 Box</h3>
              <p className="text-xs text-muted-foreground font-light mb-3">15 sachets · 1 month supply</p>
              <p className="text-[25px] font-display text-foreground">RM 138</p>
            </div>
          </div>
          <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <ArrowRight className="h-5 w-5 text-gold" />
          </div>
        </div>
      </Link>

      {/* 2 Boxes Bundle */}
      <Link href="/shop/bloomie" className="group">
        <div className="relative bg-gradient-to-br from-[#ffdde1] to-[#ee9ca7] text-white p-8 lg:p-10 overflow-hidden transition-all duration-500 hover:shadow-lg">
          {/* Best Seller badge - bottom right */}
          <div className="absolute bottom-3 right-3 bg-gradient-to-br from-[#ffdde1] to-[#ee9ca7] text-white text-xs font-bold tracking-wider uppercase px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
            <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            Best Seller
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
                <p className="text-xs font-medium tracking-[0.2em] uppercase text-gold">Buy 2 Free 1</p>
                <Gift className="h-3.5 w-3.5 text-gold" />
              </div>
              <h3 className="text-[25px] font-display tracking-wide mb-1">2 Boxes</h3>
              <p className="text-xs text-white/50 font-light mb-3">Get 3 boxes · 3 month supply</p>
              <div className="flex items-baseline gap-2">
                <p className="text-[25px] font-display">RM 209</p>
                <p className="text-xs text-white/40 line-through">RM 414</p>
              </div>
              <p className="text-xs text-gold font-medium mt-1">Save RM 205</p>
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
