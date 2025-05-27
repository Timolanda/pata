"use client"

import { useState } from "react"
import Image from "next/image"
import { User, MapPin, Globe, Save, Camera } from "lucide-react"
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
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"

interface EditProfileButtonProps {
  variant?: "default" | "outline" | "secondary" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
  userData?: {
    name: string
    email: string
    bio: string
    location: string
    phone: string
    website: string
  }
}

export function EditProfileButton({
  variant = "default",
  size = "default",
  className = "",
  userData = {
    name: "Amara Okafor",
    email: "amara@example.com",
    bio: "Explorer and treasure hunter passionate about African culture and history.",
    location: "Nairobi, Kenya",
    phone: "+254 123 456789",
    website: "amaraokafor.com",
  },
}: EditProfileButtonProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState(userData)

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSave = () => {
    if (!formData.name.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter your name",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved",
    })

    setOpen(false)
  }

  const handleUploadAvatar = () => {
    toast({
      title: "Upload Avatar",
      description: "Opening file selector for new profile image",
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={`bg-sunset-600 hover:bg-sunset-700 text-indigo-50 ${className}`}
        >
          Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] border-sunset-300 bg-gradient-to-b from-indigo-50 to-sunset-50">
        <DialogHeader>
          <DialogTitle className="text-indigo-900 flex items-center">
            <User className="mr-2 h-5 w-5 text-sunset-600" />
            Edit Profile
          </DialogTitle>
          <DialogDescription className="text-indigo-700">
            Update your personal information and preferences
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div className="flex justify-center mb-2">
            <div className="relative">
              <div className="relative w-24 h-24 rounded-full border-4 border-indigo-50 overflow-hidden bg-indigo-200">
                <Image src="/placeholder.svg?height=96&width=96" alt="Profile Picture" fill className="object-cover" />
              </div>
              <Button
                size="icon"
                className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-sunset-600 hover:bg-sunset-700"
                onClick={handleUploadAvatar}
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right text-indigo-900">
                Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="col-span-3 border-indigo-300"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right text-indigo-900">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="col-span-3 border-indigo-300"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right text-indigo-900">
                Phone
              </Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                className="col-span-3 border-indigo-300"
              />
            </div>

            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="bio" className="text-right text-indigo-900 pt-2">
                Bio
              </Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => handleChange("bio", e.target.value)}
                className="col-span-3 border-indigo-300 min-h-[80px]"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="location" className="text-right text-indigo-900">
                Location
              </Label>
              <div className="col-span-3 flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-sunset-600" />
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleChange("location", e.target.value)}
                  className="border-indigo-300"
                />
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="website" className="text-right text-indigo-900">
                Website
              </Label>
              <div className="col-span-3 flex items-center space-x-2">
                <Globe className="h-5 w-5 text-sunset-600" />
                <Input
                  id="website"
                  value={formData.website}
                  onChange={(e) => handleChange("website", e.target.value)}
                  className="border-indigo-300"
                />
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="language" className="text-right text-indigo-900">
                Language
              </Label>
              <Select defaultValue="en">
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
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} className="border-indigo-300">
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-sunset-600 hover:bg-sunset-700">
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

