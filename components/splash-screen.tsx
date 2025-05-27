"use client"

import { motion } from "framer-motion"
import Image from "next/image"

export function SplashScreen() {
  return (
    <motion.div
      className="flex flex-col items-center justify-center h-full w-full bg-gradient-to-br from-indigo-700 via-indigo-800 to-indigo-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="relative w-48 h-48 mb-8"
      >
        <div className="absolute inset-0 bg-gold-600 rounded-full opacity-20 animate-ping" />
        <div className="relative z-10 w-full h-full flex items-center justify-center">
          <div className="w-40 h-40 rounded-full bg-gradient-to-br from-indigo-50 to-indigo-100 flex items-center justify-center border-8 border-sunset-600 overflow-hidden pulse-glow-gold">
            <div className="relative w-full h-full">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pata-png-wt-VxqYAG2LvNmiK5xEnJ1S0EqwR4ODPB.png"
                alt="PATA Logo"
                width={120}
                height={120}
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </motion.div>

      <motion.h2
        className="text-2xl font-bold text-white mb-4 text-center"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        Uncover Africa&apos;s Hidden Treasures
      </motion.h2>

      <div className="flex space-x-2">
        <div className="w-3 h-3 bg-gold-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
        <div className="w-3 h-3 bg-gold-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
        <div className="w-3 h-3 bg-gold-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
      </div>
    </motion.div>
  )
}

