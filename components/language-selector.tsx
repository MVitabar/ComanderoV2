"use client"

import { useState } from "react"
import { Check, ChevronDown, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useLocale } from "@/hooks/use-locale"

const languages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "it", name: "Italiano", flag: "🇮🇹" },
  { code: "pt", name: "Português", flag: "🇵🇹" },
  { code: "zh", name: "中文", flag: "🇨🇳" },
  { code: "ja", name: "日本語", flag: "🇯🇵" },
  { code: "ar", name: "العربية", flag: "🇸🇦" },
]

export function LanguageSelector() {
  const { locale, setLocale } = useLocale()
  const [open, setOpen] = useState(false)

  const currentLanguage = languages.find((lang) => lang.code === locale) || languages[0]

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-auto px-2 gap-1.5 text-xs sm:text-sm">
          <Globe className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="hidden sm:inline">{currentLanguage.flag}</span>
          <span className="hidden md:inline">{currentLanguage.name}</span>
          <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 max-h-64 overflow-y-auto" side="bottom">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => {
              setLocale(language.code)
              setOpen(false)
            }}
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span className="text-base">{language.flag}</span>
              <span className="text-sm">{language.name}</span>
            </div>
            {locale === language.code && <Check className="h-4 w-4 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
