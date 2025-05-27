"use client"

import { useState } from "react"
import Image from "next/image"
import { Share2, MessageSquare, Heart, Calendar, Users, MapPin, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

export function CommunityScreen() {
  return (
    <div className="h-full bg-indigo-50">
      <header className="bg-indigo-800 text-indigo-50 p-4">
        <h1 className="text-xl font-bold">Community</h1>
        <p className="text-sm text-indigo-200">Connect with fellow explorers</p>
      </header>

      <Tabs defaultValue="feed" className="w-full">
        <TabsList className="grid grid-cols-2 bg-indigo-700 text-indigo-100 rounded-none">
          <TabsTrigger value="feed" className="data-[state=active]:bg-indigo-800">
            Discovery Feed
          </TabsTrigger>
          <TabsTrigger value="events" className="data-[state=active]:bg-indigo-800">
            Events
          </TabsTrigger>
        </TabsList>

        <TabsContent value="feed" className="m-0 p-4">
          <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="space-y-4">
              <PostCard
                user={{
                  name: "Kwame A.",
                  avatar: "/placeholder.svg?height=40&width=40",
                  level: 8,
                }}
                content="Just discovered this amazing mask at the National Museum! The details are incredible. #CulturalTreasure"
                image="/placeholder.svg?height=200&width=400"
                likes={24}
                comments={8}
                time="2 hours ago"
                location="National Museum"
                points={150}
              />

              <PostCard
                user={{
                  name: "Amara T.",
                  avatar: "/placeholder.svg?height=40&width=40",
                  level: 6,
                }}
                content="The spices at Maasai Market are a must-try! I learned so much about traditional cooking methods. #FoodieAdventure"
                image="/placeholder.svg?height=200&width=400"
                likes={18}
                comments={5}
                time="5 hours ago"
                location="Maasai Market"
                points={120}
              />

              <PostCard
                user={{
                  name: "Jamal K.",
                  avatar: "/placeholder.svg?height=40&width=40",
                  level: 7,
                }}
                content="Completed the Cultural Heritage challenge today! Found all 5 artifacts in record time. Who wants to beat my score? #Challenge"
                likes={32}
                comments={12}
                time="Yesterday"
                location="City Center"
                points={300}
              />
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="events" className="m-0 p-4">
          <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="space-y-4">
              <EventCard
                title="Cultural Treasure Hunt"
                date="Nov 15, 2023"
                time="10:00 AM - 2:00 PM"
                location="National Museum"
                image="/placeholder.svg?height=120&width=400"
                attendees={48}
                points={500}
              />

              <EventCard
                title="African Cuisine Festival"
                date="Nov 22, 2023"
                time="12:00 PM - 6:00 PM"
                location="City Park"
                image="/placeholder.svg?height=120&width=400"
                attendees={124}
                points={350}
              />

              <EventCard
                title="Artisan Market Tour"
                date="Dec 5, 2023"
                time="9:00 AM - 1:00 PM"
                location="Maasai Market"
                image="/placeholder.svg?height=120&width=400"
                attendees={36}
                points={400}
              />

              <div className="mt-6">
                <h2 className="text-lg font-bold text-indigo-900 mb-3">Team Challenges</h2>
                <Card className="bg-indigo-100 border-indigo-300">
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      <TeamChallengeCard
                        title="Heritage Hunters"
                        members={5}
                        progress={70}
                        reward={1000}
                        endDate="Nov 30, 2023"
                      />

                      <TeamChallengeCard
                        title="Culinary Explorers"
                        members={3}
                        progress={45}
                        reward={800}
                        endDate="Dec 15, 2023"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function PostCard({
  user,
  content,
  image,
  likes,
  comments,
  time,
  location,
  points,
}: {
  user: {
    name: string
    avatar: string
    level: number
  }
  content: string
  image?: string
  likes: number
  comments: number
  time: string
  location: string
  points: number
}) {
  const [liked, setLiked] = useState(false)

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="p-3 flex items-center">
          <Avatar className="h-10 w-10 border-2 border-indigo-300">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="ml-2">
            <div className="flex items-center">
              <span className="font-bold text-indigo-900">{user.name}</span>
              <Badge className="ml-2 text-[10px] bg-sunset-600">Lvl {user.level}</Badge>
            </div>
            <div className="flex items-center text-xs text-indigo-600">
              <MapPin className="h-3 w-3 mr-1" />
              {location} · {time}
            </div>
          </div>
        </div>

        <div className="px-3 pb-2">
          <p className="text-sm text-indigo-900">{content}</p>
        </div>

        {image && (
          <div className="relative h-48 w-full">
            <Image src={image || "/placeholder.svg"} alt="Post image" fill className="object-cover" />
            <div className="absolute top-2 right-2">
              <Badge className="bg-sunset-600 flex items-center">
                <Trophy className="h-3 w-3 mr-1" />
                {points} pts
              </Badge>
            </div>
          </div>
        )}

        <div className="p-3 flex items-center justify-between border-t border-indigo-200">
          <Button
            variant="ghost"
            size="sm"
            className={`text-sm ${liked ? "text-red-500" : "text-indigo-700"}`}
            onClick={() => setLiked(!liked)}
          >
            <Heart className="h-4 w-4 mr-1" />
            {liked ? likes + 1 : likes}
          </Button>
          <Button variant="ghost" size="sm" className="text-sm text-indigo-700">
            <MessageSquare className="h-4 w-4 mr-1" />
            {comments}
          </Button>
          <Button variant="ghost" size="sm" className="text-sm text-indigo-700">
            <Share2 className="h-4 w-4 mr-1" />
            Share
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function EventCard({
  title,
  date,
  time,
  location,
  image,
  attendees,
  points,
}: {
  title: string
  date: string
  time: string
  location: string
  image: string
  attendees: number
  points: number
}) {
  const [joined, setJoined] = useState(false)

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="relative h-32 w-full">
          <Image src={image || "/placeholder.svg"} alt={title} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-indigo-900 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <h3 className="font-bold text-indigo-50 text-lg">{title}</h3>
            <div className="flex items-center text-indigo-200 text-sm">
              <MapPin className="h-3 w-3 mr-1" />
              {location}
            </div>
          </div>
          <div className="absolute top-2 right-2">
            <Badge className="bg-sunset-600 flex items-center">
              <Trophy className="h-3 w-3 mr-1" />
              {points} pts
            </Badge>
          </div>
        </div>

        <div className="p-3">
          <div className="flex items-center text-sm text-indigo-700 mb-3">
            <Calendar className="h-4 w-4 mr-1" />
            {date} · {time}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-indigo-700">
              <Users className="h-4 w-4 mr-1" />
              {attendees} attending
            </div>
            <Button
              className={
                joined ? "bg-indigo-200 text-indigo-800 hover:bg-indigo-300" : "bg-sunset-600 hover:bg-sunset-700"
              }
              size="sm"
              onClick={() => setJoined(!joined)}
            >
              {joined ? "Joined" : "Join Event"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function TeamChallengeCard({
  title,
  members,
  progress,
  reward,
  endDate,
}: {
  title: string
  members: number
  progress: number
  reward: number
  endDate: string
}) {
  return (
    <div className="bg-indigo-50 rounded-lg p-3 border border-indigo-300">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bold text-indigo-900">{title}</h3>
        <Badge className="bg-sunset-600">{reward} pts</Badge>
      </div>

      <div className="flex items-center text-xs text-indigo-700 mb-2">
        <Users className="h-3 w-3 mr-1" />
        {members} team members
        <span className="mx-2">•</span>
        <Calendar className="h-3 w-3 mr-1" />
        Ends {endDate}
      </div>

      <div className="w-full bg-indigo-200 rounded-full h-2 mb-1">
        <div className="bg-sunset-600 h-2 rounded-full" style={{ width: `${progress}%` }}></div>
      </div>

      <div className="flex justify-between text-xs text-indigo-700">
        <span>Progress: {progress}%</span>
        <Button variant="link" className="h-auto p-0 text-xs text-indigo-800">
          View Details
        </Button>
      </div>
    </div>
  )
}

