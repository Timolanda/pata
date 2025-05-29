'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

// Dynamically import the map component with SSR disabled
const Map = dynamic(() => import('./Map').then(mod => mod.Map), {
  ssr: false,
  loading: () => <div>Loading map...</div>
})

export function MapComponent() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return <Map />
}
