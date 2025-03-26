"use client"

import { useState } from "react"
import Image from "next/image"
import { Eye, Info, ArrowRight, MapPin, Calendar, Award, Download, Share2 } from "lucide-react"
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
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"

interface FeaturedViewButtonProps {
  variant?: "default" | "outline" | "secondary" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
  nft: {
    id: string
    name: string
    image: string
    rarity: string
    description: string
    location: string
    acquired: string
    culture: string
    age: string
  }
}

export function FeaturedViewButton({ variant = "ghost", size = "sm", className = "", nft }: FeaturedViewButtonProps) {
  const [open, setOpen] = useState(false)

  const handleDownload = () => {
    toast({
      title: "Image Downloaded",
      description: `${nft.name} image saved to your device`,
    })
  }

  const handleShare = () => {
    toast({
      title: "Sharing NFT",
      description: `Sharing ${nft.name} to social media`,
    })
  }

  const rarityColors = {
    Common: "bg-indigo-600 text-white",
    Uncommon: "bg-jungle-600 text-white",
    Rare: "bg-electric-600 text-white",
    Legendary: "bg-gold-600 text-indigo-900",
    Mythical: "bg-neon-600 text-white",
  }

  const rarityColor = rarityColors[nft.rarity as keyof typeof rarityColors] || "bg-indigo-600"

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} size={size} className={`h-7 px-2 text-xs text-indigo-700 ${className}`}>
          View <ArrowRight className="ml-1 h-3 w-3" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] border-indigo-300">
        <DialogHeader>
          <DialogTitle className="text-indigo-900 flex items-center">
            <Eye className="mr-2 h-5 w-5 text-indigo-600" />
            Featured Treasure
          </DialogTitle>
          <DialogDescription className="text-indigo-700">
            Explore this unique African treasure in detail
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative rounded-lg overflow-hidden bg-indigo-100 border border-indigo-300 h-[250px]">
              <Image src={nft.image || "/placeholder.svg"} alt={nft.name} fill className="object-contain" />
              <Badge className={`absolute top-2 right-2 ${rarityColor}`}>{nft.rarity}</Badge>
            </div>

            <div className="space-y-3">
              <div>
                <h2 className="text-xl font-bold text-indigo-900">{nft.name}</h2>
                <div className="flex items-center text-sm text-indigo-700 mt-1">
                  <MapPin className="h-4 w-4 mr-1" />
                  {nft.location}
                </div>
              </div>

              <p className="text-indigo-700">{nft.description}</p>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-indigo-100 p-2 rounded-lg border border-indigo-300">
                  <p className="text-xs text-indigo-600">Culture</p>
                  <p className="font-medium text-indigo-900">{nft.culture}</p>
                </div>

                <div className="bg-indigo-100 p-2 rounded-lg border border-indigo-300">
                  <p className="text-xs text-indigo-600">Age</p>
                  <p className="font-medium text-indigo-900">{nft.age}</p>
                </div>
              </div>

              <div className="flex items-center text-sm text-indigo-700">
                <Calendar className="h-4 w-4 mr-1" />
                <span>Acquired: {nft.acquired}</span>
              </div>
            </div>
          </div>

          <div className="bg-indigo-100 p-3 rounded-lg border border-indigo-200">
            <div className="flex items-start">
              <Info className="h-5 w-5 text-indigo-600 mr-2 mt-0.5" />
              <div>
                <h4 className="font-medium text-indigo-900">Historical Context</h4>
                <p className="text-sm text-indigo-700">
                  This {nft.name.toLowerCase()} represents an important cultural artifact from the {nft.culture} people.
                  These items were traditionally used in ceremonies and important cultural events, symbolizing the
                  connection between the physical and spiritual worlds.
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <div className="flex space-x-2">
            <Button variant="outline" className="border-indigo-300" onClick={handleShare}>
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
            <Button variant="outline" className="border-indigo-300" onClick={handleDownload}>
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
            <Button className="bg-indigo-700 hover:bg-indigo-800" onClick={() => setOpen(false)}>
              <Award className="mr-2 h-4 w-4" />
              Add to Collection
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

