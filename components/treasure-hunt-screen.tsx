'use client'
import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Camera, X, Award, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { ProximityNotification } from '@/components/proximity-notification'
// If you're not using aliases
import ARScene from '../components/ARScene';


// Dynamically import aframe for client-side only
const AframeScene = dynamic(() => import('../components/ARScene'), { ssr: false })

export function TreasureHuntScreen() {
  const [scanning, setScanning] = useState(false)
  const [foundTreasure, setFoundTreasure] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)
  const [distance, setDistance] = useState(10)
  const [hint, setHint] = useState('Look for the hidden artifact near the ancient trees.')
  const [markerVisible, setMarkerVisible] = useState(false)

  useEffect(() => {
    if (scanning && markerVisible && !foundTreasure) {
      const interval = setInterval(() => {
        setScanProgress((prev) => {
          const newValue = prev + 5
          if (newValue >= 100) {
            setScanning(false)
            setFoundTreasure(true)
            clearInterval(interval)
            return 100
          }
          return newValue
        })
      }, 200)

      return () => clearInterval(interval)
    }
  }, [scanning, markerVisible, foundTreasure])

  const startScanning = () => {
    setScanning(true)
    setScanProgress(0)
  }

  const resetScan = () => {
    setFoundTreasure(false)
    setScanning(false)
    setScanProgress(0)
    setMarkerVisible(false)
  }

  const handleDismiss = () => setFoundTreasure(false)
  const handleNavigate = () => console.log('Navigating to the treasure...')

  return (
    <div className="h-screen w-screen relative overflow-hidden bg-black">
      {/* AR Camera View */}
      <div className="absolute inset-0 z-0">
        {/* Hide Image when AR is active */}
        {!scanning && !markerVisible && (
          <Image
            src="/placeholder.svg?height=800&width=400"
            alt="Camera Placeholder"
            fill
            className="object-cover opacity-80"
          />
        )}

        {/* A-Frame Scene */}
        <AframeScene onMarkerFound={() => setMarkerVisible(true)} onMarkerLost={() => setMarkerVisible(false)} />
      </div>

      {/* Scanning Animation */}
      {scanning && !foundTreasure && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center">
          <motion.div
            className="relative w-64 h-64 border-4 border-sunset-500 rounded-lg"
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [0.85, 1, 0.85],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <Camera className="h-12 w-12 text-sunset-500" />
            </div>
          </motion.div>
          <div className="mt-8 w-64">
            <Progress value={scanProgress} className="h-2 bg-indigo-200" />
            <p className="text-center text-indigo-100 mt-2">Scanning for treasures...</p>
          </div>
        </div>
      )}

      {/* Found Treasure UI */}
      {foundTreasure && (
        <motion.div
          className="absolute inset-0 z-20 flex items-center justify-center bg-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Card className="w-[90%] max-w-md bg-indigo-100 border-indigo-600 border-2">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-indigo-900">Treasure Found!</h2>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-indigo-900" onClick={resetScan}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <div className="flex flex-col items-center mb-4">
                <div className="relative w-40 h-40 mb-4">
                  <Image
                    src="/placeholder.svg?height=160&width=160"
                    alt="African Mask"
                    fill
                    className="object-contain"
                  />
                </div>
                <h3 className="text-lg font-bold text-indigo-900">Traditional Mask</h3>
                <div className="flex items-center mt-1">
                  <Award className="h-5 w-5 text-indigo-600 mr-1" />
                  <span className="text-indigo-700 font-bold">+150 PATA Points</span>
                </div>
              </div>

              <div className="bg-indigo-200 p-3 rounded-lg mb-4">
                <div className="flex items-start">
                  <Info className="h-5 w-5 text-indigo-800 mr-2 mt-0.5" />
                  <p className="text-sm text-indigo-800">
                    This traditional mask represents the spirit of ancestors in many West African cultures.
                  </p>
                </div>
              </div>

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  className="bg-indigo-200 border-indigo-600 text-indigo-900 hover:bg-indigo-300"
                  onClick={resetScan}
                >
                  Continue Hunting
                </Button>
                <Button className="bg-sunset-600 text-indigo-50 hover:bg-sunset-700">Claim Reward</Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Scan Button */}
      {!scanning && !foundTreasure && (
        <div className="absolute bottom-8 left-0 right-0 flex justify-center z-10">
          <Button className="h-16 w-16 rounded-full bg-sunset-600 hover:bg-sunset-700" onClick={startScanning}>
            <Camera className="h-8 w-8" />
          </Button>
        </div>
      )}

      {/* Guidance */}
      {!scanning && !foundTreasure && (
        <div className="absolute top-8 left-0 right-0 flex justify-center z-10">
          <div className="bg-indigo-900/80 text-indigo-50 px-4 py-2 rounded-full text-sm">
            Point camera at African artifact marker
          </div>
        </div>
      )}

      {/* Proximity Notification */}
      {foundTreasure && (
        <ProximityNotification
          treasureId="1"
          treasureName="Ancient Mask"
          distance={distance}
          hint={hint}
          onDismiss={handleDismiss}
          onNavigate={handleNavigate}
        />
      )}
    </div>
  )
}
