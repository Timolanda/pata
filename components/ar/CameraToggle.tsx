'use client'

import { useState, useEffect } from 'react'
import { Button } from '../ui/button'

interface CameraToggleProps {
  onFacingChange: (facing: 'environment' | 'user') => void
  currentFacing: 'environment' | 'user'
}

export function CameraToggle({ onFacingChange, currentFacing }: CameraToggleProps) {
  const [hasMultipleCameras, setHasMultipleCameras] = useState(false)

  useEffect(() => {
    const checkCameras = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices()
        const videoDevices = devices.filter(device => device.kind === 'videoinput')
        setHasMultipleCameras(videoDevices.length > 1)
      } catch (error) {
        console.error('Error checking cameras:', error)
        setHasMultipleCameras(false)
      }
    }

    checkCameras()
  }, [])

  if (!hasMultipleCameras) {
    return null
  }

  return (
    <Button
      onClick={() => onFacingChange(currentFacing === 'environment' ? 'user' : 'environment')}
      variant="outline"
      size="sm"
      className="px-3 py-1"
    >
      {currentFacing === 'environment' ? 'Front Camera' : 'Back Camera'}
    </Button>
  )
} 