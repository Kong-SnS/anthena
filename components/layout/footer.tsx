"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useTranslation } from "@/lib/i18n"
import { ChevronDown, Instagram } from "lucide-react"

function FooterAccordion({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="md:hidden border-b border-white/10">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between py-4">
        <span className="text-[11px] font-medium tracking-[0.2em] uppercase">{title}</span>
        <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? "max-h-60 pb-4" : "max-h-0"}`}>
        {children}
      </div>
    </div>
  )
}

export function Footer() {
  const { t } = useTranslation()
  const [email, setEmail] = useState("")

  return (
    <footer className="bg-gradient-to-br from-[#ffdde1] to-[#e48d98] text-white">
      <div className="container mx-auto px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="md:col-span-4 text-center md:text-left">
            <h3 className="text-2xl font-display tracking-[0.2em] uppercase mb-4">
              Athena
            </h3>
            <p className="text-white/80 text-sm leading-relaxed max-w-sm font-light mx-auto md:mx-0">
              {t.footer.tagline}
            </p>
          </div>

          {/* Navigation - Collapsible on mobile */}
          <div className="md:col-span-2">
            <FooterAccordion title={t.footer.navigation}>
              <ul className="space-y-2.5">
                {[
                  { href: "/shop", label: t.nav.shop },
                  { href: "/#about", label: t.nav.about },
                  { href: "/cart", label: t.cart?.title || "Cart" },
                  { href: "/#testimonials", label: t.nav.reviews },
                ].map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-white/80 text-sm font-light hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </FooterAccordion>
            {/* Desktop - always visible */}
            <div className="hidden md:block">
              <h4 className="text-[11px] font-medium tracking-[0.2em] uppercase text-white/70 mb-4">{t.footer.navigation}</h4>
              <ul className="space-y-2.5">
                {[
                  { href: "/shop", label: t.nav.shop },
                  { href: "/#about", label: t.nav.about },
                  { href: "/cart", label: t.cart?.title || "Cart" },
                  { href: "/#testimonials", label: t.nav.reviews },
                ].map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-white/80 text-sm font-light hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact - Collapsible on mobile */}
          <div className="md:col-span-3">
            <FooterAccordion title={t.footer.contact}>
              <ul className="space-y-2.5">
                <li>
                  <a href="https://wa.me/60126431737?text=PMBloomie" className="text-white/80 text-sm font-light hover:text-white transition-colors">
                    WhatsApp: 012-643 1737
                  </a>
                </li>
                <li>
                  <a href="mailto:woosisterstrading@gmail.com" className="text-white/80 text-sm font-light hover:text-white transition-colors">
                    woosisterstrading@gmail.com
                  </a>
                </li>
                <li>
                  <Link href="/auth/login" className="text-white/80 text-sm font-light hover:text-white transition-colors">
                    {t.nav.account}
                  </Link>
                </li>
              </ul>
            </FooterAccordion>
            <div className="hidden md:block">
              <h4 className="text-[11px] font-medium tracking-[0.2em] uppercase text-white/70 mb-4">{t.footer.contact}</h4>
              <ul className="space-y-2.5">
                <li><a href="https://wa.me/60126431737?text=PMBloomie" className="text-white/80 text-sm font-light hover:text-white transition-colors">WhatsApp: 012-643 1737</a></li>
                <li><a href="mailto:woosisterstrading@gmail.com" className="text-white/80 text-sm font-light hover:text-white transition-colors">woosisterstrading@gmail.com</a></li>
                <li><Link href="/auth/login" className="text-white/80 text-sm font-light hover:text-white transition-colors">{t.nav.account}</Link></li>
              </ul>
            </div>
          </div>

          {/* Newsletter Subscribe */}
          <div className="md:col-span-3 text-center md:text-left">
            <h4 className="text-[11px] font-medium tracking-[0.2em] uppercase text-white/70 mb-4">Subscribe to Our Newsletter</h4>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                setEmail("")
              }}
              className="flex"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="E-mail"
                className="flex-1 h-10 px-3 bg-white/10 border border-white/20 text-white text-sm placeholder:text-white/40 focus:outline-none focus:border-white/50 rounded-none"
              />
              <button type="submit" className="h-10 px-3 bg-white/20 border border-white/20 border-l-0 hover:bg-white/30 transition-colors">
                <span className="text-white text-sm">→</span>
              </button>
            </form>

            {/* Social Icons */}
            <div className="flex gap-4 mt-6 justify-center md:justify-start">
              <a href="https://www.instagram.com/bloomie_int/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col items-center sm:flex-row sm:justify-between gap-3 text-center sm:text-left">
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
