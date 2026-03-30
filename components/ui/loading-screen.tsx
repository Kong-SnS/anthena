"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

const letters = "ATHENA".split("")

export function LoadingScreen() {
  const [show, setShow] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setShow(false), 3500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#faf8f5]"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          <div className="text-center">
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-display tracking-[0.15em] sm:tracking-[0.25em] md:tracking-[0.3em] uppercase">
              {letters.map((letter, i) => (
                <motion.span
                  key={i}
                  className="inline-block text-rose-gold-gradient"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.2 + i * 0.1,
                    ease: [0.33, 1, 0.68, 1],
                  }}
                >
                  {letter}
                </motion.span>
              ))}
            </h1>

            <motion.div
              className="h-[1px] mx-auto mt-6 line-rose-gold"
              initial={{ width: 0 }}
              animate={{ width: 96 }}
              transition={{ duration: 1, delay: 1.2, ease: "easeInOut" }}
            />

            <motion.p
              className="text-xs sm:text-sm md:text-base tracking-[0.15em] sm:tracking-[0.25em] uppercase text-gold/50 mt-5 font-light px-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.8 }}
            >
              Affordable Premium Wellness
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
