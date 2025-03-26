"use client"

import { useState } from "react"
import { Coins, ArrowRight, Clock, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function StakeTokensButton() {
  const { toast } = useToast()
  const [amount, setAmount] = useState("")
  const [duration, setDuration] = useState("30")
  const [isStaking, setIsStaking] = useState(false)

  const handleStake = () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount to stake",
        variant: "destructive",
      })
      return
    }

    setIsStaking(true)
    // Simulate staking process
    setTimeout(() => {
      setIsStaking(false)
      toast({
        title: "Tokens Staked",
        description: `${amount} PATA tokens staked for ${duration} days`,
      })
      setAmount("")
    }, 2000)
  }

  const calculateRewards = (amt: string, days: string) => {
    const tokenAmount = Number(amt) || 0
    const stakingDays = Number(days) || 0

    // Simple reward calculation: 0.05% per day
    const dailyRate = 0.0005
    const totalReward = tokenAmount * dailyRate * stakingDays

    return totalReward.toFixed(2)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full flex items-center justify-between bg-gradient-to-r from-emerald-500/10 to-green-500/10 border-emerald-500/20 hover:bg-emerald-500/20 transition-all duration-300"
        >
          <span className="flex items-center gap-2">
            <Coins className="h-5 w-5 text-emerald-500" />
            Stake Tokens
          </span>
          <span className="text-xs text-emerald-400">Earn Rewards</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-gradient-to-b from-slate-900 to-emerald-900/50 border-emerald-500/50">
        <DialogHeader>
          <DialogTitle className="text-white">Stake PATA Tokens</DialogTitle>
          <DialogDescription className="text-emerald-200">
            Stake your tokens to earn rewards and support the PATA ecosystem
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="stake" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-slate-800">
            <TabsTrigger value="stake" className="data-[state=active]:bg-emerald-500">
              Stake
            </TabsTrigger>
            <TabsTrigger value="unstake" className="data-[state=active]:bg-emerald-500">
              Unstake
            </TabsTrigger>
          </TabsList>

          <TabsContent value="stake" className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="stake-amount" className="text-white">
                Amount to Stake
              </Label>
              <Input
                id="stake-amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-slate-800 text-white border-emerald-500/50"
              />
              <p className="text-xs text-emerald-300">Available: 1,250 PATA</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="stake-duration" className="text-white">
                Staking Period
              </Label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger id="stake-duration" className="bg-slate-800 text-white border-emerald-500/50">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-emerald-500/50">
                  <SelectItem value="30">30 Days (5% APY)</SelectItem>
                  <SelectItem value="90">90 Days (7% APY)</SelectItem>
                  <SelectItem value="180">180 Days (10% APY)</SelectItem>
                  <SelectItem value="365">365 Days (15% APY)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-md bg-emerald-900/20 p-4 border border-emerald-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-emerald-400" />
                  <span className="text-sm text-emerald-200">Estimated Rewards</span>
                </div>
                <span className="text-white font-bold">{calculateRewards(amount, duration)} PATA</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-emerald-400" />
                  <span className="text-sm text-emerald-200">Unlock Date</span>
                </div>
                <span className="text-white">
                  {new Date(Date.now() + Number(duration) * 24 * 60 * 60 * 1000).toLocaleDateString()}
                </span>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="unstake" className="space-y-4 py-4">
            <div className="rounded-md bg-slate-800 p-4 border border-emerald-500/30">
              <h3 className="text-white font-medium mb-2">Active Stakes</h3>

              <div className="space-y-3">
                <div className="flex justify-between items-center p-2 border border-emerald-500/20 rounded-md">
                  <div>
                    <p className="text-white">500 PATA</p>
                    <p className="text-xs text-emerald-300">Unlocks: 12/15/2023</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-emerald-500/50 hover:bg-emerald-500/20 text-white"
                  >
                    Unstake
                  </Button>
                </div>

                <div className="flex justify-between items-center p-2 border border-emerald-500/20 rounded-md">
                  <div>
                    <p className="text-white">250 PATA</p>
                    <p className="text-xs text-emerald-300">Unlocks: 03/22/2024</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled
                    className="border-emerald-500/50 hover:bg-emerald-500/20 text-white opacity-50"
                  >
                    Locked
                  </Button>
                </div>
              </div>

              <p className="text-xs text-emerald-200 mt-4">Early unstaking incurs a 10% penalty fee on rewards</p>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button
            type="button"
            onClick={handleStake}
            disabled={isStaking || !amount}
            className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white w-full"
          >
            {isStaking ? (
              <div className="flex items-center">
                <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                Processing...
              </div>
            ) : (
              <div className="flex items-center">
                Stake Tokens
                <ArrowRight className="ml-2 h-4 w-4" />
              </div>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

