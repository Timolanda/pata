"use client"

import { useState } from "react"
import { Send, Search, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function SendButton() {
  const { toast } = useToast()
  const [step, setStep] = useState(1)
  const [recipient, setRecipient] = useState("")
  const [amount, setAmount] = useState("")
  const [token, setToken] = useState("PATA")
  const [isProcessing, setIsProcessing] = useState(false)

  const handleNext = () => {
    if (step === 1) {
      if (!recipient) {
        toast({
          title: "Missing Recipient",
          description: "Please enter a recipient address",
          variant: "destructive",
        })
        return
      }
      setStep(2)
    } else if (step === 2) {
      if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
        toast({
          title: "Invalid Amount",
          description: "Please enter a valid amount to send",
          variant: "destructive",
        })
        return
      }
      setStep(3)
    } else if (step === 3) {
      setIsProcessing(true)
      // Simulate transaction processing
      setTimeout(() => {
        setIsProcessing(false)
        toast({
          title: "Transaction Sent",
          description: `${amount} ${token} sent to ${recipient.substring(0, 6)}...${recipient.substring(recipient.length - 4)}`,
        })
        setStep(1)
        setRecipient("")
        setAmount("")
      }, 2000)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleScanQR = () => {
    // Placeholder for QR scanning functionality
    toast({
      title: "QR Scanner",
      description: "QR scanner would open here",
    })
  }

  return (
    <Dialog onOpenChange={() => setStep(1)}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full flex items-center justify-between bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-amber-500/20 hover:bg-amber-500/20 transition-all duration-300"
        >
          <span className="flex items-center gap-2">
            <Send className="h-5 w-5 text-amber-500" />
            Send Tokens
          </span>
          <span className="text-xs text-amber-400">Transfer</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-gradient-to-b from-slate-900 to-amber-900/50 border-amber-500/50">
        <DialogHeader>
          <DialogTitle className="text-white">
            {step === 1 ? "Send Tokens" : step === 2 ? "Amount & Token" : "Confirm Transaction"}
          </DialogTitle>
          <DialogDescription className="text-amber-200">
            {step === 1
              ? "Enter the recipient's wallet address"
              : step === 2
                ? "Specify amount and token type to send"
                : "Review and confirm your transaction"}
          </DialogDescription>
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="recipient" className="text-white">
                Recipient Address
              </Label>
              <div className="flex w-full items-center space-x-2">
                <Input
                  id="recipient"
                  placeholder="0x..."
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  className="bg-slate-800 text-white border-amber-500/50"
                />
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  onClick={handleScanQR}
                  className="border-amber-500/50 hover:bg-amber-500/20"
                >
                  <Search className="h-4 w-4 text-amber-300" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-white">Recent Recipients</Label>
              <div className="grid grid-cols-2 gap-2">
                {["0x1a2b...3c4d", "0x5e6f...7g8h", "0x9i0j...1k2l", "0x3m4n...5o6p"].map((addr, i) => (
                  <Button
                    key={i}
                    variant="outline"
                    size="sm"
                    onClick={() => setRecipient(`0x${addr.split("...")[0].substring(2)}${addr.split("...")[1]}`)}
                    className="border-amber-500/30 hover:bg-amber-500/20 text-amber-200"
                  >
                    {addr}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-white">
                Amount
              </Label>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-slate-800 text-white border-amber-500/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="token" className="text-white">
                Token
              </Label>
              <Select value={token} onValueChange={setToken}>
                <SelectTrigger className="bg-slate-800 text-white border-amber-500/50">
                  <SelectValue placeholder="Select token" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-amber-500/50">
                  <SelectItem value="PATA">PATA Token</SelectItem>
                  <SelectItem value="SCROLL">Scroll Token</SelectItem>
                  <SelectItem value="TREASURE">Treasure Fragment</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-md bg-amber-900/20 p-3 border border-amber-500/30">
              <p className="text-sm text-amber-200">Available Balance: 1,250 PATA</p>
              <p className="text-xs text-amber-300/70 mt-1">Transaction fee: ~0.001 PATA</p>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 py-4">
            <div className="rounded-md bg-slate-800 p-4 border border-amber-500/30">
              <div className="flex justify-between items-center mb-3">
                <span className="text-amber-200">Sending</span>
                <span className="text-white font-bold">
                  {amount} {token}
                </span>
              </div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-amber-200">To</span>
                <span className="text-white">
                  {recipient.substring(0, 6)}...{recipient.substring(recipient.length - 4)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-amber-200">Fee</span>
                <span className="text-white">0.001 PATA</span>
              </div>
              <div className="mt-4 pt-3 border-t border-amber-500/20">
                <div className="flex justify-between items-center">
                  <span className="text-amber-200">Total</span>
                  <span className="text-white font-bold">
                    {(Number(amount) + 0.001).toFixed(3)} {token}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="flex flex-row justify-between sm:justify-between">
          {step > 1 ? (
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              className="border-amber-500/50 hover:bg-amber-500/20 text-white"
              disabled={isProcessing}
            >
              Back
            </Button>
          ) : (
            <div></div>
          )}
          <Button
            type="button"
            onClick={handleNext}
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
            disabled={isProcessing}
          >
            {isProcessing ? (
              <div className="flex items-center">
                <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                Processing...
              </div>
            ) : (
              <div className="flex items-center">
                {step === 3 ? "Confirm & Send" : "Next"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </div>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

