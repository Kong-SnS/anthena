"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { ShoppingCart, Menu, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { LanguageSwitcher } from "@/components/layout/language-switcher"
import { useCart, useCartDrawer } from "@/hooks/use-cart"
import { useTranslation } from "@/lib/i18n"
import { createClient } from "@/lib/supabase/client"
import { useAnnouncementVisible } from "@/components/layout/announcement-bar"
import { useState, useEffect } from "react"

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const itemCount = useCart((s) => s.getItemCount())
  const openCartDrawer = useCartDrawer((s) => s.show)

  const announcementVisible = useAnnouncementVisible()
  useEffect(() => setMounted(true), [])
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
      className={`fixed left-0 right-0 z-50 transition-all duration-500 ${
        announcementVisible ? "top-9" : "top-0"
      } ${
        useDarkText
          ? "glass-nav shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex h-20 items-center justify-between px-6 lg:px-8">
        <Link href="/" className="relative z-10">
          <span
            className={`text-[25px] font-display tracking-[0.2em] uppercase transition-all duration-500 ${
              useDarkText ? "logo-gold-3d" : "text-white drop-shadow-lg"
            }`}
          >
            Athena
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-xs font-medium tracking-[0.15em] uppercase transition-colors duration-500 hover:opacity-70 py-2 ${
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
              useDarkText ? "text-foreground hover:bg-gold/5" : "text-white hover:bg-white/10"
            }`}
          >
            <User className="h-[18px] w-[18px]" />
          </Link>
          <button
            onClick={openCartDrawer}
            aria-label="Cart"
            className={`relative flex items-center justify-center w-11 h-11 rounded-md transition-colors duration-500 ${
              useDarkText ? "text-foreground hover:bg-gold/5" : "text-white hover:bg-white/10"
            }`}
          >
            <ShoppingCart className="h-[18px] w-[18px]" />
            {mounted && itemCount > 0 && (
              <span
                key={itemCount}
                className="absolute top-1 right-1 h-4 w-4 rounded-full bg-gold text-xs text-white flex items-center justify-center font-medium animate-scale-in"
              >
                {itemCount}
              </span>
            )}
          </button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              className="md:hidden"
              aria-label="Open menu"
              render={
                <button
                  className={`flex items-center justify-center w-11 h-11 rounded-md transition-colors duration-500 ${
                    useDarkText ? "text-foreground hover:bg-gold/5" : "text-white hover:bg-white/10"
                  }`}
                />
              }
            >
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-[85vw] max-w-sm bg-gradient-to-b from-[#faf8f5] to-[#faf8f5] border-gold/10 px-8">
              <div className="flex flex-col mt-16">
                <div className="flex items-center justify-between mb-10">
                  <p className="text-xs font-medium tracking-[0.3em] uppercase text-gold">{t.nav.menu}</p>
                  <LanguageSwitcher />
                </div>
                <nav className="flex flex-col">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-foreground text-[25px] font-display tracking-wide py-4 border-b border-gold/10 hover:text-gold transition-colors"
                      onClick={() => setOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                  <Link
                    href={accountHref}
                    className="text-foreground text-[25px] font-display tracking-wide py-4 hover:text-gold transition-colors"
                    onClick={() => setOpen(false)}
                  >
                    {isLoggedIn ? t.nav.account : "Login"}
                  </Link>
                </nav>
                <a
                  href="https://wa.me/60126431737?text=PMBloomie"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-12 btn-rose-gold text-center py-3.5 text-xs font-medium tracking-[0.15em] uppercase rounded-sm"
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
