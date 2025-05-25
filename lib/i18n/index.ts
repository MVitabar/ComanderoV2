import type { SupportedLocale, Translation } from "./types"
import { en } from "./translations/en"
import { es } from "./translations/es"
import { fr } from "./translations/fr"
import { de } from "./translations/de"
import { it } from "./translations/it"
import { pt } from "./translations/pt"
import { zh } from "./translations/zh"
import { ja } from "./translations/ja"
import { ar } from "./translations/ar"

export const supportedLocales: SupportedLocale[] = ["en", "es", "fr", "de", "it", "pt", "zh", "ja", "ar"]

export const localeNames: Record<SupportedLocale, string> = {
  en: "English",
  es: "Español",
  fr: "Français",
  de: "Deutsch",
  it: "Italiano",
  pt: "Português",
  zh: "中文",
  ja: "日本語",
  ar: "العربية",
}

export const defaultLocale: SupportedLocale = "en"

const translations: Record<SupportedLocale, Translation> = {
  en,
  es,
  fr,
  de,
  it,
  pt,
  zh,
  ja,
  ar,
}

export function getTranslation(locale: SupportedLocale): Translation {
  return translations[locale] || translations[defaultLocale]
}

export function detectBrowserLocale(): SupportedLocale {
  if (typeof window === "undefined") return defaultLocale

  const browserLocale = navigator.language.split("-")[0] as SupportedLocale
  return supportedLocales.includes(browserLocale) ? browserLocale : defaultLocale
}

export type { SupportedLocale, Translation }
