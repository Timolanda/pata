"use client"

import type React from "react"

import { useState } from "react"
import { ArrowLeft, Send, Building, MapPin, Phone, Mail, User, FileText, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/hooks/use-toast"

interface PartnerApplicationFormProps {
  onBack: () => void
}

export function PartnerApplicationForm({ onBack }: PartnerApplicationFormProps) {
  const [formStep, setFormStep] = useState(1)
  const [formData, setFormData] = useState({
    businessName: "",
    businessType: "",
    location: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    partnershipType: "",
    description: "",
    offerDetails: "",
    heardFrom: "",
    agreeTerms: false,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const updateFormData = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleNext = () => {
    if (formStep === 1) {
      // Validate first step
      if (!formData.businessName || !formData.businessType || !formData.location) {
        toast({
          title: "Missing information",
          description: "Please fill in all required fields",
          variant: "destructive",
        })
        return
      }
    }

    if (formStep === 2) {
      // Validate second step
      if (!formData.contactName || !formData.contactEmail || !formData.contactPhone) {
        toast({
          title: "Missing information",
          description: "Please fill in all required fields",
          variant: "destructive",
        })
        return
      }
    }

    setFormStep((prev) => prev + 1)
  }

  const handleBack = () => {
    if (formStep > 1) {
      setFormStep((prev) => prev - 1)
    } else {
      onBack()
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate final step
    if (!formData.partnershipType || !formData.description || !formData.agreeTerms) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields and agree to the terms",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      toast({
        title: "Application submitted!",
        description: "We'll review your application and contact you soon.",
      })
      onBack()
    }, 1500)
  }

  return (
    <div className="p-4">
      <Button variant="ghost" className="mb-4 text-indigo-800" onClick={handleBack}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>

      <Card className="border-indigo-300">
        <CardHeader className="bg-indigo-100">
          <CardTitle className="text-indigo-900">PATA Partnership Application</CardTitle>
          <CardDescription>Join our network of African businesses and cultural sites</CardDescription>
          <div className="flex justify-between mt-4">
            <div
              className={`flex-1 h-2 ${formStep >= 1 ? "bg-sunset-600" : "bg-indigo-200"} mr-1 rounded-l-full`}
            ></div>
            <div className={`flex-1 h-2 ${formStep >= 2 ? "bg-sunset-600" : "bg-indigo-200"} mx-1`}></div>
            <div
              className={`flex-1 h-2 ${formStep >= 3 ? "bg-sunset-600" : "bg-indigo-200"} ml-1 rounded-r-full`}
            ></div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <form onSubmit={handleSubmit}>
            {formStep === 1 && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-indigo-900 flex items-center">
                  <Building className="mr-2 h-5 w-5" /> Business Information
                </h2>

                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name *</Label>
                  <Input
                    id="businessName"
                    placeholder="Enter your business name"
                    value={formData.businessName}
                    onChange={(e) => updateFormData("businessName", e.target.value)}
                    className="border-indigo-300"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessType">Business Type *</Label>
                  <Select
                    value={formData.businessType}
                    onValueChange={(value) => updateFormData("businessType", value)}
                  >
                    <SelectTrigger className="border-indigo-300">
                      <SelectValue placeholder="Select business type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="museum">Museum / Gallery</SelectItem>
                      <SelectItem value="restaurant">Restaurant / Café</SelectItem>
                      <SelectItem value="hotel">Hotel / Accommodation</SelectItem>
                      <SelectItem value="market">Market / Retail</SelectItem>
                      <SelectItem value="cultural">Cultural Site</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5 text-sunset-600" />
                    <Input
                      id="location"
                      placeholder="City, Country"
                      value={formData.location}
                      onChange={(e) => updateFormData("location", e.target.value)}
                      className="border-indigo-300"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {formStep === 2 && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-indigo-900 flex items-center">
                  <User className="mr-2 h-5 w-5" /> Contact Information
                </h2>

                <div className="space-y-2">
                  <Label htmlFor="contactName">Contact Person *</Label>
                  <Input
                    id="contactName"
                    placeholder="Full name"
                    value={formData.contactName}
                    onChange={(e) => updateFormData("contactName", e.target.value)}
                    className="border-indigo-300"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Email Address *</Label>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-5 w-5 text-sunset-600" />
                    <Input
                      id="contactEmail"
                      type="email"
                      placeholder="email@example.com"
                      value={formData.contactEmail}
                      onChange={(e) => updateFormData("contactEmail", e.target.value)}
                      className="border-indigo-300"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Phone Number *</Label>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-5 w-5 text-sunset-600" />
                    <Input
                      id="contactPhone"
                      placeholder="+123 456 7890"
                      value={formData.contactPhone}
                      onChange={(e) => updateFormData("contactPhone", e.target.value)}
                      className="border-indigo-300"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {formStep === 3 && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-indigo-900 flex items-center">
                  <FileText className="mr-2 h-5 w-5" /> Partnership Details
                </h2>

                <div className="space-y-2">
                  <Label>Partnership Type *</Label>
                  <RadioGroup
                    value={formData.partnershipType}
                    onValueChange={(value) => updateFormData("partnershipType", value)}
                    className="space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="treasure-host" id="treasure-host" className="text-sunset-600" />
                      <Label htmlFor="treasure-host" className="font-normal">
                        Treasure Host - Place AR treasures at your location
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="rewards" id="rewards" className="text-sunset-600" />
                      <Label htmlFor="rewards" className="font-normal">
                        Rewards Provider - Offer exclusive rewards to players
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="events" id="events" className="text-sunset-600" />
                      <Label htmlFor="events" className="font-normal">
                        Event Sponsor - Host special treasure hunt events
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="multiple" id="multiple" className="text-sunset-600" />
                      <Label htmlFor="multiple" className="font-normal">
                        Multiple Options - Interested in several partnership types
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Tell us about your business *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your business, target audience, and what makes it unique..."
                    value={formData.description}
                    onChange={(e) => updateFormData("description", e.target.value)}
                    className="border-indigo-300 min-h-[100px]"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="offerDetails">What can you offer PATA users?</Label>
                  <Textarea
                    id="offerDetails"
                    placeholder="Describe potential rewards, discounts, or experiences you could offer..."
                    value={formData.offerDetails}
                    onChange={(e) => updateFormData("offerDetails", e.target.value)}
                    className="border-indigo-300 min-h-[80px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="heardFrom">How did you hear about PATA?</Label>
                  <Select value={formData.heardFrom} onValueChange={(value) => updateFormData("heardFrom", value)}>
                    <SelectTrigger className="border-indigo-300">
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="social">Social Media</SelectItem>
                      <SelectItem value="search">Search Engine</SelectItem>
                      <SelectItem value="referral">Referral from Another Business</SelectItem>
                      <SelectItem value="event">Event or Conference</SelectItem>
                      <SelectItem value="news">News or Media</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-start space-x-2 pt-2">
                  <Checkbox
                    id="terms"
                    checked={formData.agreeTerms}
                    onCheckedChange={(checked) => updateFormData("agreeTerms", checked as boolean)}
                    className="data-[state=checked]:bg-sunset-600 data-[state=checked]:border-sunset-600"
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor="terms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      I agree to the terms and conditions *
                    </label>
                    <p className="text-xs text-muted-foreground">
                      By submitting this form, you agree to be contacted by the PATA team.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </form>
        </CardContent>

        <CardFooter className="flex justify-between border-t border-indigo-200 p-4">
          {formStep < 3 ? (
            <Button type="button" onClick={handleNext} className="bg-sunset-600 hover:bg-sunset-700 text-indigo-50">
              Continue
            </Button>
          ) : (
            <Button
              type="submit"
              onClick={handleSubmit}
              className="bg-sunset-600 hover:bg-sunset-700 text-indigo-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Application"}
              {!isSubmitting && <Send className="ml-2 h-4 w-4" />}
            </Button>
          )}
        </CardFooter>
      </Card>

      <div className="mt-4 p-3 bg-indigo-100 rounded-lg border border-indigo-300 flex items-start">
        <HelpCircle className="h-5 w-5 text-sunset-600 mr-2 mt-0.5" />
        <p className="text-sm text-indigo-800">
          Need help with your application? Contact our partnership team at partnerships@pata-app.com or call +123 456
          7890.
        </p>
      </div>
    </div>
  )
}

