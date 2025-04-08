"use client"

import { useState } from "react"
import { Plus, Gem, MapPin, Camera, Upload, Sparkles, ArrowRight } from "lucide-react"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/hooks/use-toast"

interface AddTreasureButtonProps {
  variant?: "default" | "outline" | "secondary" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
}

export function AddTreasureButton({ variant = "default", size = "default", className = "" }: AddTreasureButtonProps) {
  const [open, setOpen] = useState(false)
  const [treasureName, setTreasureName] = useState("")
  const [treasureType, setTreasureType] = useState("mask")
  const [treasureRarity, setTreasureRarity] = useState("common")
  const [treasureDescription, setTreasureDescription] = useState("")
  const [treasurePoints, setTreasurePoints] = useState(50)
  const [arEffectsEnabled, setArEffectsEnabled] = useState(false)
  const [animation, setAnimation] = useState("none")
  const [soundEffect, setSoundEffect] = useState("none")
  const [activeTab, setActiveTab] = useState("basic")

  const handleAddTreasure = () => {
    if (!treasureName.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter a name for your treasure",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Treasure Added",
      description: `Your "${treasureName}" treasure has been added`,
    })

    // Reset all states
    setOpen(false)
    setTreasureName("")
    setTreasureType("mask")
    setTreasureRarity("common")
    setTreasureDescription("")
    setTreasurePoints(50)
    setArEffectsEnabled(false)
    setAnimation("none")
    setSoundEffect("none")
    setActiveTab("basic")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} size={size} className={`bg-sunset-600 hover:bg-sunset-700 ${className}`}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Treasure
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px] border-sunset-300 bg-gradient-to-b from-indigo-50 to-sunset-50">
        <DialogHeader>
          <DialogTitle className="text-indigo-900 flex items-center">
            <Gem className="mr-2 h-5 w-5 text-sunset-600" />
            Add New Treasure
          </DialogTitle>
          <DialogDescription className="text-indigo-700">
            Create a unique treasure for PATA users to discover
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="basic" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 bg-sunset-100 text-indigo-900">
            <TabsTrigger value="basic" className="data-[state=active]:bg-sunset-600 data-[state=active]:text-white">
              Basic Info
            </TabsTrigger>
            <TabsTrigger value="appearance" className="data-[state=active]:bg-sunset-600 data-[state=active]:text-white">
              Appearance
            </TabsTrigger>
            <TabsTrigger value="placement" className="data-[state=active]:bg-sunset-600 data-[state=active]:text-white">
              Placement
            </TabsTrigger>
          </TabsList>

          {/* BASIC INFO TAB */}
          <TabsContent value="basic" className="mt-4 space-y-4">
            <div className="grid gap-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="treasureName" className="text-right text-indigo-900">
                  Name
                </Label>
                <Input
                  id="treasureName"
                  placeholder="Traditional Mask"
                  className="col-span-3 border-indigo-300"
                  value={treasureName}
                  onChange={(e) => setTreasureName(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right text-indigo-900">Type</Label>
                <Select value={treasureType} onValueChange={setTreasureType}>
                  <SelectTrigger className="col-span-3 border-indigo-300">
                    <SelectValue placeholder="Select treasure type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mask">Mask</SelectItem>
                    <SelectItem value="statue">Statue</SelectItem>
                    <SelectItem value="jewelry">Jewelry</SelectItem>
                    <SelectItem value="drum">Drum</SelectItem>
                    <SelectItem value="artifact">Artifact</SelectItem>
                    <SelectItem value="scroll">Scroll</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right text-indigo-900">Rarity</Label>
                <Select value={treasureRarity} onValueChange={setTreasureRarity}>
                  <SelectTrigger className="col-span-3 border-indigo-300">
                    <SelectValue placeholder="Select rarity level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="common">Common</SelectItem>
                    <SelectItem value="uncommon">Uncommon</SelectItem>
                    <SelectItem value="rare">Rare</SelectItem>
                    <SelectItem value="legendary">Legendary</SelectItem>
                    <SelectItem value="mythical">Mythical</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right text-indigo-900 pt-2">Description</Label>
                <textarea
                  className="col-span-3 border border-indigo-300 rounded-md p-2 h-20"
                  placeholder="Describe your treasure and its cultural significance..."
                  value={treasureDescription}
                  onChange={(e) => setTreasureDescription(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right text-indigo-900">Point Value</Label>
                <div className="col-span-3 flex items-center space-x-2">
                  <Slider
                    value={[treasurePoints]}
                    max={500}
                    step={10}
                    onValueChange={(val) => setTreasurePoints(val[0])}
                    className="flex-1 [&>span]:bg-sunset-600"
                  />
                  <span className="w-12 text-center text-indigo-900 font-medium">{treasurePoints}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={() => setActiveTab("appearance")} className="bg-sunset-600 hover:bg-sunset-700">
                Next: Appearance <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </TabsContent>

          {/* APPEARANCE TAB */}
          <TabsContent value="appearance" className="mt-4 space-y-4">
            <div className="grid gap-4">
              <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right text-indigo-900">Image</Label>
                <div className="col-span-3">
                  <div className="border-2 border-dashed border-indigo-300 rounded-lg p-6 flex flex-col items-center justify-center bg-indigo-50">
                    <Camera className="h-8 w-8 text-indigo-400 mb-2" />
                    <p className="text-sm text-indigo-700 text-center mb-2">
                      Drag and drop an image, or click to browse
                    </p>
                    <Button variant="outline" size="sm" className="border-indigo-300">
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Image
                    </Button>
                  </div>
                  <p className="text-xs text-indigo-600 mt-1">Recommended: 800x800px, PNG or JPG format, max 5MB</p>
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right text-indigo-900">AR Effects</Label>
                <div className="col-span-3 flex items-center space-x-2">
                  <Switch checked={arEffectsEnabled} onCheckedChange={setArEffectsEnabled} />
                  <span className="text-indigo-900">Enable special AR effects</span>
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right text-indigo-900">Animation</Label>
                <Select value={animation} onValueChange={setAnimation}>
                  <SelectTrigger className="col-span-3 border-indigo-300">
                    <SelectValue placeholder="Select animation style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="rotate">Rotate</SelectItem>
                    <SelectItem value="pulse">Pulse</SelectItem>
                    <SelectItem value="float">Float</SelectItem>
                    <SelectItem value="sparkle">Sparkle</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right text-indigo-900">Sound Effect</Label>
                <Select value={soundEffect} onValueChange={setSoundEffect}>
                  <SelectTrigger className="col-span-3 border-indigo-300">
                    <SelectValue placeholder="Select sound effect" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="drum">Drum Beat</SelectItem>
                    <SelectItem value="chime">Chime</SelectItem>
                    <SelectItem value="nature">Nature Sounds</SelectItem>
                    <SelectItem value="celebration">Celebration</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab("basic")} className="border-indigo-300">
                Back: Basic Info
              </Button>
              <Button onClick={() => setActiveTab("placement")} className="bg-sunset-600 hover:bg-sunset-700">
                Next: Placement <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </TabsContent>

          {/* PLACEMENT TAB (Add your map/location logic here later) */}
          <TabsContent value="placement" className="mt-4">
            <div className="h-40 bg-indigo-100 border border-indigo-300 rounded-lg flex items-center justify-center">
              <MapPin className="h-8 w-8 text-indigo-400" />
              <span className="ml-2 text-indigo-700">Location selector coming soon...</span>
            </div>

            <div className="flex justify-between mt-4">
              <Button variant="outline" onClick={() => setActiveTab("appearance")} className="border-indigo-300">
                Back: Appearance
              </Button>
              <Button onClick={handleAddTreasure} className="bg-sunset-600 hover:bg-sunset-700">
                Save Treasure
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
