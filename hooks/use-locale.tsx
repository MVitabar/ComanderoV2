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
  const [t, setTranslation] = useState<Translation>(() => {
    const translation = getTranslation(defaultLocale)
    console.log('Initial translation loaded:', translation)
    return translation
  })

  useEffect(() => {
    setMounted(true)
    // Solo acceder a localStorage en el cliente
    const savedLocale = typeof window !== 'undefined' ?
      localStorage.getItem("comandero-locale") as SupportedLocale : null
    const initialLocale = savedLocale || detectBrowserLocale()
    console.log('Detected locale:', initialLocale)
    setLocaleState(initialLocale)
    const translation = getTranslation(initialLocale)
    console.log('Translation loaded:', translation)
    console.log('Has auth?', !!translation.auth)
    setTranslation(translation)
  }, [])

  const setLocale = (newLocale: SupportedLocale) => {
    setLocaleState(newLocale)
    const translation = getTranslation(newLocale)
    setTranslation(translation)
    if (typeof window !== 'undefined') {
      localStorage.setItem("comandero-locale", newLocale)
    }
  }

  // Si no está montado, renderizar con las traducciones por defecto
  if (!mounted) {
    return (
      <LocaleContext.Provider value={{ locale: defaultLocale, setLocale, t }}>
        {children}
      </LocaleContext.Provider>
    )
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
