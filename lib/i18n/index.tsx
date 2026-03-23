"use client"

import { createContext, useContext, useState, useEffect, useCallback } from "react"
import en from "./en.json"
import bm from "./bm.json"
import zh from "./zh.json"

export type Locale = "en" | "bm" | "zh"

const translations = { en, bm, zh } as const

export const localeNames: Record<Locale, string> = {
  en: "EN",
  bm: "BM",
  zh: "中文",
}

type TranslationData = typeof en

interface I18nContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: TranslationData
}

const I18nContext = createContext<I18nContextType>({
  locale: "en",
  setLocale: () => {},
  t: en,
})

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en")

  useEffect(() => {
    const saved = document.cookie
      .split("; ")
      .find((c) => c.startsWith("locale="))
      ?.split("=")[1] as Locale | undefined
    if (saved && translations[saved]) {
      setLocaleState(saved)
    }
  }, [])

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale)
    document.cookie = `locale=${newLocale};path=/;max-age=31536000`
  }, [])

  const t = translations[locale]

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useTranslation() {
  return useContext(I18nContext)
}
