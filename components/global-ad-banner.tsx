import { AdvertisingBanner } from "./advertising-banner"

export function GlobalAdBanner() {
  return (
    <AdvertisingBanner text="Advertisement" backgroundColor="bg-[#1DBFB0]" textColor="text-white" dismissible={true} />
  )
}
