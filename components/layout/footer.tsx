"use client"

import Link from "next/link"
import { useTranslation } from "@/lib/i18n"

export function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="bg-gradient-to-br from-[#c4a07c] to-[#b8956f] text-white">
      <div className="container mx-auto px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-5">
            <h3 className="text-2xl font-display tracking-[0.2em] uppercase mb-6">
              Athena
            </h3>
            <p className="text-white/60 text-sm leading-relaxed max-w-sm font-light">
              {t.footer.tagline}
            </p>
            <div className="flex gap-4 mt-6">
              <a
                href="https://www.instagram.com/bloomie_int/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/45 text-sm hover:text-white transition-colors"
              >
                Instagram
              </a>
            </div>
          </div>

          <div className="md:col-span-3">
            <h4 className="text-[11px] font-medium tracking-[0.2em] uppercase text-white/50 mb-6">
              {t.footer.navigation}
            </h4>
            <ul className="space-y-3">
              {[
                { href: "/shop", label: t.nav.shop },
                { href: "/#about", label: t.nav.about },
                { href: "/cart", label: t.cart.title },
                { href: "/#testimonials", label: t.nav.reviews },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/65 text-sm font-light hover:text-white transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <h4 className="text-[11px] font-medium tracking-[0.2em] uppercase text-white/50 mb-6">
              {t.footer.contact}
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://wa.me/60126431737?text=PMBloomie"
                  className="text-white/65 text-sm font-light hover:text-white transition-colors duration-300"
                >
                  WhatsApp: 012-643 1737
                </a>
              </li>
              <li>
                <a
                  href="mailto:woosisterstrading@gmail.com"
                  className="text-white/65 text-sm font-light hover:text-white transition-colors duration-300"
                >
                  woosisterstrading@gmail.com
                </a>
              </li>
              <li>
                <Link
                  href="/auth/login"
                  className="text-white/65 text-sm font-light hover:text-white transition-colors duration-300"
                >
                  {t.nav.account}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/45 text-xs font-light tracking-wider">
            &copy; {new Date().getFullYear()} {t.footer.copyright}
          </p>
          <div className="flex gap-8">
            <span className="text-white/45 text-xs font-light tracking-wider">
              {t.footer.privacy}
            </span>
            <span className="text-white/45 text-xs font-light tracking-wider">
              {t.footer.terms}
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
