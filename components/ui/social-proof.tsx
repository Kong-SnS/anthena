"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ShoppingBag } from "lucide-react"

const names = ["Sarah", "Aisyah", "Michelle", "Nurul", "Wei Lin", "Priya", "Fatimah", "Mei Ling", "Siti", "Amanda"]
const cities = ["Kuala Lumpur", "Petaling Jaya", "Shah Alam", "Johor Bahru", "Penang", "Ipoh", "Melaka", "Kota Kinabalu"]
const times = ["just now", "2 mins ago", "5 mins ago", "8 mins ago", "12 mins ago"]

export function SocialProof() {
  const [show, setShow] = useState(false)
  const [current, setCurrent] = useState({ name: "", city: "", time: "" })

  useEffect(() => {
    const showPopup = () => {
      setCurrent({
        name: names[Math.floor(Math.random() * names.length)],
        city: cities[Math.floor(Math.random() * cities.length)],
        time: times[Math.floor(Math.random() * times.length)],
      })
      setShow(true)
      setTimeout(() => setShow(false), 4000)
    }

    // First popup after 15s, then every 30-60s
    const first = setTimeout(showPopup, 15000)
    const interval = setInterval(showPopup, 30000 + Math.random() * 30000)

    return () => {
      clearTimeout(first)
      clearInterval(interval)
    }
  }, [])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300, opacity: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
          className="fixed bottom-6 left-6 z-50 bg-white/95 backdrop-blur-sm border border-gold/10 shadow-lg rounded-lg p-4 flex items-center gap-3 max-w-xs"
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#ffdde1] to-[#ee9ca7] flex items-center justify-center shrink-0">
            <ShoppingBag className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="text-xs font-medium">
              {current.name} from {current.city}
            </p>
            <p className="text-base text-muted-foreground">
              purchased Bloomie · {current.time}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
