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
  // Usar un estado para manejar la hidratación
  const [mounted, setMounted] = useState(false)
  const [locale, setLocaleState] = useState<SupportedLocale>(defaultLocale)
  const [t, setTranslation] = useState<Translation>(() => getTranslation(defaultLocale))

  useEffect(() => {
    setMounted(true)
    // Solo acceder a localStorage en el cliente
    const savedLocale = typeof window !== 'undefined' ? 
      localStorage.getItem("comandero-locale") as SupportedLocale : null
    const initialLocale = savedLocale || detectBrowserLocale()
    setLocaleState(initialLocale)
    setTranslation(getTranslation(initialLocale))
  }, [])

  const setLocale = (newLocale: SupportedLocale) => {
    setLocaleState(newLocale)
    setTranslation(getTranslation(newLocale))
    if (typeof window !== 'undefined') {
      localStorage.setItem("comandero-locale", newLocale)
    }
  }

  // No renderizar nada hasta que el componente se monte en el cliente
  if (!mounted) {
    return null
  }

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale() {
  const context = useContext(LocaleContext)
  if (context === undefined) {
    throw new Error("useLocale must be used within a LocaleProvider")
  }
  return context
}
