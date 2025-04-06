"use client"

import { useState } from "react"
import { Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function TreasureUpgradesButton() {
  const { toast } = useToast();
  const [isUpgrading, setIsUpgrading] = useState(false);

  const handleUpgrade = (treasureName: string, level: number) => {
    setIsUpgrading(true);
    // Simulate upgrade process
    setTimeout(() => {
      setIsUpgrading(false);
      toast({
        title: "Treasure Upgraded",
        description: `${treasureName} upgraded to Level ${level + 1}`,
      });
    }, 2000);
  };

  const treasures = [
    {
      id: 1,
      name: "Ancient Mask",
      description: "A ceremonial mask from ancient African traditions",
      level: 2,
      maxLevel: 5,
      attributes: ["Rarity +10%", "Discovery Range +5m"],
      upgradeRequirements: "150 PATA + 3 Mask Fragments",
      nextLevelBonus: "Rarity +15%, Discovery Range +8m",
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      id: 2,
      name: "Golden Ankh",
      description: "Symbol of life and prosperity in ancient Egypt",
      level: 3,
      maxLevel: 5,
      attributes: ["Token Rewards +20%", "Durability +15%"],
      upgradeRequirements: "200 PATA + 5 Gold Fragments",
      nextLevelBonus: "Token Rewards +25%, Durability +20%",
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      id: 3,
      name: "Tribal Shield",
      description: "Protective shield decorated with tribal patterns",
      level: 1,
      maxLevel: 5,
      attributes: ["Defense +5%", "Visibility +10%"],
      upgradeRequirements: "100 PATA + 2 Shield Fragments",
      nextLevelBonus: "Defense +10%, Visibility +15%",
      image: "/placeholder.svg?height=80&width=80",
    },
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="w-full flex items-center justify-between bg-gradient-to-r from-purple-500/10 to-fuchsia-500/10 border-purple-500/20 hover:bg-purple-500/20 transition-all duration-300"
        >
          <span className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            Treasure Upgrades
          </span>
          <span className="text-xs text-purple-400">Enhance</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md md:max-w-2xl bg-gradient-to-b from-slate-900 to-purple-900/50 border-purple-500/50">
        <DialogHeader>
          <DialogTitle className="text-white">Treasure Upgrades</DialogTitle>
          <DialogDescription className="text-purple-200">
            Upgrade your treasures to enhance their attributes and abilities
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="owned" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-slate-800">
            <TabsTrigger value="owned" className="data-[state=active]:bg-purple-500">Owned Treasures</TabsTrigger>
            <TabsTrigger value="marketplace" className="data-[state=active]:bg-purple-500">Marketplace</TabsTrigger>
          </TabsList>
          
          <TabsContent value="owned" className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {treasures.map((treasure) => (
                <Card key={treasure.id} className="bg-slate-800 border-purple-500/30">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-white">{treasure.name}</CardTitle>
                        <CardDescription className="text-purple-200">{treasure.description}</CardDescription>
                      </div>
                      <div className="flex items-center">
                        <img 
                          src={treasure.image || "/placeholder.svg"} 
                          alt={treasure.name} 
                          className="w-12 h-12 rounded-md border border-purple-500/50"
                        />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex items-center mb-2">
                      <div className="flex-1">
                        <div className="text-xs text-purple-300 mb-1">Level {treasure.level}/{treasure.maxLevel}</div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-purple-500 to-fuchsia-500 h-2 rounded-full" 
                            style={{ width: `${(treasure.level / treasure.maxLevel) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      <Badge variant="outline" className="ml-2 bg-purple-900/50 text-purple-200 border-purple-500/50">
                        Lvl {treasure.level}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 mt-3">
                      <div className="text-xs text-purple-300">Upgrade Requirements</div>
                      <div className="text-sm text-purple-200">{treasure.upgradeRequirements}</div>
                    </div>
                    
                    <div className="mt-4">
                      {treasure.level < treasure.maxLevel && (
                        <Button
                          variant="outline"
                          className="w-full bg-gradient-to-r from-purple-500/10 to-fuchsia-500/10 hover:bg-purple-500/20 border-purple-500/20 text-white"
                          onClick={() => handleUpgrade(treasure.name, treasure.level)}
                          disabled={isUpgrading}
                        >
                          {isUpgrading ? "Upgrading..." : `Upgrade to Level ${treasure.level + 1}`}
                        </Button>
                      )}
                      {treasure.level >= treasure.maxLevel && (
                        <Button
                          variant="outline"
                          disabled
                          className="w-full bg-gray-600 text-gray-400 cursor-not-allowed"
                        >
                          Max Level Reached
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="marketplace" className="space-y-4 py-4">
            {/* Marketplace Content Goes Here */}
            <div className="text-center text-purple-200">
              Coming Soon!
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
