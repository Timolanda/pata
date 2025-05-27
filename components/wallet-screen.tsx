"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Copy,
  ExternalLink,
  QrCode,
  Clock,
  CheckCircle,
  AlertCircle,
  Coins,
  Award,
  Gem,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "@/hooks/use-toast"
import { ConnectWallet, Wallet as OnchainWallet, WalletDropdown, WalletDropdownDisconnect } from '@coinbase/onchainkit/wallet'
import { useAccount, useBalance, useChainId } from 'wagmi'
import { PATA_TOKEN_ADDRESSES, PATA_TOKEN_ABI } from '@/config/web3'
import { type Chain } from 'viem'

export function WalletScreen() {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const [showQR, setShowQR] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const { data: pataTokenData, error: balanceError } = useBalance({
    address: address as `0x${string}` | undefined,
    token: chainId ? (PATA_TOKEN_ADDRESSES[chainId as keyof typeof PATA_TOKEN_ADDRESSES] as `0x${string}`) : undefined,
  })

  useEffect(() => {
    if (balanceError) {
    toast({
        title: "Error Loading Balance",
        description: "There was an error loading your PATA token balance. Please try again.",
        variant: "destructive",
    })
  }
    setIsLoading(false)
  }, [balanceError])

  const handleCopy = () => {
    if (address) {
      navigator.clipboard.writeText(address)
    toast({
      title: "Address Copied",
      description: "Wallet address copied to clipboard",
    })
    }
  }

  const handleSend = () => {
    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to send tokens",
        variant: "destructive",
      })
      return
    }
    // Implement send functionality
    toast({
      title: "Coming Soon",
      description: "Send functionality will be available soon!",
    })
  }

  const handleReceive = () => {
    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to receive tokens",
        variant: "destructive",
      })
      return
    }
    setShowQR(true)
  }

  const resetScan = () => {
    setShowQR(false)
  }

  return (
    <div className="h-full">
      <header className="bg-gradient-to-r from-indigo-700 to-indigo-800 text-white p-4 shadow-md">
        <h1 className="text-2xl font-bold flex items-center">
          <Wallet className="mr-2 h-6 w-6" /> PATA Wallet
        </h1>
        <p className="text-sm text-indigo-200">Manage your crypto assets and NFT treasures</p>
      </header>

      <div className="p-4">
        {!isConnected ? (
          <Card className="game-card mb-6">
            <CardHeader className="pb-2">
              <CardTitle>Connect Your Wallet</CardTitle>
              <CardDescription>Connect your crypto wallet to manage your PATA tokens and NFTs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center">
                <OnchainWallet>
                  <ConnectWallet>
                    <Wallet className="h-6 w-6 mr-2" />
                    <span>Connect Wallet</span>
                  </ConnectWallet>
                  <WalletDropdown>
                    <WalletDropdownDisconnect />
                  </WalletDropdown>
                </OnchainWallet>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center border-t border-border pt-4">
              <p className="text-sm text-muted-foreground text-center">
                Connect your wallet to access your PATA tokens, claim rewards, and manage your NFT treasures
              </p>
            </CardFooter>
          </Card>
        ) : (
          <>
            <Card className="game-card mb-6 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 p-4 text-white">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-lg font-bold">PATA Balance</h2>
                    <div className="flex items-baseline mt-1">
                      {isLoading ? (
                        <span className="text-3xl font-bold animate-pulse">Loading...</span>
                      ) : (
                        <>
                          <span className="text-3xl font-bold">
                            {pataTokenData?.formatted || '0'}
                          </span>
                      <span className="ml-2 text-sm text-indigo-200">PATA</span>
                        </>
                      )}
                    </div>
                    <p className="text-xs text-indigo-200 mt-1">≈ ${(Number(pataTokenData?.formatted || 0) * 0.1).toFixed(2)} USD</p>
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
                      <Image 
                        src={`https://chart.googleapis.com/chart?cht=qr&chl=${address}&chs=150x150&choe=UTF-8&chld=L|2`} 
                        alt="QR Code" 
                        width={150} 
                        height={150} 
                      />
                    </div>
                    <p className="text-xs mt-2 text-center text-indigo-200">Scan to send PATA tokens to this wallet</p>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-indigo-900"
                      onClick={resetScan}
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                ) : (
                  <div className="mt-4 flex justify-between">
                    <Button className="game-button-accent flex-1 mr-2" onClick={handleReceive}>
                      <ArrowDownLeft className="mr-1 h-4 w-4" /> Receive
                    </Button>
                    <Button className="game-button-secondary flex-1 ml-2" onClick={handleSend}>
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
                  {address}
                </div>
              </div>
            </Card>

            <Tabs defaultValue="nfts" className="w-full">
              <TabsList className="grid grid-cols-3 bg-gradient-to-r from-indigo-700 to-indigo-800 text-white rounded-t-xl">
                <TabsTrigger value="nfts" className="data-[state=active]:bg-indigo-900">
                  NFT Treasures
                </TabsTrigger>
                <TabsTrigger value="transactions" className="data-[state=active]:bg-indigo-900">
                  Transactions
                </TabsTrigger>
                <TabsTrigger value="rewards" className="data-[state=active]:bg-indigo-900">
                  Rewards
                </TabsTrigger>
              </TabsList>

              <TabsContent value="nfts" className="mt-0">
                <Card className="border-t-0 rounded-t-none game-card">
                  <CardContent className="p-4">
                    <h3 className="text-lg font-bold text-indigo-900 mb-3 flex items-center">
                      <Gem className="mr-2 h-5 w-5 text-electric-600" /> Your NFT Collection
                    </h3>

                    <div className="grid grid-cols-2 gap-3">
                      <NFTCard
                        name="Traditional Mask"
                        image="/placeholder.svg?height=120&width=120"
                        rarity="Rare"
                        acquired="2 days ago"
                      />
                      <NFTCard
                        name="Ancient Drum"
                        image="/placeholder.svg?height=120&width=120"
                        rarity="Common"
                        acquired="5 days ago"
                      />
                      <NFTCard
                        name="Tribal Necklace"
                        image="/placeholder.svg?height=120&width=120"
                        rarity="Uncommon"
                        acquired="1 week ago"
                      />
                      <NFTCard
                        name="Mystery Artifact"
                        image="/placeholder.svg?height=120&width=120"
                        rarity="Legendary"
                        acquired="3 days ago"
                      />
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
                      <Clock className="mr-2 h-5 w-5 text-electric-600" /> Recent Transactions
                    </h3>

                    <ScrollArea className="h-[300px] pr-4">
                      <div className="space-y-3">
                        <TransactionCard
                          type="receive"
                          amount="150"
                          description="Treasure Discovery Reward"
                          time="2 hours ago"
                          status="completed"
                        />
                        <TransactionCard
                          type="send"
                          amount="50"
                          description="NFT Purchase"
                          time="Yesterday"
                          status="completed"
                        />
                        <TransactionCard
                          type="receive"
                          amount="300"
                          description="Challenge Completion"
                          time="3 days ago"
                          status="completed"
                        />
                        <TransactionCard
                          type="receive"
                          amount="75"
                          description="Daily Login Bonus"
                          time="4 days ago"
                          status="completed"
                        />
                        <TransactionCard
                          type="send"
                          amount="200"
                          description="Marketplace Purchase"
                          time="1 week ago"
                          status="completed"
                        />
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="rewards" className="mt-0">
                <Card className="border-t-0 rounded-t-none game-card">
                  <CardContent className="p-4">
                    <h3 className="text-lg font-bold text-indigo-900 mb-3 flex items-center">
                      <Award className="mr-2 h-5 w-5 text-gold-600" /> Available Rewards
                    </h3>

                    <div className="space-y-3">
                      <RewardCard
                        title="15% Off at African Crafts Market"
                        points={500}
                        expires="Valid until Dec 31, 2023"
                        tokenCost={50}
                      />
                      <RewardCard
                        title="Free Dessert at Savanna Restaurant"
                        points={300}
                        expires="Valid until Nov 15, 2023"
                        tokenCost={30}
                      />
                      <RewardCard
                        title="Museum Entry Ticket"
                        points={800}
                        expires="Valid until Jan 31, 2024"
                        tokenCost={80}
                      />
                      <RewardCard
                        title="Exclusive NFT: Golden Mask"
                        points={1200}
                        expires="Limited Edition"
                        tokenCost={120}
                        isSpecial
                      />
                    </div>

                    <div className="mt-4 p-3 bg-indigo-100 rounded-lg border border-indigo-200">
                      <div className="flex items-start">
                        <Coins className="h-5 w-5 text-gold-600 mr-2 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-indigo-900">Earn More PATA Tokens</h4>
                          <p className="text-sm text-indigo-700">
                            Complete challenges, discover treasures, and participate in events to earn more tokens!
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="mt-4 text-center">
              <Button
                variant="outline"
                size="default"
                className="bg-indigo-200 border-indigo-600 text-indigo-900 hover:bg-indigo-300"
                onClick={resetScan}
              >
                Continue Hunting
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function NFTCard({
  name,
  image,
  rarity,
  acquired,
}: {
  name: string
  image: string
  rarity: "Common" | "Uncommon" | "Rare" | "Legendary"
  acquired: string
}) {
  const rarityColors = {
    Common: "bg-gray-200 text-gray-800",
    Uncommon: "bg-jungle-200 text-jungle-800",
    Rare: "bg-electric-200 text-electric-800",
    Legendary: "bg-gold-200 text-gold-800",
  }

  return (
    <div className="bg-white rounded-xl overflow-hidden border border-indigo-200 shadow-md hover:shadow-lg transition-all">
      <div className="relative h-32 w-full">
        <Image src={image || "/placeholder.svg"} alt={name} fill className="object-cover" />
        <div className={`absolute top-2 right-2 text-xs px-2 py-1 rounded-full ${rarityColors[rarity]}`}>{rarity}</div>
      </div>
      <div className="p-2">
        <h4 className="font-bold text-indigo-900">{name}</h4>
        <p className="text-xs text-indigo-600">{acquired}</p>
      </div>
    </div>
  )
}

function TransactionCard({
  type,
  amount,
  description,
  time,
  status,
}: {
  type: "send" | "receive"
  amount: string
  description: string
  time: string
  status: "pending" | "completed" | "failed"
}) {
  const statusIcons = {
    pending: <Clock className="h-4 w-4 text-sunset-500" />,
    completed: <CheckCircle className="h-4 w-4 text-jungle-500" />,
    failed: <AlertCircle className="h-4 w-4 text-red-500" />,
  }

  return (
    <div className="bg-white rounded-lg p-3 border border-indigo-200 shadow-sm">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          {type === "receive" ? (
            <div className="h-8 w-8 rounded-full bg-jungle-100 flex items-center justify-center mr-3">
              <ArrowDownLeft className="h-4 w-4 text-jungle-600" />
            </div>
          ) : (
            <div className="h-8 w-8 rounded-full bg-sunset-100 flex items-center justify-center mr-3">
              <ArrowUpRight className="h-4 w-4 text-sunset-600" />
            </div>
          )}
          <div>
            <p className="font-medium text-indigo-900">{description}</p>
            <p className="text-xs text-indigo-600">{time}</p>
          </div>
        </div>
        <div className="text-right">
          <p className={`font-bold ${type === "receive" ? "text-jungle-600" : "text-sunset-600"}`}>
            {type === "receive" ? "+" : "-"}
            {amount} PATA
          </p>
          <div className="flex items-center justify-end text-xs mt-1">
            {statusIcons[status]}
            <span className="ml-1 capitalize">{status}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function RewardCard({
  title,
  points,
  expires,
  tokenCost,
  isSpecial = false,
}: {
  title: string
  points: number
  expires: string
  tokenCost: number
  isSpecial?: boolean
}) {
  return (
    <Card
      className={`overflow-hidden border ${isSpecial ? "border-gold-300 bg-gradient-to-r from-gold-50 to-gold-100" : "border-indigo-200"}`}
    >
      <CardContent className="p-0">
        <div className="flex">
          <div className={`w-16 h-16 ${isSpecial ? "bg-gold-200" : "bg-indigo-200"} flex items-center justify-center`}>
            {isSpecial ? <Gem className="h-8 w-8 text-gold-600" /> : <Award className="h-8 w-8 text-indigo-600" />}
          </div>
          <div className="p-3 flex-1">
            <div className="flex justify-between items-start">
              <h3 className={`font-bold text-sm ${isSpecial ? "text-gold-900" : "text-indigo-900"}`}>{title}</h3>
              <Badge className={isSpecial ? "bg-gold-500 text-indigo-900" : "bg-indigo-600"}>{points} pts</Badge>
            </div>
            <p className="text-xs text-indigo-600 mt-1">{expires}</p>
            <Button
              className={`mt-2 h-8 text-xs ${
                isSpecial
                  ? "bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-indigo-900"
                  : "bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white"
              }`}
            >
              Redeem for {tokenCost} PATA
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

