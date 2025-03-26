"use client"

import { useState } from "react"
import Image from "next/image"
import { Users, MessageSquare, Heart, Share2, Calendar, MapPin, User, Bell, Filter, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"
import { Switch } from "@/components/ui/switch"

interface CommunityButtonProps {
  variant?: "default" | "outline" | "secondary" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
}

export function CommunityButton({ variant = "default", size = "default", className = "" }: CommunityButtonProps) {
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("feed")
  const [postContent, setPostContent] = useState("")

  const handlePost = () => {
    if (!postContent.trim()) {
      toast({
        title: "Empty Post",
        description: "Please enter some content for your post",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Post Created",
      description: "Your post has been shared with the community",
    })

    setPostContent("")
  }

  const handleJoinEvent = (eventName: string) => {
    toast({
      title: "Event Joined",
      description: `You've joined the "${eventName}" event`,
    })
  }

  const handleLike = () => {
    toast({
      title: "Post Liked",
      description: "You've liked this post",
    })
  }

  const handleComment = () => {
    toast({
      title: "Add Comment",
      description: "Opening comment section",
    })
  }

  const handleShare = () => {
    toast({
      title: "Share Post",
      description: "Opening share options",
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} size={size} className={`bg-electric-600 hover:bg-electric-700 ${className}`}>
          <Users className="mr-2 h-4 w-4" />
          Community
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] border-electric-300">
        <DialogHeader>
          <DialogTitle className="text-indigo-900 flex items-center">
            <Users className="mr-2 h-5 w-5 text-electric-600" />
            PATA Community
          </DialogTitle>
          <DialogDescription className="text-indigo-700">
            Connect with fellow explorers and share your discoveries
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="feed" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 bg-indigo-100 text-indigo-900">
            <TabsTrigger value="feed" className="data-[state=active]:bg-electric-600 data-[state=active]:text-white">
              Discovery Feed
            </TabsTrigger>
            <TabsTrigger value="events" className="data-[state=active]:bg-electric-600 data-[state=active]:text-white">
              Events
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="data-[state=active]:bg-electric-600 data-[state=active]:text-white"
            >
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="feed" className="mt-4 space-y-4">
            <div className="bg-white p-3 rounded-lg border border-indigo-200">
              <div className="flex items-start space-x-3">
                <Avatar className="h-10 w-10 border-2 border-indigo-300">
                  <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Your Avatar" />
                  <AvatarFallback>AO</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <textarea
                    className="w-full border border-indigo-200 rounded-md p-2 text-sm text-indigo-900 min-h-[80px]"
                    placeholder="Share your latest discovery or adventure..."
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                  />
                  <div className="flex justify-between items-center mt-2">
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="border-indigo-300">
                        <MapPin className="h-4 w-4 mr-1" />
                        Add Location
                      </Button>
                      <Button variant="outline" size="sm" className="border-indigo-300">
                        <Image className="h-4 w-4 mr-1" />
                        Add Photo
                      </Button>
                    </div>
                    <Button size="sm" className="bg-electric-600 hover:bg-electric-700" onClick={handlePost}>
                      Post
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
              <CommunityPost
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
                onLike={handleLike}
                onComment={handleComment}
                onShare={handleShare}
              />

              <CommunityPost
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
                onLike={handleLike}
                onComment={handleComment}
                onShare={handleShare}
              />
            </div>
          </TabsContent>

          <TabsContent value="events" className="mt-4 space-y-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold text-indigo-900">Upcoming Events</h3>
              <Button variant="outline" size="sm" className="border-indigo-300">
                <Filter className="h-4 w-4 mr-1" />
                Filter
              </Button>
            </div>

            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
              <CommunityEvent
                title="Cultural Treasure Hunt"
                date="Nov 15, 2023"
                time="10:00 AM - 2:00 PM"
                location="National Museum"
                image="/placeholder.svg?height=120&width=400"
                attendees={48}
                points={500}
                onJoin={() => handleJoinEvent("Cultural Treasure Hunt")}
              />

              <CommunityEvent
                title="African Cuisine Festival"
                date="Nov 22, 2023"
                time="12:00 PM - 6:00 PM"
                location="City Park"
                image="/placeholder.svg?height=120&width=400"
                attendees={124}
                points={350}
                onJoin={() => handleJoinEvent("African Cuisine Festival")}
              />

              <CommunityEvent
                title="Artisan Market Tour"
                date="Dec 5, 2023"
                time="9:00 AM - 1:00 PM"
                location="Maasai Market"
                image="/placeholder.svg?height=120&width=400"
                attendees={36}
                points={400}
                onJoin={() => handleJoinEvent("Artisan Market Tour")}
              />
            </div>
          </TabsContent>

          <TabsContent value="settings" className="mt-4 space-y-4">
            <div className="bg-white p-4 rounded-lg border border-indigo-200">
              <h3 className="font-bold text-indigo-900 mb-3 flex items-center">
                <Bell className="mr-2 h-5 w-5 text-electric-600" />
                Notification Preferences
              </h3>

              <div className="space-y-3">
                <NotificationSetting
                  title="New Comments"
                  description="When someone comments on your post"
                  defaultChecked={true}
                />

                <NotificationSetting
                  title="Post Likes"
                  description="When someone likes your post"
                  defaultChecked={true}
                />

                <NotificationSetting
                  title="Event Invitations"
                  description="When you're invited to an event"
                  defaultChecked={true}
                />

                <NotificationSetting
                  title="Community Announcements"
                  description="Important updates from PATA"
                  defaultChecked={true}
                />
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border border-indigo-200">
              <h3 className="font-bold text-indigo-900 mb-3 flex items-center">
                <User className="mr-2 h-5 w-5 text-electric-600" />
                Privacy Settings
              </h3>

              <div className="space-y-3">
                <NotificationSetting
                  title="Public Profile"
                  description="Allow others to view your profile"
                  defaultChecked={true}
                />

                <NotificationSetting
                  title="Show Location"
                  description="Share your location with posts"
                  defaultChecked={true}
                />

                <NotificationSetting
                  title="Discovery Sharing"
                  description="Automatically share new discoveries"
                  defaultChecked={false}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

function CommunityPost({
  user,
  content,
  image,
  likes,
  comments,
  time,
  location,
  points,
  onLike,
  onComment,
  onShare,
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
  onLike: () => void
  onComment: () => void
  onShare: () => void
}) {
  const [liked, setLiked] = useState(false)

  const handleLike = () => {
    setLiked(!liked)
    onLike()
  }

  return (
    <div className="bg-white rounded-lg border border-indigo-200 overflow-hidden">
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
          onClick={handleLike}
        >
          <Heart className="h-4 w-4 mr-1" />
          {liked ? likes + 1 : likes}
        </Button>
        <Button variant="ghost" size="sm" className="text-sm text-indigo-700" onClick={onComment}>
          <MessageSquare className="h-4 w-4 mr-1" />
          {comments}
        </Button>
        <Button variant="ghost" size="sm" className="text-sm text-indigo-700" onClick={onShare}>
          <Share2 className="h-4 w-4 mr-1" />
          Share
        </Button>
      </div>
    </div>
  )
}

function CommunityEvent({
  title,
  date,
  time,
  location,
  image,
  attendees,
  points,
  onJoin,
}: {
  title: string
  date: string
  time: string
  location: string
  image: string
  attendees: number
  points: number
  onJoin: () => void
}) {
  const [joined, setJoined] = useState(false)

  const handleJoin = () => {
    setJoined(!joined)
    if (!joined) {
      onJoin()
    }
  }

  return (
    <div className="bg-white rounded-lg border border-indigo-200 overflow-hidden">
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
            onClick={handleJoin}
          >
            {joined ? "Joined" : "Join Event"}
          </Button>
        </div>
      </div>
    </div>
  )
}

function NotificationSetting({
  title,
  description,
  defaultChecked = false,
}: {
  title: string
  description: string
  defaultChecked?: boolean
}) {
  const [checked, setChecked] = useState(defaultChecked)

  return (
    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-indigo-50">
      <div>
        <h4 className="font-medium text-indigo-900">{title}</h4>
        <p className="text-xs text-indigo-700">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={setChecked} className="data-[state=checked]:bg-electric-600" />
    </div>
  )
}

