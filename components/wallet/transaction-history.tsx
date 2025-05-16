'use client';

import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { formatEther } from 'viem';
import { ArrowUpRight, ArrowDownLeft, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { pataTokenABI } from '@/lib/pataTokenABI';

interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: bigint;
  timestamp: number;
  status: 'completed' | 'pending' | 'failed';
}

interface TransactionHistoryProps {
  tokenAddress: string;
}

export function TransactionHistory({ tokenAddress }: TransactionHistoryProps) {
  const { address } = useAccount();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!address) return;

      try {
        // In a real implementation, you would:
        // 1. Query your indexer or blockchain for Transfer events
        // 2. Format and store them in state
        // 3. Update in real-time with websocket subscriptions

        // For now, we'll show some mock data
        const mockTransactions: Transaction[] = [
          {
            hash: '0x123...abc',
            from: '0x0000000000000000000000000000000000000000',
            to: address,
            value: BigInt('1000000000000000000'), // 1 PATA
            timestamp: Date.now() - 3600000, // 1 hour ago
            status: 'completed',
          },
          {
            hash: '0x456...def',
            from: address,
            to: '0x1111111111111111111111111111111111111111',
            value: BigInt('500000000000000000'), // 0.5 PATA
            timestamp: Date.now() - 7200000, // 2 hours ago
            status: 'completed',
          },
        ];

        setTransactions(mockTransactions);
      } catch (error) {
        console.error('Failed to fetch transactions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [address]);

  if (isLoading) {
    return <div className="text-center py-4">Loading transactions...</div>;
  }

  if (transactions.length === 0) {
    return <div className="text-center py-4">No transactions yet</div>;
  }

  return (
    <ScrollArea className="h-[400px] pr-4">
      <div className="space-y-4">
        {transactions.map((tx) => (
          <div
            key={tx.hash}
            className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div
                  className={`p-2 rounded-full ${
                    tx.from === address
                      ? 'bg-red-100 text-red-600'
                      : 'bg-green-100 text-green-600'
                  }`}
                >
                  {tx.from === address ? (
                    <ArrowUpRight className="h-4 w-4" />
                  ) : (
                    <ArrowDownLeft className="h-4 w-4" />
                  )}
                </div>
                <div>
                  <p className="font-medium">
                    {tx.from === address ? 'Sent' : 'Received'} PATA
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(tx.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p
                  className={`font-bold ${
                    tx.from === address ? 'text-red-600' : 'text-green-600'
                  }`}
                >
                  {tx.from === address ? '-' : '+'}
                  {formatEther(tx.value)} PATA
                </p>
                <div className="flex items-center justify-end space-x-1 mt-1">
                  {tx.status === 'pending' ? (
                    <Clock className="h-4 w-4 text-yellow-500" />
                  ) : tx.status === 'completed' ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  )}
                  <span className="text-sm text-gray-500 capitalize">
                    {tx.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
} 