"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Search, Filter, MapPin, Trophy, Star, Compass, Clock, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MapComponent } from "@/components/MapComponent"

export function ExploreScreen() {
  const [searchQuery, setSearchQuery] = useState("")
  const userLocation = { lat: -1.2921, lng: 36.8219 }
  
  return (
    <div className="h-full bg-indigo-50">
      <header className="bg-indigo-800 text-indigo-50 p-4">
        <h1 className="text-xl font-bold mb-3">Explore Treasures</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-400" />
          <Input
            placeholder="Search locations, treasures, categories..."
            className="pl-10 bg-indigo-700 border-indigo-600 text-indigo-50 placeholder:text-indigo-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button size="icon" className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 bg-indigo-600">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <Tabs defaultValue="featured" className="w-full">
        <TabsList className="grid grid-cols-3 bg-indigo-700 text-indigo-100 rounded-none">
          <TabsTrigger value="featured" className="data-[state=active]:bg-indigo-800">
            Featured
          </TabsTrigger>
          <TabsTrigger value="categories" className="data-[state=active]:bg-indigo-800">
            Categories
          </TabsTrigger>
          <TabsTrigger value="nearby" className="data-[state=active]:bg-indigo-800">
            Nearby
          </TabsTrigger>
        </TabsList>

        <TabsContent value="featured" className="m-0 p-4">
          <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="space-y-6">
              <section>
                <h2 className="text-lg font-bold text-indigo-900 mb-3 flex items-center">
                  <Star className="mr-2 h-5 w-5 text-gold-600" /> Featured Treasures
                </h2>
                <div className="relative h-48 rounded-xl overflow-hidden mb-4">
                  <Image
                    src="/placeholder.svg?height=200&width=400"
                    alt="Featured Treasure"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-indigo-900 to-transparent opacity-70" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <Badge className="bg-gold-600 text-indigo-900 mb-2">Limited Time</Badge>
                    <h3 className="text-xl font-bold text-white">Royal African Artifacts</h3>
                    <p className="text-indigo-100 text-sm">National Museum • 500 pts</p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-lg font-bold text-indigo-900 mb-3 flex items-center">
                  <Trophy className="mr-2 h-5 w-5 text-sunset-600" /> Top Rated Locations
                </h2>
                <div className="space-y-3">
                  <LocationCard
                    name="National Museum of African Art"
                    category="Museums"
                    rating={4.8}
                    treasures={12}
                    distance="0.5 km"
                    image="/placeholder.svg?height=80&width=80"
                  />
                  <LocationCard
                    name="Maasai Market Crafts"
                    category="Markets"
                    rating={4.6}
                    treasures={8}
                    distance="1.2 km"
                    image="/placeholder.svg?height=80&width=80"
                  />
                  <LocationCard
                    name="Savanna Cuisine Restaurant"
                    category="Restaurants"
                    rating={4.5}
                    treasures={5}
                    distance="0.8 km"
                    image="/placeholder.svg?height=80&width=80"
                  />
                </div>
              </section>

              <section>
                <h2 className="text-lg font-bold text-indigo-900 mb-3 flex items-center">
                  <Clock className="mr-2 h-5 w-5 text-electric-600" /> Limited Time Events
                </h2>
                <Card className="bg-gradient-to-r from-electric-100 to-indigo-100 border-electric-300">
                  <CardContent className="p-4">
                    <div className="flex items-start">
                      <div className="mr-3 bg-electric-200 p-2 rounded-lg">
                        <Compass className="h-8 w-8 text-electric-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-indigo-900">Cultural Heritage Week</h3>
                        <p className="text-sm text-indigo-700 mb-2">
                          Discover special treasures and earn 2x points at all museum locations
                        </p>
                        <div className="flex justify-between items-center">
                          <Badge className="bg-electric-600">Ends in 5 days</Badge>
                          <Button size="sm" className="bg-electric-600 hover:bg-electric-700">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="categories" className="m-0 p-4">
          <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="grid grid-cols-2 gap-3">
              <CategoryCard name="Museums" count={15} icon={<Compass className="h-6 w-6" />} color="bg-indigo-600" />
              <CategoryCard
                name="Markets"
                count={12}
                icon={<ShoppingBag className="h-6 w-6" />}
                color="bg-sunset-600"
              />
              <CategoryCard
                name="Restaurants"
                count={18}
                icon={<Utensils className="h-6 w-6" />}
                color="bg-jungle-600"
              />
              <CategoryCard
                name="Cultural Sites"
                count={10}
                icon={<Landmark className="h-6 w-6" />}
                color="bg-gold-600"
              />
              <CategoryCard name="Historical" count={8} icon={<Clock className="h-6 w-6" />} color="bg-electric-600" />
              <CategoryCard name="Art Galleries" count={6} icon={<Image className="h-6 w-6" />} color="bg-neon-600" />
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="nearby" className="m-0 p-4">
          <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="space-y-4">
              <div className="relative h-48 rounded-xl overflow-hidden mb-4">
              <MapComponent
              userLocation={userLocation}
              treasureLocation={{ lat: -1.2921, lng: 36.8219 }} // Example treasure location
              zoom={15}
              className="h-full w-full"
            />
                <div className="absolute top-2 right-2">
                  <Button size="sm" className="bg-indigo-800 hover:bg-indigo-900">
                    Open Full Map
                  </Button>
                </div>
              </div>

              <h2 className="text-lg font-bold text-indigo-900 mb-3 flex items-center">
                <MapPin className="mr-2 h-5 w-5 text-sunset-600" /> Treasures Within 2km
              </h2>

              <div className="space-y-3">
                <TreasureCard
                  title="Traditional Mask"
                  location="National Museum"
                  distance="0.5 km"
                  points={150}
                  image="/placeholder.svg?height=80&width=80"
                />
                <TreasureCard
                  title="Handwoven Basket"
                  location="Maasai Market"
                  distance="1.2 km"
                  points={100}
                  image="/placeholder.svg?height=80&width=80"
                />
                <TreasureCard
                  title="Tribal Jewelry"
                  location="Cultural Center"
                  distance="0.8 km"
                  points={120}
                  image="/placeholder.svg?height=80&width=80"
                />
                <TreasureCard
                  title="Ancient Drum"
                  location="Music Museum"
                  distance="1.5 km"
                  points={200}
                  image="/placeholder.svg?height=80&width=80"
                />
                <TreasureCard
                  title="Ceremonial Spear"
                  location="Historical Society"
                  distance="1.8 km"
                  points={180}
                  image="/placeholder.svg?height=80&width=80"
                />
              </div>
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function LocationCard({
  name,
  category,
  rating,
  treasures,
  distance,
  image,
}: {
  name: string
  category: string
  rating: number
  treasures: number
  distance: string
  image: string
}) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="flex">
          <div className="w-20 h-20 relative">
            <Image src={image || "/placeholder.svg"} alt={name} fill className="object-cover" />
          </div>
          <div className="p-3 flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-indigo-900">{name}</h3>
                <p className="text-xs text-indigo-700">{category}</p>
                <div className="flex items-center mt-1">
                  <Star className="h-3 w-3 text-gold-600 fill-gold-600 mr-1" />
                  <span className="text-xs text-indigo-700 mr-2">{rating}</span>
                  <Trophy className="h-3 w-3 text-sunset-600 mr-1" />
                  <span className="text-xs text-indigo-700">{treasures} treasures</span>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-xs text-indigo-600">{distance}</span>
                <ChevronRight className="h-5 w-5 text-indigo-400 mt-2" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function CategoryCard({
  name,
  count,
  icon,
  color,
}: {
  name: string
  count: number
  icon: React.ReactNode
  color: string
}) {
  return (
    <Card className="overflow-hidden border-indigo-200 hover:border-indigo-400 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-center">
          <div className={`${color} text-white p-3 rounded-lg mr-3`}>{icon}</div>
          <div>
            <h3 className="font-bold text-indigo-900">{name}</h3>
            <p className="text-xs text-indigo-700">{count} locations</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function TreasureCard({
  title,
  location,
  distance,
  points,
  image,
}: {
  title: string
  location: string
  distance: string
  points: number
  image: string
}) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="flex">
          <div className="w-20 h-20 relative">
            <Image src={image || "/placeholder.svg"} alt={title} fill className="object-cover" />
          </div>
          <div className="p-3 flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-indigo-900">{title}</h3>
                <div className="flex items-center text-xs text-indigo-600 mt-1">
                  <MapPin className="h-3 w-3 mr-1" />
                  {location}
                </div>
                <p className="text-xs text-indigo-600 mt-1">{distance} away</p>
              </div>
              <Badge className="bg-sunset-600">{points} pts</Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Import these components in the appropriate places
import { ShoppingBag, Utensils, Landmark } from "lucide-react"

