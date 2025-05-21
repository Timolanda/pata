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

export function SendButton({ tokenAddress }: SendButtonProps) {
  const [open, setOpen] = useState(false)
  const [recipient, setRecipient] = useState("")
  const [amount, setAmount] = useState("")
  const { toast } = useToast()

  const { data: hash, writeContract, isPending } = useWriteContract()

  const { isLoading: isConfirming } = useWaitForTransactionReceipt({
    hash,
  })

  const handleSend = async () => {
    try {
      const value = parseEther(amount)
      
      writeContract({
        address: tokenAddress as `0x${string}`,
        abi: pataTokenABI,
        functionName: "transfer",
        args: [recipient, value],
      })

        toast({
        title: "Transaction Submitted",
        description: "Your transfer is being processed...",
        })
    } catch (error) {
        toast({
        title: "Error",
        description: "Failed to send tokens. Please try again.",
          variant: "destructive",
        })
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
            />
          </div>
              </div>
        <DialogFooter>
          <Button
            onClick={handleSend}
            disabled={isPending || isConfirming || !recipient || !amount}
          >
            {isPending || isConfirming ? "Confirming..." : "Send Tokens"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

