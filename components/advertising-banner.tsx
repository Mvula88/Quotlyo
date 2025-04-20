"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { initializeAdsterra } from "@/utils/adsterra"

interface AdvertisingBannerProps {
  text?: string
  backgroundColor?: string
  textColor?: string
  dismissible?: boolean
}

export function AdvertisingBanner({
  text = "Advertisement",
  backgroundColor = "bg-[#1DBFB0]",
  textColor = "text-white",
  dismissible = true,
}: AdvertisingBannerProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [adInitialized, setAdInitialized] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined" && !adInitialized) {
      // Initialize Adsterra after component mounts
      const success = initializeAdsterra()
      if (success) {
        setAdInitialized(true)
      }
    }
  }, [adInitialized])

  // Don't render if dismissed
  if (!isVisible) return null

  return (
    <div className={`w-full ${backgroundColor} py-4 px-4 relative`} style={{ minHeight: "90px" }}>
      <div className="container mx-auto flex items-center justify-center h-full">
        <p className={`text-center font-medium tracking-wider ${textColor}`}>{text}</p>

        {dismissible && (
          <button
            onClick={() => setIsVisible(false)}
            className={`absolute right-4 top-1/2 -translate-y-1/2 ${textColor} hover:opacity-70 z-10`}
            aria-label="Dismiss banner"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  )
}
