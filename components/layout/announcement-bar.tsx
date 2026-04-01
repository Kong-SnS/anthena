"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

export function useAnnouncementVisible() {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const hide = () => setVisible(false)
    const show = () => setVisible(true)
    window.addEventListener("announcement-close", hide)
    window.addEventListener("announcement-show", show)
    return () => {
      window.removeEventListener("announcement-close", hide)
      window.removeEventListener("announcement-show", show)
    }
  }, [])

  return visible
}

export function useNavbarVisible() {
  const [visible, setVisible] = useState(true)
  const lastScrollY = useRef(0)

  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY
      if (currentY > lastScrollY.current && currentY > 80) {
        // Scrolling down — hide navbar
        setVisible(false)
      } else {
        // Scrolling up — show navbar
        setVisible(true)
      }
      lastScrollY.current = currentY
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return visible
}

const messages = [
  "Min 2 Boxes Free Shipping",
  "Results Seen in 1 Week",
]

export function AnnouncementBar() {
  const [atTop, setAtTop] = useState(true)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const isTop = window.scrollY <= 10
      setAtTop(isTop)
      if (!isTop) {
        window.dispatchEvent(new Event("announcement-close"))
      } else {
        window.dispatchEvent(new Event("announcement-show"))
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const prev = useCallback(() => setActiveIndex((i) => (i - 1 + messages.length) % messages.length), [])
  const next = useCallback(() => setActiveIndex((i) => (i + 1) % messages.length), [])

  // Auto-rotate
  useEffect(() => {
    const interval = setInterval(next, 3500)
    return () => clearInterval(interval)
  }, [next])

  if (!atTop) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] bg-gradient-to-r from-[#ffdde1] to-[#ee9ca7] text-white text-center py-2 px-4">
      <div className="flex items-center justify-center gap-3">
        <button onClick={prev} className="text-white/70 hover:text-white transition-colors" aria-label="Previous">
          <ChevronLeft className="h-3.5 w-3.5" />
        </button>
        <p className="text-xs font-medium tracking-[0.1em] uppercase min-w-[200px]">
          {messages[activeIndex]}
        </p>
        <button onClick={next} className="text-white/70 hover:text-white transition-colors" aria-label="Next">
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}
