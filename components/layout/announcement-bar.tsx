"use client"

import { useState } from "react"
import Link from "next/link"
import { X, ArrowRight } from "lucide-react"

export function AnnouncementBar() {
  const [show, setShow] = useState(true)

  if (!show) return null

  return (
    <div className="relative bg-gradient-to-r from-[#c4a07c] to-[#d4a89a] text-white text-center py-2 px-8 z-[60]">
      <Link
        href="/shop/bloomie"
        className="inline-flex items-center gap-2 text-[12px] font-medium tracking-[0.1em] uppercase hover:opacity-80 transition-opacity"
      >
        Buy 2 Free 1 — Limited Time Offer
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
      <button
        onClick={() => setShow(false)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors"
        aria-label="Close announcement"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}
