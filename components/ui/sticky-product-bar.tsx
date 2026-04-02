"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function StickyProductBar() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling past the product showcase (~1200px)
      // Hide near the bottom CTA section
      const scrollY = window.scrollY
      const docHeight = document.body.scrollHeight
      const winHeight = window.innerHeight
      setShow(scrollY > 1200 && scrollY < docHeight - winHeight - 400)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -60, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed top-20 left-0 right-0 z-40 hidden lg:block"
        >
          <div className="bg-white/90 backdrop-blur-md border-b border-gold/10 shadow-sm">
            <div className="container mx-auto px-6 lg:px-8 flex items-center justify-between h-12">
              <div className="flex items-center gap-4">
                <span className="font-display text-xs tracking-wide">Bloomie</span>
                <span className="text-xs text-muted-foreground">Intimate Hydration · Menstrual Comfort · Uterine Health</span>
                <span className="text-xs font-medium">RM 138</span>
                <span className="text-xs btn-rose-gold px-2 py-0.5 tracking-wider uppercase">Buy 2 Free 1</span>
              </div>
              <Link
                href="/shop/bloomie"
                className="btn-rose-gold px-5 py-1.5 text-xs font-medium tracking-[0.1em] uppercase flex items-center gap-1.5"
              >
                Order Now <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
