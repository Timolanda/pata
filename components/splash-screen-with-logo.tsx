"use client"

import { motion } from "framer-motion"
import Image from "next/image"

export function SplashScreenWithLogo() {
  return (
    <motion.div 
      className="flex flex-col items-center justify-center h-full w-full bg-gradient-to-b from-amber-700 to-amber-900"
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
        <div className="absolute inset-0 bg-amber-600 rounded-full opacity-20 animate-ping" />
        <div className="relative z-10 w-full h-full flex items-center justify-center">
          <div className="w-40 h-40 rounded-full bg-amber-100 flex items-center justify-center border-8 border-amber-600 overflow-hidden">
            {/* Replace this with your actual PNG logo */}
            <Image 
              src="/pata-logo.png" 
              alt="PATA Logo" 
              width={160} 
              height={160}
              className="object-contain"
            />
          </div>
        </div>
      </motion.div>
      
      <motion.h2 
        className="text-2xl font-bold text-amber-100 mb-4 text-center"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        Uncover Africa&apos;s Hidden Treasures
      </motion.h2>
      
      <motion.div
        className="flex space-x-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <div 
          className="w-3 h-3 bg-amber-200 rounded-full animate-bounce" 
          style={{ animationDelay: "0ms" }}
        />
        <div 
          className="w-3 h-3 bg-amber-200 rounded-full animate-bounce" 
          style={{ animationDelay: "150ms" }}
        />
        <div 
          className="w-3 h-3 bg-amber-200 rounded-full animate-bounce" 
          style={{ animationDelay: "300ms" }}
        />
      </motion.div>
    </motion.div>
  )
}

