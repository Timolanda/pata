"use client"

import { useState } from "react"
import { Calendar, MapPin, Plus, CalendarDays, Info } from "lucide-react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/hooks/use-toast"

interface ScheduleEventButtonProps {
  variant?: "default" | "outline" | "secondary" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
}

export function ScheduleEventButton({
  variant = "outline",
  size = "default",
  className = "",
}: ScheduleEventButtonProps) {
  const [open, setOpen] = useState(false)
  const [eventName, setEventName] = useState("")
  const [eventDate, setEventDate] = useState("")
  const [eventTime, setEventTime] = useState("")
  const [eventDuration, setEventDuration] = useState("2")
  const [isPublic, setIsPublic] = useState(true)

  const handleScheduleEvent = () => {
    if (!eventName.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter a name for your event",
        variant: "destructive",
      })
      return
    }

    if (!eventDate) {
      toast({
        title: "Date Required",
        description: "Please select a date for your event",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Event Scheduled",
      description: `"${eventName}" has been scheduled for ${eventDate}`,
    })

    setOpen(false)
    setEventName("")
    setEventDate("")
    setEventTime("")
    setEventDuration("2")
    setIsPublic(true)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} size={size} className={`w-full justify-start border-indigo-300 ${className}`}>
          <Calendar className="mr-2 h-4 w-4" />
          Schedule Event
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] border-indigo-300">
        <DialogHeader>
          <DialogTitle className="text-indigo-900 flex items-center">
            <CalendarDays className="mr-2 h-5 w-5 text-indigo-600" />
            Schedule Treasure Hunt Event
          </DialogTitle>
          <DialogDescription className="text-indigo-700">
            Create a special event with unique treasures and rewards
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="eventName" className="text-right text-indigo-900">
              Event Name
            </Label>
            <Input
              id="eventName"
              placeholder="Cultural Festival"
              className="col-span-3 border-indigo-300"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="eventDate" className="text-right text-indigo-900">
              Date
            </Label>
            <Input
              id="eventDate"
              type="date"
              className="col-span-3 border-indigo-300"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="eventTime" className="text-right text-indigo-900">
              Start Time
            </Label>
            <Input
              id="eventTime"
              type="time"
              className="col-span-3 border-indigo-300"
              value={eventTime}
              onChange={(e) => setEventTime(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="eventDuration" className="text-right text-indigo-900">
              Duration
            </Label>
            <Select value={eventDuration} onValueChange={setEventDuration}>
              <SelectTrigger className="col-span-3 border-indigo-300">
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 hour</SelectItem>
                <SelectItem value="2">2 hours</SelectItem>
                <SelectItem value="3">3 hours</SelectItem>
                <SelectItem value="4">4 hours</SelectItem>
                <SelectItem value="6">6 hours</SelectItem>
                <SelectItem value="8">8 hours</SelectItem>
                <SelectItem value="12">12 hours</SelectItem>
                <SelectItem value="24">All day (24 hours)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="eventLocation" className="text-right text-indigo-900 pt-2">
              Location
            </Label>
            <div className="col-span-3">
              <Input id="eventLocation" placeholder="Event location" className="border-indigo-300 mb-2" />
              <div className="h-32 bg-indigo-100 rounded-lg flex items-center justify-center mb-1 border border-indigo-300">
                <MapPin className="h-6 w-6 text-indigo-400" />
                <span className="ml-2 text-indigo-600">Map View</span>
              </div>
              <p className="text-xs text-indigo-600">Select a location or enter an address</p>
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="maxParticipants" className="text-right text-indigo-900">
              Max Participants
            </Label>
            <Input
              id="maxParticipants"
              type="number"
              min="1"
              placeholder="Unlimited"
              className="col-span-3 border-indigo-300"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="treasureCount" className="text-right text-indigo-900">
              Treasures
            </Label>
            <div className="col-span-3 flex items-center space-x-2">
              <Input id="treasureCount" type="number" min="1" defaultValue="5" className="w-20 border-indigo-300" />
              <Button variant="outline" size="sm" className="border-indigo-300">
                <Plus className="mr-1 h-4 w-4" />
                Select Treasures
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="isPublic" className="text-right text-indigo-900">
              Public Event
            </Label>
            <div className="col-span-3 flex items-center space-x-2">
              <Switch
                id="isPublic"
                checked={isPublic}
                onCheckedChange={setIsPublic}
                className="data-[state=checked]:bg-indigo-600"
              />
              <span className="text-indigo-900">{isPublic ? "Visible to all PATA users" : "Invitation only"}</span>
            </div>
          </div>

          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="eventDescription" className="text-right text-indigo-900 pt-2">
              Description
            </Label>
            <textarea
              id="eventDescription"
              className="col-span-3 border border-indigo-300 rounded-md p-2 h-20"
              placeholder="Describe your event and what participants can expect..."
            />
          </div>

          <div className="bg-indigo-100 p-3 rounded-lg border border-indigo-300 mt-2">
            <div className="flex items-start">
              <Info className="h-5 w-5 text-indigo-600 mr-2 mt-0.5" />
              <div>
                <h4 className="font-medium text-indigo-900">Event Tips</h4>
                <p className="text-sm text-indigo-700">
                  Events with special treasures and higher point values attract more participants. Consider offering
                  exclusive rewards for event completion.
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} className="border-indigo-300">
            Cancel
          </Button>
          <Button onClick={handleScheduleEvent} className="bg-indigo-700 hover:bg-indigo-800">
            <Calendar className="mr-2 h-4 w-4" />
            Schedule Event
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

