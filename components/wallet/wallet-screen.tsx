"use client"

import { useState } from "react"
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
  History,
  Gift,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "@/hooks/use-toast"
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount, useBalance } from 'wagmi'
import { formatEther } from 'viem'
import { SendButton } from './buttons/send-button'
import { ReceiveButton } from './buttons/receive-button'
import { TransactionHistory } from './transaction-history'
import { Rewards } from './rewards'

// Replace this with your deployed PATA token address
const PATA_TOKEN_ADDRESS = '0x0000000000000000000000000000000000000000'

export function WalletScreen() {
  const [activeTab, setActiveTab] = useState('balance')
  const { address, isConnected } = useAccount()
  const { data: balance } = useBalance({
    address,
    token: PATA_TOKEN_ADDRESS as `0x${string}`,
  })

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-indigo-50 p-4">
        <Card className="w-full max-w-md bg-white">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-indigo-900">Connect Wallet</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <p className="text-indigo-700 text-center mb-4">
              Connect your wallet to view your PATA tokens and rewards
            </p>
            <ConnectButton />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-indigo-50 p-4">
      <Card className="w-full max-w-2xl mx-auto bg-white">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold text-indigo-900">PATA Wallet</CardTitle>
            <ConnectButton />
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 gap-4 mb-6">
              <TabsTrigger value="balance" className="flex items-center gap-2">
                <Wallet className="h-4 w-4" />
                Balance
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <History className="h-4 w-4" />
                History
              </TabsTrigger>
              <TabsTrigger value="rewards" className="flex items-center gap-2">
                <Gift className="h-4 w-4" />
                Rewards
              </TabsTrigger>
            </TabsList>

            <TabsContent value="balance">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium text-indigo-700">PATA Balance</h3>
                      <p className="text-3xl font-bold text-indigo-900">
                        {balance ? formatEther(balance.value) : '0.00'} PATA
                      </p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-indigo-700">Wallet Address</h3>
                      <p className="text-sm text-indigo-900 font-mono">
                        {address}
                      </p>
                    </div>

                    <div className="flex gap-4">
                      <SendButton tokenAddress={PATA_TOKEN_ADDRESS} />
                      <ReceiveButton />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history">
              <Card>
                <CardContent className="pt-6">
                  <TransactionHistory tokenAddress={PATA_TOKEN_ADDRESS} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="rewards">
              <Card>
                <CardContent className="pt-6">
                  <Rewards />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
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

