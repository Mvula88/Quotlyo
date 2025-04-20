"use client"

import { useState, useEffect, useRef } from "react"
import { X } from "lucide-react"
import { initializeAdsterra } from "@/utils/adsterra"

interface AdvertisingBannerProps {
  text?: string
  backgroundColor?: string
  textColor?: string
  dismissible?: boolean
  zoneId?: string
}

export function AdvertisingBanner({
  text = "PLACE YOUR AD HERE",
  backgroundColor = "bg-[#1DBFB0]",
  textColor = "text-white",
  dismissible = true,
  zoneId,
}: AdvertisingBannerProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [adLoaded, setAdLoaded] = useState(false)
  const adContainerRef = useRef<HTMLDivElement>(null)
  const containerId = "adsterra-banner-container"

  // Use the environment variable if zoneId is not provided
  const adsterraZoneId = zoneId || process.env.NEXT_PUBLIC_ADSTERRA_ZONE_ID

  useEffect(() => {
    if (typeof window !== "undefined" && adsterraZoneId) {
      // Initialize Adsterra after component mounts
      const timer = setTimeout(() => {
        const success = initializeAdsterra(adsterraZoneId, containerId)
        if (success) {
          setAdLoaded(true)
        }
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [adsterraZoneId])

  // Don't render anything if there's no zone ID
  if (!adsterraZoneId) return null

  // Don't render if dismissed
  if (!isVisible) return null

  return (
    <div className={`w-full ${backgroundColor} py-4 px-4 relative`} style={{ minHeight: "90px" }}>
      <div className="container mx-auto flex items-center justify-center h-full">
        <div id={containerId} ref={adContainerRef} className="w-full h-full flex items-center justify-center">
          {!adLoaded && <p className={`text-center font-medium tracking-wider ${textColor}`}>{text}</p>}
          {/* Adsterra ad will be inserted here by the script */}
        </div>

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
