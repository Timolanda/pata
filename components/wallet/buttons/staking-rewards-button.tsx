"use client"

import { SelectItem } from "@/components/ui/select"

import { SelectContent } from "@/components/ui/select"

import { SelectValue } from "@/components/ui/select"

import { SelectTrigger } from "@/components/ui/select"

import { Select } from "@/components/ui/select"

import { useState } from "react"
import { Coins, TrendingUp, Clock, Calendar, Download, BarChart2 } from "lucide-react"
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
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"

interface StakingRewardsButtonProps {
  variant?: "default" | "outline" | "secondary" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
  isStaking?: boolean
  stakedAmount?: number
  rewardsEarned?: number
}

export function StakingRewardsButton({
  variant = "default",
  size = "default",
  className = "",
  isStaking = true,
  stakedAmount = 500,
  rewardsEarned = 12.5,
}: StakingRewardsButtonProps) {
  const [open, setOpen] = useState(false)

  const handleClaimRewards = () => {
    if (!isStaking || rewardsEarned <= 0) {
      toast({
        title: "No Rewards Available",
        description: "You don't have any rewards to claim",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Rewards Claimed",
      description: `${rewardsEarned} PATA tokens have been added to your wallet`,
    })

    setOpen(false)
  }

  const handleExportReport = () => {
    toast({
      title: "Report Exported",
      description: "Staking report has been downloaded",
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} size={size} className={`bg-jungle-600 hover:bg-jungle-700 ${className}`}>
          <Coins className="mr-2 h-4 w-4" />
          Staking Rewards
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] border-jungle-300 bg-gradient-to-b from-indigo-50 to-jungle-50">
        <DialogHeader>
          <DialogTitle className="text-indigo-900 flex items-center">
            <Coins className="mr-2 h-5 w-5 text-jungle-600" />
            Staking Rewards
          </DialogTitle>
          <DialogDescription className="text-indigo-700">
            Track and manage your PATA token staking rewards
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid grid-cols-3 bg-indigo-100 text-indigo-900">
            <TabsTrigger value="overview" className="data-[state=active]:bg-jungle-600 data-[state=active]:text-white">
              Overview
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-jungle-600 data-[state=active]:text-white">
              History
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-jungle-600 data-[state=active]:text-white">
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-4 space-y-4">
            {isStaking ? (
              <div className="bg-white p-4 rounded-lg border border-jungle-200">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-indigo-900">Current Staking</h3>
                  <Badge className="bg-jungle-600">Active</Badge>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-indigo-700">Staked Amount:</span>
                    <span className="font-bold text-indigo-900">{stakedAmount} PATA</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-indigo-700">Staking Period:</span>
                    <span className="text-indigo-900">30 days</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-indigo-700">Start Date:</span>
                    <span className="text-indigo-900">Oct 15, 2023</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-indigo-700">End Date:</span>
                    <span className="text-indigo-900">Nov 14, 2023</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-indigo-700">APY:</span>
                    <span className="font-bold text-jungle-600">5%</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-indigo-700">Rewards Earned:</span>
                    <span className="font-bold text-jungle-600">+{rewardsEarned} PATA</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-indigo-700">Auto-Compound:</span>
                    <span className="text-indigo-900">Enabled</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-indigo-100">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium text-indigo-900">Available to Claim</h4>
                      <p className="text-sm text-indigo-700">Claim rewards without unstaking your tokens</p>
                    </div>
                    <Button className="bg-jungle-600 hover:bg-jungle-700" onClick={handleClaimRewards}>
                      <Coins className="mr-2 h-4 w-4" />
                      Claim {rewardsEarned} PATA
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white p-4 rounded-lg border border-indigo-200">
                <div className="flex flex-col items-center justify-center py-6">
                  <Coins className="h-12 w-12 text-indigo-300 mb-3" />
                  <h3 className="font-bold text-indigo-900 mb-2">No Active Staking</h3>
                  <p className="text-indigo-700 text-center mb-4">
                    You don't have any PATA tokens staked. Start staking to earn rewards.
                  </p>
                  <Button className="bg-jungle-600 hover:bg-jungle-700" onClick={() => setOpen(false)}>
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Start Staking
                  </Button>
                </div>
              </div>
            )}

            <div className="bg-jungle-100 p-3 rounded-lg border border-jungle-200">
              <div className="flex items-start">
                <TrendingUp className="h-5 w-5 text-jungle-600 mr-2 mt-0.5" />
                <div>
                  <h4 className="font-medium text-indigo-900">Staking Benefits</h4>
                  <p className="text-sm text-indigo-700">
                    Staking your PATA tokens not only earns you rewards but also gives you voting rights in the PATA
                    ecosystem and access to exclusive features.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history" className="mt-4">
            <div className="bg-white p-4 rounded-lg border border-indigo-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-indigo-900">Staking History</h3>
                <Button variant="outline" size="sm" className="border-indigo-300" onClick={handleExportReport}>
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>

              <div className="space-y-3">
                <HistoryItem type="stake" amount="500" date="Oct 15, 2023" status="active" />

                <HistoryItem type="reward" amount="5.2" date="Oct 30, 2023" status="completed" />

                <HistoryItem type="stake" amount="300" date="Sep 1, 2023" status="completed" />

                <HistoryItem type="unstake" amount="300" date="Oct 1, 2023" status="completed" />

                <HistoryItem type="reward" amount="3.8" date="Sep 15, 2023" status="completed" />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="mt-4">
            <div className="bg-white p-4 rounded-lg border border-indigo-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-indigo-900">Staking Analytics</h3>
                <Select defaultValue="30days">
                  <SelectTrigger className="w-[120px] border-indigo-300">
                    <SelectValue placeholder="Time period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7days">7 days</SelectItem>
                    <SelectItem value="30days">30 days</SelectItem>
                    <SelectItem value="90days">90 days</SelectItem>
                    <SelectItem value="year">1 year</SelectItem>
                    <SelectItem value="all">All time</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="h-40 bg-indigo-50 rounded-lg flex items-center justify-center mb-4">
                <BarChart2 className="h-8 w-8 text-indigo-400" />
                <span className="ml-2 text-indigo-400">Rewards Chart</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <StatCard label="Total Staked" value="500 PATA" />
                <StatCard label="Total Rewards" value="21.5 PATA" />
                <StatCard label="Avg. APY" value="5%" />
                <StatCard label="Staking Efficiency" value="98%" />
              </div>
            </div>

            <div className="bg-jungle-100 p-3 rounded-lg border border-jungle-200 mt-4">
              <div className="flex items-start">
                <Calendar className="h-5 w-5 text-jungle-600 mr-2 mt-0.5" />
                <div>
                  <h4 className="font-medium text-indigo-900">Staking Projections</h4>
                  <p className="text-sm text-indigo-700">
                    At your current staking rate, you'll earn approximately 60 PATA in rewards over the next year.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

function HistoryItem({
  type,
  amount,
  date,
  status,
}: {
  type: "stake" | "unstake" | "reward"
  amount: string
  date: string
  status: "active" | "completed" | "failed"
}) {
  const typeLabels = {
    stake: "Staked Tokens",
    unstake: "Unstaked Tokens",
    reward: "Claimed Rewards",
  }

  const statusColors = {
    active: "bg-jungle-600",
    completed: "bg-indigo-600",
    failed: "bg-red-600",
  }

  return (
    <div className="flex justify-between items-center p-3 bg-indigo-50 rounded-lg">
      <div>
        <h4 className="font-medium text-indigo-900">{typeLabels[type]}</h4>
        <div className="flex items-center text-xs text-indigo-600 mt-1">
          <Clock className="h-3 w-3 mr-1" />
          {date}
        </div>
      </div>
      <div className="flex items-center">
        <span className={`font-bold ${type === "reward" ? "text-jungle-600" : "text-indigo-900"}`}>
          {type === "unstake" ? "-" : type === "reward" ? "+" : ""}
          {amount} PATA
        </span>
        <Badge className={`ml-2 ${statusColors[status]}`}>{status}</Badge>
      </div>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-indigo-50 p-3 rounded-lg">
      <p className="text-xs text-indigo-700">{label}</p>
      <p className="text-lg font-bold text-indigo-900">{value}</p>
    </div>
  )
}

