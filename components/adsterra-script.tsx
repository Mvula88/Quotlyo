"use client"

import { useEffect } from "react"

export function AdsterraScript() {
  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return

    // Create script element
    const script = document.createElement("script")
    script.type = "text/javascript"
    script.async = true
    script.src = "//pl26429731.profitableratecpm.com/63/b4/1b/63b41b42e773c6ccfd7ec1bdb9b6182e.js"

    // Add to document
    document.head.appendChild(script)

    // Cleanup function
    return () => {
      // Remove script if component unmounts
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }
  }, [])

  return null
}
