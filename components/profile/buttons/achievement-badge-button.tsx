"use client"

import { useState } from "react"
import { Award, Trophy, Share2, Info, Star, Calendar, MapPin, CheckCircle, Lock } from "lucide-react"
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

interface AchievementBadgeButtonProps {
  badge: {
    id: string
    name: string
    description: string
    icon: string
    unlocked: boolean
    progress?: number
    total?: number
    dateEarned?: string
    rarity?: "common" | "uncommon" | "rare" | "legendary"
    points?: number
  }
  variant?: "default" | "outline" | "secondary" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
}

export function AchievementBadgeButton({
  badge,
  variant = "outline",
  size = "default",
  className = "",
}: AchievementBadgeButtonProps) {
  const [open, setOpen] = useState(false)

  const handleShare = () => {
    toast({
      title: "Badge Shared",
      description: `You've shared your "${badge.name}" achievement`,
    })
  }

  const rarityColors = {
    common: "bg-indigo-600",
    uncommon: "bg-jungle-600",
    rare: "bg-electric-600",
    legendary: "bg-gold-600 text-indigo-900",
  }

  const rarityColor = badge.rarity ? rarityColors[badge.rarity] : "bg-indigo-600"

  return (
    <>
      <DialogTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={`${badge.unlocked ? "border-indigo-300 hover:bg-indigo-100" : "border-indigo-200 bg-indigo-50 opacity-70"} ${className}`}
          onClick={() => setOpen(true)}
        >
          <div className={`p-2 rounded-full mr-3 ${badge.unlocked ? "text-sunset-600" : "text-indigo-400"}`}>
            {badge.icon === "trophy" ? (
              <Trophy className="h-4 w-4" />
            ) : badge.icon === "star" ? (
              <Star className="h-4 w-4" />
            ) : badge.icon === "calendar" ? (
              <Calendar className="h-4 w-4" />
            ) : badge.icon === "map" ? (
              <MapPin className="h-4 w-4" />
            ) : (
              <Award className="h-4 w-4" />
            )}
          </div>
          <div className="text-left">
            <h3 className={`font-bold ${badge.unlocked ? "text-indigo-900" : "text-indigo-400"}`}>{badge.name}</h3>
            <p className={`text-xs ${badge.unlocked ? "text-indigo-700" : "text-indigo-400"}`}>{badge.description}</p>
          </div>
          {!badge.unlocked && <Badge className="ml-auto bg-indigo-300 text-indigo-800 text-[10px]">Locked</Badge>}
        </Button>
      </DialogTrigger>

      <Dialog open={open} onOpenChange={setOpen}>
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
                  {badge.icon === "trophy" ? (
                    <Trophy className={`h-16 w-16 ${badge.unlocked ? "text-sunset-600" : "text-indigo-400"}`} />
                  ) : badge.icon === "star" ? (
                    <Star className={`h-16 w-16 ${badge.unlocked ? "text-sunset-600" : "text-indigo-400"}`} />
                  ) : badge.icon === "calendar" ? (
                    <Calendar className={`h-16 w-16 ${badge.unlocked ? "text-sunset-600" : "text-indigo-400"}`} />
                  ) : badge.icon === "map" ? (
                    <MapPin className={`h-16 w-16 ${badge.unlocked ? "text-sunset-600" : "text-indigo-400"}`} />
                  ) : (
                    <Award className={`h-16 w-16 ${badge.unlocked ? "text-sunset-600" : "text-indigo-400"}`} />
                  )}
                </div>
                {badge.unlocked && badge.rarity && (
                  <Badge className={`absolute -top-2 -right-2 ${rarityColor}`}>
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
    </>
  )
}

