"use client"

import { useState } from "react"
import Image from "next/image"
import { Gift, Tag, MapPin, Calendar, QrCode, Check, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "@/hooks/use-toast"

interface RewardRedemptionButtonProps {
  variant?: "default" | "outline" | "secondary" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
  balance?: number
}

export function RewardRedemptionButton({
  variant = "default",
  size = "default",
  className = "",
  balance = 1250,
}: RewardRedemptionButtonProps) {
  const [open, setOpen] = useState(false)
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null)
  const [confirmRedeem, setConfirmRedeem] = useState(false)
  const [showQR, setShowQR] = useState(false)

  const handleSelectReward = (reward: Reward) => {
    if (reward.cost > balance) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough PATA tokens for this reward",
        variant: "destructive",
      })
      return
    }

    setSelectedReward(reward)
    setConfirmRedeem(true)
  }

  const handleConfirmRedeem = () => {
    if (!selectedReward) return

    setShowQR(true)
  }

  const handleFinishRedemption = () => {
    toast({
      title: "Reward Redeemed",
      description: `You've successfully redeemed "${selectedReward?.title}"`,
    })

    setOpen(false)
    setSelectedReward(null)
    setConfirmRedeem(false)
    setShowQR(false)
  }

  const handleBack = () => {
    if (showQR) {
      setShowQR(false)
    } else {
      setConfirmRedeem(false)
      setSelectedReward(null)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        setOpen(newOpen)
        if (!newOpen) {
          setSelectedReward(null)
          setConfirmRedeem(false)
          setShowQR(false)
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant={variant} size={size} className={`bg-gold-600 hover:bg-gold-700 text-indigo-900 ${className}`}>
          <Gift className="mr-2 h-4 w-4" />
          Reward Redemption
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] border-gold-300 bg-gradient-to-b from-indigo-50 to-gold-50">
        <DialogHeader>
          <DialogTitle className="text-indigo-900 flex items-center">
            <Gift className="mr-2 h-5 w-5 text-gold-600" />
            Reward Redemption
          </DialogTitle>
          <DialogDescription className="text-indigo-700">
            Exchange your PATA tokens for real-world rewards
          </DialogDescription>
        </DialogHeader>

        {showQR && selectedReward ? (
          <div className="py-4 space-y-4">
            <div className="bg-white p-4 rounded-lg border border-gold-200 flex flex-col items-center">
              <h3 className="font-bold text-indigo-900 mb-3">Redemption Code</h3>

              <div className="bg-indigo-100 p-4 rounded-lg border border-indigo-200 mb-4">
                <div className="relative w-64 h-64">
                  <Image
                    src="/placeholder.svg?height=256&width=256"
                    alt="QR Code"
                    width={256}
                    height={256}
                    className="object-contain"
                  />
                </div>
              </div>

              <div className="text-center mb-4">
                <h4 className="font-bold text-indigo-900">{selectedReward.title}</h4>
                <p className="text-sm text-indigo-700 mt-1">Show this QR code to the partner to redeem your reward</p>
                <p className="text-sm font-mono text-indigo-900 mt-2">
                  CODE: PATA-{Math.random().toString(36).substring(2, 10).toUpperCase()}
                </p>
              </div>

              <div className="bg-gold-100 p-3 rounded-lg border border-gold-200 w-full">
                <div className="flex items-start">
                  <Info className="h-5 w-5 text-gold-600 mr-2 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-indigo-900">Redemption Details</h4>
                    <p className="text-sm text-indigo-700">Valid at: {selectedReward.partner}</p>
                    <p className="text-sm text-indigo-700">Location: {selectedReward.location}</p>
                    <p className="text-sm text-indigo-700">Expires: {selectedReward.expires}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-2 pt-2">
              <Button variant="outline" className="flex-1 border-indigo-300" onClick={handleBack}>
                Back
              </Button>
              <Button className="flex-1 bg-gold-600 hover:bg-gold-700 text-indigo-900" onClick={handleFinishRedemption}>
                <Check className="mr-2 h-4 w-4" />
                Finish Redemption
              </Button>
            </div>
          </div>
        ) : confirmRedeem && selectedReward ? (
          <div className="py-4 space-y-4">
            <div className="bg-white p-4 rounded-lg border border-gold-200">
              <h3 className="font-bold text-indigo-900 mb-3 text-center">Confirm Redemption</h3>

              <div className="flex items-center justify-center mb-4">
                <div className="relative w-24 h-24 mr-4">
                  <Image
                    src="/placeholder.svg?height=96&width=96"
                    alt={selectedReward.title}
                    width={96}
                    height={96}
                    className="object-contain rounded-lg border border-indigo-200"
                  />
                </div>

                <div>
                  <h4 className="font-bold text-indigo-900">{selectedReward.title}</h4>
                  <div className="flex items-center text-sm text-indigo-700 mt-1">
                    <MapPin className="h-3 w-3 mr-1" />
                    {selectedReward.partner}
                  </div>
                  <Badge className="mt-2 bg-gold-600 text-indigo-900">{selectedReward.cost} PATA</Badge>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-indigo-700">Your Balance:</span>
                  <span className="text-indigo-900">{balance} PATA</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-indigo-700">Reward Cost:</span>
                  <span className="text-indigo-900">-{selectedReward.cost} PATA</span>
                </div>

                <div className="border-t border-indigo-200 pt-2 mt-2">
                  <div className="flex justify-between">
                    <span className="font-bold text-indigo-700">Remaining Balance:</span>
                    <span className="font-bold text-indigo-900">{balance - selectedReward.cost} PATA</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gold-100 p-3 rounded-lg border border-gold-200">
              <div className="flex items-start">
                <Calendar className="h-5 w-5 text-gold-600 mr-2 mt-0.5" />
                <div>
                  <h4 className="font-medium text-indigo-900">Reward Details</h4>
                  <p className="text-sm text-indigo-700">{selectedReward.description}</p>
                  <p className="text-sm font-medium text-indigo-900 mt-1">Expires: {selectedReward.expires}</p>
                </div>
              </div>
            </div>

            <div className="flex space-x-2 pt-2">
              <Button variant="outline" className="flex-1 border-indigo-300" onClick={handleBack}>
                Back
              </Button>
              <Button className="flex-1 bg-gold-600 hover:bg-gold-700 text-indigo-900" onClick={handleConfirmRedeem}>
                <QrCode className="mr-2 h-4 w-4" />
                Generate Redemption Code
              </Button>
            </div>
          </div>
        ) : (
          <div className="py-4 space-y-4">
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid grid-cols-3 bg-indigo-100 text-indigo-900">
                <TabsTrigger
                  value="all"
                  className="data-[state=active]:bg-gold-600 data-[state=active]:text-indigo-900"
                >
                  All Rewards
                </TabsTrigger>
                <TabsTrigger
                  value="nearby"
                  className="data-[state=active]:bg-gold-600 data-[state=active]:text-indigo-900"
                >
                  Nearby
                </TabsTrigger>
                <TabsTrigger
                  value="popular"
                  className="data-[state=active]:bg-gold-600 data-[state=active]:text-indigo-900"
                >
                  Popular
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold text-indigo-900">Available Rewards</h3>
                  <Badge className="bg-indigo-600">Balance: {balance} PATA</Badge>
                </div>

                <ScrollArea className="h-[300px] pr-2">
                  <div className="space-y-3">
                    {availableRewards.map((reward, index) => (
                      <RewardCard
                        key={index}
                        reward={reward}
                        balance={balance}
                        onSelect={() => handleSelectReward(reward)}
                      />
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="nearby" className="mt-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold text-indigo-900">Nearby Rewards</h3>
                  <Badge className="bg-indigo-600">Within 2km</Badge>
                </div>

                <ScrollArea className="h-[300px] pr-2">
                  <div className="space-y-3">
                    {availableRewards
                      .filter((reward) => reward.distance && reward.distance <= 2)
                      .map((reward, index) => (
                        <RewardCard
                          key={index}
                          reward={reward}
                          balance={balance}
                          onSelect={() => handleSelectReward(reward)}
                        />
                      ))}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="popular" className="mt-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold text-indigo-900">Popular Rewards</h3>
                  <Badge className="bg-indigo-600">Most Redeemed</Badge>
                </div>

                <ScrollArea className="h-[300px] pr-2">
                  <div className="space-y-3">
                    {availableRewards
                      .filter((reward) => reward.popular)
                      .map((reward, index) => (
                        <RewardCard
                          key={index}
                          reward={reward}
                          balance={balance}
                          onSelect={() => handleSelectReward(reward)}
                        />
                      ))}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>

            <div className="bg-indigo-100 p-3 rounded-lg border border-indigo-200">
              <div className="flex items-start">
                <Gift className="h-5 w-5 text-gold-600 mr-2 mt-0.5" />
                <div>
                  <h4 className="font-medium text-indigo-900">How Redemption Works</h4>
                  <p className="text-sm text-indigo-700">
                    Select a reward, confirm your redemption, and show the generated QR code to the partner to claim
                    your reward.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

interface Reward {
  title: string
  description: string
  partner: string
  location: string
  expires: string
  cost: number
  distance?: number
  popular?: boolean
  type: "discount" | "product" | "experience" | "ticket"
}

const availableRewards: Reward[] = [
  {
    title: "15% Off at African Crafts Market",
    description: "Get 15% off your purchase of any handcrafted items",
    partner: "African Crafts Market",
    location: "Central Market, Nairobi",
    expires: "Dec 31, 2023",
    cost: 150,
    distance: 0.8,
    popular: true,
    type: "discount",
  },
  {
    title: "Free Dessert at Savanna Restaurant",
    description: "Enjoy a complimentary traditional dessert with any main course",
    partner: "Savanna Cuisine Restaurant",
    location: "Downtown, Cape Town",
    expires: "Nov 15, 2023",
    cost: 100,
    distance: 1.5,
    popular: true,
    type: "product",
  },
  {
    title: "Museum Entry Ticket",
    description: "One free entry to the National Museum of African Art",
    partner: "National Museum",
    location: "Cultural District, Lagos",
    expires: "Jan 31, 2024",
    cost: 200,
    distance: 3.2,
    type: "ticket",
  },
  {
    title: "Cultural Dance Show Discount",
    description: "50% off tickets to the weekly cultural dance performance",
    partner: "Heritage Theater",
    location: "Arts Quarter, Accra",
    expires: "Feb 28, 2024",
    cost: 300,
    distance: 5.7,
    type: "discount",
  },
  {
    title: "Exclusive Safari Tour",
    description: "Special guided tour of wildlife sanctuary with expert guides",
    partner: "Savanna Expeditions",
    location: "National Park Entrance",
    expires: "Mar 15, 2024",
    cost: 500,
    distance: 12.4,
    popular: true,
    type: "experience",
  },
  {
    title: "Traditional Cooking Class",
    description: "Learn to prepare authentic African dishes with local chefs",
    partner: "Taste of Africa Culinary School",
    location: "Food District, Johannesburg",
    expires: "Apr 30, 2024",
    cost: 350,
    distance: 1.2,
    type: "experience",
  },
]

function RewardCard({
  reward,
  balance,
  onSelect,
}: {
  reward: Reward
  balance: number
  onSelect: () => void
}) {
  const typeIcons = {
    discount: <Tag className="h-5 w-5" />,
    product: <Gift className="h-5 w-5" />,
    experience: <Calendar className="h-5 w-5" />,
    ticket: <QrCode className="h-5 w-5" />,
  }

  const canAfford = balance >= reward.cost

  return (
    <div
      className={`p-3 rounded-lg border ${canAfford ? "border-indigo-200 bg-white" : "border-indigo-200 bg-indigo-50 opacity-70"}`}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-start">
          <div className="bg-gold-100 p-2 rounded-full mr-3 text-gold-600">{typeIcons[reward.type]}</div>
          <div>
            <h4 className="font-bold text-indigo-900">{reward.title}</h4>
            <div className="flex items-center text-xs text-indigo-600 mt-1">
              <MapPin className="h-3 w-3 mr-1" />
              {reward.partner}
              {reward.distance && (
                <>
                  <span className="mx-1">•</span>
                  <span>{reward.distance} km away</span>
                </>
              )}
            </div>
            <p className="text-xs text-indigo-700 mt-1">Expires: {reward.expires}</p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <Badge className={`${canAfford ? "bg-gold-600 text-indigo-900" : "bg-indigo-400"}`}>{reward.cost} PATA</Badge>
          <Button
            size="sm"
            className="mt-2 bg-gold-600 hover:bg-gold-700 text-indigo-900"
            disabled={!canAfford}
            onClick={onSelect}
          >
            Redeem
          </Button>
        </div>
      </div>
    </div>
  )
}

