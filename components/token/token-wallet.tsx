"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  History,
  Coins,
  Award,
  Gem,
  Lock,
  Unlock,
  BarChart2,
  RefreshCw,
  ExternalLink,
  Copy,
  QrCode,
  ArrowRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "@/hooks/use-toast"

export function TokenWallet() {
  const [connected, setConnected] = useState(true)
  const [showQR, setShowQR] = useState(false)
  const [walletAddress, setWalletAddress] = useState("0x7a16ff8270133f063aab6c9977183d9e72835428")
  const [isStaking, setIsStaking] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(walletAddress)
    toast({
      title: "Address Copied",
      description: "Wallet address copied to clipboard",
    })
  }

  const toggleStaking = () => {
    setIsStaking(!isStaking)
    toast({
      title: isStaking ? "Staking Disabled" : "Staking Enabled",
      description: isStaking ? "Your PATA tokens are now available for use" : "Your PATA tokens are now earning yield",
    })
  }

  return (
    <div className="h-full">
      <header className="bg-gradient-to-r from-indigo-700 to-indigo-800 text-white p-4 shadow-md">
        <h1 className="text-2xl font-bold flex items-center">
          <Wallet className="mr-2 h-6 w-6" /> PATA Token Wallet
        </h1>
        <p className="text-sm text-indigo-200">Manage your on-chain assets and NFT treasures</p>
      </header>

      <div className="p-4">
        <Card className="game-card mb-6 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 p-4 text-white">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-bold">PATA Balance</h2>
                <div className="flex items-baseline mt-1">
                  <span className="text-3xl font-bold">1,250</span>
                  <span className="ml-2 text-sm text-indigo-200">PATA</span>
                </div>
                <p className="text-xs text-indigo-200 mt-1">≈ $125.00 USD</p>
              </div>
              <div className="flex flex-col items-end">
                <Badge className="bg-gold-600 text-indigo-900 mb-2">Level 5 Explorer</Badge>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    className="bg-white/20 hover:bg-white/30 text-white"
                    onClick={() => setShowQR(true)}
                  >
                    <QrCode className="h-4 w-4" />
                  </Button>
                  <Button size="sm" className="bg-white/20 hover:bg-white/30 text-white" onClick={handleCopy}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {showQR ? (
              <div className="mt-4 flex flex-col items-center">
                <div className="bg-white p-2 rounded-lg">
                  <Image src="/placeholder.svg?height=150&width=150" alt="QR Code" width={150} height={150} />
                </div>
                <p className="text-xs mt-2 text-center text-indigo-200">Scan to send PATA tokens to this wallet</p>
                <Button
                  size="sm"
                  variant="ghost"
                  className="mt-2 text-white hover:bg-white/20"
                  onClick={() => setShowQR(false)}
                >
                  Hide QR
                </Button>
              </div>
            ) : (
              <div className="mt-4 flex justify-between">
                <Button className="game-button-accent flex-1 mr-2">
                  <ArrowDownLeft className="mr-1 h-4 w-4" /> Receive
                </Button>
                <Button className="game-button-secondary flex-1 ml-2">
                  <ArrowUpRight className="mr-1 h-4 w-4" /> Send
                </Button>
              </div>
            )}
          </div>

          <div className="p-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">Wallet Address</span>
              <Button variant="ghost" size="sm" className="h-8 text-primary" onClick={handleCopy}>
                <Copy className="h-3 w-3 mr-1" /> Copy
              </Button>
            </div>
            <div className="bg-muted p-2 rounded-md text-xs font-mono overflow-hidden text-ellipsis">
              {walletAddress}
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center">
                <Badge className={`${isStaking ? "bg-jungle-600" : "bg-indigo-600"} mr-2`}>
                  {isStaking ? "Staking Active" : "Not Staking"}
                </Badge>
                {isStaking && <span className="text-xs text-jungle-600">+5% APY</span>}
              </div>
              <Button
                variant="outline"
                size="sm"
                className={`border-indigo-300 ${isStaking ? "text-jungle-600" : "text-indigo-700"}`}
                onClick={toggleStaking}
              >
                {isStaking ? <Lock className="mr-1 h-4 w-4" /> : <Unlock className="mr-1 h-4 w-4" />}
                {isStaking ? "Unstake Tokens" : "Stake Tokens"}
              </Button>
            </div>
          </div>
        </Card>

        <Tabs defaultValue="treasures" className="w-full">
          <TabsList className="grid grid-cols-3 bg-gradient-to-r from-indigo-700 to-indigo-800 text-white rounded-t-xl">
            <TabsTrigger value="treasures" className="data-[state=active]:bg-indigo-900">
              NFT Treasures
            </TabsTrigger>
            <TabsTrigger value="transactions" className="data-[state=active]:bg-indigo-900">
              Transactions
            </TabsTrigger>
            <TabsTrigger value="tokenomics" className="data-[state=active]:bg-indigo-900">
              Tokenomics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="treasures" className="mt-0">
            <Card className="border-t-0 rounded-t-none game-card">
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-indigo-900 flex items-center">
                    <Gem className="mr-2 h-5 w-5 text-electric-600" /> Your NFT Collection
                  </h3>
                  <div className="flex items-center">
                    <Badge className="mr-2 bg-indigo-600">12 NFTs</Badge>
                    <Button variant="outline" size="sm" className="border-indigo-300">
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <NFTCard
                    name="Traditional Mask"
                    image="/placeholder.svg?height=120&width=120"
                    rarity="Rare"
                    acquired="2 days ago"
                    tokenId="#8273"
                  />
                  <NFTCard
                    name="Ancient Drum"
                    image="/placeholder.svg?height=120&width=120"
                    rarity="Common"
                    acquired="5 days ago"
                    tokenId="#4129"
                  />
                  <NFTCard
                    name="Tribal Necklace"
                    image="/placeholder.svg?height=120&width=120"
                    rarity="Uncommon"
                    acquired="1 week ago"
                    tokenId="#6392"
                  />
                  <NFTCard
                    name="Mystery Artifact"
                    image="/placeholder.svg?height=120&width=120"
                    rarity="Legendary"
                    acquired="3 days ago"
                    tokenId="#1038"
                  />
                </div>

                <div className="mt-6 bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                  <h4 className="font-bold text-indigo-900 mb-2">NFT Upgrades Available</h4>
                  <div className="space-y-3">
                    <NFTUpgradeOption
                      fromItems={["Common Mask", "Common Drum"]}
                      toItem="Uncommon Ceremonial Set"
                      cost={50}
                    />
                    <NFTUpgradeOption
                      fromItems={["Uncommon Necklace", "Uncommon Bracelet"]}
                      toItem="Rare Royal Jewelry"
                      cost={120}
                    />
                  </div>
                </div>

                <div className="mt-4 text-center">
                  <Button className="game-button">
                    View All NFTs <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions" className="mt-0">
            <Card className="border-t-0 rounded-t-none game-card">
              <CardContent className="p-4">
                <h3 className="text-lg font-bold text-indigo-900 mb-3 flex items-center">
                  <History className="mr-2 h-5 w-5 text-electric-600" /> Recent Transactions
                </h3>

                <ScrollArea className="h-[300px] pr-4">
                  <div className="space-y-3">
                    <TransactionCard
                      type="receive"
                      amount="150"
                      description="Treasure Discovery Reward"
                      time="2 hours ago"
                      status="completed"
                      hash="0x8f...3e2a"
                    />
                    <TransactionCard
                      type="send"
                      amount="50"
                      description="NFT Purchase"
                      time="Yesterday"
                      status="completed"
                      hash="0x7a...9c4b"
                    />
                    <TransactionCard
                      type="receive"
                      amount="300"
                      description="Challenge Completion"
                      time="3 days ago"
                      status="completed"
                      hash="0x2d...7f1c"
                    />
                    <TransactionCard
                      type="mint"
                      amount="1"
                      description="NFT Minting - Tribal Mask"
                      time="4 days ago"
                      status="completed"
                      hash="0x3e...5a2d"
                    />
                    <TransactionCard
                      type="stake"
                      amount="200"
                      description="Token Staking"
                      time="1 week ago"
                      status="completed"
                      hash="0x9c...2e4f"
                    />
                    <TransactionCard
                      type="upgrade"
                      amount="2"
                      description="NFT Upgrade - Common to Uncommon"
                      time="2 weeks ago"
                      status="completed"
                      hash="0x5f...8d3a"
                    />
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tokenomics" className="mt-0">
            <Card className="border-t-0 rounded-t-none game-card">
              <CardContent className="p-4">
                <h3 className="text-lg font-bold text-indigo-900 mb-3 flex items-center">
                  <BarChart2 className="mr-2 h-5 w-5 text-gold-600" /> PATA Token Economics
                </h3>

                <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200 mb-4">
                  <h4 className="font-bold text-indigo-900 mb-2">Token Distribution</h4>
                  <div className="h-40 bg-white rounded-lg flex items-center justify-center mb-3">
                    <BarChart2 className="h-8 w-8 text-indigo-400" />
                    <span className="ml-2 text-indigo-400">Distribution Chart</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-indigo-600 mr-2"></div>
                      <span className="text-indigo-900">Players: 40%</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-sunset-600 mr-2"></div>
                      <span className="text-indigo-900">Partners: 20%</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-jungle-600 mr-2"></div>
                      <span className="text-indigo-900">Development: 25%</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-gold-600 mr-2"></div>
                      <span className="text-indigo-900">Reserve: 15%</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-indigo-900 mb-2">Token Utility</h4>
                    <div className="space-y-2">
                      <TokenUtilityItem
                        title="Treasure Upgrades"
                        description="Combine and upgrade NFTs to create rarer items"
                        icon={<Gem className="h-5 w-5" />}
                      />
                      <TokenUtilityItem
                        title="Reward Redemption"
                        description="Exchange tokens for real-world rewards at partners"
                        icon={<Award className="h-5 w-5" />}
                      />
                      <TokenUtilityItem
                        title="Staking Rewards"
                        description="Earn yield by staking your tokens"
                        icon={<Coins className="h-5 w-5" />}
                      />
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-indigo-900 mb-2">Point System Conversion</h4>
                    <div className="space-y-2">
                      <PointConversionItem type="Common" pointRange="5-20" color="bg-indigo-600" />
                      <PointConversionItem type="Rare" pointRange="50-200" color="bg-electric-600" />
                      <PointConversionItem type="Legendary" pointRange="500-1,000" color="bg-gold-600" />
                      <PointConversionItem type="Mythical" pointRange="5,000-10,000" color="bg-neon-600" />
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-indigo-100 rounded-lg border border-indigo-200">
                  <div className="flex items-start">
                    <Coins className="h-5 w-5 text-gold-600 mr-2 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-indigo-900">Hybrid Blockchain Approach</h4>
                      <p className="text-sm text-indigo-700">
                        PATA uses Layer-2 solutions to reduce gas fees and environmental impact. NFTs are only minted
                        on-chain when traded or sold.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function NFTCard({
  name,
  image,
  rarity,
  acquired,
  tokenId,
}: {
  name: string
  image: string
  rarity: "Common" | "Uncommon" | "Rare" | "Legendary" | "Mythical"
  acquired: string
  tokenId: string
}) {
  const rarityColors = {
    Common: "bg-indigo-200 text-indigo-800",
    Uncommon: "bg-jungle-200 text-jungle-800",
    Rare: "bg-electric-200 text-electric-800",
    Legendary: "bg-gold-200 text-gold-800",
    Mythical: "bg-neon-200 text-neon-800",
  }

  return (
    <div className="bg-white rounded-xl overflow-hidden border border-indigo-200 shadow-md hover:shadow-lg transition-all">
      <div className="relative h-32 w-full">
        <Image src={image || "/placeholder.svg"} alt={name} fill className="object-cover" />
        <div className={`absolute top-2 right-2 text-xs px-2 py-1 rounded-full ${rarityColors[rarity]}`}>{rarity}</div>
      </div>
      <div className="p-2">
        <div className="flex justify-between items-start">
          <h4 className="font-bold text-indigo-900">{name}</h4>
          <span className="text-xs text-indigo-600">{tokenId}</span>
        </div>
        <p className="text-xs text-indigo-600">{acquired}</p>
        <div className="flex justify-between items-center mt-1">
          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-indigo-700">
            View
          </Button>
          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-indigo-700">
            Trade
          </Button>
        </div>
      </div>
    </div>
  )
}

function NFTUpgradeOption({
  fromItems,
  toItem,
  cost,
}: {
  fromItems: string[]
  toItem: string
  cost: number
}) {
  return (
    <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-indigo-200">
      <div className="flex items-center">
        <div className="flex flex-col items-center mr-3">
          {fromItems.map((item, index) => (
            <span key={index} className="text-xs text-indigo-700">
              {item}
            </span>
          ))}
        </div>
        <ArrowRight className="h-4 w-4 text-indigo-400 mx-2" />
        <span className="text-sm font-medium text-indigo-900">{toItem}</span>
      </div>
      <Button size="sm" className="bg-sunset-600 hover:bg-sunset-700 h-8">
        Upgrade ({cost} PATA)
      </Button>
    </div>
  )
}

function TransactionCard({
  type,
  amount,
  description,
  time,
  status,
  hash,
}: {
  type: "send" | "receive" | "mint" | "stake" | "upgrade"
  amount: string
  description: string
  time: string
  status: "pending" | "completed" | "failed"
  hash: string
}) {
  const typeIcons = {
    send: <ArrowUpRight className="h-4 w-4 text-sunset-600" />,
    receive: <ArrowDownLeft className="h-4 w-4 text-jungle-600" />,
    mint: <Gem className="h-4 w-4 text-electric-600" />,
    stake: <Lock className="h-4 w-4 text-gold-600" />,
    upgrade: <RefreshCw className="h-4 w-4 text-neon-600" />,
  }

  const typeColors = {
    send: "bg-sunset-100",
    receive: "bg-jungle-100",
    mint: "bg-electric-100",
    stake: "bg-gold-100",
    upgrade: "bg-neon-100",
  }

  return (
    <div className="bg-white rounded-lg p-3 border border-indigo-200 shadow-sm">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <div className={`h-8 w-8 rounded-full ${typeColors[type]} flex items-center justify-center mr-3`}>
            {typeIcons[type]}
          </div>
          <div>
            <p className="font-medium text-indigo-900">{description}</p>
            <div className="flex items-center text-xs text-indigo-600">
              <span>{time}</span>
              <span className="mx-1">•</span>
              <span className="font-mono">{hash}</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <p
            className={`font-bold ${
              type === "receive"
                ? "text-jungle-600"
                : type === "send"
                  ? "text-sunset-600"
                  : type === "mint"
                    ? "text-electric-600"
                    : type === "stake"
                      ? "text-gold-600"
                      : "text-neon-600"
            }`}
          >
            {type === "receive" ? "+" : type === "send" ? "-" : ""}
            {amount} {type === "mint" || type === "upgrade" ? "NFT" : "PATA"}
          </p>
        </div>
      </div>
    </div>
  )
}

function TokenUtilityItem({
  title,
  description,
  icon,
}: {
  title: string
  description: string
  icon: React.ReactNode
}) {
  return (
    <div className="flex items-start p-3 bg-white rounded-lg border border-indigo-200">
      <div className="bg-indigo-100 p-2 rounded-full mr-3 text-indigo-600">{icon}</div>
      <div>
        <h5 className="font-medium text-indigo-900">{title}</h5>
        <p className="text-sm text-indigo-700">{description}</p>
      </div>
    </div>
  )
}

function PointConversionItem({
  type,
  pointRange,
  color,
}: {
  type: string
  pointRange: string
  color: string
}) {
  return (
    <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-indigo-200">
      <div className="flex items-center">
        <div className={`w-3 h-3 rounded-full ${color} mr-2`}></div>
        <span className="font-medium text-indigo-900">{type} Treasures</span>
      </div>
      <Badge className={color}>{pointRange} points</Badge>
    </div>
  )
}

