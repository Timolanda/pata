"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MapPin, X, Compass, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ProximityNotificationProps {
  treasureId: string
  treasureName: string
  distance: number // in meters
  hint: string
  onDismiss: () => void
  onNavigate: () => void
}

export function ProximityNotification({
  treasureId,
  treasureName,
  distance,
  hint,
  onDismiss,
  onNavigate,
}: ProximityNotificationProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [pulseIntensity, setPulseIntensity] = useState(1)

  // Simulate increasing pulse intensity as user gets closer
  useEffect(() => {
    // Calculate pulse intensity based on distance (closer = more intense)
    const intensity = Math.max(1, Math.min(3, 4 - distance / 100))
    setPulseIntensity(intensity)

    // Simulate vibration based on distance
    if (distance < 100) {
      // In a real app, this would use the Vibration API
      console.log("Vibrating with intensity:", intensity)
    }

    // Auto-dismiss after 10 seconds
    const timer = setTimeout(() => {
      handleDismiss()
    }, 10000)

    return () => clearTimeout(timer)
  }, [distance])

  const handleDismiss = () => {
    setIsVisible(false)
    setTimeout(() => {
      onDismiss()
    }, 300) // Wait for exit animation
  }

  // Determine notification style based on distance
  const getNotificationStyle = () => {
    if (distance < 100) {
      return {
        bgColor: "bg-sunset-600",
        textColor: "text-white",
        icon: <MapPin className="h-5 w-5" />,
        label: "Very Close!",
      }
    } else if (distance < 300) {
      return {
        bgColor: "bg-gold-500",
        textColor: "text-indigo-900",
        icon: <MapPin className="h-5 w-5" />,
        label: "Nearby",
      }
    } else {
      return {
        bgColor: "bg-indigo-600",
        textColor: "text-white",
        icon: <MapPin className="h-5 w-5" />,
        label: "In the Area",
      }
    }
  }

  const style = getNotificationStyle()

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-4 left-4 right-4 z-50"
        >
          <div className={`rounded-lg shadow-lg overflow-hidden ${style.bgColor}`}>
            <div className="p-4">
              <div className="flex items-start">
                <div className="relative mr-3">
                  {style.icon}
                  <motion.div
                    className="absolute -inset-2 rounded-full border-2 border-white/50"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.7, 0.2, 0.7],
                    }}
                    transition={{
                      duration: 2 / pulseIntensity,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }}
                  />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className={`font-bold ${style.textColor}`}>Treasure {style.label}!</h3>
                      <p className={`text-sm ${style.textColor} opacity-90`}>
                        {treasureName} ({Math.round(distance)}m away)
                      </p>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      className={`h-6 w-6 ${style.textColor} opacity-80 hover:opacity-100 hover:bg-transparent`}
                      onClick={handleDismiss}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className={`mt-2 p-2 rounded bg-white/20 text-sm ${style.textColor}`}>
                    <p>{hint}</p>
                  </div>
                  <div className="mt-3 flex justify-end">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="bg-white/20 hover:bg-white/30 text-white"
                      onClick={onNavigate}
                    >
                      <Compass className="mr-1 h-4 w-4" />
                      Navigate
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

