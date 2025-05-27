"use client"

import { useState } from "react"
import { Plus, Gem, MapPin, Camera, Upload, Sparkles, AlertTriangle, ArrowRight } from "lucide-react"
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
import { MapComponent } from "@/components/MapComponent"

interface CreateTreasureButtonProps {
  variant?: "default" | "outline" | "secondary" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
  isPartner?: boolean
}

export function CreateTreasureButton({
  variant = "outline",
  size = "default",
  className = "",
  isPartner = true,
}: CreateTreasureButtonProps) {
  const [open, setOpen] = useState(false)
  const [treasureName, setTreasureName] = useState("")
  const [treasureType, setTreasureType] = useState("mask")
  const [treasureRarity, setTreasureRarity] = useState("common")
  const [activeTab, setActiveTab] = useState("basic")
  const [hasPartnership, setHasPartnership] = useState(isPartner)
  const [coordinates, setCoordinates] = useState("")
  const userLocation = { lat: -1.2921, lng: 36.8219 }
  
  const handleCreateTreasure = () => {
    if (!treasureName.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter a name for your treasure",
        variant: "destructive",
      })
      return
    }

    if (!hasPartnership) {
      toast({
        title: "Partnership Required",
        description: "You need to apply for a partnership first",
        variant: "destructive",
      })
      return
    }

    if (!coordinates.trim()) {
      toast({
        title: "Location Required",
        description: "Please select a location for your treasure",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Treasure Created",
      description: `Your "${treasureName}" treasure has been created at ${coordinates}`,
    })

    setOpen(false)
    setTreasureName("")
    setTreasureType("mask")
    setTreasureRarity("common")
    setActiveTab("basic")
    setCoordinates("")
  }

  const handleApplyPartnership = () => {
    toast({
      title: "Partnership Application",
      description: "Opening partnership application form",
    })

    // In a real app, this would navigate to the partnership application form
    setHasPartnership(true)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} size={size} className={`w-full justify-start ${className}`}>
          <Plus className="mr-2 h-4 w-4" />
          Create New Treasure
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] border-electric-300 bg-gradient-to-b from-indigo-50 to-electric-50">
        <DialogHeader>
          <DialogTitle className="text-indigo-900 flex items-center">
            <Gem className="mr-2 h-5 w-5 text-electric-600" />
            Create New Treasure
          </DialogTitle>
          <DialogDescription className="text-indigo-700">
            Design a unique treasure for PATA users to discover
          </DialogDescription>
        </DialogHeader>

        {!hasPartnership ? (
          <div className="py-6">
            <div className="bg-sunset-100 p-4 rounded-lg border border-sunset-300 mb-4">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-sunset-600 mr-2 mt-0.5" />
                <div>
                  <h4 className="font-medium text-indigo-900">Partnership Required</h4>
                  <p className="text-sm text-indigo-700 mb-3">
                    You need to be a PATA partner to create treasures. Apply for a partnership to get started.
                  </p>
                  <Button onClick={handleApplyPartnership} className="bg-sunset-600 hover:bg-sunset-700">
                    Apply for Partnership <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <Tabs defaultValue="basic" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-3 bg-indigo-100 text-indigo-900">
                <TabsTrigger
                  value="basic"
                  className="data-[state=active]:bg-electric-600 data-[state=active]:text-white"
                >
                  Basic Info
                </TabsTrigger>
                <TabsTrigger
                  value="appearance"
                  className="data-[state=active]:bg-electric-600 data-[state=active]:text-white"
                >
                  Appearance
                </TabsTrigger>
                <TabsTrigger
                  value="placement"
                  className="data-[state=active]:bg-electric-600 data-[state=active]:text-white"
                >
                  Placement
                </TabsTrigger>
              </TabsList>

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
                    <Label htmlFor="treasureType" className="text-right text-indigo-900">
                      Type
                    </Label>
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
                    <Label htmlFor="treasureRarity" className="text-right text-indigo-900">
                      Rarity
                    </Label>
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
                    <Label htmlFor="description" className="text-right text-indigo-900 pt-2">
                      Description
                    </Label>
                    <textarea
                      id="description"
                      className="col-span-3 border border-indigo-300 rounded-md p-2 h-20"
                      placeholder="Describe your treasure and its cultural significance..."
                    />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="pointValue" className="text-right text-indigo-900">
                      Point Value
                    </Label>
                    <div className="col-span-3 flex items-center space-x-2">
                      <Slider defaultValue={[50]} max={500} step={10} className="flex-1 [&>span]:bg-electric-600" />
                      <span className="w-12 text-center text-indigo-900 font-medium">50</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={() => setActiveTab("appearance")} className="bg-electric-600 hover:bg-electric-700">
                    Next: Appearance <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="appearance" className="mt-4 space-y-4">
                <div className="grid gap-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="color" className="text-right text-indigo-900">
                      Color
                    </Label>
                    <Input
                      id="color"
                      placeholder="#FF5733"
                      className="col-span-3 border-indigo-300"
                    />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="material" className="text-right text-indigo-900">
                      Material
                    </Label>
                    <Input
                      id="material"
                      placeholder="Wood, Clay, Leather"
                      className="col-span-3 border-indigo-300"
                    />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="shape" className="text-right text-indigo-900">
                      Shape
                    </Label>
                    <Input
                      id="shape"
                      placeholder="Circular, Rectangular, Animal-Shaped"
                      className="col-span-3 border-indigo-300"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={() => setActiveTab("placement")} className="bg-electric-600 hover:bg-electric-700">
                    Next: Placement <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="placement" className="mt-4 space-y-4">
                <div className="grid gap-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="location" className="text-right text-indigo-900">
                      Select Location
                    </Label>
                    <MapComponent
                      userLocation={userLocation} // Pass userLocation here
                      treasureLocation={{ lat: -1.2921, lng: 36.8219 }} // Example location for a treasure
                      zoom={15}
                    />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="coordinates" className="text-right text-indigo-900">
                      Coordinates
                    </Label>
                    <Input
                      id="coordinates"
                      value={coordinates}
                      readOnly
                      className="col-span-3 border-indigo-300"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleCreateTreasure} className="bg-electric-600 hover:bg-electric-700">
                    Create Treasure <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
