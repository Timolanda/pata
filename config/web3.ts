import { http } from 'viem'
import { createConfig } from 'wagmi'
import { base, baseSepolia } from 'viem/chains'
import { injected } from 'wagmi/connectors'

// Add local network configuration
const localNetwork = {
  id: 31337,
  name: 'Hardhat Local',
  network: 'hardhat',
  nativeCurrency: {
    decimals: 18,
    name: 'Ethereum',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: { http: ['http://127.0.0.1:8545'] },
    public: { http: ['http://127.0.0.1:8545'] },
  },
} as const

// PATA token contract addresses for different networks
export const PATA_TOKEN_ADDRESSES: { [key: number]: `0x${string}` } = {
  [base.id]: '0x1234567890123456789012345678901234567890' as `0x${string}`,
  [baseSepolia.id]: 'YOUR_DEPLOYED_PATA_TOKEN_ADDRESS' as `0x${string}`,
  [localNetwork.id]: 'YOUR_DEPLOYED_PATA_TOKEN_ADDRESS' as `0x${string}` // Add this after deployment
}

// Reward NFT contract addresses for different networks
export const REWARD_NFT_ADDRESSES: { [key: number]: `0x${string}` } = {
  [base.id]: '0xabcdef1234567890abcdef1234567890abcdef12' as `0x${string}`,
  [baseSepolia.id]: 'YOUR_DEPLOYED_REWARD_NFT_ADDRESS' as `0x${string}`,
  [localNetwork.id]: 'YOUR_DEPLOYED_REWARD_NFT_ADDRESS' as `0x${string}` // Add this after deployment
}

// Create config
export const config = createConfig({
  chains: [localNetwork, base, baseSepolia],
  connectors: [
    injected(),
  ],
  transports: {
    [localNetwork.id]: http(),
    [base.id]: http(),
    [baseSepolia.id]: http(),
  },
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
    "inputs": [{"name": "amount", "type": "uint256"}],
    "name": "burn",
    "outputs": [],
    "stateMutability": "nonpayable",
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

// ABI for the Reward NFT contract
export const REWARD_NFT_ABI = [
  {
    "inputs": [{"name": "to", "type": "address"}],
    "name": "mintReward",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"name": "tokenId", "type": "uint256"}],
    "name": "ownerOf",
    "outputs": [{"name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  }
]

export const STAKING_CONTRACT_ADDRESSES: { [key: number]: `0x${string}` } = {
  [base.id]: '0x1234567890123456789012345678901234567890' as `0x${string}`,
  [baseSepolia.id]: 'YOUR_DEPLOYED_STAKING_CONTRACT_ADDRESS' as `0x${string}`,
  [localNetwork.id]: 'YOUR_DEPLOYED_STAKING_CONTRACT_ADDRESS' as `0x${string}` // Add this after deployment
}

export const STAKING_CONTRACT_ABI = [
  // ... ABI from the StakingContract.sol ...
] as const 