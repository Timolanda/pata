"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { SplashScreen } from "@/components/splash-screen"
import { HomeScreen } from "@/components/home-screen"
import { ExploreScreen } from "@/components/explore-screen"
import { TreasureHuntScreen } from "@/components/treasure-hunt-screen"
import { ProfileScreen } from "@/components/profile/profile-screen"
import { PartnerScreen } from "@/components/partner-screen"
import { CommunityScreen } from "@/components/community-screen"
import { WalletScreen } from "@/components/wallet/wallet-screen"
import { Navigation } from "@/components/navigation"
import { NotificationSettings } from "@/components/settings/notification-settings"
import { PartnerDashboard } from "@/components/partner/partner-dashboard"
import { TokenWallet } from "@/components/token/token-wallet"
import { NFTMuseum } from "@/components/nft/nft-museum"
import 'leaflet/dist/leaflet.css';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<string>("splash")
  const [showSplash, setShowSplash] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Auto-navigate from splash screen after 3 seconds
    if (showSplash) {
      const timer = setTimeout(() => {
        setShowSplash(false)
        setCurrentScreen("home")
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [showSplash])

  useEffect(() => {
    // Listen for custom navigation events
    const handleCustomNavigate = (e: CustomEvent) => {
      setCurrentScreen(e.detail)
    }

    window.addEventListener("navigate", handleCustomNavigate as EventListener)

    return () => {
      window.removeEventListener("navigate", handleCustomNavigate as EventListener)
    }
  }, [])

  const handleNavigate = (screen: string) => {
    setCurrentScreen(screen)
  }

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-gradient-to-b from-indigo-50 to-indigo-100 dark:from-indigo-900 dark:to-indigo-950 font-pata">
      {showSplash ? (
        <SplashScreen />
      ) : (
        <>
          <div className="h-[calc(100dvh-70px)] overflow-y-auto pb-20">
            {currentScreen === "home" && <HomeScreen />}
            {currentScreen === "explore" && <ExploreScreen />}
            {currentScreen === "hunt" && <TreasureHuntScreen />}
            {currentScreen === "profile" && <ProfileScreen />}
            {currentScreen === "partner" && <PartnerScreen />}
            {currentScreen === "community" && <CommunityScreen />}
            {currentScreen === "wallet" && <WalletScreen />}
            {currentScreen === "settings" && <NotificationSettings />}
            {currentScreen === "partner-dashboard" && <PartnerDashboard />}
            {currentScreen === "token-wallet" && <TokenWallet />}
            {currentScreen === "nft-museum" && <NFTMuseum />}
          </div>
          <Navigation currentScreen={currentScreen} onNavigate={handleNavigate} />
        </>
      )}
    </div>
  )
}

