/**
 * Adsterra Ads Integration Utility
 */

export const initializeAdsterra = (): boolean => {
  if (typeof window === "undefined") return false

  try {
    // Create the Adsterra script element with your specific code
    const script = document.createElement("script")
    script.async = true
    script.type = "text/javascript"
    script.src = "//pl26429731.profitableratecpm.com/63/b4/1b/63b41b42e773c6ccfd7ec1bdb9b6182e.js"

    // Append the script to the document head
    document.head.appendChild(script)

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
