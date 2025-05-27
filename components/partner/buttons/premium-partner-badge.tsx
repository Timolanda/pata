"use client"

import { useState } from "react"
import { Award, Star, TrendingUp, Info, Shield, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "@/hooks/use-toast"

interface PremiumPartnerBadgeProps {
  tier?: "basic" | "premium" | "elite"
  size?: "default" | "sm" | "lg"
  className?: string
  showDetails?: boolean
}

export function PremiumPartnerBadge({
  tier = "premium",
  size = "default",
  className = "",
  showDetails = true,
}: PremiumPartnerBadgeProps) {
  const [open, setOpen] = useState(false)

  const tierColors = {
    basic: "bg-indigo-600",
    premium: "bg-sunset-600",
    elite: "bg-gold-600 text-indigo-900",
  }

  const tierIcons = {
    basic: <Award className="h-4 w-4 mr-1" />,
    premium: <Star className="h-4 w-4 mr-1" />,
    elite: <Zap className="h-4 w-4 mr-1" />,
  }

  const handleUpgrade = () => {
    toast({
      title: "Upgrade Partnership",
      description: "Opening partnership upgrade options",
    })

    setOpen(false)

    // In a real app, this would navigate to the upgrade page
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Badge
          className={`${tierColors[tier]} cursor-pointer ${
            size === "sm" ? "text-xs py-0 px-2" : size === "lg" ? "text-base py-1 px-3" : "text-sm py-1 px-2"
          } ${className}`}
        >
          {tierIcons[tier]}
          {tier === "basic" ? "Basic" : tier === "premium" ? "Premium" : "Elite"} Partner
        </Badge>
      </DialogTrigger>

      {showDetails && (
        <DialogContent
          className={`sm:max-w-[500px] border-${tier === "basic" ? "indigo" : tier === "premium" ? "sunset" : "gold"}-300 bg-gradient-to-b from-indigo-50 to-${tier === "basic" ? "indigo" : tier === "premium" ? "sunset" : "gold"}-50`}
        >
          <DialogHeader>
            <DialogTitle className="text-indigo-900 flex items-center">
              {tier === "basic" ? (
                <Award className="mr-2 h-5 w-5 text-indigo-600" />
              ) : tier === "premium" ? (
                <Star className="mr-2 h-5 w-5 text-sunset-600" />
              ) : (
                <Zap className="mr-2 h-5 w-5 text-gold-600" />
              )}
              {tier === "basic" ? "Basic" : tier === "premium" ? "Premium" : "Elite"} Partnership
            </DialogTitle>
            <DialogDescription className="text-indigo-700">
              {tier === "basic"
                ? "Your basic partnership provides standard features for treasure placement"
                : tier === "premium"
                  ? "Your premium partnership unlocks enhanced features and visibility"
                  : "Your elite partnership provides exclusive benefits and maximum exposure"}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <h3 className="font-bold text-indigo-900 mb-3">Your Partnership Benefits</h3>

            <div className="space-y-2">
              <BenefitItem
                feature="Treasure Placement"
                description={
                  tier === "basic"
                    ? "Standard placement in the PATA app"
                    : tier === "premium"
                      ? "Featured placement with higher visibility"
                      : "Premium placement with maximum visibility"
                }
                included={true}
              />

              <BenefitItem
                feature="Custom Treasures"
                description="Create unique treasures with custom designs"
                included={tier !== "basic"}
              />

              <BenefitItem
                feature="Analytics Dashboard"
                description={
                  tier === "basic"
                    ? "Basic analytics on treasure discoveries"
                    : tier === "premium"
                      ? "Advanced analytics with user demographics"
                      : "Real-time analytics with predictive insights"
                }
                included={true}
              />

              <BenefitItem
                feature="Support Level"
                description={
                  tier === "basic"
                    ? "Email support"
                    : tier === "premium"
                      ? "Priority email support"
                      : "24/7 dedicated support"
                }
                included={true}
              />

              <BenefitItem
                feature="Exclusive Events"
                description="Host special treasure hunt events"
                included={tier === "elite"}
              />

              <BenefitItem
                feature="API Access"
                description="Integrate PATA with your systems"
                included={tier === "elite"}
              />
            </div>

            {tier !== "elite" && (
              <div className="mt-4">
                <Button
                  onClick={handleUpgrade}
                  className={`w-full ${tier === "basic" ? "bg-sunset-600 hover:bg-sunset-700" : "bg-gold-600 hover:bg-gold-700 text-indigo-900"}`}
                >
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Upgrade to {tier === "basic" ? "Premium" : "Elite"}
                </Button>
              </div>
            )}

            <div
              className={`mt-4 p-3 rounded-lg border bg-${tier === "basic" ? "indigo" : tier === "premium" ? "sunset" : "gold"}-100 border-${tier === "basic" ? "indigo" : tier === "premium" ? "sunset" : "gold"}-300`}
            >
              <div className="flex items-start">
                <Info
                  className={`h-5 w-5 text-${tier === "basic" ? "indigo" : tier === "premium" ? "sunset" : "gold"}-600 mr-2 mt-0.5`}
                />
                <div>
                  <h4 className="font-medium text-indigo-900">Partnership Status</h4>
                  <p className="text-sm text-indigo-700">
                    Your {tier === "basic" ? "Basic" : tier === "premium" ? "Premium" : "Elite"} partnership is active
                    and in good standing.
                    {tier === "elite" ? " Thank you for being an Elite partner!" : ""}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      )}
    </Dialog>
  )
}

function BenefitItem({
  feature,
  description,
  included,
}: {
  feature: string
  description: string
  included: boolean
}) {
  return (
    <div
      className={`flex items-start p-3 rounded-lg border ${included ? "bg-white border-indigo-200" : "bg-indigo-50 border-indigo-200"}`}
    >
      <div
        className={`p-1 rounded-full mr-3 ${included ? "bg-jungle-100 text-jungle-600" : "bg-indigo-100 text-indigo-400"}`}
      >
        {included ? <Shield className="h-4 w-4" /> : <Info className="h-4 w-4" />}
      </div>
      <div>
        <h5 className={`font-medium ${included ? "text-indigo-900" : "text-indigo-400"}`}>{feature}</h5>
        <p className={`text-sm ${included ? "text-indigo-700" : "text-indigo-400"}`}>{description}</p>
      </div>
    </div>
  )
}

