"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"

export function ImageReveal({ children, className = "", direction = "up" }: {
  children: React.ReactNode
  className?: string
  direction?: "up" | "left" | "right"
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-100px" })

  const clipPaths = {
    up: { hidden: "inset(100% 0 0 0)", visible: "inset(0 0 0 0)" },
    left: { hidden: "inset(0 100% 0 0)", visible: "inset(0 0 0 0)" },
    right: { hidden: "inset(0 0 0 100%)", visible: "inset(0 0 0 0)" },
  }

  return (
    <motion.div
      ref={ref}
      className={`overflow-hidden ${className}`}
      initial={{ clipPath: clipPaths[direction].hidden, opacity: 0 }}
      animate={inView ? { clipPath: clipPaths[direction].visible, opacity: 1 } : {}}
      transition={{ duration: 1, ease: [0.33, 1, 0.68, 1] }}
    >
      <motion.div
        initial={{ scale: 1.2 }}
        animate={inView ? { scale: 1 } : {}}
        transition={{ duration: 1.4, ease: [0.33, 1, 0.68, 1] }}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}
