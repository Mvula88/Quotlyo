"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

// Define available languages
export const languages = [
  { code: "en", name: "English" },
  { code: "es", name: "Español" },
  { code: "fr", name: "Français" },
  { code: "de", name: "Deutsch" },
  { code: "zh", name: "中文" },
  { code: "ar", name: "العربية" },
  { code: "pt", name: "Português" },
  { code: "ru", name: "Русский" },
  { code: "hi", name: "हिन्दी" },
  { code: "sw", name: "Kiswahili" },
  { code: "ja", name: "日本語" },
  { code: "bn", name: "বাংলা" },
  { code: "tr", name: "Türkçe" },
  { code: "ko", name: "한국어" },
  { code: "vi", name: "Tiếng Việt" },
  { code: "id", name: "Bahasa Indonesia" },
  { code: "am", name: "አማርኛ" },
  { code: "ha", name: "Hausa" },
  { code: "yo", name: "Yorùbá" },
]

// Create the context
type LanguageContextType = {
  language: string
  setLanguage: (lang: string) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  t: (key) => key,
})

// Create translations
import enTranslations from "@/translations/en"
import esTranslations from "@/translations/es"
import frTranslations from "@/translations/fr"
import deTranslations from "@/translations/de"
import zhTranslations from "@/translations/zh"
import arTranslations from "@/translations/ar"
import ptTranslations from "@/translations/pt"
import ruTranslations from "@/translations/ru"
import hiTranslations from "@/translations/hi"
import swTranslations from "@/translations/sw"
import jaTranslations from "@/translations/ja"
import bnTranslations from "@/translations/bn"
import trTranslations from "@/translations/tr"
import koTranslations from "@/translations/ko"
import viTranslations from "@/translations/vi"
import idTranslations from "@/translations/id"
import amTranslations from "@/translations/am"
import haTranslations from "@/translations/ha"
import yoTranslations from "@/translations/yo"

const translations = {
  en: enTranslations,
  es: esTranslations,
  fr: frTranslations,
  de: deTranslations,
  zh: zhTranslations,
  ar: arTranslations,
  pt: ptTranslations,
  ru: ruTranslations,
  hi: hiTranslations,
  sw: swTranslations,
  ja: jaTranslations,
  bn: bnTranslations,
  tr: trTranslations,
  ko: koTranslations,
  vi: viTranslations,
  id: idTranslations,
  am: amTranslations,
  ha: haTranslations,
  yo: yoTranslations,
}

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  // Initialize with English or saved preference
  const [language, setLanguage] = useState("en")

  // Load saved language preference on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem("quotlyo-language")
    if (savedLanguage && Object.keys(translations).includes(savedLanguage)) {
      setLanguage(savedLanguage)
    }
  }, [])

  // Save language preference when it changes
  useEffect(() => {
    localStorage.setItem("quotlyo-language", language)
    // Update HTML lang attribute
    document.documentElement.lang = language
  }, [language])

  // Translation function
  const t = (key: string): string => {
    const currentTranslations = translations[language as keyof typeof translations] || {}
    return currentTranslations[key] || key
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

// Custom hook for using the language context
export const useLanguage = () => useContext(LanguageContext)
