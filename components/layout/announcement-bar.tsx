"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { X, ArrowRight } from "lucide-react"

export function useAnnouncementVisible() {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const hide = () => setVisible(false)
    window.addEventListener("announcement-close", hide)
    return () => window.removeEventListener("announcement-close", hide)
  }, [])

  return visible
}

export function AnnouncementBar() {
  const [show, setShow] = useState(true)

  const hide = () => {
    setShow(false)
    window.dispatchEvent(new Event("announcement-close"))
  }

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 50) {
        setShow(false)
        window.dispatchEvent(new Event("announcement-close"))
        window.removeEventListener("scroll", onScroll)
      }
    }
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  if (!show) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] bg-gradient-to-r from-[#ffdde1] to-[#ee9ca7] text-white text-center py-2 px-8">
      <Link
        href="/shop/bloomie"
        className="inline-flex items-center gap-2 text-[12px] font-medium tracking-[0.1em] uppercase hover:opacity-80 transition-opacity"
      >
        Buy 2 Free 1 — Limited Time Offer
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
      <button
        onClick={hide}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors"
        aria-label="Close announcement"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}
