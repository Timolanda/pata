"use client"

import { useState } from "react"
import { ExternalLink, ShoppingBag, Gem, Coins, AlertTriangle, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"

interface MarketplaceButtonProps {
  variant?: "default" | "outline" | "secondary" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
}

export function MarketplaceButton({ variant = "default", size = "default", className = "" }: MarketplaceButtonProps) {
  const [open, setOpen] = useState(false)

  const handleOpenMarketplace = () => {
    toast({
      title: "Opening Marketplace",
      description: "Connecting to the PATA NFT Marketplace",
    })

    setOpen(false)

    // In a real app, this would navigate to the marketplace
    // router.push('/marketplace')

    // Simulate navigation delay
    setTimeout(() => {
      toast({
        title: "Marketplace Connected",
        description: "You are now browsing the PATA NFT Marketplace",
      })
    }, 1500)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} size={size} className={`bg-sunset-600 hover:bg-sunset-700 ${className}`}>
          <ExternalLink className="mr-2 h-4 w-4" />
          Open Marketplace
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] border-sunset-300 bg-gradient-to-b from-indigo-50 to-sunset-50">
        <DialogHeader>
          <DialogTitle className="text-indigo-900 flex items-center">
            <ShoppingBag className="mr-2 h-5 w-5 text-sunset-600" />
            PATA NFT Marketplace
          </DialogTitle>
          <DialogDescription className="text-indigo-700">
            Buy, sell, and trade African treasures with other explorers
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="featured" className="w-full">
          <TabsList className="grid grid-cols-3 bg-sunset-100 text-indigo-900">
            <TabsTrigger value="featured" className="data-[state=active]:bg-sunset-600 data-[state=active]:text-white">
              Featured
            </TabsTrigger>
            <TabsTrigger value="trending" className="data-[state=active]:bg-sunset-600 data-[state=active]:text-white">
              Trending
            </TabsTrigger>
            <TabsTrigger value="info" className="data-[state=active]:bg-sunset-600 data-[state=active]:text-white">
              Info
            </TabsTrigger>
          </TabsList>

          <TabsContent value="featured" className="mt-4 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <MarketplaceItem name="Royal Headdress" price="2,500" rarity="Legendary" />
              <MarketplaceItem name="Tribal Shield" price="850" rarity="Rare" />
              <MarketplaceItem name="Ceremonial Spear" price="1,200" rarity="Rare" />
              <MarketplaceItem name="Ancient Scroll" price="3,000" rarity="Mythical" />
            </div>
          </TabsContent>

          <TabsContent value="trending" className="mt-4 space-y-4">
            <div className="space-y-3">
              <TrendingItem name="Festival Masks Collection" volume="12,500" change="+24%" />
              <TrendingItem name="Ancient Artifacts" volume="8,750" change="+18%" />
              <TrendingItem name="Tribal Jewelry" volume="5,200" change="+10%" />
            </div>
          </TabsContent>

          <TabsContent value="info" className="mt-4 space-y-4">
            <div className="bg-white p-3 rounded-lg border border-sunset-200">
              <h3 className="font-medium text-indigo-900 flex items-center">
                <Coins className="mr-2 h-4 w-4 text-sunset-600" />
                Marketplace Fees
              </h3>
              <p className="text-sm text-indigo-700 mt-1">
                2.5% transaction fee on all sales. Sellers receive 97.5% of the sale price.
              </p>
            </div>

            <div className="bg-white p-3 rounded-lg border border-sunset-200">
              <h3 className="font-medium text-indigo-900 flex items-center">
                <Gem className="mr-2 h-4 w-4 text-electric-600" />
                NFT Standards
              </h3>
              <p className="text-sm text-indigo-700 mt-1">
                All NFTs follow the ERC-721 standard on Ethereum Layer-2 solutions for lower gas fees.
              </p>
            </div>

            <div className="bg-sunset-100 p-3 rounded-lg border border-sunset-300">
              <div className="flex items-start">
                <div className="bg-sunset-200 p-1 rounded-full mr-2 mt-0.5">
                  <AlertTriangle className="h-4 w-4 text-sunset-700" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-indigo-900">Safety First</h4>
                  <p className="text-xs text-indigo-700">
                    Always verify NFT authenticity before purchasing. PATA verifies all listed treasures.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => setOpen(false)} className="border-indigo-300">
            Cancel
          </Button>
          <Button onClick={handleOpenMarketplace} className="bg-sunset-600 hover:bg-sunset-700">
            <ShoppingBag className="mr-2 h-4 w-4" />
            Enter Marketplace
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function MarketplaceItem({
  name,
  price,
  rarity,
}: {
  name: string
  price: string
  rarity: "Common" | "Uncommon" | "Rare" | "Legendary" | "Mythical"
}) {
  const rarityColors = {
    Common: "bg-indigo-200 text-indigo-800",
    Uncommon: "bg-jungle-200 text-jungle-800",
    Rare: "bg-electric-200 text-electric-800",
    Legendary: "bg-gold-200 text-gold-800",
    Mythical: "bg-neon-200 text-neon-800",
  }

  return (
    <div className="bg-white rounded-lg overflow-hidden border border-sunset-200 shadow-sm hover:shadow-md transition-all">
      <div className="h-20 bg-indigo-100 flex items-center justify-center">
        <Gem className="h-8 w-8 text-indigo-300" />
      </div>
      <div className="p-2">
        <div className="flex justify-between items-start">
          <h4 className="font-medium text-indigo-900 text-sm">{name}</h4>
          <Badge className={rarityColors[rarity]}>{rarity}</Badge>
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-sm font-bold text-indigo-900">{price} PATA</span>
          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-sunset-700">
            View <ArrowRight className="ml-1 h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  )
}

function TrendingItem({
  name,
  volume,
  change,
}: {
  name: string
  volume: string
  change: string
}) {
  return (
    <div className="bg-white p-3 rounded-lg border border-sunset-200 flex items-center justify-between">
      <div>
        <h4 className="font-medium text-indigo-900">{name}</h4>
        <div className="flex items-center mt-1">
          <span className="text-xs text-indigo-700">Volume: </span>
          <span className="text-xs font-bold text-indigo-900 ml-1">{volume} PATA</span>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <Badge className="bg-jungle-600">{change}</Badge>
        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-sunset-700 mt-1">
          Explore
        </Button>
      </div>
    </div>
  )
}

