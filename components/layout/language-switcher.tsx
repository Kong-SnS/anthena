"use client"

import { useTranslation, localeNames, type Locale } from "@/lib/i18n"
import { Globe } from "lucide-react"
import { useState, useRef, useEffect } from "react"

export function LanguageSwitcher({ dark = false }: { dark?: boolean }) {
  const { locale, setLocale } = useTranslation()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        aria-label="Change language"
        className={`flex items-center gap-1.5 px-2 py-1.5 rounded-md text-[11px] font-medium tracking-wider uppercase transition-colors ${
          dark
            ? "text-white/70 hover:text-white hover:bg-white/10"
            : "text-foreground/70 hover:text-foreground hover:bg-gold/5"
        }`}
      >
        <Globe className="h-3.5 w-3.5" />
        {localeNames[locale]}
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-1 bg-white border border-gold/10 shadow-lg rounded-md overflow-hidden min-w-[80px] z-50">
          {(Object.keys(localeNames) as Locale[]).map((l) => (
            <button
              key={l}
              onClick={() => {
                setLocale(l)
                setOpen(false)
              }}
              className={`block w-full text-left px-4 py-2 text-xs tracking-wider transition-colors ${
                locale === l
                  ? "bg-gold/10 text-gold font-medium"
                  : "text-foreground/70 hover:bg-gold/5"
              }`}
            >
              {localeNames[l]}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
