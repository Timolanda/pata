"use client"

import type React from "react"
import { useCallback } from "react"
import Image from "next/image"
import { Trophy, Award, Gift, Clock, MapPin, Ticket, ShoppingBag, Utensils } from "lucide-react"
import { Button, type ButtonProps } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useRouter } from "next/navigation"

// Import profile button components
import { EditProfileButton } from "@/components/profile/buttons/edit-profile-button"
import { AchievementBadgeButton } from "@/components/profile/buttons/achievement-badge-button"
import { RedeemButton } from "@/components/profile/buttons/redeem-button"
import { CommunityButton } from "@/components/community/community-button"

export function ProfileScreen() {
  const userPoints = 1250
  const router = useRouter()

  const handleNavigate = useCallback((destination: string) => {
    router.push(`/${destination}`)
  }, [router])

  return (
    <div className="h-full bg-indigo-50">
      <div className="relative h-40 bg-indigo-800">
        <Image
          src="/placeholder.svg?height=160&width=400"
          alt="Profile Banner"
          fill
          className="object-cover opacity-70"
        />
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-indigo-900 to-transparent" />
      </div>

      <div className="relative px-4 pb-4">
        <div className="flex items-end -mt-16 mb-4">
          <div className="relative w-24 h-24 rounded-full border-4 border-indigo-50 overflow-hidden bg-indigo-200">
            <Image src="/placeholder.svg?height=96&width=96" alt="Profile Picture" fill className="object-cover" />
          </div>
          <div className="ml-4 mb-2">
            <h1 className="text-xl font-bold text-indigo-900">Amara Okafor</h1>
            <p className="text-sm text-indigo-700">Explorer Level 5</p>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Trophy className="h-5 w-5 text-sunset-600 mr-1" />
            <span className="font-bold text-indigo-800">{userPoints} PATA Points</span>
          </div>
          <div className="flex gap-2">
            <EditProfileButton />
            <CommunityButton variant="outline" />
            <Button
              variant="outline"
              className="border-sunset-600 text-indigo-800 hover:bg-indigo-100"
              onClick={() => handleNavigate('partner')}
            >
              Partner Page
            </Button>
          </div>
        </div>

        <Card className="bg-indigo-100 border-indigo-300 mb-6">
          <CardContent className="p-4">
            <h2 className="text-lg font-bold text-indigo-900 mb-2">Explorer Progress</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-indigo-800">Level 5</span>
                  <span className="text-indigo-800">Level 6</span>
                </div>
                <Progress value={65} className="h-2 bg-indigo-200" />
                <p className="text-xs text-indigo-700 mt-1">750 more points to reach Level 6</p>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <StatCard icon={<MapPin className="h-4 w-4" />} value="24" label="Places" />
                <StatCard icon={<Award className="h-4 w-4" />} value="12" label="Badges" />
                <StatCard icon={<Clock className="h-4 w-4" />} value="8" label="Days" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="badges" className="w-full">
          <TabsList className="grid grid-cols-2 bg-indigo-700 text-indigo-100 rounded-none">
            <TabsTrigger value="badges" className="data-[state=active]:bg-indigo-800">
              Badges
            </TabsTrigger>
            <TabsTrigger value="rewards" className="data-[state=active]:bg-indigo-800">
              Rewards
            </TabsTrigger>
          </TabsList>

          <TabsContent value="badges" className="mt-4">
            <h2 className="text-lg font-bold text-indigo-900 mb-3">Achievement Badges</h2>
            <ScrollArea className="h-[280px]">
              <div className="space-y-2">
                <AchievementBadgeButton
                  badge={{
                    id: "market-explorer",
                    name: "Market Explorer",
                    description: "Visited 5 local markets",
                    icon: "shopping",
                    unlocked: true,
                    dateEarned: "Oct 15, 2023",
                    rarity: "uncommon",
                    points: 150,
                  }}
                  variant="outline"
                  className="w-full"
                />

                <AchievementBadgeButton
                  badge={{
                    id: "food-connoisseur",
                    name: "Food Connoisseur",
                    description: "Tried 3 local dishes",
                    icon: "utensils",
                    unlocked: true,
                    dateEarned: "Oct 10, 2023",
                    rarity: "common",
                    points: 100,
                  }}
                  variant="outline"
                  className="w-full"
                />

                <AchievementBadgeButton
                  badge={{
                    id: "city-wanderer",
                    name: "City Wanderer",
                    description: "Explored 10 locations",
                    icon: "map",
                    unlocked: true,
                    dateEarned: "Oct 5, 2023",
                    rarity: "uncommon",
                    points: 200,
                  }}
                  variant="outline"
                  className="w-full"
                />

                <AchievementBadgeButton
                  badge={{
                    id: "first-discovery",
                    name: "First Discovery",
                    description: "Found your first treasure",
                    icon: "award",
                    unlocked: true,
                    dateEarned: "Sep 28, 2023",
                    rarity: "common",
                    points: 50,
                  }}
                  variant="outline"
                  className="w-full"
                />

                <AchievementBadgeButton
                  badge={{
                    id: "top-10",
                    name: "Top 10",
                    description: "Reached top 10 on leaderboard",
                    icon: "trophy",
                    unlocked: false,
                    progress: 15,
                    total: 100,
                    rarity: "rare",
                    points: 300,
                  }}
                  variant="outline"
                  className="w-full"
                />

                <AchievementBadgeButton
                  badge={{
                    id: "week-streak",
                    name: "Week Streak",
                    description: "Used app for 7 days in a row",
                    icon: "calendar",
                    unlocked: false,
                    progress: 4,
                    total: 7,
                    rarity: "uncommon",
                    points: 150,
                  }}
                  variant="outline"
                  className="w-full"
                />
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="rewards" className="mt-4">
            <h2 className="text-lg font-bold text-indigo-900 mb-3">Available Rewards</h2>
            <ScrollArea className="h-[280px]">
              <div className="space-y-3">
                <RewardCard
                  title="15% Off at African Crafts Market"
                  points={500}
                  icon={<ShoppingBag className="h-5 w-5" />}
                  expires="Valid until Dec 31, 2023"
                  userPoints={userPoints}
                />
                <RewardCard
                  title="Free Dessert at Savanna Restaurant"
                  points={300}
                  icon={<Utensils className="h-5 w-5" />}
                  expires="Valid until Nov 15, 2023"
                  userPoints={userPoints}
                />
                <RewardCard
                  title="Museum Entry Ticket"
                  points={800}
                  icon={<Ticket className="h-5 w-5" />}
                  expires="Valid until Jan 31, 2024"
                  userPoints={userPoints}
                />
                <RewardCard
                  title="Cultural Dance Show Discount"
                  points={1200}
                  icon={<Gift className="h-5 w-5" />}
                  expires="Valid until Feb 28, 2024"
                  disabled
                  userPoints={userPoints}
                />
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function StatCard({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="bg-indigo-200 rounded-lg p-2 flex flex-col items-center">
      <div className="text-indigo-700 mb-1">{icon}</div>
      <div className="font-bold text-indigo-900">{value}</div>
      <div className="text-xs text-indigo-700">{label}</div>
    </div>
  )
}

interface RewardCardProps {
  title: string
  points: number
  icon: React.ReactNode
  expires: string
  disabled?: boolean
  userPoints: number
}

function RewardCard({ title, points, icon, expires, disabled = false, userPoints }: RewardCardProps) {
  const canRedeem = userPoints >= points && !disabled

  const handleRedeem = () => {
    if (!canRedeem) return
    window.dispatchEvent(new CustomEvent("redeem-reward", { detail: { title, points } }))
  }

  return (
    <Card className={`bg-white border-indigo-200 ${disabled ? "opacity-50" : ""}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              {icon}
              <h3 className="font-semibold text-indigo-900">{title}</h3>
            </div>
            <p className="text-xs text-indigo-700">{expires}</p>
          </div>
          <div className="flex flex-col items-end">
            <Badge variant="outline" className="mb-2">
              {points} Points
            </Badge>
            <Button
              onClick={handleRedeem}
              disabled={!canRedeem}
              className={canRedeem ? "bg-sunset-600 hover:bg-sunset-700" : "bg-gray-400"}
            >
              Redeem
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

