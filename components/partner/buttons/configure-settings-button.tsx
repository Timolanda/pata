"use client"

import { useState } from "react"
import { Settings, Bell, Shield, Save } from "lucide-react"
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
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"

interface ConfigureSettingsButtonProps {
  variant?: "default" | "outline" | "secondary" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
}

export function ConfigureSettingsButton({
  variant = "outline",
  size = "default",
  className = "",
}: ConfigureSettingsButtonProps) {
  const [open, setOpen] = useState(false)
  const [notifyDiscoveries, setNotifyDiscoveries] = useState(true)
  const [notifyRedemptions, setNotifyRedemptions] = useState(true)
  const [treasureVisibility, setTreasureVisibility] = useState(100)
  const [arEffects, setArEffects] = useState(true)
  const [hintDifficulty, setHintDifficulty] = useState("medium")

  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your treasure hunt settings have been updated",
    })

    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} size={size} className={`w-full justify-start border-indigo-300 ${className}`}>
          <Settings className="mr-2 h-4 w-4" />
          Configure Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] border-indigo-300">
        <DialogHeader>
          <DialogTitle className="text-indigo-900 flex items-center">
            <Settings className="mr-2 h-5 w-5 text-indigo-600" />
            Treasure Hunt Settings
          </DialogTitle>
          <DialogDescription className="text-indigo-700">
            Configure how your treasures appear and behave in the PATA app
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="notifications" className="w-full">
          <TabsList className="grid grid-cols-3 bg-indigo-100 text-indigo-900">
            <TabsTrigger
              value="notifications"
              className="data-[state=active]:bg-indigo-700 data-[state=active]:text-white"
            >
              Notifications
            </TabsTrigger>
            <TabsTrigger value="treasures" className="data-[state=active]:bg-indigo-700 data-[state=active]:text-white">
              Treasures
            </TabsTrigger>
            <TabsTrigger value="advanced" className="data-[state=active]:bg-indigo-700 data-[state=active]:text-white">
              Advanced
            </TabsTrigger>
          </TabsList>

          <TabsContent value="notifications" className="mt-4 space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-indigo-900">Discovery Notifications</Label>
                  <p className="text-sm text-indigo-700">Receive alerts when users discover your treasures</p>
                </div>
                <Switch
                  checked={notifyDiscoveries}
                  onCheckedChange={setNotifyDiscoveries}
                  className="data-[state=checked]:bg-indigo-600"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-indigo-900">Reward Redemption Alerts</Label>
                  <p className="text-sm text-indigo-700">Receive alerts when users redeem rewards at your location</p>
                </div>
                <Switch
                  checked={notifyRedemptions}
                  onCheckedChange={setNotifyRedemptions}
                  className="data-[state=checked]:bg-indigo-600"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-indigo-900">Daily Summary</Label>
                  <p className="text-sm text-indigo-700">Receive a daily summary of all treasure hunt activity</p>
                </div>
                <Switch className="data-[state=checked]:bg-indigo-600" />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-indigo-900">Weekly Analytics</Label>
                  <p className="text-sm text-indigo-700">Receive weekly analytics reports via email</p>
                </div>
                <Switch className="data-[state=checked]:bg-indigo-600" />
              </div>

              <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-200">
                <div className="flex items-start">
                  <Bell className="h-5 w-5 text-indigo-600 mr-2 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-indigo-900">Notification Delivery</h4>
                    <p className="text-sm text-indigo-700">
                      Notifications will be sent to your registered email and through the PATA app
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="treasures" className="mt-4 space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-indigo-900">Treasure Visibility Range</Label>
                  <span className="text-sm font-medium text-indigo-900">{treasureVisibility}m</span>
                </div>
                <Slider
                  value={[treasureVisibility]}
                  min={50}
                  max={500}
                  step={50}
                  onValueChange={(value) => setTreasureVisibility(value[0])}
                  className="[&>span]:bg-indigo-600"
                />
                <div className="flex justify-between text-xs text-indigo-600">
                  <span>Close (50m)</span>
                  <span>Medium (250m)</span>
                  <span>Far (500m)</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="space-y-0.5">
                  <Label className="text-indigo-900">AR Effects</Label>
                  <p className="text-sm text-indigo-700">Enable special AR effects for your treasures</p>
                </div>
                <Switch
                  checked={arEffects}
                  onCheckedChange={setArEffects}
                  className="data-[state=checked]:bg-electric-600"
                />
              </div>

              <div className="pt-2">
                <Label className="text-indigo-900 mb-2">Hint Difficulty</Label>
                <Select value={hintDifficulty} onValueChange={setHintDifficulty}>
                  <SelectTrigger className="border-indigo-300">
                    <SelectValue placeholder="Select hint difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy (Clear hints)</SelectItem>
                    <SelectItem value="medium">Medium (Moderate hints)</SelectItem>
                    <SelectItem value="hard">Hard (Cryptic hints)</SelectItem>
                    <SelectItem value="custom">Custom per treasure</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-indigo-600 mt-1">
                  This setting affects how detailed the hints are for finding your treasures
                </p>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="space-y-0.5">
                  <Label className="text-indigo-900">Treasure Rotation</Label>
                  <p className="text-sm text-indigo-700">Automatically rotate treasure locations periodically</p>
                </div>
                <Switch className="data-[state=checked]:bg-jungle-600" />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="space-y-0.5">
                  <Label className="text-indigo-900">Limited Discoveries</Label>
                  <p className="text-sm text-indigo-700">Limit the number of times each treasure can be discovered</p>
                </div>
                <Switch className="data-[state=checked]:bg-sunset-600" />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="mt-4 space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-indigo-900">High Performance Mode</Label>
                  <p className="text-sm text-indigo-700">
                    Enable advanced AR features (requires more device resources)
                  </p>
                </div>
                <Switch className="data-[state=checked]:bg-electric-600" />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-indigo-900">Battery Optimization</Label>
                  <p className="text-sm text-indigo-700">
                    Reduce battery usage for treasure hunters (may affect accuracy)
                  </p>
                </div>
                <Switch defaultChecked className="data-[state=checked]:bg-jungle-600" />
              </div>

              <div className="pt-2">
                <Label className="text-indigo-900 mb-2">Discovery Algorithm</Label>
                <Select defaultValue="balanced">
                  <SelectTrigger className="border-indigo-300">
                    <SelectValue placeholder="Select algorithm" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="precise">Precise (Higher accuracy, more battery)</SelectItem>
                    <SelectItem value="balanced">Balanced (Default)</SelectItem>
                    <SelectItem value="efficient">Efficient (Battery saving)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-indigo-600 mt-1">
                  This setting affects how the app detects when users are near your treasures
                </p>
              </div>

              <div className="pt-2">
                <Label className="text-indigo-900 mb-2">Point Multiplier</Label>
                <Select defaultValue="1">
                  <SelectTrigger className="border-indigo-300">
                    <SelectValue placeholder="Select multiplier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1x (Standard)</SelectItem>
                    <SelectItem value="1.5">1.5x (Premium Partners)</SelectItem>
                    <SelectItem value="2">2x (Elite Partners)</SelectItem>
                    <SelectItem value="custom">Custom (Events Only)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-indigo-600 mt-1">
                  Multiplier for PATA points earned when discovering your treasures
                </p>
              </div>

              <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-200">
                <div className="flex items-start">
                  <Shield className="h-5 w-5 text-indigo-600 mr-2 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-indigo-900">Advanced Settings</h4>
                    <p className="text-sm text-indigo-700">
                      These settings affect the technical aspects of how your treasures function in the PATA app.
                      Contact support for more information.
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
            Save Settings
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

