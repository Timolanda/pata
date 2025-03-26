"use client"

import { useState } from "react"
import { QrCode, Copy, Download, Share2 } from "lucide-react"
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
import { useToast } from "@/hooks/use-toast"

export function ReceiveButton() {
  const { toast } = useToast()
  const [walletAddress, setWalletAddress] = useState("0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t")

  const handleCopy = () => {
    navigator.clipboard.writeText(walletAddress)
    toast({
      title: "Address Copied",
      description: "Wallet address copied to clipboard",
    })
  }

  const handleDownload = () => {
    // Create QR code as SVG and download
    toast({
      title: "QR Code Downloaded",
      description: "QR code has been saved to your device",
    })
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "My PATA Wallet Address",
          text: `Here's my PATA wallet address: ${walletAddress}`,
        })
        .catch((err) => {
          console.error("Error sharing:", err)
        })
    } else {
      toast({
        title: "Sharing Not Available",
        description: "Your browser doesn't support sharing",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full flex items-center justify-between bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-indigo-500/20 hover:bg-indigo-500/20 transition-all duration-300"
        >
          <span className="flex items-center gap-2">
            <QrCode className="h-5 w-5 text-indigo-500" />
            Receive Tokens
          </span>
          <span className="text-xs text-indigo-400">Scan QR</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-gradient-to-b from-slate-900 to-indigo-900 border-indigo-500/50">
        <DialogHeader>
          <DialogTitle className="text-white">Receive Tokens</DialogTitle>
          <DialogDescription className="text-indigo-200">
            Share your wallet address to receive PATA tokens and treasures
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-6 py-4">
          <div className="bg-white p-4 rounded-lg">
            {/* Placeholder for actual QR code component */}
            <div className="w-48 h-48 bg-slate-100 flex items-center justify-center border-2 border-indigo-500">
              <QrCode className="w-32 h-32 text-indigo-900" />
            </div>
          </div>

          <div className="w-full space-y-2">
            <p className="text-sm text-indigo-200">Your wallet address:</p>
            <div className="flex w-full items-center space-x-2">
              <Input value={walletAddress} readOnly className="bg-slate-800 text-white border-indigo-500/50" />
              <Button
                type="button"
                size="icon"
                variant="outline"
                onClick={handleCopy}
                className="border-indigo-500/50 hover:bg-indigo-500/20"
              >
                <Copy className="h-4 w-4 text-indigo-300" />
              </Button>
            </div>
          </div>

          <div className="flex w-full justify-between space-x-2">
            <Button
              variant="outline"
              className="flex-1 border-indigo-500/50 hover:bg-indigo-500/20 text-white"
              onClick={handleDownload}
            >
              <Download className="mr-2 h-4 w-4" />
              Download QR
            </Button>
            <Button
              variant="outline"
              className="flex-1 border-indigo-500/50 hover:bg-indigo-500/20 text-white"
              onClick={handleShare}
            >
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

