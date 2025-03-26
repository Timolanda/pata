"use client"

import { useState } from "react"
import { TrendingUp, Check, X, Shield } from "lucide-react"
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"

interface UpgradePartnershipButtonProps {
  variant?: "default" | "outline" | "secondary" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
  currentTier?: "basic" | "premium" | "elite"
}

export function UpgradePartnershipButton({
  variant = "default",
  size = "default",
  className = "",
  currentTier = "premium",
}: UpgradePartnershipButtonProps) {
  const [open, setOpen] = useState(false)
  const [selectedTier, setSelectedTier] = useState<string>(currentTier)
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual")

  const handleUpgrade = () => {
    if (selectedTier === currentTier) {
      toast({
        title: "No Change",
        description: `You are already on the ${selectedTier} tier`,
      })
      return
    }

    toast({
      title: "Partnership Upgraded",
      description: `Your partnership has been upgraded to ${selectedTier}`,
    })

    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} size={size} className={`w-full mt-3 bg-sunset-600 hover:bg-sunset-700 ${className}`}>
          Upgrade Partnership
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] border-sunset-300 bg-gradient-to-b from-indigo-50 to-sunset-50">
        <DialogHeader>
          <DialogTitle className="text-indigo-900 flex items-center">
            <TrendingUp className="mr-2 h-5 w-5 text-sunset-600" />
            Upgrade Your Partnership
          </DialogTitle>
          <DialogDescription className="text-indigo-700">
            Choose the partnership tier that best fits your business needs
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-end mt-2 mb-4">
          <div className="flex items-center space-x-2 bg-indigo-100 p-1 rounded-lg">
            <Button
              variant="ghost"
              size="sm"
              className={`rounded-md px-3 ${billingCycle === "monthly" ? "bg-white shadow-sm" : "bg-transparent"}`}
              onClick={() => setBillingCycle("monthly")}
            >
              Monthly
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`rounded-md px-3 ${billingCycle === "annual" ? "bg-white shadow-sm" : "bg-transparent"}`}
              onClick={() => setBillingCycle("annual")}
            >
              Annual <Badge className="ml-1 bg-jungle-600 text-xs">Save 20%</Badge>
            </Button>
          </div>
        </div>

        <RadioGroup value={selectedTier} onValueChange={setSelectedTier} className="grid grid-cols-3 gap-4">
          <div
            className={`border rounded-lg p-4 ${selectedTier === "basic" ? "border-indigo-600 bg-indigo-50" : "border-indigo-200"}`}
          >
            <RadioGroupItem value="basic" id="basic" className="sr-only" />
            <Label htmlFor="basic" className="cursor-pointer block">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-indigo-900">Basic</h3>
                <Badge className="bg-indigo-600">Current: {currentTier === "basic" ? "Yes" : "No"}</Badge>
              </div>

              <div className="mb-4">
                <span className="text-2xl font-bold text-indigo-900">${billingCycle === "monthly" ? "49" : "39"}</span>
                <span className="text-indigo-700">/month</span>
                {billingCycle === "annual" && (
                  <div className="text-xs text-jungle-600 mt-1">Billed annually (${39 * 12})</div>
                )}
              </div>

              <ul className="space-y-2 text-sm">
                <FeatureItem feature="Standard Treasure Placement" included={true} />
                <FeatureItem feature="Basic Analytics" included={true} />
                <FeatureItem feature="Up to 5 Treasures" included={true} />
                <FeatureItem feature="Email Support" included={true} />
                <FeatureItem feature="Featured Placement" included={false} />
                <FeatureItem feature="Custom Treasures" included={false} />
              </ul>

              <Button
                className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700"
                disabled={currentTier === "basic"}
                onClick={() => setSelectedTier("basic")}
              >
                {currentTier === "basic" ? "Current Plan" : "Select Basic"}
              </Button>
            </Label>
          </div>

          <div
            className={`border rounded-lg p-4 ${selectedTier === "premium" ? "border-sunset-600 bg-sunset-50" : "border-indigo-200"} relative`}
          >
            {currentTier !== "premium" && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-sunset-600 text-white text-xs py-1 px-3 rounded-full">
                Popular Choice
              </div>
            )}
            <RadioGroupItem value="premium" id="premium" className="sr-only" />
            <Label htmlFor="premium" className="cursor-pointer block">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-indigo-900">Premium</h3>
                <Badge className="bg-sunset-600">Current: {currentTier === "premium" ? "Yes" : "No"}</Badge>
              </div>

              <div className="mb-4">
                <span className="text-2xl font-bold text-indigo-900">${billingCycle === "monthly" ? "99" : "79"}</span>
                <span className="text-indigo-700">/month</span>
                {billingCycle === "annual" && (
                  <div className="text-xs text-jungle-600 mt-1">Billed annually (${79 * 12})</div>
                )}
              </div>

              <ul className="space-y-2 text-sm">
                <FeatureItem feature="Standard Treasure Placement" included={true} />
                <FeatureItem feature="Advanced Analytics" included={true} />
                <FeatureItem feature="Up to 15 Treasures" included={true} />
                <FeatureItem feature="Priority Email Support" included={true} />
                <FeatureItem feature="Featured Placement" included={true} />
                <FeatureItem feature="Custom Treasures" included={true} />
                <FeatureItem feature="Exclusive Events" included={false} />
              </ul>

              <Button
                className="w-full mt-4 bg-sunset-600 hover:bg-sunset-700"
                disabled={currentTier === "premium"}
                onClick={() => setSelectedTier("premium")}
              >
                {currentTier === "premium" ? "Current Plan" : "Select Premium"}
              </Button>
            </Label>
          </div>

          <div
            className={`border rounded-lg p-4 ${selectedTier === "elite" ? "border-gold-600 bg-gold-50" : "border-indigo-200"}`}
          >
            <RadioGroupItem value="elite" id="elite" className="sr-only" />
            <Label htmlFor="elite" className="cursor-pointer block">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-indigo-900">Elite</h3>
                <Badge className="bg-gold-600 text-indigo-900">Current: {currentTier === "elite" ? "Yes" : "No"}</Badge>
              </div>

              <div className="mb-4">
                <span className="text-2xl font-bold text-indigo-900">
                  ${billingCycle === "monthly" ? "199" : "159"}
                </span>
                <span className="text-indigo-700">/month</span>
                {billingCycle === "annual" && (
                  <div className="text-xs text-jungle-600 mt-1">Billed annually (${159 * 12})</div>
                )}
              </div>

              <ul className="space-y-2 text-sm">
                <FeatureItem feature="Premium Treasure Placement" included={true} />
                <FeatureItem feature="Real-time Analytics" included={true} />
                <FeatureItem feature="Unlimited Treasures" included={true} />
                <FeatureItem feature="24/7 Phone Support" included={true} />
                <FeatureItem feature="Top Featured Placement" included={true} />
                <FeatureItem feature="Custom Treasures" included={true} />
                <FeatureItem feature="Exclusive Events" included={true} />
              </ul>

              <Button
                className="w-full mt-4 bg-gold-600 hover:bg-gold-700 text-indigo-900"
                disabled={currentTier === "elite"}
                onClick={() => setSelectedTier("elite")}
              >
                {currentTier === "elite" ? "Current Plan" : "Select Elite"}
              </Button>
            </Label>
          </div>
        </RadioGroup>

        <div className="bg-indigo-100 p-3 rounded-lg border border-indigo-200 mt-4">
          <div className="flex items-start">
            <Shield className="h-5 w-5 text-indigo-600 mr-2 mt-0.5" />
            <div>
              <h4 className="font-medium text-indigo-900">Partnership Guarantee</h4>
              <p className="text-sm text-indigo-700">
                You can upgrade or downgrade your partnership tier at any time. Changes will be effective on your next
                billing cycle.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => setOpen(false)} className="border-indigo-300">
            Cancel
          </Button>
          <Button
            onClick={handleUpgrade}
            className="bg-sunset-600 hover:bg-sunset-700"
            disabled={selectedTier === currentTier}
          >
            <TrendingUp className="mr-2 h-4 w-4" />
            {selectedTier === currentTier ? "Current Plan" : "Upgrade Now"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function FeatureItem({ feature, included }: { feature: string; included: boolean }) {
  return (
    <li className="flex items-center">
      {included ? <Check className="h-4 w-4 text-jungle-600 mr-2" /> : <X className="h-4 w-4 text-indigo-300 mr-2" />}
      <span className={included ? "text-indigo-900" : "text-indigo-400"}>{feature}</span>
    </li>
  )
}

