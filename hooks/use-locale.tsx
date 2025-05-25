"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { SupportedLocale, Translation } from "@/lib/i18n/types"
import { getTranslation, detectBrowserLocale, defaultLocale } from "@/lib/i18n"

interface LocaleContextType {
  locale: SupportedLocale
  setLocale: (locale: SupportedLocale) => void
  t: Translation
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined)

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<SupportedLocale>(defaultLocale)
  const [t, setTranslation] = useState<Translation>(getTranslation(defaultLocale))

  useEffect(() => {
    // Load saved locale or detect browser locale
    const savedLocale = localStorage.getItem("comandero-locale") as SupportedLocale
    const initialLocale = savedLocale || detectBrowserLocale()
    setLocaleState(initialLocale)
    setTranslation(getTranslation(initialLocale))
  }, [])

  const setLocale = (newLocale: SupportedLocale) => {
    setLocaleState(newLocale)
    setTranslation(getTranslation(newLocale))
    localStorage.setItem("comandero-locale", newLocale)
  }

  return <LocaleContext.Provider value={{ locale, setLocale, t }}>{children}</LocaleContext.Provider>
}

export function useLocale() {
  const context = useContext(LocaleContext)
  if (context === undefined) {
    throw new Error("useLocale must be used within a LocaleProvider")
  }
  return context
}
