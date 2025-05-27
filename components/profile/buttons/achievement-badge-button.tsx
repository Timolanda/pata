"use client"

import { useState, useCallback } from "react"
import { Award, Trophy, Share2, Info, Star, Calendar, MapPin, CheckCircle, Lock, Map, ShoppingBag, Utensils } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { toast } from "@/hooks/use-toast"

interface AchievementBadge {
    id: string
    name: string
    description: string
    icon: string
    unlocked: boolean
  dateEarned?: string
    progress?: number
    total?: number
  rarity: "common" | "uncommon" | "rare" | "legendary"
  points: number
  }

interface AchievementBadgeButtonProps {
  variant?: "default" | "outline" | "secondary" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
  badge: AchievementBadge
  onBadgeClick?: (badgeId: string) => void
}

export function AchievementBadgeButton({
  variant = "outline",
  size = "default",
  className = "",
  badge,
  onBadgeClick,
}: AchievementBadgeButtonProps) {
  const [open, setOpen] = useState(false)

  const handleBadgeClick = useCallback(() => {
    onBadgeClick?.(badge.id)
  }, [badge.id, onBadgeClick])

  const handleShare = () => {
    toast({
      title: "Badge Shared",
      description: `You've shared your "${badge.name}" achievement`,
    })
  }

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "trophy":
        return <Trophy className="h-5 w-5" />
      case "calendar":
        return <Calendar className="h-5 w-5" />
      case "map":
        return <Map className="h-5 w-5" />
      case "shopping":
        return <ShoppingBag className="h-5 w-5" />
      case "utensils":
        return <Utensils className="h-5 w-5" />
      default:
        return <Award className="h-5 w-5" />
    }
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "bg-indigo-200 text-indigo-800"
      case "uncommon":
        return "bg-green-200 text-green-800"
      case "rare":
        return "bg-purple-200 text-purple-800"
      case "legendary":
        return "bg-amber-200 text-amber-800"
      default:
        return "bg-gray-200 text-gray-800"
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={`w-full justify-start ${className}`}
          onClick={handleBadgeClick}
        >
          <div className="flex items-center space-x-2">
            <div className={`p-2 rounded-full ${badge.unlocked ? "bg-sunset-100" : "bg-gray-100"}`}>
              {getIcon(badge.icon)}
            </div>
            <div className="flex-1 text-left">
              <div className="font-bold">{badge.name}</div>
              <div className="text-sm text-gray-600">{badge.description}</div>
            </div>
            {badge.unlocked ? (
              <Badge className={getRarityColor(badge.rarity)}>{badge.points} pts</Badge>
            ) : (
              badge.progress !== undefined && (
                <Progress value={(badge.progress / (badge.total || 1)) * 100} className="w-20" />
              )
            )}
          </div>
        </Button>
      </DialogTrigger>

        <DialogContent className="sm:max-w-[425px] border-indigo-300">
          <DialogHeader>
            <DialogTitle className="text-indigo-900 flex items-center">
              <Award className="mr-2 h-5 w-5 text-sunset-600" />
              Achievement Badge
            </DialogTitle>
            <DialogDescription className="text-indigo-700">
              {badge.unlocked ? "You've earned this badge!" : "Keep exploring to unlock this badge"}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4">
            <div className="flex flex-col items-center">
              <div className={`relative w-32 h-32 ${badge.unlocked ? "pulse-glow" : "opacity-60"}`}>
                <div className={`p-8 rounded-full ${badge.unlocked ? "bg-sunset-100" : "bg-indigo-100"}`}>
                {getIcon(badge.icon)}
                </div>
                {badge.unlocked && badge.rarity && (
                <Badge className={`absolute -top-2 -right-2 ${getRarityColor(badge.rarity)}`}>
                    {badge.rarity.charAt(0).toUpperCase() + badge.rarity.slice(1)}
                  </Badge>
                )}
              </div>

              <h2 className="text-xl font-bold text-indigo-900 mt-4">{badge.name}</h2>
              <p className="text-indigo-700 text-center mt-1">{badge.description}</p>

              {badge.unlocked && badge.dateEarned && (
                <div className="flex items-center mt-2 text-sm text-indigo-600">
                  <CheckCircle className="h-4 w-4 mr-1 text-jungle-600" />
                  Earned on {badge.dateEarned}
                </div>
              )}

              {badge.points && <Badge className="mt-2 bg-sunset-600">+{badge.points} PATA Points</Badge>}
            </div>

            {!badge.unlocked && badge.progress !== undefined && badge.total !== undefined && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-indigo-700">Progress</span>
                  <span className="text-indigo-900 font-medium">
                    {badge.progress} / {badge.total}
                  </span>
                </div>
                <Progress value={(badge.progress / badge.total) * 100} className="h-2 bg-indigo-200" />
              </div>
            )}

            <div className="bg-indigo-100 p-3 rounded-lg border border-indigo-200">
              <div className="flex items-start">
                <Info className="h-5 w-5 text-indigo-600 mr-2 mt-0.5" />
                <div>
                  <h4 className="font-medium text-indigo-900">Badge Details</h4>
                  <p className="text-sm text-indigo-700">
                    {badge.unlocked
                      ? "This badge showcases your achievement in the PATA ecosystem. Share it with friends to show off your explorer status!"
                      : "Continue exploring and completing challenges to unlock this badge and earn PATA points."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            {badge.unlocked ? (
              <Button onClick={handleShare} className="bg-sunset-600 hover:bg-sunset-700">
                <Share2 className="mr-2 h-4 w-4" />
                Share Badge
              </Button>
            ) : (
              <Button variant="outline" className="border-indigo-300" onClick={() => setOpen(false)}>
                <Lock className="mr-2 h-4 w-4" />
                Continue Exploring
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
  )
}

