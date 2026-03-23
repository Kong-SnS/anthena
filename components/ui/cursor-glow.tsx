"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

export function CursorGlow() {
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [hovering, setHovering] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Only show on desktop
    if (window.matchMedia("(pointer: coarse)").matches) return

    const move = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY })
      setVisible(true)
    }
    const leave = () => setVisible(false)

    const checkHover = (e: MouseEvent) => {
      const el = e.target as HTMLElement
      const isInteractive = el.closest("a, button, [role='button'], input, select, textarea, .magnetic-btn")
      setHovering(!!isInteractive)
    }

    window.addEventListener("mousemove", move)
    window.addEventListener("mousemove", checkHover)
    document.addEventListener("mouseleave", leave)

    return () => {
      window.removeEventListener("mousemove", move)
      window.removeEventListener("mousemove", checkHover)
      document.removeEventListener("mouseleave", leave)
    }
  }, [])

  if (!visible) return null

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[999] mix-blend-difference"
      animate={{
        x: pos.x - (hovering ? 20 : 6),
        y: pos.y - (hovering ? 20 : 6),
        width: hovering ? 40 : 12,
        height: hovering ? 40 : 12,
      }}
      transition={{ type: "spring", stiffness: 500, damping: 28, mass: 0.5 }}
    >
      <div
        className="w-full h-full rounded-full transition-colors duration-300"
        style={{
          background: hovering
            ? "radial-gradient(circle, rgba(196,160,124,0.4) 0%, rgba(212,168,154,0.2) 50%, transparent 70%)"
            : "rgba(196,160,124,0.6)",
        }}
      />
    </motion.div>
  )
}
