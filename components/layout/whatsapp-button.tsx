"use client"

import { MessageCircle } from "lucide-react"

export function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/60126431737?text=PMBloomie"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 btn-rose-gold rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-300"
    >
      <MessageCircle className="h-6 w-6" />
    </a>
  )
}
