// lib/storage.ts

// Save the user's proximity notification settings (for example, distance)
export function saveProximitySettings(distance: number) {
    if (typeof window !== "undefined") {
      localStorage.setItem("proximityDistance", JSON.stringify(distance))
    }
  }
  
  // Retrieve the user's proximity notification settings
  export function getProximitySettings(): number {
    if (typeof window !== "undefined") {
      const savedDistance = localStorage.getItem("proximityDistance")
      if (savedDistance) {
        return JSON.parse(savedDistance)
      }
    }
    return 5 // Default distance in km
  }
  
  // Save any other preference settings you might have in the future
  export function saveUserPreference(key: string, value: any) {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, JSON.stringify(value))
    }
  }
  
  // Retrieve a generic user preference by key
  export function getUserPreference(key: string): any {
    if (typeof window !== "undefined") {
      const savedValue = localStorage.getItem(key)
      if (savedValue) {
        return JSON.parse(savedValue)
      }
    }
    return null
  }
  
  // Clear all stored preferences (for example, on logout)
  export function clearPreferences() {
    if (typeof window !== "undefined") {
      localStorage.clear()
    }
  }
  