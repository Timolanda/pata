"use client"

import { useState } from "react"
import Image from "next/image"
import {
  Gem,
  Filter,
  Search,
  Grid3X3,
  List,
  Info,
  Share2,
  ChevronLeft,
  Award,
  Clock,
  MapPin,
  ArrowUpRight,
  Download,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import { ShowcaseButton } from "@/components/ui/buttons/showcase-button"
import { MarketplaceButton } from "@/components/ui/buttons/marketplace-button"

export function NFTMuseum() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterRarity, setFilterRarity] = useState("all")
  const [isARMode, setIsARMode] = useState(false)

  const handleViewNFT = (nft: NFT) => {
    setSelectedNFT(nft)
  }

  const closeNFTView = () => {
    setSelectedNFT(null)
  }

  const toggleARMode = () => {
    if (selectedNFT) {
      setIsARMode(!isARMode)
      toast({
        title: isARMode ? "AR Mode Disabled" : "AR Mode Enabled",
        description: isARMode
          ? "Returned to standard view"
          : "Point your camera to place the treasure in your environment",
      })
    }
  }

  const shareNFT = () => {
    if (selectedNFT) {
      toast({
        title: "Sharing NFT",
        description: `Sharing ${selectedNFT.name} to social media`,
      })
    }
  }

  return (
    <div className="h-full bg-indigo-50">
      <header className="bg-indigo-800 text-indigo-50 p-4">
        <h1 className="text-xl font-bold flex items-center mb-3">
          <Gem className="mr-2 h-6 w-6" /> NFT Museum
        </h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-400" />
          <Input
            placeholder="Search your collection..."
            className="pl-10 bg-indigo-700 border-indigo-600 text-indigo-50 placeholder:text-indigo-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button size="icon" className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 bg-indigo-600">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {selectedNFT ? (
        <NFTDetailView
          nft={selectedNFT}
          onClose={closeNFTView}
          isARMode={isARMode}
          onToggleAR={toggleARMode}
          onShare={shareNFT}
        />
      ) : (
        <>
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center">
              <Select value={filterRarity} onValueChange={setFilterRarity}>
                <SelectTrigger className="w-[180px] border-indigo-300">
                  <SelectValue placeholder="Filter by rarity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Rarities</SelectItem>
                  <SelectItem value="common">Common</SelectItem>
                  <SelectItem value="uncommon">Uncommon</SelectItem>
                  <SelectItem value="rare">Rare</SelectItem>
                  <SelectItem value="legendary">Legendary</SelectItem>
                  <SelectItem value="mythical">Mythical</SelectItem>
                </SelectContent>
              </Select>
              <span className="mx-2 text-indigo-700">View:</span>
              <div className="flex border border-indigo-300 rounded-md overflow-hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-8 w-8 rounded-none ${viewMode === "grid" ? "bg-indigo-200" : ""}`}
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-8 w-8 rounded-none ${viewMode === "list" ? "bg-indigo-200" : ""}`}
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <Badge className="bg-indigo-600">12 NFTs</Badge>
          </div>

          <Tabs defaultValue="collection" className="w-full">
            <TabsList className="grid grid-cols-3 bg-indigo-700 text-indigo-100 rounded-none">
              <TabsTrigger value="collection" className="data-[state=active]:bg-indigo-800">
                My Collection
              </TabsTrigger>
              <TabsTrigger value="marketplace" className="data-[state=active]:bg-indigo-800">
                Marketplace
              </TabsTrigger>
              <TabsTrigger value="showcase" className="data-[state=active]:bg-indigo-800">
                Showcase
              </TabsTrigger>
            </TabsList>

            <TabsContent value="collection" className="m-0 p-4">
              <ScrollArea className="h-[calc(100vh-220px)]">
                {viewMode === "grid" ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {nftData.map((nft) => (
                      <NFTGridCard key={nft.id} nft={nft} onClick={() => handleViewNFT(nft)} />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {nftData.map((nft) => (
                      <NFTListCard key={nft.id} nft={nft} onClick={() => handleViewNFT(nft)} />
                    ))}
                  </div>
                )}
              </ScrollArea>
            </TabsContent>

            <TabsContent value="marketplace" className="m-0 p-4">
              <div className="flex flex-col items-center justify-center h-[calc(100vh-220px)] bg-indigo-100 rounded-lg border border-indigo-300">
                <Gem className="h-12 w-12 text-indigo-400 mb-4" />
                <h3 className="text-lg font-bold text-indigo-900 mb-2">NFT Marketplace</h3>
                <p className="text-indigo-700 text-center max-w-xs mb-4">
                  Buy, sell, and trade your NFT treasures with other explorers
                </p>
                <MarketplaceButton />
              </div>
            </TabsContent>

            <TabsContent value="showcase" className="m-0 p-4">
              <div className="flex flex-col items-center justify-center h-[calc(100vh-220px)] bg-indigo-100 rounded-lg border border-indigo-300">
                <Award className="h-12 w-12 text-gold-400 mb-4" />
                <h3 className="text-lg font-bold text-indigo-900 mb-2">Digital Showcase</h3>
                <p className="text-indigo-700 text-center max-w-xs mb-4">
                  Create a virtual gallery to display your most prized treasures
                </p>
                <ShowcaseButton />
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  )
}

interface NFT {
  id: string
  name: string
  image: string
  rarity: "Common" | "Uncommon" | "Rare" | "Legendary" | "Mythical"
  acquired: string
  description: string
  location: string
  tokenId: string
  attributes: {
    name: string
    value: string
  }[]
}

function NFTGridCard({ nft, onClick }: { nft: NFT; onClick: () => void }) {
  const rarityColors = {
    Common: "bg-indigo-200 text-indigo-800",
    Uncommon: "bg-jungle-200 text-jungle-800",
    Rare: "bg-electric-200 text-electric-800",
    Legendary: "bg-gold-200 text-gold-800",
    Mythical: "bg-neon-200 text-neon-800",
  }

  return (
    <Card
      className="overflow-hidden border-indigo-200 hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer"
      onClick={onClick}
    >
      <CardContent className="p-0">
        <div className="relative h-40 w-full">
          <Image src={nft.image || "/placeholder.svg"} alt={nft.name} fill className="object-cover" />
          <div className={`absolute top-2 right-2 text-xs px-2 py-1 rounded-full ${rarityColors[nft.rarity]}`}>
            {nft.rarity}
          </div>
        </div>
        <div className="p-3">
          <h3 className="font-bold text-indigo-900">{nft.name}</h3>
          <p className="text-xs text-indigo-700 mt-1">Acquired: {nft.acquired}</p>
          <p className="text-xs text-indigo-600 mt-1 font-mono">#{nft.tokenId}</p>
        </div>
      </CardContent>
    </Card>
  )
}

function NFTListCard({ nft, onClick }: { nft: NFT; onClick: () => void }) {
  const rarityColors = {
    Common: "bg-indigo-200 text-indigo-800",
    Uncommon: "bg-jungle-200 text-jungle-800",
    Rare: "bg-electric-200 text-electric-800",
    Legendary: "bg-gold-200 text-gold-800",
    Mythical: "bg-neon-200 text-neon-800",
  }

  return (
    <Card
      className="overflow-hidden border-indigo-200 hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer"
      onClick={onClick}
    >
      <CardContent className="p-0">
        <div className="flex">
          <div className="w-20 h-20 relative">
            <Image src={nft.image || "/placeholder.svg"} alt={nft.name} fill className="object-cover" />
          </div>
          <div className="p-3 flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-indigo-900">{nft.name}</h3>
                <p className="text-xs text-indigo-700">Acquired: {nft.acquired}</p>
                <div className="flex items-center mt-1">
                  <MapPin className="h-3 w-3 text-sunset-600 mr-1" />
                  <span className="text-xs text-indigo-600">{nft.location}</span>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <div className={`text-xs px-2 py-1 rounded-full ${rarityColors[nft.rarity]}`}>{nft.rarity}</div>
                <span className="text-xs text-indigo-600 mt-1 font-mono">#{nft.tokenId}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function NFTDetailView({
  nft,
  onClose,
  isARMode,
  onToggleAR,
  onShare,
}: {
  nft: NFT
  onClose: () => void
  isARMode: boolean
  onToggleAR: () => void
  onShare: () => void
}) {
  const rarityColors = {
    Common: "bg-indigo-600 text-white",
    Uncommon: "bg-jungle-600 text-white",
    Rare: "bg-electric-600 text-white",
    Legendary: "bg-gold-600 text-indigo-900",
    Mythical: "bg-neon-600 text-white",
  }

  return (
    <div className="h-[calc(100vh-120px)] p-4">
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" className="text-indigo-700" onClick={onClose}>
          <ChevronLeft className="mr-1 h-5 w-5" />
          Back to Collection
        </Button>
        <div className="flex items-center space-x-2">
          <Button variant="outline" className="border-indigo-300" onClick={onShare}>
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Button
            variant="outline"
            className={`border-indigo-300 ${isARMode ? "bg-sunset-100 text-sunset-700 border-sunset-300" : ""}`}
            onClick={onToggleAR}
          >
            {isARMode ? "Exit AR Mode" : "View in AR"}
          </Button>
        </div>
      </div>

      {isARMode ? (
        <div className="relative h-[calc(100vh-200px)] bg-black rounded-lg overflow-hidden">
          <Image src="/placeholder.svg?height=600&width=400" alt="AR View" fill className="object-cover opacity-80" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Image
              src={nft.image || "/placeholder.svg"}
              alt={nft.name}
              width={200}
              height={200}
              className="object-contain"
            />
          </div>
          <div className="absolute bottom-4 left-4 right-4 bg-black/70 p-3 rounded-lg">
            <h3 className="text-white font-bold">{nft.name}</h3>
            <p className="text-white/80 text-sm">{nft.description}</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative rounded-lg overflow-hidden bg-indigo-100 border border-indigo-300 h-[400px]">
            <Image src={nft.image || "/placeholder.svg"} alt={nft.name} fill className="object-contain" />
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-indigo-900">{nft.name}</h2>
                <Badge className={rarityColors[nft.rarity]}>{nft.rarity}</Badge>
              </div>
              <p className="text-indigo-700 mt-1 font-mono">Token ID: #{nft.tokenId}</p>
            </div>

            <div className="bg-indigo-100 p-4 rounded-lg border border-indigo-300">
              <h3 className="font-bold text-indigo-900 mb-2 flex items-center">
                <Info className="mr-2 h-4 w-4" /> Description
              </h3>
              <p className="text-indigo-700">{nft.description}</p>
            </div>

            <div>
              <h3 className="font-bold text-indigo-900 mb-2">Attributes</h3>
              <div className="grid grid-cols-2 gap-2">
                {nft.attributes.map((attr, index) => (
                  <div key={index} className="bg-indigo-100 p-2 rounded-lg border border-indigo-300">
                    <p className="text-xs text-indigo-600">{attr.name}</p>
                    <p className="font-medium text-indigo-900">{attr.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-2 text-sm text-indigo-700">
              <Clock className="h-4 w-4" />
              <span>Acquired: {nft.acquired}</span>
              <span className="mx-1">•</span>
              <MapPin className="h-4 w-4" />
              <span>{nft.location}</span>
            </div>

            <div className="pt-4 flex space-x-3">
              <Button className="flex-1 bg-sunset-600 hover:bg-sunset-700">
                <ArrowUpRight className="mr-2 h-4 w-4" />
                Trade NFT
              </Button>
              <Button className="flex-1 bg-indigo-700 hover:bg-indigo-800">
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Sample NFT data
const nftData: NFT[] = [
  {
    id: "1",
    name: "Traditional Mask",
    image: "/placeholder.svg?height=200&width=200",
    rarity: "Rare",
    acquired: "2 days ago",
    description:
      "This traditional mask represents the spirit of ancestors in many West African cultures. It is used in important ceremonies and celebrations.",
    location: "National Museum",
    tokenId: "8273",
    attributes: [
      { name: "Culture", value: "Yoruba" },
      { name: "Age", value: "150+ years" },
      { name: "Material", value: "Wood" },
      { name: "Style", value: "Ceremonial" },
    ],
  },
  {
    id: "2",
    name: "Ancient Drum",
    image: "/placeholder.svg?height=200&width=200",
    rarity: "Common",
    acquired: "5 days ago",
    description:
      "A traditional drum used in community gatherings and celebrations. The rhythms played on this drum have been passed down through generations.",
    location: "Music Museum",
    tokenId: "4129",
    attributes: [
      { name: "Culture", value: "Akan" },
      { name: "Age", value: "80+ years" },
      { name: "Material", value: "Wood & Hide" },
      { name: "Type", value: "Talking Drum" },
    ],
  },
  {
    id: "3",
    name: "Tribal Necklace",
    image: "/placeholder.svg?height=200&width=200",
    rarity: "Uncommon",
    acquired: "1 week ago",
    description:
      "A beautiful beaded necklace worn by tribal leaders during important ceremonies. Each bead pattern tells a story about the wearer's lineage.",
    location: "Cultural Center",
    tokenId: "6392",
    attributes: [
      { name: "Culture", value: "Maasai" },
      { name: "Age", value: "60+ years" },
      { name: "Material", value: "Glass Beads" },
      { name: "Pattern", value: "Royal Lineage" },
    ],
  },
  {
    id: "4",
    name: "Mystery Artifact",
    image: "/placeholder.svg?height=200&width=200",
    rarity: "Legendary",
    acquired: "3 days ago",
    description:
      "An artifact of unknown origin with mysterious properties. Scholars debate its purpose and the civilization that created it.",
    location: "Historical Society",
    tokenId: "1038",
    attributes: [
      { name: "Culture", value: "Unknown" },
      { name: "Age", value: "500+ years" },
      { name: "Material", value: "Stone & Metal" },
      { name: "Purpose", value: "Ceremonial" },
    ],
  },
  {
    id: "5",
    name: "Golden Statue",
    image: "/placeholder.svg?height=200&width=200",
    rarity: "Mythical",
    acquired: "1 month ago",
    description:
      "A rare golden statue representing a deity from ancient African mythology. Only a handful of these statues are known to exist.",
    location: "Royal Treasury",
    tokenId: "0217",
    attributes: [
      { name: "Culture", value: "Ancient Nubian" },
      { name: "Age", value: "2000+ years" },
      { name: "Material", value: "Gold & Gems" },
      { name: "Deity", value: "Apedemak" },
    ],
  },
]

