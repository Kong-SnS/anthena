"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ShoppingCart, Menu, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { LanguageSwitcher } from "@/components/layout/language-switcher"
import { useCart } from "@/hooks/use-cart"
import { useTranslation } from "@/lib/i18n"
import { createClient } from "@/lib/supabase/client"
import { useState, useEffect } from "react"

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const pathname = usePathname()
  const itemCount = useCart((s) => s.getItemCount())
  const { t } = useTranslation()
  const isHome = pathname === "/"
  const useDarkText = !isHome || scrolled
  const accountHref = isLoggedIn ? "/account" : "/auth/login"

  const navLinks = [
    { href: "/", label: t.nav.home },
    { href: "/shop", label: t.nav.shop },
    { href: "/#about", label: t.nav.about },
    { href: "/#testimonials", label: t.nav.reviews },
  ]

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsLoggedIn(!!user)
    })
  }, [pathname])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        useDarkText
          ? "glass-nav shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex h-20 items-center justify-between px-6 lg:px-8">
        <Link href="/" className="relative z-10">
          <span
            className={`text-2xl font-display tracking-[0.2em] uppercase transition-colors duration-500 ${
              useDarkText ? "text-foreground" : "text-white"
            }`}
          >
            Anthena
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-[13px] font-medium tracking-[0.15em] uppercase transition-colors duration-500 hover:opacity-70 py-2 ${
                useDarkText ? "text-foreground" : "text-white/90"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <div className="hidden md:block">
            <LanguageSwitcher dark={!useDarkText} />
          </div>
          <Link
            href={accountHref}
            aria-label="Account"
            className={`hidden md:flex items-center justify-center w-11 h-11 rounded-md transition-colors duration-500 ${
              useDarkText ? "text-foreground hover:bg-black/5" : "text-white hover:bg-white/10"
            }`}
          >
            <User className="h-[18px] w-[18px]" />
          </Link>
          <Link
            href="/cart"
            aria-label="Cart"
            className={`relative flex items-center justify-center w-11 h-11 rounded-md transition-colors duration-500 ${
              useDarkText ? "text-foreground hover:bg-black/5" : "text-white hover:bg-white/10"
            }`}
          >
            <ShoppingCart className="h-[18px] w-[18px]" />
            {itemCount > 0 && (
              <span
                key={itemCount}
                className="absolute top-1 right-1 h-4 w-4 rounded-full bg-gold text-[9px] text-white flex items-center justify-center font-medium animate-scale-in"
              >
                {itemCount}
              </span>
            )}
          </Link>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              className="md:hidden"
              aria-label="Open menu"
              render={
                <button
                  className={`flex items-center justify-center w-11 h-11 rounded-md transition-colors duration-500 ${
                    useDarkText ? "text-foreground hover:bg-black/5" : "text-white hover:bg-white/10"
                  }`}
                />
              }
            >
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-80 bg-gradient-to-b from-[#faf8f5] to-[#f5ece4] border-gold/10">
              <div className="flex flex-col gap-0 mt-12">
                <div className="flex items-center justify-between mb-6">
                  <p className="text-[10px] font-medium tracking-[0.3em] uppercase text-gold px-1">{t.nav.menu}</p>
                  <LanguageSwitcher />
                </div>
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-foreground/80 text-lg font-display tracking-[0.05em] py-3.5 border-b border-gold/10 hover:text-gold transition-colors"
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href={accountHref}
                  className="text-foreground/80 text-lg font-display tracking-[0.05em] py-3.5 hover:text-gold transition-colors"
                  onClick={() => setOpen(false)}
                >
                  {t.nav.account}
                </Link>
                <a
                  href="https://wa.me/60126431737?text=PMBloomie"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 btn-rose-gold text-center py-3 text-[11px] font-medium tracking-[0.15em] uppercase"
                >
                  {t.nav.whatsappUs}
                </a>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
