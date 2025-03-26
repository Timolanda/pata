"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { TrendingUp, Gem, Users, BarChart2, Clock, Award } from "lucide-react"
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
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"

interface TrendingExploreButtonProps {
  variant?: "default" | "outline" | "secondary" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
  collection: {
    id: string
    name: string
    volume: string
    change: string
    items: number
    owners: number
    floorPrice: string
  }
}

export function TrendingExploreButton({
  variant = "ghost",
  size = "sm",
  className = "",
  collection,
}: TrendingExploreButtonProps) {
  const [open, setOpen] = useState(false)

  const handleExplore = () => {
    toast({
      title: "Exploring Collection",
      description: `Viewing all items in the ${collection.name} collection`,
    })

    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} size={size} className={`h-7 px-2 text-xs text-sunset-700 ${className}`}>
          Explore
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] border-sunset-300 bg-gradient-to-b from-indigo-50 to-sunset-50">
        <DialogHeader>
          <DialogTitle className="text-indigo-900 flex items-center">
            <TrendingUp className="mr-2 h-5 w-5 text-sunset-600" />
            Trending Collection
          </DialogTitle>
          <DialogDescription className="text-indigo-700">
            Explore the popular {collection.name} collection
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div className="relative h-40 rounded-lg overflow-hidden">
            <Image src="/placeholder.svg?height=160&width=600" alt={collection.name} fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-indigo-900 to-transparent opacity-70" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h2 className="text-xl font-bold text-white">{collection.name}</h2>
              <div className="flex items-center mt-1">
                <Badge className="bg-sunset-600">{collection.change} this week</Badge>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <StatCard
              icon={<Gem className="h-5 w-5 text-sunset-600" />}
              label="Items"
              value={collection.items.toString()}
            />

            <StatCard
              icon={<Users className="h-5 w-5 text-sunset-600" />}
              label="Owners"
              value={collection.owners.toString()}
            />

            <StatCard
              icon={<Award className="h-5 w-5 text-sunset-600" />}
              label="Floor Price"
              value={collection.floorPrice}
            />
          </div>

          <div className="bg-white p-4 rounded-lg border border-indigo-200">
            <h3 className="font-bold text-indigo-900 mb-3 flex items-center">
              <BarChart2 className="mr-2 h-5 w-5 text-sunset-600" />
              Trading Activity
            </h3>

            <div className="h-40 bg-indigo-50 rounded-lg flex items-center justify-center mb-3">
              <BarChart2 className="h-8 w-8 text-indigo-400" />
              <span className="ml-2 text-indigo-400">Activity Chart</span>
            </div>

            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center text-indigo-700">
                <Clock className="h-4 w-4 mr-1" />
                Last updated: 2 hours ago
              </div>
              <Button variant="outline" size="sm" className="border-indigo-300">
                View Analytics
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="relative h-24 rounded-lg overflow-hidden border border-indigo-200">
                <Image
                  src={`/placeholder.svg?height=96&width=96`}
                  alt={`Collection item ${i}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} className="border-indigo-300">
            Close
          </Button>
          <Button onClick={handleExplore} className="bg-sunset-600 hover:bg-sunset-700">
            <Gem className="mr-2 h-4 w-4" />
            Explore Collection
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="bg-white p-3 rounded-lg border border-indigo-200 flex flex-col items-center">
      <div className="mb-1">{icon}</div>
      <p className="text-xs text-indigo-700">{label}</p>
      <p className="font-bold text-indigo-900">{value}</p>
    </div>
  )
}

