'use client'

import { useState, useEffect } from 'react'
import { Button } from '../ui/button'
import { Camera, CameraOff } from 'lucide-react'

interface CameraToggleProps {
  onCameraChange?: (facingMode: 'user' | 'environment') => void
  initialFacingMode?: 'user' | 'environment'
}

export function CameraToggle({ 
  onCameraChange,
  initialFacingMode = 'environment'
}: CameraToggleProps) {
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>(initialFacingMode)
  const [isSupported, setIsSupported] = useState(true)

  useEffect(() => {
    // Check if device has multiple cameras
    if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
      navigator.mediaDevices.enumerateDevices()
        .then(devices => {
          const hasMultipleCameras = devices.filter(device => device.kind === 'videoinput').length > 1
          setIsSupported(hasMultipleCameras)
        })
        .catch(error => {
          console.error('Error checking camera support:', error)
          setIsSupported(false)
        })
    } else {
      setIsSupported(false)
    }
  }, [])

  const toggleCamera = () => {
    const newFacingMode = facingMode === 'user' ? 'environment' : 'user'
    setFacingMode(newFacingMode)
    onCameraChange?.(newFacingMode)
  }

  if (!isSupported) {
    return null
  }

  return (
    <Button
      variant="outline"
      size="icon"
      className="fixed top-4 right-4 z-50 bg-white/80 backdrop-blur-sm"
      onClick={toggleCamera}
    >
      {facingMode === 'user' ? (
        <Camera className="h-4 w-4" />
      ) : (
        <CameraOff className="h-4 w-4" />
      )}
    </Button>
  )
} 