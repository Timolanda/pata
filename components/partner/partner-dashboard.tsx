"use client"

import type React from "react"

import { useState } from "react"
import {
  Users,
  DollarSign,
  Calendar,
  MapPin,
  Award,
  Settings,
  BarChart,
  PieChart,
  LineChart,
  Download,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

import { AccountSettingsButton } from "@/components/partner/buttons/account-settings-button"
import { ViewEventsButton } from "@/components/partner/buttons/view-events-button"
import { UpgradePartnershipButton } from "@/components/partner/buttons/upgrade-partnership-button"
import { CreateTreasureButton } from "@/components/partner/buttons/create-treasure-button"
import { ManageRewardsButton } from "@/components/partner/buttons/manage-rewards-button"
import { ScheduleEventButton } from "@/components/partner/buttons/schedule-event-button"
import { ConfigureSettingsButton } from "@/components/partner/buttons/configure-settings-button"
import { AddTreasureButton } from "@/components/partner/buttons/add-treasure-button"
import { PremiumPartnerBadge } from "@/components/partner/buttons/premium-partner-badge"
import { TreasureHeatmap } from "@/components/partner/TreasureHeatmap"

export function PartnerDashboard() {
  const [partnershipTier, setPartnershipTier] = useState("premium")
  const [dateRange, setDateRange] = useState("30days")

  return (
    <div className="p-4 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-indigo-900">Partner Dashboard</h1>
          <p className="text-indigo-700">Manage your PATA business partnership</p>
        </div>
        <div className="flex items-center gap-2">
          <PremiumPartnerBadge tier="premium" />
          <AccountSettingsButton />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Visitors"
          value="1,248"
          change="+12.5%"
          trend="up"
          icon={<Users className="h-5 w-5 text-indigo-600" />}
        />
        <MetricCard
          title="Treasure Discoveries"
          value="342"
          change="+8.3%"
          trend="up"
          icon={<MapPin className="h-5 w-5 text-sunset-600" />}
        />
        <MetricCard
          title="Reward Redemptions"
          value="86"
          change="+5.2%"
          trend="up"
          icon={<Award className="h-5 w-5 text-gold-600" />}
        />
        <MetricCard
          title="Revenue Generated"
          value="$2,450"
          change="+15.7%"
          trend="up"
          icon={<DollarSign className="h-5 w-5 text-jungle-600" />}
        />
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-indigo-900">Performance Analytics</h2>
        <div className="flex items-center gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px] border-indigo-300">
              <SelectValue placeholder="Select time period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="year">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="border-indigo-300">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <Tabs defaultValue="engagement" className="w-full">
        <TabsList className="grid grid-cols-3 bg-indigo-100 text-indigo-900 rounded-lg">
          <TabsTrigger value="engagement" className="data-[state=active]:bg-indigo-700 data-[state=active]:text-white">
            Engagement
          </TabsTrigger>
          <TabsTrigger value="treasures" className="data-[state=active]:bg-indigo-700 data-[state=active]:text-white">
            Treasures
          </TabsTrigger>
          <TabsTrigger value="revenue" className="data-[state=active]:bg-indigo-700 data-[state=active]:text-white">
            Revenue
          </TabsTrigger>
        </TabsList>

        <TabsContent value="engagement" className="mt-4">
          <Card className="border-indigo-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-indigo-900">Visitor Engagement</CardTitle>
              <CardDescription>User interactions with your location</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full bg-indigo-50 rounded-lg flex items-center justify-center">
                <LineChart className="h-10 w-10 text-indigo-400" />
                <span className="ml-2 text-indigo-400">Engagement Chart</span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <EngagementStat label="Avg. Time Spent" value="12m 30s" />
                <EngagementStat label="Return Rate" value="42%" />
                <EngagementStat label="Social Shares" value="156" />
                <EngagementStat label="New Visitors" value="68%" />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Card className="border-indigo-300">
              <CardHeader className="pb-2">
                <CardTitle className="text-indigo-900 text-base">Visitor Demographics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-60 w-full bg-indigo-50 rounded-lg flex items-center justify-center">
                  <PieChart className="h-8 w-8 text-indigo-400" />
                  <span className="ml-2 text-indigo-400">Demographics Chart</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-indigo-300">
              <CardHeader className="pb-2">
                <CardTitle className="text-indigo-900 text-base">Traffic by Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-60 w-full bg-indigo-50 rounded-lg flex items-center justify-center">
                  <BarChart className="h-8 w-8 text-indigo-400" />
                  <span className="ml-2 text-indigo-400">Traffic Chart</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="treasures" className="mt-4">
          <Card className="border-indigo-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-indigo-900">Treasure Performance</CardTitle>
              <CardDescription>How your treasures are performing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium text-indigo-900">Active Treasures</h3>
                <AddTreasureButton />
              </div>

              <div className="space-y-4">
                <TreasurePerformanceRow
                  name="Traditional Mask"
                  type="Rare"
                  discoveries="124"
                  engagement="High"
                  status="active"
                />
                <TreasurePerformanceRow
                  name="Ancient Drum"
                  type="Common"
                  discoveries="256"
                  engagement="Medium"
                  status="active"
                />
                <TreasurePerformanceRow
                  name="Tribal Necklace"
                  type="Uncommon"
                  discoveries="98"
                  engagement="High"
                  status="active"
                />
                <TreasurePerformanceRow
                  name="Golden Statue"
                  type="Legendary"
                  discoveries="42"
                  engagement="Very High"
                  status="active"
                />
                <TreasurePerformanceRow
                  name="Festival Mask"
                  type="Common"
                  discoveries="0"
                  engagement="N/A"
                  status="scheduled"
                  scheduledDate="Nov 15, 2023"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-indigo-300 mt-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-indigo-900">Treasure Heatmap</CardTitle>
              <CardDescription>Where users are finding treasures</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full rounded-lg">
                <TreasureHeatmap />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="mt-4">
          <Card className="border-indigo-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-indigo-900">Revenue Analytics</CardTitle>
              <CardDescription>Financial performance from PATA partnership</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full bg-indigo-50 rounded-lg flex items-center justify-center">
                <LineChart className="h-10 w-10 text-indigo-400" />
                <span className="ml-2 text-indigo-400">Revenue Chart</span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <EngagementStat label="Total Revenue" value="$2,450" />
                <EngagementStat label="Avg. Per Customer" value="$18.50" />
                <EngagementStat label="Conversion Rate" value="24%" />
                <EngagementStat label="ROI" value="320%" />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Card className="border-indigo-300">
              <CardHeader className="pb-2">
                <CardTitle className="text-indigo-900 text-base">Revenue by Treasure Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-60 w-full bg-indigo-50 rounded-lg flex items-center justify-center">
                  <PieChart className="h-8 w-8 text-indigo-400" />
                  <span className="ml-2 text-indigo-400">Revenue Distribution</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-indigo-300">
              <CardHeader className="pb-2">
                <CardTitle className="text-indigo-900 text-base">Reward Redemption Value</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-60 w-full bg-indigo-50 rounded-lg flex items-center justify-center">
                  <BarChart className="h-8 w-8 text-indigo-400" />
                  <span className="ml-2 text-indigo-400">Redemption Chart</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-indigo-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-indigo-900 text-base">Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <EventItem name="Cultural Festival" date="Nov 15, 2023" treasures={5} />
              <EventItem name="Holiday Treasure Hunt" date="Dec 20, 2023" treasures={8} />
              <EventItem name="New Year Special" date="Jan 1, 2024" treasures={3} />
            </div>
            <ViewEventsButton />
          </CardContent>
        </Card>

        <Card className="border-indigo-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-indigo-900 text-base">Partnership Benefits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <BenefitItem name="Featured Placement" status={partnershipTier !== "basic"} />
              <BenefitItem name="Custom Treasure Creation" status={partnershipTier !== "basic"} />
              <BenefitItem name="Advanced Analytics" status={partnershipTier !== "basic"} />
              <BenefitItem name="Priority Support" status={partnershipTier === "elite"} />
              <BenefitItem name="Exclusive Events" status={partnershipTier === "elite"} />
            </div>
            <UpgradePartnershipButton currentTier="premium" />
          </CardContent>
        </Card>

        <Card className="border-indigo-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-indigo-900 text-base">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <CreateTreasureButton />
              <ManageRewardsButton />
              <ScheduleEventButton />
              <ConfigureSettingsButton />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function MetricCard({
  title,
  value,
  change,
  trend,
  icon,
}: {
  title: string
  value: string
  change: string
  trend: "up" | "down"
  icon: React.ReactNode
}) {
  return (
    <Card className="border-indigo-300">
      <CardContent className="pt-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-indigo-700">{title}</p>
            <h3 className="text-2xl font-bold text-indigo-900 mt-1">{value}</h3>
          </div>
          <div className="bg-indigo-100 p-2 rounded-full">{icon}</div>
        </div>
        <div className="mt-2">
          <span className={`text-xs font-medium ${trend === "up" ? "text-jungle-600" : "text-red-600"}`}>
            {change} {trend === "up" ? "↑" : "↓"}
          </span>
          <span className="text-xs text-indigo-600 ml-1">vs. last period</span>
        </div>
      </CardContent>
    </Card>
  )
}

function EngagementStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-indigo-50 p-3 rounded-lg">
      <p className="text-xs text-indigo-700">{label}</p>
      <p className="text-lg font-bold text-indigo-900">{value}</p>
    </div>
  )
}

function TreasurePerformanceRow({
  name,
  type,
  discoveries,
  engagement,
  status,
  scheduledDate,
}: {
  name: string
  type: string
  discoveries: string
  engagement: string
  status: "active" | "inactive" | "scheduled"
  scheduledDate?: string
}) {
  return (
    <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg">
      <div className="flex-1">
        <h4 className="font-medium text-indigo-900">{name}</h4>
        <div className="flex items-center mt-1">
          <Badge
            className={`
            ${
              type === "Common"
                ? "bg-indigo-600"
                : type === "Uncommon"
                  ? "bg-jungle-600"
                  : type === "Rare"
                    ? "bg-electric-600"
                    : "bg-gold-600 text-indigo-900"
            }
            text-xs
          `}
          >
            {type}
          </Badge>
          <span className="text-xs text-indigo-700 ml-2">
            {status === "active" ? "Active" : status === "scheduled" ? `Scheduled for ${scheduledDate}` : "Inactive"}
          </span>
        </div>
      </div>
      <div className="flex-1 text-center">
        <p className="text-sm text-indigo-700">Discoveries</p>
        <p className="font-bold text-indigo-900">{discoveries}</p>
      </div>
      <div className="flex-1 text-center">
        <p className="text-sm text-indigo-700">Engagement</p>
        <p className="font-bold text-indigo-900">{engagement}</p>
      </div>
      <Button variant="ghost" size="sm" className="text-indigo-700">
        <Settings className="h-4 w-4" />
      </Button>
    </div>
  )
}

function EventItem({ name, date, treasures }: { name: string; date: string; treasures: number }) {
  return (
    <div className="flex items-center p-2 border-b border-indigo-200 last:border-0">
      <div className="bg-indigo-100 p-2 rounded-full mr-3">
        <Calendar className="h-4 w-4 text-indigo-600" />
      </div>
      <div className="flex-1">
        <h4 className="font-medium text-indigo-900">{name}</h4>
        <p className="text-xs text-indigo-700">
          {date} • {treasures} treasures
        </p>
      </div>
    </div>
  )
}

function BenefitItem({ name, status }: { name: string; status: boolean }) {
  return (
    <div className={`flex items-center p-2 ${status ? "" : "opacity-50"}`}>
      <div className={`w-4 h-4 rounded-full mr-2 ${status ? "bg-jungle-600" : "bg-indigo-300"}`} />
      <span className="text-sm text-indigo-900">{name}</span>
      {!status && <span className="text-xs ml-auto text-indigo-600">Upgrade</span>}
    </div>
  )
}

