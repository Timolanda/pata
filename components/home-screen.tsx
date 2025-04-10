"use client"

import type React from "react"
import { useState } from "react"
import Image from "next/image"
import { LibraryIcon as Museum, ShoppingBag, Utensils, Landmark, Trophy, Calendar, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MapComponent } from "@/components/MapComponent"

export function HomeScreen() {
  const [activeTab, setActiveTab] = useState("map")

  const userLocation = { lat: -1.2921, lng: 36.8219 }  // Example user location (could be dynamic)

  return (
    <div className="h-full">
      <header className="bg-indigo-800 text-indigo-50 p-4 flex items-center justify-between">
        <div className="flex items-center">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pata-png-wt-VxqYAG2LvNmiK5xEnJ1S0EqwR4ODPB.png"
            alt="PATA"
            width={32}
            height={32}
            className="mr-2"
          />
          <h1 className="text-2xl font-bold">PATA</h1>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-indigo-700 text-indigo-50 border-indigo-600">
            <Trophy className="w-4 h-4 mr-1" /> 1250 pts
          </Badge>
        </div>
      </header>

      <Tabs defaultValue="map" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 bg-indigo-700 text-indigo-100 rounded-none">
          <TabsTrigger value="map" className="data-[state=active]:bg-indigo-800">
            Map View
          </TabsTrigger>
          <TabsTrigger value="challenges" className="data-[state=active]:bg-indigo-800">
            Challenges
          </TabsTrigger>
        </TabsList>

        <TabsContent value="map" className="m-0">
          <div className="relative h-[300px] border-b-4 border-indigo-800">
            <MapComponent
              userLocation={userLocation} // Pass userLocation here
              treasureLocation={{ lat: -1.2921, lng: 36.8219 }} // Example location for a treasure
              zoom={15}
              className="w-full h-full"
            />
          </div>

          <div className="p-4 bg-indigo-50">
            <h2 className="text-lg font-bold text-indigo-900 mb-3">Treasure Categories</h2>
            <div className="grid grid-cols-4 gap-2">
              <CategoryButton icon={<Museum className="h-6 w-6" />} label="Museums" />
              <CategoryButton icon={<ShoppingBag className="h-6 w-6" />} label="Markets" />
              <CategoryButton icon={<Utensils className="h-6 w-6" />} label="Food" />
              <CategoryButton icon={<Landmark className="h-6 w-6" />} label="Culture" />
            </div>
          </div>

          <div className="p-4 bg-indigo-50">
            <h2 className="text-lg font-bold text-indigo-900 mb-3">Nearby Treasures</h2>
            <ScrollArea className="h-[200px]">
              <div className="space-y-3">
                <TreasureCard
                  title="National Museum"
                  distance="0.5 km"
                  points={150}
                  category="Museums"
                  image="/placeholder.svg?height=80&width=80"
                />
                <TreasureCard
                  title="Maasai Market"
                  distance="1.2 km"
                  points={100}
                  category="Markets"
                  image="/placeholder.svg?height=80&width=80"
                />
                <TreasureCard
                  title="Swahili Cuisine"
                  distance="0.8 km"
                  points={120}
                  category="Food"
                  image="/placeholder.svg?height=80&width=80"
                />
              </div>
            </ScrollArea>
          </div>
        </TabsContent>

        <TabsContent value="challenges" className="m-0 p-4 bg-indigo-50">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-indigo-900 mb-3 flex items-center">
              <Calendar className="mr-2 h-5 w-5" /> Daily Challenges
            </h2>
            <Card className="bg-indigo-100 border-indigo-300">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <ChallengeItem title="Visit 3 Museums" progress={1} total={3} reward={300} />
                  <ChallengeItem title="Try a Local Dish" progress={0} total={1} reward={150} />
                  <ChallengeItem title="Collect Market Treasures" progress={2} total={5} reward={500} />
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <h2 className="text-lg font-bold text-indigo-900 mb-3 flex items-center">
              <Trophy className="mr-2 h-5 w-5" /> Leaderboard
            </h2>
            <Card className="bg-indigo-100 border-indigo-300">
              <CardContent className="p-4">
                <div className="space-y-2">
                  <LeaderboardItem rank={1} name="Kwame A." points={3250} />
                  <LeaderboardItem rank={2} name="Amara T." points={2980} />
                  <LeaderboardItem rank={3} name="Jamal K." points={2740} />
                  <LeaderboardItem rank={4} name="You" points={1250} isUser />
                  <LeaderboardItem rank={5} name="Zara M." points={1100} />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function CategoryButton({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <Button
      variant="outline"
      className="flex flex-col items-center justify-center h-20 bg-indigo-100 border-indigo-300 hover:bg-indigo-200 text-indigo-900"
    >
      {icon}
      <span className="mt-1 text-xs">{label}</span>
    </Button>
  )
}

function TreasureCard({
  title,
  distance,
  points,
  category,
  image,
}: {
  title: string
  distance: string
  points: number
  category: string
  image: string
}) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="flex">
          <div className="w-20 h-20 relative">
            <Image src={image || "/placeholder.svg"} alt={title} fill className="object-cover" />
          </div>
          <div className="p-3 flex-1">
            <div className="flex justify-between items-start">
              <h3 className="font-bold text-indigo-900">{title}</h3>
              <Badge className="bg-sunset-600">{points} pts</Badge>
            </div>
            <p className="text-xs text-indigo-700">{category}</p>
            <p className="text-xs text-indigo-600 mt-1">{distance} away</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function ChallengeItem({
  title,
  progress,
  total,
  reward,
}: {
  title: string
  progress: number
  total: number
  reward: number
}) {
  const percentage = (progress / total) * 100

  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-indigo-900">{title}</span>
        <Badge className="bg-sunset-600">{reward} pts</Badge>
      </div>
      <div className="w-full bg-indigo-200 rounded-full h-2.5">
        <div className="bg-sunset-600 h-2.5 rounded-full" style={{ width: `${percentage}%` }}></div>
      </div>
      <div className="text-xs text-right mt-1 text-indigo-700">
        {progress} of {total} completed
      </div>
    </div>
  )
}

function LeaderboardItem({
  rank,
  name,
  points,
  isUser = false,
}: {
  rank: number
  name: string
  points: number
  isUser?: boolean
}) {
  return (
    <div className={`flex items-center ${isUser ? "bg-indigo-100" : ""}`}>
      <span className={`mr-2 w-6 text-center font-semibold ${isUser ? "text-indigo-900" : ""}`}>{rank}</span>
      <span className="flex-1 text-sm">{name}</span>
      <span className={`font-bold ${isUser ? "text-indigo-900" : "text-indigo-700"}`}>{points} pts</span>
    </div>
  )
}
