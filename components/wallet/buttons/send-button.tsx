"use client"

import { useState } from "react"
import { ArrowUpRight } from "lucide-react"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { parseEther } from "viem"
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { pataTokenABI } from "@/lib/pataTokenABI"

interface SendButtonProps {
  tokenAddress: string
}

const validateAddress = (address: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

const validateAmount = (amount: string): boolean => {
  try {
    const value = parseEther(amount)
    return value > BigInt(0)
  } catch {
    return false
  }
}

export function SendButton({ tokenAddress }: SendButtonProps) {
  const [open, setOpen] = useState(false)
  const [recipient, setRecipient] = useState("")
  const [amount, setAmount] = useState("")
  const [isValidating, setIsValidating] = useState(false)
  const { toast } = useToast()

  const { data: hash, writeContract, isPending } = useWriteContract()

  const { isLoading: isConfirming } = useWaitForTransactionReceipt({
    hash,
  })

  const validateInputs = (): { isValid: boolean; error?: string } => {
    if (!recipient) {
      return { isValid: false, error: "Recipient address is required" }
    }

    if (!amount) {
      return { isValid: false, error: "Amount is required" }
    }

    if (!validateAddress(recipient)) {
      return { isValid: false, error: "Invalid recipient address format" }
    }

    if (!validateAmount(amount)) {
      return { isValid: false, error: "Invalid amount format" }
    }

    return { isValid: true }
  }

  const handleSend = async () => {
    try {
      setIsValidating(true)
      const validation = validateInputs()
      
      if (!validation.isValid) {
        toast({
          title: "Validation Error",
          description: validation.error,
          variant: "destructive",
        })
        return
      }

      const value = parseEther(amount)
      
      await writeContract({
        address: tokenAddress as `0x${string}`,
        abi: pataTokenABI,
        functionName: "transfer",
        args: [recipient as `0x${string}`, value],
      })

      toast({
        title: "Transaction Submitted",
        description: "Your transfer is being processed...",
      })

      // Reset form
      setRecipient("")
      setAmount("")
      setOpen(false)
    } catch (error) {
      console.error('Transfer error:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send tokens. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsValidating(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex-1 bg-sunset-600 hover:bg-sunset-700">
          Send
          <ArrowUpRight className="ml-2 h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send PATA Tokens</DialogTitle>
          <DialogDescription>
            Enter the recipient's address and the amount of PATA tokens to send.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="recipient">Recipient Address</Label>
            <Input
              id="recipient"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="0x..."
              disabled={isPending || isConfirming}
            />
          </div>
          <div>
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              disabled={isPending || isConfirming}
            />
          </div>
        </div>
        <p className="text-sm text-gray-500">
          You&apos;re about to send {amount} PATA tokens
        </p>
        <DialogFooter>
          <Button
            onClick={handleSend}
            disabled={isPending || isConfirming || isValidating}
          >
            {isPending || isConfirming ? "Processing..." : "Send"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

