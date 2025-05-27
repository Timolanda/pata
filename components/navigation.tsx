"use client"

import type React from "react"
import { useState } from "react"

import { Home, Search, Camera, User, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"

interface NavigationProps {
  currentScreen: string
  onNavigate: (screen: string) => void
}

export function Navigation({ currentScreen, onNavigate }: NavigationProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-[70px] bg-gradient-to-r from-indigo-700 to-indigo-800 border-t border-indigo-600 flex items-center justify-around px-2 shadow-lg">
      <NavButton
        icon={<Home className="h-6 w-6" />}
        label="Home"
        isActive={currentScreen === "home"}
        onClick={() => onNavigate("home")}
      />
      <NavButton
        icon={<Search className="h-6 w-6" />}
        label="Explore"
        isActive={currentScreen === "explore"}
        onClick={() => onNavigate("explore")}
      />
      <NavButton
        icon={<Camera className="h-6 w-6" />}
        label="Hunt"
        isActive={currentScreen === "hunt"}
        onClick={() => onNavigate("hunt")}
        isPrimary
      />
      <NavButton
        icon={<Wallet className="h-6 w-6" />}
        label="Wallet"
        isActive={currentScreen === "wallet"}
        onClick={() => onNavigate("token-wallet")}
      />
      <NavButton
        icon={<User className="h-6 w-6" />}
        label="Profile"
        isActive={currentScreen === "profile" || currentScreen === "partner" || currentScreen === "community"}
        onClick={() => onNavigate("profile")}
        hasSubmenu={true}
        onSubmenuSelect={(screen) => onNavigate(screen)}
        currentScreen={currentScreen}
      />
    </div>
  )
}

interface NavButtonProps {
  icon: React.ReactNode
  label: string
  isActive: boolean
  isPrimary?: boolean
  hasSubmenu?: boolean
  currentScreen?: string
  onClick: () => void
  onSubmenuSelect?: (screen: string) => void
}

function NavButton({
  icon,
  label,
  isActive,
  isPrimary = false,
  hasSubmenu = false,
  currentScreen,
  onClick,
  onSubmenuSelect,
}: NavButtonProps) {
  const [showSubmenu, setShowSubmenu] = useState(false)

  const handleClick = () => {
    if (hasSubmenu) {
      setShowSubmenu(!showSubmenu)
    } else {
      onClick()
    }
  }

  if (isPrimary) {
    return (
      <Button
        className="flex flex-col items-center justify-center h-14 w-14 rounded-full bg-gradient-to-r from-sunset-500 to-sunset-600 hover:from-sunset-600 hover:to-sunset-700 text-white -mt-5 shadow-lg pulse-glow-gold"
        onClick={onClick}
      >
        {icon}
        <span className="text-[10px] mt-1">{label}</span>
      </Button>
    )
  }

  return (
    <div className="relative">
      <Button
        variant="ghost"
        className={`flex flex-col items-center justify-center h-full px-3 ${
          isActive ? "text-white" : "text-indigo-200 hover:text-white"
        }`}
        onClick={hasSubmenu ? handleClick : onClick}
      >
        {icon}
        <span className="text-[10px] mt-1">{label}</span>
      </Button>

      {hasSubmenu && showSubmenu && (
        <div className="absolute bottom-full mb-2 right-0 bg-gradient-to-r from-indigo-700 to-indigo-800 rounded-lg shadow-lg overflow-hidden w-32 border border-indigo-500">
          <Button
            variant="ghost"
            className={`w-full justify-start text-left text-sm py-2 px-3 ${
              currentScreen === "profile" ? "bg-indigo-900 text-white" : "text-indigo-200"
            }`}
            onClick={() => {
              if (onSubmenuSelect) onSubmenuSelect("profile")
              setShowSubmenu(false)
            }}
          >
            Profile
          </Button>
          <Button
            variant="ghost"
            className={`w-full justify-start text-left text-sm py-2 px-3 ${
              currentScreen === "partner" ? "bg-indigo-900 text-white" : "text-indigo-200"
            }`}
            onClick={() => {
              if (onSubmenuSelect) onSubmenuSelect("partner")
              setShowSubmenu(false)
            }}
          >
            Partner Page
          </Button>
          <Button
            variant="ghost"
            className={`w-full justify-start text-left text-sm py-2 px-3 ${
              currentScreen === "community" ? "bg-indigo-900 text-white" : "text-indigo-200"
            }`}
            onClick={() => {
              if (onSubmenuSelect) onSubmenuSelect("community")
              setShowSubmenu(false)
            }}
          >
            Community
          </Button>
          <Button
            variant="ghost"
            className={`w-full justify-start text-left text-sm py-2 px-3 ${
              currentScreen === "settings" ? "bg-indigo-900 text-white" : "text-indigo-200"
            }`}
            onClick={() => {
              if (onSubmenuSelect) onSubmenuSelect("settings")
              setShowSubmenu(false)
            }}
          >
            Settings
          </Button>
          <Button
            variant="ghost"
            className={`w-full justify-start text-left text-sm py-2 px-3 ${
              currentScreen === "partner-dashboard" ? "bg-indigo-900 text-white" : "text-indigo-200"
            }`}
            onClick={() => {
              if (onSubmenuSelect) onSubmenuSelect("partner-dashboard")
              setShowSubmenu(false)
            }}
          >
            Partner Dashboard
          </Button>
          <Button
            variant="ghost"
            className={`w-full justify-start text-left text-sm py-2 px-3 ${
              currentScreen === "nft-museum" ? "bg-indigo-900 text-white" : "text-indigo-200"
            }`}
            onClick={() => {
              if (onSubmenuSelect) onSubmenuSelect("nft-museum")
              setShowSubmenu(false)
            }}
          >
            NFT Museum
          </Button>
        </div>
      )}
    </div>
  )
}

