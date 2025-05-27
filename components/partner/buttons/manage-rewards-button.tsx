"use client"

import { useState } from "react"
import { Award, Plus, Edit, Trash2, Tag, Ticket, Gift, Coffee, ShoppingBag, Percent } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"

interface ManageRewardsButtonProps {
  variant?: "default" | "outline" | "secondary" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
}

export function ManageRewardsButton({
  variant = "outline",
  size = "default",
  className = "",
}: ManageRewardsButtonProps) {
  const [open, setOpen] = useState(false)
  const [rewards, setRewards] = useState([
    { id: 1, name: "Free Coffee", type: "product", cost: 100, active: true },
    { id: 2, name: "15% Discount", type: "discount", cost: 150, active: true },
    { id: 3, name: "Museum Ticket", type: "ticket", cost: 250, active: true },
    { id: 4, name: "Souvenir Gift", type: "product", cost: 300, active: false },
  ])
  const [editingReward, setEditingReward] = useState<any>(null)

  const handleAddReward = () => {
    setEditingReward({
      id: Math.max(0, ...rewards.map((r) => r.id)) + 1,
      name: "",
      type: "product",
      cost: 100,
      active: true,
    })
  }

  const handleEditReward = (reward: any) => {
    setEditingReward({ ...reward })
  }

  const handleDeleteReward = (id: number) => {
    setRewards(rewards.filter((r) => r.id !== id))
    toast({
      title: "Reward Deleted",
      description: "The reward has been removed from your offerings",
    })
  }

  const handleSaveReward = () => {
    if (!editingReward.name.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter a name for the reward",
        variant: "destructive",
      })
      return
    }

    const isNew = !rewards.some((r) => r.id === editingReward.id)

    if (isNew) {
      setRewards([...rewards, editingReward])
    } else {
      setRewards(rewards.map((r) => (r.id === editingReward.id ? editingReward : r)))
    }

    setEditingReward(null)

    toast({
      title: isNew ? "Reward Added" : "Reward Updated",
      description: `"${editingReward.name}" has been ${isNew ? "added to" : "updated in"} your rewards`,
    })
  }

  const handleToggleActive = (id: number) => {
    setRewards(
      rewards.map((r) => {
        if (r.id === id) {
          const newActive = !r.active
          toast({
            title: newActive ? "Reward Activated" : "Reward Deactivated",
            description: `"${r.name}" is now ${newActive ? "available" : "unavailable"} to users`,
          })
          return { ...r, active: newActive }
        }
        return r
      }),
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} size={size} className={`w-full justify-start border-indigo-300 ${className}`}>
          <Award className="mr-2 h-4 w-4" />
          Manage Rewards
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] border-gold-300">
        <DialogHeader>
          <DialogTitle className="text-indigo-900 flex items-center">
            <Award className="mr-2 h-5 w-5 text-gold-600" />
            Manage Partner Rewards
          </DialogTitle>
          <DialogDescription className="text-indigo-700">
            Create and manage rewards that users can redeem with PATA points
          </DialogDescription>
        </DialogHeader>

        {editingReward ? (
          <div className="py-4 space-y-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="rewardName" className="text-right text-indigo-900">
                Name
              </Label>
              <Input
                id="rewardName"
                placeholder="Free Coffee"
                className="col-span-3 border-indigo-300"
                value={editingReward.name}
                onChange={(e) => setEditingReward({ ...editingReward, name: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="rewardType" className="text-right text-indigo-900">
                Type
              </Label>
              <Select
                value={editingReward.type}
                onValueChange={(value) => setEditingReward({ ...editingReward, type: value })}
              >
                <SelectTrigger className="col-span-3 border-indigo-300">
                  <SelectValue placeholder="Select reward type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="product">Product</SelectItem>
                  <SelectItem value="discount">Discount</SelectItem>
                  <SelectItem value="ticket">Ticket/Entry</SelectItem>
                  <SelectItem value="experience">Experience</SelectItem>
                  <SelectItem value="gift">Gift</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="rewardCost" className="text-right text-indigo-900">
                Point Cost
              </Label>
              <Input
                id="rewardCost"
                type="number"
                min="1"
                className="col-span-3 border-indigo-300"
                value={editingReward.cost}
                onChange={(e) => setEditingReward({ ...editingReward, cost: Number.parseInt(e.target.value) || 0 })}
              />
            </div>

            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="rewardDescription" className="text-right text-indigo-900 pt-2">
                Description
              </Label>
              <textarea
                id="rewardDescription"
                className="col-span-3 border border-indigo-300 rounded-md p-2 h-20"
                placeholder="Describe the reward and any terms or conditions..."
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="rewardActive" className="text-right text-indigo-900">
                Active
              </Label>
              <div className="col-span-3 flex items-center space-x-2">
                <Switch
                  id="rewardActive"
                  checked={editingReward.active}
                  onCheckedChange={(checked) => setEditingReward({ ...editingReward, active: checked })}
                  className="data-[state=checked]:bg-gold-600"
                />
                <span className="text-indigo-900">
                  {editingReward.active ? "Available for redemption" : "Not available"}
                </span>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <Button variant="outline" onClick={() => setEditingReward(null)} className="border-indigo-300">
                Cancel
              </Button>
              <Button onClick={handleSaveReward} className="bg-gold-600 hover:bg-gold-700 text-indigo-900">
                Save Reward
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center my-4">
              <h3 className="font-bold text-indigo-900">Your Rewards</h3>
              <Button size="sm" onClick={handleAddReward} className="bg-gold-600 hover:bg-gold-700 text-indigo-900">
                <Plus className="mr-2 h-4 w-4" />
                Add Reward
              </Button>
            </div>

            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
              {rewards.map((reward) => (
                <RewardCard
                  key={reward.id}
                  reward={reward}
                  onEdit={() => handleEditReward(reward)}
                  onDelete={() => handleDeleteReward(reward.id)}
                  onToggleActive={() => handleToggleActive(reward.id)}
                />
              ))}
            </div>

            <div className="bg-gold-100 p-3 rounded-lg border border-gold-300 mt-4">
              <div className="flex items-start">
                <Award className="h-5 w-5 text-gold-600 mr-2 mt-0.5" />
                <div>
                  <h4 className="font-medium text-indigo-900">Reward Best Practices</h4>
                  <p className="text-sm text-indigo-700">
                    Offer a variety of rewards at different point levels. Popular options include discounts, free
                    products, and exclusive experiences.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

function RewardCard({
  reward,
  onEdit,
  onDelete,
  onToggleActive,
}: {
  reward: any
  onEdit: () => void
  onDelete: () => void
  onToggleActive: () => void
}) {
  const typeIcons = {
    product: <ShoppingBag className="h-5 w-5" />,
    discount: <Percent className="h-5 w-5" />,
    ticket: <Ticket className="h-5 w-5" />,
    experience: <Coffee className="h-5 w-5" />,
    gift: <Gift className="h-5 w-5" />,
  }

  const typeColors = {
    product: "bg-indigo-100 text-indigo-600",
    discount: "bg-jungle-100 text-jungle-600",
    ticket: "bg-sunset-100 text-sunset-600",
    experience: "bg-electric-100 text-electric-600",
    gift: "bg-gold-100 text-gold-600",
  }

  return (
    <div className={`p-4 rounded-lg border ${reward.active ? "border-indigo-300" : "border-indigo-200 bg-indigo-50"}`}>
      <div className="flex justify-between items-start">
        <div className="flex items-start">
          <div className={`p-2 rounded-full mr-3 ${typeColors[reward.type as keyof typeof typeColors]}`}>
            {typeIcons[reward.type as keyof typeof typeIcons]}
          </div>
          <div>
            <h4 className="font-bold text-indigo-900">{reward.name}</h4>
            <div className="flex items-center mt-1">
              <Tag className="h-4 w-4 text-indigo-600 mr-1" />
              <span className="text-sm text-indigo-700">{reward.cost} PATA Points</span>
            </div>
          </div>
        </div>

        <Badge className={reward.active ? "bg-jungle-600" : "bg-indigo-400"}>
          {reward.active ? "Active" : "Inactive"}
        </Badge>
      </div>

      <div className="flex justify-end space-x-2 mt-3">
        <Button variant="outline" size="sm" className="h-8 border-indigo-300" onClick={onToggleActive}>
          {reward.active ? "Deactivate" : "Activate"}
        </Button>
        <Button variant="outline" size="sm" className="h-8 border-indigo-300" onClick={onEdit}>
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-8 border-indigo-300 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

