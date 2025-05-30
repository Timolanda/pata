"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Building, MapPin, CheckCircle, ArrowRight, Gift, Calendar, Star, Zap, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PartnerApplicationForm } from "@/components/partner-application-form"

export function PartnerScreen() {
  const [showApplicationForm, setShowApplicationForm] = useState(false)

  return (
    <div className="h-full bg-indigo-50">
      {showApplicationForm ? (
        <PartnerApplicationForm onBack={() => setShowApplicationForm(false)} />
      ) : (
        <>
          <div className="relative h-48 bg-indigo-800">
            <Image
              src="/placeholder.svg?height=200&width=400"
              alt="Partner Banner"
              fill
              className="object-cover opacity-70"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
              <h1 className="text-2xl font-bold text-indigo-50 mb-2">PATA Partnership Program</h1>
              <p className="text-indigo-100 max-w-xs">Unlocking Africa's Hidden Treasures Through Augmented Reality</p>
            </div>
          </div>

          <div className="p-4">
            <Card className="bg-indigo-100 border-indigo-300 mb-6">
              <CardContent className="p-4">
                <h2 className="text-lg font-bold text-indigo-900 mb-3">What is PATA?</h2>
                <p className="text-indigo-800 mb-4">
                  PATA (Swahili for "to find") is Africa's first Augmented Reality (AR) treasure hunt, designed to blend
                  culture, tourism, and gamification. This innovative platform drives foot traffic to real-world
                  businesses while providing players with an immersive and rewarding experience.
                </p>
                <div className="relative h-40 rounded-lg overflow-hidden mb-4">
                  <Image
                    src="/placeholder.svg?height=160&width=400"
                    alt="PATA AR Experience"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-indigo-900 to-transparent opacity-60" />
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <p className="text-indigo-50 text-sm">
                      The app overlays digital treasures onto real-world locations
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="opportunities" className="w-full mb-6">
              <TabsList className="grid grid-cols-2 bg-indigo-700 text-indigo-100 rounded-none">
                <TabsTrigger value="opportunities" className="data-[state=active]:bg-indigo-800">
                  Partnership Options
                </TabsTrigger>
                <TabsTrigger value="impact" className="data-[state=active]:bg-indigo-800">
                  Business Impact
                </TabsTrigger>
              </TabsList>

              <TabsContent value="opportunities" className="mt-4">
                <h2 className="text-lg font-bold text-indigo-900 mb-3">Business Partnership Opportunities</h2>
                <div className="space-y-4">
                  <PartnershipOption
                    icon={<Building className="h-6 w-6" />}
                    title="Become a Treasure Host"
                    description="Place AR treasures at your location to attract visitors and encourage exploration within your space."
                  />
                  <PartnershipOption
                    icon={<Gift className="h-6 w-6" />}
                    title="Offer Exclusive Rewards"
                    description="Provide players with discounts, free products, or experiences in exchange for treasure discovery."
                  />
                  <PartnershipOption
                    icon={<Calendar className="h-6 w-6" />}
                    title="Sponsor Special Events"
                    description="Host limited-time treasure hunts tied to brand promotions or festivals with branded AR relics."
                  />
                  <PartnershipOption
                    icon={<Star className="h-6 w-6" />}
                    title="Boost Digital Exposure"
                    description="Players share discoveries, tagging your business for organic marketing reach and user-generated content."
                  />
                </div>
              </TabsContent>

              <TabsContent value="impact" className="mt-4">
                <h2 className="text-lg font-bold text-indigo-900 mb-3">Expected Business Impact</h2>
                <div className="space-y-3">
                  <ImpactItem
                    percentage="20-30%"
                    title="Increase in foot traffic"
                    description="Drive new visitors to your location through gamification"
                  />
                  <ImpactItem
                    percentage="15-25%"
                    title="Higher conversion rates"
                    description="Turn visitors into paying customers"
                  />
                  <ImpactItem
                    percentage="40%+"
                    title="Increased social media presence"
                    description="Organic shares and user-generated content"
                  />
                  <ImpactItem
                    percentage="35%"
                    title="Enhanced customer experience"
                    description="More engaging and memorable visits"
                  />
                </div>
              </TabsContent>
            </Tabs>

            <h2 className="text-lg font-bold text-indigo-900 mb-3">How the Treasure Hunt Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
              <StepCard
                number={1}
                title="Download & Explore"
                description="Players download the PATA app and view the interactive map"
              />
              <StepCard
                number={2}
                title="Visit Locations"
                description="They visit real-world locations like your business"
              />
              <StepCard
                number={3}
                title="AR Scanning"
                description="Using AR, they uncover hidden relics or artifacts"
              />
              <StepCard
                number={4}
                title="Earn Rewards"
                description="Each discovery grants in-game and real-world rewards"
              />
            </div>

            <Card className="bg-indigo-100 border-indigo-300 mb-6">
              <CardContent className="p-4">
                <h2 className="text-lg font-bold text-indigo-900 mb-3">Why Partner with PATA?</h2>
                <div className="space-y-2">
                  <BenefitItem text="Innovative & Unique – Be part of Africa's first large-scale AR treasure hunt" />
                  <BenefitItem text="Drives Foot Traffic – Attract new customers through gamification" />
                  <BenefitItem text="Enhances Customer Experience – Engage visitors in a fun, interactive way" />
                  <BenefitItem text="Boosts Sales & Loyalty – Rewards create a direct incentive to visit and spend" />
                  <BenefitItem text="Leverages Cutting-Edge Technology – Position your brand at the forefront of digital transformation" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-sunset-600 to-sunset-800 text-indigo-50 mb-6">
              <CardContent className="p-4">
                <div className="flex items-start">
                  <div className="mr-4">
                    <Zap className="h-10 w-10" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-1">Ready to Join?</h3>
                    <p className="text-sm text-indigo-100 mb-3">
                      Showcase your business to thousands of explorers and boost your customer engagement
                    </p>
                    <Button
                      className="bg-indigo-50 text-indigo-800 hover:bg-indigo-200"
                      onClick={() => setShowApplicationForm(true)}
                    >
                      Apply Now <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <h2 className="text-lg font-bold text-indigo-900 mb-3">Featured Partners</h2>
            <div className="space-y-3">
              <PartnerCard
                name="National Museum of African Art"
                category="Museums"
                location="Nairobi, Kenya"
                image="/placeholder.svg?height=80&width=80"
              />
              <PartnerCard
                name="Maasai Market Crafts"
                category="Markets"
                location="Arusha, Tanzania"
                image="/placeholder.svg?height=80&width=80"
              />
              <PartnerCard
                name="Savanna Cuisine Restaurant"
                category="Restaurants"
                location="Cape Town, South Africa"
                image="/placeholder.svg?height=80&width=80"
              />
            </div>

            <p className="text-lg text-gray-600 mb-6">
              Let&apos;s make your location a treasure trove of experiences!
            </p>
            <p className="text-sm text-gray-500 italic">
              &quot;Join us in creating magical moments for explorers&quot; - PATA Team
            </p>
          </div>
        </>
      )}
    </div>
  )
}

function PartnershipOption({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <Card className="overflow-hidden border-indigo-300">
      <CardContent className="p-4">
        <div className="flex items-start">
          <div className="mr-3 text-sunset-600 bg-indigo-100 p-2 rounded-full">{icon}</div>
          <div>
            <h3 className="font-bold text-indigo-900">{title}</h3>
            <p className="text-sm text-indigo-700">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function ImpactItem({
  percentage,
  title,
  description,
}: {
  percentage: string
  title: string
  description: string
}) {
  return (
    <Card className="overflow-hidden border-indigo-300">
      <CardContent className="p-3 flex items-center">
        <div className="w-16 h-16 bg-indigo-600 text-indigo-50 rounded-full flex items-center justify-center text-xl font-bold mr-3">
          {percentage}
        </div>
        <div>
          <h3 className="font-bold text-indigo-900">{title}</h3>
          <p className="text-sm text-indigo-700">{description}</p>
        </div>
      </CardContent>
    </Card>
  )
}

function StepCard({
  number,
  title,
  description,
}: {
  number: number
  title: string
  description: string
}) {
  return (
    <Card className="overflow-hidden border-indigo-300">
      <CardContent className="p-3 flex items-center">
        <div className="w-10 h-10 bg-indigo-600 text-indigo-50 rounded-full flex items-center justify-center text-lg font-bold mr-3">
          {number}
        </div>
        <div>
          <h3 className="font-bold text-indigo-900">{title}</h3>
          <p className="text-sm text-indigo-700">{description}</p>
        </div>
      </CardContent>
    </Card>
  )
}

function BenefitItem({
  text,
}: {
  text: string
}) {
  return (
    <div className="flex items-start">
      <div className="mr-2 text-sunset-600 mt-0.5">
        <Check className="h-5 w-5" />
      </div>
      <p className="text-sm text-indigo-800">{text}</p>
    </div>
  )
}

function PartnerCard({
  name,
  category,
  location,
  image,
}: {
  name: string
  category: string
  location: string
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
                <div className="flex items-center text-xs text-sunset-600 mt-1">
                  <MapPin className="h-3 w-3 mr-1" />
                  {location}
                </div>
              </div>
              <CheckCircle className="h-5 w-5 text-sunset-600" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

