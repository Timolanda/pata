"use client"

import type React from "react"

import Image from "next/image"
import { Trophy, Award, Gift, Clock, MapPin, Ticket, ShoppingBag, Utensils } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

export function ProfileScreen() {
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
            <span className="font-bold text-indigo-800">1,250 PATA Points</span>
          </div>
          <div className="flex gap-2">
            <Button className="bg-sunset-600 hover:bg-sunset-700 text-indigo-50">Edit Profile</Button>
            <Button
              variant="outline"
              className="border-sunset-600 text-indigo-800 hover:bg-indigo-100"
              onClick={() => window.dispatchEvent(new CustomEvent("navigate", { detail: "partner" }))}
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
              <div className="grid grid-cols-3 gap-4">
                <BadgeCard
                  icon={<ShoppingBag className="h-8 w-8" />}
                  title="Market Explorer"
                  description="Visited 5 local markets"
                />
                <BadgeCard
                  icon={<Utensils className="h-8 w-8" />}
                  title="Food Connoisseur"
                  description="Tried 3 local dishes"
                />
                <BadgeCard
                  icon={<MapPin className="h-8 w-8" />}
                  title="City Wanderer"
                  description="Explored 10 locations"
                />
                <BadgeCard
                  icon={<Award className="h-8 w-8" />}
                  title="First Discovery"
                  description="Found your first treasure"
                />
                <BadgeCard
                  icon={<Trophy className="h-8 w-8" />}
                  title="Top 10"
                  description="Reached top 10 on leaderboard"
                  locked
                />
                <BadgeCard
                  icon={<Clock className="h-8 w-8" />}
                  title="Week Streak"
                  description="Used app for 7 days in a row"
                  locked
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
                />
                <RewardCard
                  title="Free Dessert at Savanna Restaurant"
                  points={300}
                  icon={<Utensils className="h-5 w-5" />}
                  expires="Valid until Nov 15, 2023"
                />
                <RewardCard
                  title="Museum Entry Ticket"
                  points={800}
                  icon={<Ticket className="h-5 w-5" />}
                  expires="Valid until Jan 31, 2024"
                />
                <RewardCard
                  title="Cultural Dance Show Discount"
                  points={1200}
                  icon={<Gift className="h-5 w-5" />}
                  expires="Valid until Feb 28, 2024"
                  disabled
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

function BadgeCard({
  icon,
  title,
  description,
  locked = false,
}: {
  icon: React.ReactNode
  title: string
  description: string
  locked?: boolean
}) {
  return (
    <div
      className={`bg-indigo-100 border ${locked ? "border-indigo-300" : "border-indigo-400"} rounded-lg p-3 flex flex-col items-center text-center ${locked ? "opacity-50" : ""}`}
    >
      <div className={`mb-2 ${locked ? "text-indigo-500" : "text-sunset-600"}`}>{icon}</div>
      <h3 className="font-bold text-indigo-900 text-sm">{title}</h3>
      <p className="text-xs text-indigo-700 mt-1">{description}</p>
      {locked && <Badge className="mt-2 bg-indigo-300 text-indigo-800 text-[10px]">Locked</Badge>}
    </div>
  )
}

function RewardCard({
  title,
  points,
  icon,
  expires,
  disabled = false,
}: {
  title: string
  points: number
  icon: React.ReactNode
  expires: string
  disabled?: boolean
}) {
  return (
    <Card className={`overflow-hidden ${disabled ? "opacity-60" : ""}`}>
      <CardContent className="p-0">
        <div className="flex">
          <div className="w-16 h-16 bg-indigo-200 flex items-center justify-center">
            <div className="text-sunset-600">{icon}</div>
          </div>
          <div className="p-3 flex-1">
            <div className="flex justify-between items-start">
              <h3 className="font-bold text-indigo-900 text-sm">{title}</h3>
              <Badge className="bg-sunset-600">{points} pts</Badge>
            </div>
            <p className="text-xs text-indigo-600 mt-1">{expires}</p>
            <Button className="mt-2 h-8 text-xs bg-sunset-600 hover:bg-sunset-700 text-indigo-50" disabled={disabled}>
              {disabled ? "Not Enough Points" : "Redeem"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

