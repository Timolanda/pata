"use client"

import { useState } from "react"
import { Bell, MapPin, Battery, Clock, Sliders } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"

export function NotificationSettings() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [proximityDistance, setProximityDistance] = useState(300) // meters
  const [batteryOptimization, setBatteryOptimization] = useState(true)
  const [hintDifficulty, setHintDifficulty] = useState("medium")
  const [audioEnabled, setAudioEnabled] = useState(true)
  const [vibrationEnabled, setVibrationEnabled] = useState(true)
  const [treasureHuntMode, setTreasureHuntMode] = useState(false)

  const handleSaveSettings = () => {
    // In a real app, this would save to user preferences in the backend
    toast({
      title: "Settings saved",
      description: "Your notification preferences have been updated",
    })
  }

  const toggleTreasureHuntMode = () => {
    setTreasureHuntMode(!treasureHuntMode)
    toast({
      title: treasureHuntMode ? "Treasure Hunt Mode disabled" : "Treasure Hunt Mode enabled",
      description: treasureHuntMode
        ? "Standard notification settings applied"
        : "Enhanced scanning and notifications activated",
    })
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-indigo-900">Notification Settings</h1>
        <Button
          variant="outline"
          className={`${treasureHuntMode ? "bg-sunset-600 text-white" : "bg-indigo-100 text-indigo-900"}`}
          onClick={toggleTreasureHuntMode}
        >
          <MapPin className="mr-2 h-4 w-4" />
          {treasureHuntMode ? "Hunting Active" : "Activate Hunt Mode"}
        </Button>
      </div>

      <Card className="border-indigo-300">
        <CardHeader className="bg-indigo-100">
          <CardTitle className="text-indigo-900 flex items-center">
            <Bell className="mr-2 h-5 w-5" /> Proximity Notifications
          </CardTitle>
          <CardDescription>Control how you receive alerts when treasures are nearby</CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Enable Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive alerts when treasures are nearby</p>
            </div>
            <Switch
              checked={notificationsEnabled}
              onCheckedChange={setNotificationsEnabled}
              className="data-[state=checked]:bg-sunset-600"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-base">Detection Range</Label>
              <span className="text-sm font-medium">{proximityDistance}m</span>
            </div>
            <Slider
              disabled={!notificationsEnabled}
              value={[proximityDistance]}
              min={50}
              max={500}
              step={50}
              onValueChange={(value) => setProximityDistance(value[0])}
              className="[&>span]:bg-sunset-600"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Close (50m)</span>
              <span>Medium (250m)</span>
              <span>Far (500m)</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="space-y-0.5">
              <Label className="text-base flex items-center">
                <Battery className="mr-2 h-4 w-4" /> Battery Optimization
              </Label>
              <p className="text-sm text-muted-foreground">Use geofencing to reduce battery consumption</p>
            </div>
            <Switch
              checked={batteryOptimization}
              onCheckedChange={setBatteryOptimization}
              className="data-[state=checked]:bg-jungle-600"
              disabled={!notificationsEnabled}
            />
          </div>

          <div className="pt-2">
            <Label className="text-base flex items-center mb-2">
              <Sliders className="mr-2 h-4 w-4" /> Hint Difficulty
            </Label>
            <RadioGroup
              value={hintDifficulty}
              onValueChange={setHintDifficulty}
              className="flex space-x-2"
              disabled={!notificationsEnabled}
            >
              <div className="flex items-center space-x-2 bg-indigo-50 p-2 rounded-md flex-1 justify-center">
                <RadioGroupItem value="easy" id="easy" className="text-jungle-600" />
                <Label htmlFor="easy" className="font-normal">
                  Easy
                </Label>
              </div>
              <div className="flex items-center space-x-2 bg-indigo-50 p-2 rounded-md flex-1 justify-center">
                <RadioGroupItem value="medium" id="medium" className="text-sunset-600" />
                <Label htmlFor="medium" className="font-normal">
                  Medium
                </Label>
              </div>
              <div className="flex items-center space-x-2 bg-indigo-50 p-2 rounded-md flex-1 justify-center">
                <RadioGroupItem value="hard" id="hard" className="text-electric-600" />
                <Label htmlFor="hard" className="font-normal">
                  Hard
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Audio Cues</Label>
                <p className="text-sm text-muted-foreground">Play sounds that intensify as you get closer</p>
              </div>
              <Switch
                checked={audioEnabled}
                onCheckedChange={setAudioEnabled}
                className="data-[state=checked]:bg-electric-600"
                disabled={!notificationsEnabled}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Vibration Alerts</Label>
                <p className="text-sm text-muted-foreground">Phone vibrates when treasures are nearby</p>
              </div>
              <Switch
                checked={vibrationEnabled}
                onCheckedChange={setVibrationEnabled}
                className="data-[state=checked]:bg-neon-600"
                disabled={!notificationsEnabled}
              />
            </div>
          </div>

          <div className="pt-4">
            <Button className="w-full bg-indigo-700 hover:bg-indigo-800" onClick={handleSaveSettings}>
              Save Notification Settings
            </Button>
          </div>
        </CardContent>
      </Card>

      {treasureHuntMode && (
        <Card className="border-sunset-300 bg-gradient-to-r from-sunset-50 to-gold-50">
          <CardContent className="p-6">
            <div className="flex items-start">
              <div className="bg-sunset-100 p-2 rounded-full mr-4">
                <Clock className="h-6 w-6 text-sunset-600" />
              </div>
              <div>
                <h3 className="font-bold text-indigo-900 mb-1">Treasure Hunt Mode Active</h3>
                <p className="text-sm text-indigo-700 mb-2">
                  Enhanced scanning is now active. Your device will use more battery but will detect treasures more
                  accurately.
                </p>
                <div className="bg-sunset-100 rounded-md p-2 text-xs text-sunset-800">
                  Tip: Turn off Treasure Hunt Mode when not actively searching to save battery.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

