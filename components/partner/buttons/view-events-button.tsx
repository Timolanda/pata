"use client"

import { useState } from "react"
import { Calendar, ChevronLeft, ChevronRight, Plus, Search, MapPin, Users, Clock } from "lucide-react"
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
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"

interface ViewEventsButtonProps {
  variant?: "default" | "outline" | "secondary" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
}

export function ViewEventsButton({ variant = "outline", size = "default", className = "" }: ViewEventsButtonProps) {
  const [open, setOpen] = useState(false)
  const [filterStatus, setFilterStatus] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentMonth, setCurrentMonth] = useState("November 2023")

  const handlePreviousMonth = () => {
    setCurrentMonth("October 2023")
  }

  const handleNextMonth = () => {
    setCurrentMonth("December 2023")
  }

  const handleCreateEvent = () => {
    toast({
      title: "Create New Event",
      description: "Opening event creation form",
    })

    // In a real app, this would open the event creation form
    // or navigate to the event creation page
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} size={size} className={`w-full mt-3 border-indigo-300 ${className}`}>
          View All Events
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] border-indigo-300">
        <DialogHeader>
          <DialogTitle className="text-indigo-900 flex items-center">
            <Calendar className="mr-2 h-5 w-5 text-indigo-600" />
            Partner Events
          </DialogTitle>
          <DialogDescription className="text-indigo-700">
            Manage your treasure hunt events and special promotions
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={handlePreviousMonth} className="text-indigo-700">
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <h3 className="text-lg font-bold text-indigo-900 mx-2">{currentMonth}</h3>
            <Button variant="ghost" size="icon" onClick={handleNextMonth} className="text-indigo-700">
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-indigo-400" />
              <Input
                placeholder="Search events..."
                className="pl-8 border-indigo-300 w-40 h-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[130px] border-indigo-300 h-9">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Events</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="past">Past</SelectItem>
              </SelectContent>
            </Select>

            <Button size="sm" onClick={handleCreateEvent} className="bg-sunset-600 hover:bg-sunset-700">
              <Plus className="mr-1 h-4 w-4" />
              New Event
            </Button>
          </div>
        </div>

        <div className="mt-4 space-y-3 max-h-[400px] overflow-y-auto pr-2">
          <EventCard
            name="Cultural Festival"
            date="Nov 15, 2023"
            time="10:00 AM - 6:00 PM"
            location="National Museum"
            treasures={5}
            participants={120}
            status="upcoming"
          />

          <EventCard
            name="Holiday Treasure Hunt"
            date="Dec 20, 2023"
            time="4:00 PM - 8:00 PM"
            location="City Center"
            treasures={8}
            participants={200}
            status="upcoming"
          />

          <EventCard
            name="New Year Special"
            date="Jan 1, 2024"
            time="12:00 PM - 4:00 PM"
            location="Waterfront Park"
            treasures={3}
            participants={150}
            status="upcoming"
          />

          <EventCard
            name="Heritage Day Celebration"
            date="Oct 25, 2023"
            time="9:00 AM - 5:00 PM"
            location="Cultural Center"
            treasures={6}
            participants={180}
            status="past"
          />

          <EventCard
            name="Autumn Festival"
            date="Sep 30, 2023"
            time="11:00 AM - 7:00 PM"
            location="Botanical Gardens"
            treasures={4}
            participants={95}
            status="past"
          />

          <EventCard
            name="Summer Treasure Hunt"
            date="Aug 15, 2023"
            time="10:00 AM - 2:00 PM"
            location="Beach Promenade"
            treasures={7}
            participants={210}
            status="past"
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}

function EventCard({
  name,
  date,
  time,
  location,
  treasures,
  participants,
  status,
}: {
  name: string
  date: string
  time: string
  location: string
  treasures: number
  participants: number
  status: "upcoming" | "active" | "past"
}) {
  const statusColors = {
    upcoming: "bg-jungle-100 text-jungle-800 border-jungle-200",
    active: "bg-sunset-100 text-sunset-800 border-sunset-200",
    past: "bg-indigo-100 text-indigo-800 border-indigo-200",
  }

  const handleViewEvent = () => {
    toast({
      title: "View Event Details",
      description: `Opening details for ${name}`,
    })
  }

  return (
    <div
      className={`p-4 rounded-lg border ${status === "upcoming" ? "border-jungle-200" : status === "active" ? "border-sunset-200" : "border-indigo-200"}`}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold text-indigo-900">{name}</h3>
          <div className="flex items-center mt-1 text-sm text-indigo-700">
            <Calendar className="h-4 w-4 mr-1" />
            <span>{date}</span>
            <span className="mx-1">•</span>
            <Clock className="h-4 w-4 mr-1" />
            <span>{time}</span>
          </div>
          <div className="flex items-center mt-1 text-sm text-indigo-700">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{location}</span>
          </div>
        </div>

        <Badge className={statusColors[status]}>
          {status === "upcoming" ? "Upcoming" : status === "active" ? "Active" : "Past"}
        </Badge>
      </div>

      <div className="flex items-center justify-between mt-3">
        <div className="flex space-x-4">
          <div className="flex items-center text-sm">
            <div className="w-2 h-2 rounded-full bg-electric-600 mr-1"></div>
            <span className="text-indigo-900">{treasures} Treasures</span>
          </div>
          <div className="flex items-center text-sm">
            <Users className="h-4 w-4 text-indigo-600 mr-1" />
            <span className="text-indigo-900">{participants} Participants</span>
          </div>
        </div>

        <div className="flex space-x-2">
          {status === "past" && (
            <Button variant="outline" size="sm" className="h-8 border-indigo-300">
              View Report
            </Button>
          )}
          <Button
            size="sm"
            className={`h-8 ${status === "upcoming" ? "bg-jungle-600 hover:bg-jungle-700" : status === "active" ? "bg-sunset-600 hover:bg-sunset-700" : "bg-indigo-600 hover:bg-indigo-700"}`}
            onClick={handleViewEvent}
          >
            View Details
          </Button>
        </div>
      </div>
    </div>
  )
}

