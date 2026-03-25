"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

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
            {/* Logo image with fade in */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.3, ease: [0.33, 1, 0.68, 1] }}
            >
              <Image
                src="/images/athena-logo.png"
                alt="Athena"
                width={280}
                height={70}
                className="h-16 md:h-20 w-auto mx-auto"
                priority
              />
            </motion.div>

            {/* Expanding line */}
            <motion.div
              className="h-[1px] mx-auto mt-6 line-rose-gold"
              initial={{ width: 0 }}
              animate={{ width: 96 }}
              transition={{ duration: 1, delay: 1.2, ease: "easeInOut" }}
            />

            {/* Tagline fade in */}
            <motion.p
              className="text-sm md:text-base tracking-[0.25em] uppercase text-gold/50 mt-5 font-light"
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
