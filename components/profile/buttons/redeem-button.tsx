"use client"

import { useState, useCallback } from "react"
import { Gift, Tag, Check, AlertTriangle } from "lucide-react"
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
import { toast } from "@/hooks/use-toast"

interface RedeemButtonProps {
  variant?: "default" | "outline" | "secondary" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
  reward: {
    id: string
    title: string
    description: string
    points: number
    expires: string
    disabled?: boolean
  }
  userPoints: number
  onRedeem?: (rewardId: string) => void
}

export function RedeemButton({
  variant = "default",
  size = "default",
  className = "",
  reward,
  userPoints,
  onRedeem,
}: RedeemButtonProps) {
  const [open, setOpen] = useState(false)

  const canRedeem = userPoints >= reward.points && !reward.disabled

  const handleRedeem = useCallback(() => {
    if (!canRedeem) {
      toast({
        title: "Cannot Redeem",
        description: "You don't have enough points for this reward",
        variant: "destructive",
      })
      return
    }

    onRedeem?.(reward.id)
    
    toast({
      title: "Reward Redeemed",
      description: `You've successfully redeemed "${reward.title}"`,
    })

    setOpen(false)
  }, [canRedeem, reward, onRedeem])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={`mt-2 h-8 text-xs bg-sunset-600 hover:bg-sunset-700 text-indigo-50 ${className}`}
          disabled={!canRedeem}
        >
          {reward.disabled ? "Not Enough Points" : "Redeem"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] border-sunset-300 bg-gradient-to-b from-indigo-50 to-sunset-50">
        <DialogHeader>
          <DialogTitle className="text-indigo-900 flex items-center">
            <Gift className="mr-2 h-5 w-5 text-sunset-600" />
            Redeem Reward
          </DialogTitle>
          <DialogDescription className="text-indigo-700">Exchange your PATA points for this reward</DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div className="bg-white p-4 rounded-lg border border-indigo-200">
            <h3 className="font-bold text-indigo-900 mb-2">{reward.title}</h3>
            <p className="text-sm text-indigo-700 mb-3">{reward.description}</p>

            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Tag className="h-4 w-4 text-sunset-600 mr-1" />
                <span className="text-sm font-bold text-indigo-900">{reward.points} Points</span>
              </div>
              <Badge className="bg-indigo-600">Expires: {reward.expires}</Badge>
            </div>
          </div>

          <div className="bg-indigo-100 p-3 rounded-lg border border-indigo-200">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium text-indigo-900">Your Points</h4>
                <p className="text-sm text-indigo-700">Current balance</p>
              </div>
              <span className="font-bold text-indigo-900">{userPoints} Points</span>
            </div>

            <div className="border-t border-indigo-200 mt-2 pt-2">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium text-indigo-900">After Redemption</h4>
                  <p className="text-sm text-indigo-700">Remaining balance</p>
                </div>
                <span className="font-bold text-indigo-900">{userPoints - reward.points} Points</span>
              </div>
            </div>
          </div>

          {!canRedeem && (
            <div className="bg-sunset-100 p-3 rounded-lg border border-sunset-200">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-sunset-600 mr-2 mt-0.5" />
                <div>
                  <h4 className="font-medium text-indigo-900">Insufficient Points</h4>
                  <p className="text-sm text-indigo-700">
                    You need {reward.points - userPoints} more points to redeem this reward.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} className="border-indigo-300">
            Cancel
          </Button>
          <Button onClick={handleRedeem} className="bg-sunset-600 hover:bg-sunset-700" disabled={!canRedeem}>
            <Check className="mr-2 h-4 w-4" />
            Confirm Redemption
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

