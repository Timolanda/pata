import { http } from 'viem'
import { getDefaultConfig } from '@coinbase/onchainkit'
import { base, baseSepolia } from 'viem/chains'

// PATA token contract addresses for different networks
export const PATA_TOKEN_ADDRESSES: { [key: number]: `0x${string}` } = {
  [base.id]: '0x1234567890123456789012345678901234567890' as `0x${string}`,  // Replace with mainnet contract address
  [baseSepolia.id]: '0x9876543210987654321098765432109876543210' as `0x${string}`  // Replace with testnet contract address
}

// Configure chains and connectors
export const config = getDefaultConfig({
  appName: 'PATA AR Treasure Hunt',
  chains: [base, baseSepolia],
  wallets: ['coinbaseWallet'],
})

// ABI for the PATA token contract
export const PATA_TOKEN_ABI = [
  {
    "inputs": [{"name": "account", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "decimals",
    "outputs": [{"name": "", "type": "uint8"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [{"name": "", "type": "string"}],
    "stateMutability": "view",
    "type": "function"
  }
] 