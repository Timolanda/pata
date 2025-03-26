"use client"

import { useState } from "react"
import { Award, Layout, Palette, Plus, Star } from "lucide-react"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "@/hooks/use-toast"

interface ShowcaseButtonProps {
  variant?: "default" | "outline" | "secondary" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
}

export function ShowcaseButton({ variant = "default", size = "default", className = "" }: ShowcaseButtonProps) {
  const [open, setOpen] = useState(false)
  const [showcaseName, setShowcaseName] = useState("")
  const [showcaseTheme, setShowcaseTheme] = useState("museum")

  const handleCreateShowcase = () => {
    if (!showcaseName.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter a name for your showcase",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Showcase Created",
      description: `Your "${showcaseName}" showcase has been created with the ${showcaseTheme} theme`,
    })

    setOpen(false)
    setShowcaseName("")
    setShowcaseTheme("museum")

    // In a real app, this would navigate to the new showcase
    // router.push(`/showcase/${showcaseId}`)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} size={size} className={`bg-gold-600 hover:bg-gold-700 text-indigo-900 ${className}`}>
          <Award className="mr-2 h-4 w-4" />
          Create Showcase
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] border-gold-300 bg-gradient-to-b from-indigo-50 to-gold-50">
        <DialogHeader>
          <DialogTitle className="text-indigo-900 flex items-center">
            <Award className="mr-2 h-5 w-5 text-gold-600" />
            Create Digital Showcase
          </DialogTitle>
          <DialogDescription className="text-indigo-700">
            Design a virtual gallery to display your most prized treasures
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right text-indigo-900">
              Name
            </Label>
            <Input
              id="name"
              placeholder="My African Treasures"
              className="col-span-3 border-indigo-300"
              value={showcaseName}
              onChange={(e) => setShowcaseName(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right text-indigo-900 pt-2">Theme</Label>
            <RadioGroup value={showcaseTheme} onValueChange={setShowcaseTheme} className="col-span-3 space-y-2">
              <div className="flex items-center space-x-2 bg-white p-2 rounded-md border border-indigo-200">
                <RadioGroupItem value="museum" id="museum" className="text-gold-600" />
                <Label htmlFor="museum" className="font-medium text-indigo-900 flex items-center">
                  <Layout className="mr-2 h-4 w-4 text-gold-600" />
                  Museum Gallery
                </Label>
                <span className="text-xs text-indigo-600 ml-auto">Classic</span>
              </div>

              <div className="flex items-center space-x-2 bg-white p-2 rounded-md border border-indigo-200">
                <RadioGroupItem value="tribal" id="tribal" className="text-sunset-600" />
                <Label htmlFor="tribal" className="font-medium text-indigo-900 flex items-center">
                  <Palette className="mr-2 h-4 w-4 text-sunset-600" />
                  Tribal Village
                </Label>
                <span className="text-xs text-indigo-600 ml-auto">Immersive</span>
              </div>

              <div className="flex items-center space-x-2 bg-white p-2 rounded-md border border-indigo-200">
                <RadioGroupItem value="royal" id="royal" className="text-electric-600" />
                <Label htmlFor="royal" className="font-medium text-indigo-900 flex items-center">
                  <Star className="mr-2 h-4 w-4 text-electric-600" />
                  Royal Treasury
                </Label>
                <span className="text-xs text-indigo-600 ml-auto">Premium</span>
              </div>
            </RadioGroup>
          </div>

          <div className="bg-gold-100 p-3 rounded-lg border border-gold-300 mt-2">
            <div className="flex">
              <div className="bg-gold-200 p-1 rounded-full mr-2">
                <Award className="h-4 w-4 text-gold-700" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-indigo-900">Showcase Benefits</h4>
                <p className="text-xs text-indigo-700">
                  Share your collection with friends, earn special badges, and unlock exclusive rewards
                </p>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} className="border-indigo-300">
            Cancel
          </Button>
          <Button onClick={handleCreateShowcase} className="bg-gold-600 hover:bg-gold-700 text-indigo-900">
            <Plus className="mr-2 h-4 w-4" />
            Create Showcase
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

