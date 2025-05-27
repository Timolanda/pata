import { NextResponse } from 'next/server'
import { createPublicClient, http } from 'viem'
import { baseSepolia } from 'viem/chains'

export async function GET(
  request: Request,
  { params }: { params: { address: string } }
) {
  try {
    // For now, return mock data
    const mockTransactions = [
      {
        hash: '0x123...',
        type: 'mint',
        amount: '100',
        description: 'Minted PATA tokens',
        time: new Date().toISOString(),
        status: 'completed'
      }
    ]

    return NextResponse.json(mockTransactions)
  } catch (error) {
    console.error('Error fetching transactions:', error)
    return NextResponse.json([], { status: 500 })
  }
} 