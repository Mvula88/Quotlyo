import { AdvertisingBanner } from "./advertising-banner"

export function AdsterraBanner() {
  return (
    <AdvertisingBanner
      adsterraZoneId={process.env.NEXT_PUBLIC_ADSTERRA_ZONE_ID || "YOUR_ADSTERRA_ZONE_ID"}
      text="Advertisement"
    />
  )
}
