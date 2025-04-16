"use client"

import { useLanguage } from "@/contexts/language-context"
import { useEffect, useState } from "react"

export function MetadataUpdater() {
  const { t } = useLanguage()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Update metadata when language changes
    document.title = `${t("app.name")} - ${t("app.tagline")}`

    // Find the meta description tag and update it
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute("content", t("app.description"))
    }
  }, [t])

  // Don't render anything on the server
  if (!mounted) return null

  return null
}
