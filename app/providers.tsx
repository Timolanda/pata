'use client';
 
import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { base, baseSepolia } from 'viem/chains';
import { injected } from 'wagmi/connectors';

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
} as const;

const config = getDefaultConfig({
  appName: 'PATA AR Treasure Hunt',
  projectId: 'caf47ebc-61a4-451f-b564-856f74ab001c',
  chains: [localNetwork, base, baseSepolia],
  connectors: [
    injected({
      target: 'metaMask',
    }),
  ],
});

// Create a client
const queryClient = new QueryClient();
 
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}