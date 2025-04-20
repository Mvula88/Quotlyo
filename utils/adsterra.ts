/**
 * Adsterra Ads Integration Utility
 *
 * This utility provides functions to initialize and manage Adsterra ads.
 */

export const initializeAdsterra = (zoneId: string, containerId: string): boolean => {
  if (typeof window === "undefined") return false

  try {
    // Create the Adsterra script element
    const script = document.createElement("script")
    script.async = true
    script.type = "text/javascript"
    script.src = `https://www.adsterra.com/get/code?h=${zoneId}`

    // Get the container element
    const container = document.getElementById(containerId)
    if (!container) {
      console.error(`Adsterra container with ID "${containerId}" not found`)
      return false
    }

    // Append the script to the container
    container.appendChild(script)

    return true
  } catch (error) {
    console.error("Error initializing Adsterra:", error)
    return false
  }
}

// Function to check if an ad blocker is active
export const checkAdBlocker = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const testAd = document.createElement("div")
    testAd.innerHTML = "&nbsp;"
    testAd.className = "adsbox"
    testAd.style.display = "none"
    document.body.appendChild(testAd)

    setTimeout(() => {
      if (testAd.offsetHeight === 0) {
        resolve(true) // Ad blocker is active
      } else {
        resolve(false) // No ad blocker
      }
      document.body.removeChild(testAd)
    }, 100)
  })
}

// Function to handle ad blocker detection
export const handleAdBlocker = async (callback: (isBlocked: boolean) => void): Promise<void> => {
  const isBlocked = await checkAdBlocker()
  callback(isBlocked)
}
