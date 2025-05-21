"use client"

import { useState } from "react"
import { ArrowDownLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useAccount } from "wagmi"
import QRCode from "react-qr-code"
import { toast } from "@/hooks/use-toast"

export function ReceiveButton() {
  const [open, setOpen] = useState(false)
  const { address } = useAccount()

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(address || "")
    toast({
      title: "Address Copied",
        description: "Your wallet address has been copied to clipboard.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy address to clipboard.",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex-1">
          Receive
          <ArrowDownLeft className="ml-2 h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Receive PATA Tokens</DialogTitle>
          <DialogDescription>
            Share your wallet address or scan the QR code to receive PATA tokens.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-6 p-4">
          <div className="bg-white p-4 rounded-lg">
            <QRCode value={address || ""} size={200} />
          </div>
          <div className="w-full">
            <p className="text-sm font-medium mb-2">Your Wallet Address</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 p-2 bg-muted rounded text-sm break-all">
                {address}
              </code>
              <Button variant="outline" size="sm" onClick={copyToClipboard}>
                Copy
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

