"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Gift } from "lucide-react"

export function EmailPopup() {
  const [show, setShow] = useState(false)
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    // Don't show if already dismissed
    if (localStorage.getItem("email-popup-dismissed")) return

    // Show after 8 seconds
    const timer = setTimeout(() => setShow(true), 8000)
    return () => clearTimeout(timer)
  }, [])

  const handleClose = () => {
    setShow(false)
    localStorage.setItem("email-popup-dismissed", "true")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    // TODO: Send to Mailgun mailing list or Supabase
    setSubmitted(true)
    localStorage.setItem("email-popup-dismissed", "true")

    setTimeout(() => setShow(false), 3000)
  }

  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-[80] backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[81] w-[90vw] max-w-md"
          >
            <div className="bg-[#faf8f5] rounded-sm overflow-hidden shadow-2xl">
              {/* Header */}
              <div className="bg-gradient-to-br from-[#c4a07c] to-[#d4a89a] px-8 py-10 text-center text-white relative">
                <button
                  onClick={handleClose}
                  className="absolute top-3 right-3 text-white/60 hover:text-white transition-colors"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
                <Gift className="h-8 w-8 mx-auto mb-3 opacity-80" />
                <h2 className="text-2xl font-display tracking-wide">
                  Welcome Gift
                </h2>
                <p className="text-white/80 text-sm font-light mt-2">
                  Get RM10 off your first Bloomie order
                </p>
              </div>

              {/* Body */}
              <div className="px-8 py-8">
                {submitted ? (
                  <div className="text-center py-4">
                    <p className="text-lg font-display text-gold">Thank You!</p>
                    <p className="text-sm text-muted-foreground font-light mt-2">
                      Check your email for your RM10 discount code.
                    </p>
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-muted-foreground font-light text-center mb-6">
                      Join our community and receive exclusive offers, wellness tips, and your first order discount.
                    </p>
                    <form onSubmit={handleSubmit} className="space-y-3">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                        className="w-full h-11 px-4 border border-black/10 bg-transparent rounded-none text-sm focus:outline-none focus:border-gold transition-colors"
                      />
                      <button
                        type="submit"
                        className="w-full h-11 btn-rose-gold text-[12px] font-medium tracking-[0.15em] uppercase"
                      >
                        Get RM10 Off
                      </button>
                    </form>
                    <p className="text-[10px] text-muted-foreground text-center mt-4 font-light">
                      No spam, unsubscribe anytime.
                    </p>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
