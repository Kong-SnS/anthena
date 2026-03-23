"use client"

import { motion } from "framer-motion"

export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Top curtain */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1/2 bg-[#faf8f5] z-[90] origin-top"
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease: [0.33, 1, 0.68, 1] }}
      />
      {/* Bottom curtain */}
      <motion.div
        className="fixed bottom-0 left-0 right-0 h-1/2 bg-[#faf8f5] z-[90] origin-bottom"
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease: [0.33, 1, 0.68, 1] }}
      />
      {/* Content fades in */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        {children}
      </motion.div>
    </>
  )
}
