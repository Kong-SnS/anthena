"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useTranslation } from "@/lib/i18n"
import { Instagram, MessageCircle, Mail, User } from "lucide-react"

export function Footer() {
  const { t } = useTranslation()
  const [email, setEmail] = useState("")

  return (
    <footer className="bg-gradient-to-br from-[#ffdde1] to-[#e48d98] text-white">
      <div className="container mx-auto px-6 lg:px-8 py-16 lg:py-20">
        {/* Logo */}
        <div className="mb-10">
          <Image src="/images/athena-logo.png" alt="Athena" width={280} height={280} className="h-28 w-auto object-contain opacity-80" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Contact */}
          <div className="text-left">
            <h4 className="text-xs font-medium tracking-[0.2em] uppercase text-white/70 mb-4">{t.footer.contact}</h4>
            <div className="flex gap-3 justify-start">
              <a href="https://wa.me/60126431737?text=PMBloomie" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors" aria-label="WhatsApp">
                <MessageCircle className="h-4 w-4" />
              </a>
              <a href="mailto:woosisterstrading@gmail.com" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors" aria-label="Email">
                <Mail className="h-4 w-4" />
              </a>
              <Link href="/auth/login" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors" aria-label="Account">
                <User className="h-4 w-4" />
              </Link>
              <a href="https://www.instagram.com/bloomie_int/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors" aria-label="Instagram">
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Newsletter Subscribe */}
          <div className="text-left">
            <h4 className="text-xs font-medium tracking-[0.2em] uppercase text-white/70 mb-4">Subscribe to Our Newsletter</h4>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                setEmail("")
              }}
              className="flex max-w-sm"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="E-mail"
                className="flex-1 h-10 px-3 bg-white/10 border border-white/20 text-white text-xs placeholder:text-white/40 focus:outline-none focus:border-white/50 rounded-none"
              />
              <button type="submit" className="h-10 px-3 bg-white/20 border border-white/20 border-l-0 hover:bg-white/30 transition-colors">
                <span className="text-white text-xs">→</span>
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-6 pt-6 border-t border-white/10 flex flex-col items-start sm:flex-row sm:justify-between gap-3 text-left">
          <p className="text-white/60 text-xs font-light tracking-wider">
            &copy; {new Date().getFullYear()} {t.footer.copyright}
          </p>
          <div className="flex gap-6">
            <span className="text-white/60 text-xs font-light tracking-wider">{t.footer.privacy}</span>
            <span className="text-white/60 text-xs font-light tracking-wider">{t.footer.terms}</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
