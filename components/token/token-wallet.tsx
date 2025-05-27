"use client"

import { useState, useEffect } from "react"
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
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "@/hooks/use-toast"
import { useConnect, useDisconnect } from 'wagmi'
import { useAccount, useBalance, useChainId, useContractRead, useWriteContract, useWaitForTransactionReceipt, useContractReads } from 'wagmi'
import { PATA_TOKEN_ADDRESSES, PATA_TOKEN_ABI, REWARD_NFT_ADDRESSES, REWARD_NFT_ABI } from '@/config/web3'
import { parseEther, formatEther } from 'viem'
import { useQuery } from '@tanstack/react-query'
import { base, baseSepolia } from 'viem/chains'

// Add local network configuration
const localNetwork = {
  id: 31337,
  name: 'Hardhat Local',
  network: 'hardhat',
  nativeCurrency: {
    decimals: 18,
    name: 'Ethereum',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: { http: ['http://127.0.0.1:8545'] },
    public: { http: ['http://127.0.0.1:8545'] },
  },
} as const

// Update the staking contract addresses type
const STAKING_CONTRACT_ADDRESSES: { [key: number]: `0x${string}` } = {
  [base.id]: "0x...", // Add your mainnet staking contract address
  [baseSepolia.id]: "0x...", // Add your testnet staking contract address
  [localNetwork.id]: "0x..." // Add your local network staking contract address
} as const

// Staking contract ABI and addresses
const STAKING_CONTRACT_ABI = [
  {
    "inputs": [
      { "internalType": "uint256", "name": "amount", "type": "uint256" }
    ],
    "name": "stake",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "unstake",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "claimRewards",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "user", "type": "address" }
    ],
    "name": "getStakedBalance",
    "outputs": [
      { "internalType": "uint256", "name": "", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "user", "type": "address" }
    ],
    "name": "getRewards",
    "outputs": [
      { "internalType": "uint256", "name": "", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const

// Add NFT metadata interface
interface NFTMetadata {
  name: string
  description: string
  image: string
  attributes: {
    trait_type: string
    value: string
  }[]
}

// Add transaction interface
interface Transaction {
  hash: string
  type: 'send' | 'receive' | 'mint' | 'stake' | 'upgrade'
  amount: string
  description: string
  time: string
  status: 'pending' | 'completed' | 'failed'
}

export function TokenWallet() {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const [showQR, setShowQR] = useState(false)
  const [isStaking, setIsStaking] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isStakingLoading, setIsStakingLoading] = useState(false)

  // Get PATA token balance
  const { data: pataTokenData, error: balanceError, refetch: refetchBalance } = useBalance({
    address: address as `0x${string}` | undefined,
    token: chainId ? (PATA_TOKEN_ADDRESSES[chainId as keyof typeof PATA_TOKEN_ADDRESSES] as `0x${string}`) : undefined,
  })

  // Get staked balance
  const { data: stakedBalance } = useContractRead({
    address: chainId ? STAKING_CONTRACT_ADDRESSES[chainId] : undefined,
    abi: STAKING_CONTRACT_ABI,
    functionName: 'getStakedBalance',
    args: [address as `0x${string}`],
    query: {
      enabled: !!address && !!chainId,
    }
  })

  // Get staking rewards
  const { data: stakingRewards } = useContractRead({
    address: chainId ? STAKING_CONTRACT_ADDRESSES[chainId] : undefined,
    abi: STAKING_CONTRACT_ABI,
    functionName: 'getRewards',
    args: [address as `0x${string}`],
    query: {
      enabled: !!address && !!chainId,
    }
  })

  // Prepare staking transactions
  const { writeContract: stakeTokens, data: stakeData } = useWriteContract()
  const { writeContract: unstakeTokens, data: unstakeData } = useWriteContract()
  const { writeContract: claimRewards, data: claimData } = useWriteContract()

  // Wait for staking transactions
  const { isLoading: isStakingTx, isSuccess: stakeSuccess } = useWaitForTransactionReceipt({
    hash: stakeData,
  })

  const { isLoading: isUnstakingTx, isSuccess: unstakeSuccess } = useWaitForTransactionReceipt({
    hash: unstakeData,
  })

  const { isLoading: isClaimingTx, isSuccess: claimSuccess } = useWaitForTransactionReceipt({
    hash: claimData,
  })

  // Get NFT balance
  const { data: nftBalance } = useContractRead({
    address: chainId ? REWARD_NFT_ADDRESSES[chainId] : undefined,
    abi: REWARD_NFT_ABI,
    functionName: 'balanceOf',
    args: [address as `0x${string}`],
    query: {
      enabled: !!address && !!chainId,
    }
  })

  // Get NFT token IDs
  const { data: nftTokenIds } = useContractReads({
    contracts: Array.from({ length: Number(nftBalance || 0) }, (_, i) => ({
      address: REWARD_NFT_ADDRESSES[chainId as keyof typeof REWARD_NFT_ADDRESSES] as `0x${string}`,
      abi: REWARD_NFT_ABI,
      functionName: 'tokenOfOwnerByIndex',
      args: [address as `0x${string}`, BigInt(i)],
    })),
    query: {
      enabled: !!address && !!chainId && !!nftBalance && Number(nftBalance) > 0,
    }
  })

  // Get NFT metadata
  const { data: nftMetadata } = useQuery({
    queryKey: ['nftMetadata', nftTokenIds],
    queryFn: async () => {
      if (!nftTokenIds) return []
      
      const metadata: NFTMetadata[] = []
      for (const tokenId of nftTokenIds) {
        try {
          const response = await fetch(`/api/nft-metadata/${tokenId}`)
          const data = await response.json()
          metadata.push(data)
        } catch (error) {
          console.error('Error fetching NFT metadata:', error)
        }
      }
      return metadata
    },
    enabled: !!nftTokenIds,
  })

  // Get transaction history
  const { data: transactions = [] } = useQuery({
    queryKey: ['transactions', address],
    queryFn: async () => {
      if (!address) return []
      
      try {
        const response = await fetch(`/api/transactions/${address}`)
        const data = await response.json()
        return data as Transaction[]
      } catch (error) {
        console.error('Error fetching transactions:', error)
        return []
      }
    },
    enabled: !!address,
  })

  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()

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

  useEffect(() => {
    if (stakeSuccess) {
      toast({
        title: "Staking Successful",
        description: "Your tokens have been staked successfully.",
      })
      refetchBalance()
    }
  }, [stakeSuccess, refetchBalance])

  useEffect(() => {
    if (unstakeSuccess) {
      toast({
        title: "Unstaking Successful",
        description: "Your tokens have been unstaked successfully.",
      })
      refetchBalance()
    }
  }, [unstakeSuccess, refetchBalance])

  useEffect(() => {
    if (claimSuccess) {
      toast({
        title: "Rewards Claimed",
        description: "Your staking rewards have been claimed successfully.",
      })
      refetchBalance()
    }
  }, [claimSuccess, refetchBalance])

  const handleCopy = () => {
    if (address) {
      navigator.clipboard.writeText(address)
      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard",
      })
    }
  }

  const handleStake = async () => {
    if (!address || !chainId) return;
    
    try {
      await stakeTokens({
        address: STAKING_CONTRACT_ADDRESSES[chainId],
        abi: STAKING_CONTRACT_ABI,
        functionName: 'stake',
        args: [parseEther('1')], // Adjust amount as needed
      });
    } catch (error) {
      console.error('Error staking tokens:', error);
    }
  };

  const handleUnstake = async () => {
    if (!address || !chainId) return;
    
    try {
      await unstakeTokens({
        address: STAKING_CONTRACT_ADDRESSES[chainId],
        abi: STAKING_CONTRACT_ABI,
        functionName: 'unstake',
      });
    } catch (error) {
      console.error('Error unstaking tokens:', error);
    }
  };

  const handleClaimRewards = async () => {
    if (!address || !chainId) return;
    
    try {
      await claimRewards({
        address: STAKING_CONTRACT_ADDRESSES[chainId],
        abi: STAKING_CONTRACT_ABI,
        functionName: 'claimRewards',
      });
    } catch (error) {
      console.error('Error claiming rewards:', error);
    }
  };

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
            <Button
              onClick={() => connect({ connector: connectors[0] })}
              className="w-full"
            >
              <Wallet className="mr-2 h-4 w-4" />
              Connect Wallet
            </Button>
          </CardContent>
        </Card>
      </div>
    )
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
                <p className="text-xs text-indigo-200 mt-1">
                  ≈ ${(Number(pataTokenData?.formatted || 0) * 0.1).toFixed(2)} USD
                </p>
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
              {address}
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center">
                <Badge className={`${isStaking ? "bg-jungle-600" : "bg-indigo-600"} mr-2`}>
                  {isStaking ? "Staking Active" : "Not Staking"}
                </Badge>
                {isStaking && (
                  <div className="flex items-center">
                    <span className="text-xs text-jungle-600 mr-2">+5% APY</span>
                    <span className="text-xs text-jungle-600">
                      Rewards: {formatEther(stakingRewards || BigInt(0))} PATA
                    </span>
                  </div>
                )}
              </div>
              <div className="flex space-x-2">
                {isStaking ? (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-indigo-300 text-jungle-600"
                      onClick={handleUnstake}
                      disabled={isStakingLoading || isUnstakingTx}
                    >
                      {isUnstakingTx ? (
                        <Clock className="mr-1 h-4 w-4 animate-spin" />
                      ) : (
                        <Unlock className="mr-1 h-4 w-4" />
                      )}
                      Unstake
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-indigo-300 text-jungle-600"
                      onClick={handleClaimRewards}
                      disabled={isStakingLoading || isClaimingTx || !stakingRewards || stakingRewards === BigInt(0)}
                    >
                      {isClaimingTx ? (
                        <Clock className="mr-1 h-4 w-4 animate-spin" />
                      ) : (
                        <Award className="mr-1 h-4 w-4" />
                      )}
                      Claim Rewards
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-indigo-300 text-indigo-700"
                    onClick={handleStake}
                    disabled={isStakingLoading || isStakingTx || !pataTokenData || Number(pataTokenData.formatted) < 100}
                  >
                    {isStakingTx ? (
                      <Clock className="mr-1 h-4 w-4 animate-spin" />
                    ) : (
                      <Lock className="mr-1 h-4 w-4" />
                    )}
                    Stake Tokens
                  </Button>
                )}
              </div>
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
                    <Badge className="mr-2 bg-indigo-600">
                      {nftBalance?.toString() || '0'} NFTs
                    </Badge>
                    <Button variant="outline" size="sm" className="border-indigo-300">
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {nftMetadata?.map((metadata, index) => (
                    <NFTCard
                      key={nftTokenIds?.[index]?.toString()}
                      name={metadata.name}
                      image={metadata.image}
                      rarity={metadata.attributes.find(attr => attr.trait_type === 'Rarity')?.value as any}
                      acquired={new Date().toLocaleDateString()}
                      tokenId={`#${nftTokenIds?.[index]?.toString()}`}
                    />
                  ))}
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
                  {transactions && transactions.length > 0 ? (
                    transactions.map((transaction) => (
                      <TransactionCard
                        key={transaction.hash}
                        type={transaction.type}
                        amount={transaction.amount}
                        description={transaction.description}
                        time={transaction.time}
                        status={transaction.status}
                        hash={transaction.hash}
                      />
                    ))
                  ) : (
                    <div className="text-center text-muted-foreground py-4">
                      No transactions found
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tokenomics" className="mt-0">
            <Card className="border-t-0 rounded-t-none game-card">
              <CardContent className="p-4">
                <h3 className="text-lg font-bold text-indigo-900 mb-3 flex items-center">
                  <BarChart2 className="mr-2 h-5 w-5 text-electric-600" /> Tokenomics
                </h3>

                <div className="space-y-4">
                  <TokenUtilityItem
                    title="Staking Rewards"
                    description="Earn 5% APY by staking your PATA tokens"
                    icon={<Lock className="h-5 w-5 text-jungle-600" />}
                  />
                  <TokenUtilityItem
                    title="NFT Upgrades"
                    description="Use PATA tokens to upgrade your NFT collection"
                    icon={<Gem className="h-5 w-5 text-electric-600" />}
                  />
                  <TokenUtilityItem
                    title="Community Governance"
                    description="Participate in community decisions with your tokens"
                    icon={<Award className="h-5 w-5 text-gold-600" />}
                  />
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
    <div className="flex items-start space-x-3 p-3 bg-indigo-50 rounded-lg border border-indigo-200">
      <div className="p-2 bg-white rounded-lg">{icon}</div>
      <div>
        <h4 className="font-medium text-indigo-900">{title}</h4>
        <p className="text-sm text-indigo-700">{description}</p>
      </div>
    </div>
  )
}

