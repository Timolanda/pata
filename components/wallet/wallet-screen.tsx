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
  Gift,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "@/hooks/use-toast"
import { ConnectWallet, Wallet as OnchainWallet, WalletDropdown, WalletDropdownDisconnect } from '@coinbase/onchainkit/wallet'
import { useAccount, useBalance, useChainId, useContractRead, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { PATA_TOKEN_ADDRESSES, PATA_TOKEN_ABI, REWARD_NFT_ADDRESSES, REWARD_NFT_ABI } from '@/config/web3'
import { parseEther, formatEther } from 'viem'
import { SendButton } from './buttons/send-button'
import { ReceiveButton } from './buttons/receive-button'
import { TransactionHistory } from './transaction-history'
import { Rewards } from './rewards'
import { Progress } from '@/components/ui/progress'
import { useToast } from '@/components/ui/use-toast'

export function WalletScreen() {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const [showQR, setShowQR] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isClaiming, setIsClaiming] = useState(false)
  const [burnAmount, setBurnAmount] = useState('100')
  const { toast } = useToast()

  // Get PATA token balance
  const { data: pataTokenData, error: balanceError } = useBalance({
    address: address as `0x${string}` | undefined,
    token: chainId ? (PATA_TOKEN_ADDRESSES[chainId as keyof typeof PATA_TOKEN_ADDRESSES] as `0x${string}`) : undefined,
  })

  // Contract write hooks
  const { writeContract: burnTokens } = useWriteContract()
  const { writeContract: mintNFT } = useWriteContract()

  // Transaction receipt hooks
  const { data: burnReceipt, isPending: isBurnPending } = useWaitForTransactionReceipt()
  const { data: mintReceipt, isPending: isMintPending } = useWaitForTransactionReceipt()

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

  const handleBurnAndMint = async () => {
    if (!address) {
      toast({
        title: 'Error',
        description: 'Please connect your wallet first',
        variant: 'destructive',
      })
      return
    }

    try {
      setIsLoading(true)

      // Burn PATA tokens
      const burnResult = await burnTokens({
        abi: PATA_TOKEN_ABI,
        address: PATA_TOKEN_ADDRESSES[1] as `0x${string}`,
        functionName: 'burn',
        args: [parseEther(burnAmount)],
      })

      if (!burnResult) {
        throw new Error('Burn transaction failed')
      }

      // Wait for burn transaction to be mined
      const burnTxReceipt = await burnReceipt
      if (!burnTxReceipt) {
        throw new Error('Failed to get burn transaction receipt')
      }

      // Mint NFT
      const mintResult = await mintNFT({
        abi: REWARD_NFT_ABI,
        address: REWARD_NFT_ADDRESSES[1] as `0x${string}`,
        functionName: 'mint',
        args: [address],
      })

      if (!mintResult) {
        throw new Error('Mint transaction failed')
      }

      // Wait for mint transaction to be mined
      const mintTxReceipt = await mintReceipt
      if (!mintTxReceipt) {
        throw new Error('Failed to get mint transaction receipt')
      }

      toast({
        title: 'Success',
        description: 'Successfully burned PATA tokens and minted NFT',
      })
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = () => {
    if (address) {
      navigator.clipboard.writeText(address)
    toast({
      title: "Address Copied",
      description: "Wallet address copied to clipboard",
    })
    }
  }

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
            <OnchainWallet>
              <ConnectWallet>
                <Wallet className="h-6 w-6 mr-2" />
                <span>Connect Wallet</span>
              </ConnectWallet>
              <WalletDropdown>
                <WalletDropdownDisconnect />
              </WalletDropdown>
            </OnchainWallet>
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
            <OnchainWallet>
              <WalletDropdown>
                <WalletDropdownDisconnect />
              </WalletDropdown>
            </OnchainWallet>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="balance">
            <TabsList className="grid grid-cols-3 gap-4 mb-6">
              <TabsTrigger value="balance" className="flex items-center gap-2">
                <Wallet className="h-4 w-4" />
                Balance
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
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
                        {isLoading ? (
                          <span className="animate-pulse">Loading...</span>
                        ) : (
                          `${pataTokenData?.formatted || '0'} PATA`
                        )}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-indigo-700">Wallet Address</h3>
                      <p className="text-sm text-indigo-900 font-mono">
                        {address}
                      </p>
                    </div>

                    <div className="flex gap-4">
                      <Button
                        className="flex-1 bg-sunset-600 hover:bg-sunset-700"
                        onClick={() => setShowQR(true)}
                      >
                        <ArrowDownLeft className="mr-2 h-4 w-4" />
                        Receive
                      </Button>
                      <Button
                        className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                        onClick={handleCopy}
                      >
                        <Copy className="mr-2 h-4 w-4" />
                        Copy Address
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history">
              <Card>
                <CardContent className="pt-6">
                  <TransactionHistory tokenAddress={PATA_TOKEN_ADDRESSES[chainId as keyof typeof PATA_TOKEN_ADDRESSES] as `0x${string}`} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="rewards">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <div className="text-center">
                      <h3 className="text-lg font-bold text-indigo-900 mb-2">Claim Your Reward</h3>
                      <p className="text-sm text-indigo-700 mb-4">
                        Burn 100 PATA tokens to mint a unique reward NFT
                      </p>
                      <Button
                        className="bg-gold-600 hover:bg-gold-700"
                        onClick={handleBurnAndMint}
                        disabled={isLoading || !address}
                      >
                        {isLoading ? 'Processing...' : 'Burn & Mint'}
                      </Button>
                    </div>

                    {(isBurnPending || isMintPending) && (
                      <Progress value={isBurnPending ? 50 : 100} className="w-full" />
                    )}
                  </div>
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

// Test addresses (Base Sepolia)
PATA_TOKEN_ADDRESSES[84532] = '0x1234567890123456789012345678901234567890'
REWARD_NFT_ADDRESSES[84532] = '0x0987654321098765432109876543210987654321'

