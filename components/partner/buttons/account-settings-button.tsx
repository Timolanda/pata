"use client"

import { useState } from "react"
import { Settings, Bell, Shield, Globe, Save } from "lucide-react"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"

interface AccountSettingsButtonProps {
  variant?: "default" | "outline" | "secondary" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
}

export function AccountSettingsButton({
  variant = "outline",
  size = "default",
  className = "",
}: AccountSettingsButtonProps) {
  const [open, setOpen] = useState(false)
  const [businessName, setBusinessName] = useState("African Heritage Museum")
  const [email, setEmail] = useState("contact@africanheritage.com")
  const [notifyNewTreasures, setNotifyNewTreasures] = useState(true)
  const [notifyDiscoveries, setNotifyDiscoveries] = useState(true)
  const [notifyAnalytics, setNotifyAnalytics] = useState(false)
  const [language, setLanguage] = useState("en")
  const [currency, setCurrency] = useState("usd")

  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your account settings have been updated",
    })

    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} size={size} className={`border-indigo-300 ${className}`}>
          <Settings className="mr-2 h-4 w-4" />
          Account Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] border-indigo-300">
        <DialogHeader>
          <DialogTitle className="text-indigo-900 flex items-center">
            <Settings className="mr-2 h-5 w-5 text-indigo-600" />
            Partner Account Settings
          </DialogTitle>
          <DialogDescription className="text-indigo-700">
            Manage your PATA business partnership settings
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid grid-cols-4 bg-indigo-100 text-indigo-900">
            <TabsTrigger value="profile" className="data-[state=active]:bg-indigo-700 data-[state=active]:text-white">
              Profile
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="data-[state=active]:bg-indigo-700 data-[state=active]:text-white"
            >
              Notifications
            </TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-indigo-700 data-[state=active]:text-white">
              Security
            </TabsTrigger>
            <TabsTrigger
              value="preferences"
              className="data-[state=active]:bg-indigo-700 data-[state=active]:text-white"
            >
              Preferences
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-4 space-y-4">
            <div className="grid gap-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="businessName" className="text-right text-indigo-900">
                  Business Name
                </Label>
                <Input
                  id="businessName"
                  className="col-span-3 border-indigo-300"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right text-indigo-900">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  className="col-span-3 border-indigo-300"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right text-indigo-900">
                  Description
                </Label>
                <textarea
                  id="description"
                  className="col-span-3 border border-indigo-300 rounded-md p-2 h-20"
                  placeholder="Describe your business..."
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="location" className="text-right text-indigo-900">
                  Location
                </Label>
                <Input id="location" className="col-span-3 border-indigo-300" placeholder="Business address" />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="website" className="text-right text-indigo-900">
                  Website
                </Label>
                <Input id="website" className="col-span-3 border-indigo-300" placeholder="https://example.com" />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="mt-4 space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-indigo-900">New Treasure Notifications</Label>
                  <p className="text-sm text-indigo-700">Receive alerts when new treasures are created</p>
                </div>
                <Switch
                  checked={notifyNewTreasures}
                  onCheckedChange={setNotifyNewTreasures}
                  className="data-[state=checked]:bg-sunset-600"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-indigo-900">Discovery Notifications</Label>
                  <p className="text-sm text-indigo-700">Receive alerts when users discover your treasures</p>
                </div>
                <Switch
                  checked={notifyDiscoveries}
                  onCheckedChange={setNotifyDiscoveries}
                  className="data-[state=checked]:bg-sunset-600"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-indigo-900">Analytics Reports</Label>
                  <p className="text-sm text-indigo-700">Receive weekly analytics reports via email</p>
                </div>
                <Switch
                  checked={notifyAnalytics}
                  onCheckedChange={setNotifyAnalytics}
                  className="data-[state=checked]:bg-sunset-600"
                />
              </div>

              <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-200">
                <div className="flex items-start">
                  <Bell className="h-5 w-5 text-indigo-600 mr-2 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-indigo-900">Communication Preferences</h4>
                    <p className="text-sm text-indigo-700">
                      You can also manage your notification preferences in the PATA mobile app
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="security" className="mt-4 space-y-4">
            <div className="space-y-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="currentPassword" className="text-right text-indigo-900">
                  Current Password
                </Label>
                <Input
                  id="currentPassword"
                  type="password"
                  className="col-span-3 border-indigo-300"
                  placeholder="••••••••"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="newPassword" className="text-right text-indigo-900">
                  New Password
                </Label>
                <Input
                  id="newPassword"
                  type="password"
                  className="col-span-3 border-indigo-300"
                  placeholder="••••••••"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="confirmPassword" className="text-right text-indigo-900">
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  className="col-span-3 border-indigo-300"
                  placeholder="••••••••"
                />
              </div>

              <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-200">
                <div className="flex items-start">
                  <Shield className="h-5 w-5 text-indigo-600 mr-2 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-indigo-900">Account Security</h4>
                    <p className="text-sm text-indigo-700">
                      We recommend using a strong password and enabling two-factor authentication
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-indigo-900">Two-Factor Authentication</Label>
                  <p className="text-sm text-indigo-700">Add an extra layer of security to your account</p>
                </div>
                <Button variant="outline" className="border-indigo-300">
                  Enable 2FA
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="preferences" className="mt-4 space-y-4">
            <div className="space-y-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="language" className="text-right text-indigo-900">
                  Language
                </Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="col-span-3 border-indigo-300">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="sw">Swahili</SelectItem>
                    <SelectItem value="yo">Yoruba</SelectItem>
                    <SelectItem value="ha">Hausa</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="currency" className="text-right text-indigo-900">
                  Currency
                </Label>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger className="col-span-3 border-indigo-300">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="usd">USD ($)</SelectItem>
                    <SelectItem value="eur">EUR (€)</SelectItem>
                    <SelectItem value="ngn">NGN (₦)</SelectItem>
                    <SelectItem value="ghs">GHS (₵)</SelectItem>
                    <SelectItem value="zar">ZAR (R)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="timezone" className="text-right text-indigo-900">
                  Timezone
                </Label>
                <Select defaultValue="utc">
                  <SelectTrigger className="col-span-3 border-indigo-300">
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="utc">UTC (GMT+0)</SelectItem>
                    <SelectItem value="wat">WAT (GMT+1)</SelectItem>
                    <SelectItem value="cat">CAT (GMT+2)</SelectItem>
                    <SelectItem value="eat">EAT (GMT+3)</SelectItem>
                    <SelectItem value="west">West Africa Time (GMT+1)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-200">
                <div className="flex items-start">
                  <Globe className="h-5 w-5 text-indigo-600 mr-2 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-indigo-900">Regional Settings</h4>
                    <p className="text-sm text-indigo-700">
                      These settings affect how dates, numbers, and currencies are displayed
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => setOpen(false)} className="border-indigo-300">
            Cancel
          </Button>
          <Button onClick={handleSaveSettings} className="bg-indigo-700 hover:bg-indigo-800">
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

