export function cn(...inputs) {
  let className = ""
  for (let i = 0; i < inputs.length; i++) {
    const input = inputs[i]
    if (input) {
      if (typeof input === "string") {
        className += input + " "
      } else if (typeof input === "object" && Array.isArray(input)) {
        className += cn(...input) + " "
      } else if (typeof input === "object") {
        for (const key in input) {
          if (input.hasOwnProperty(key) && input[key]) {
            className += key + " "
          }
        }
      }
    }
  }
  return className.trim()
}

export function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) {
    return "Good morning"
  } else if (hour < 18) {
    return "Good afternoon"
  } else {
    return "Good evening"
  }
}
