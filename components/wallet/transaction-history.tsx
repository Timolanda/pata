'use client';

import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { ArrowUpRight, ArrowDownLeft, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { pataTokenABI } from '@/lib/pataTokenABI';
import { formatEther } from 'viem';

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

const ITEMS_PER_PAGE = 10;

export function TransactionHistory({ tokenAddress }: TransactionHistoryProps) {
  const { address } = useAccount();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { toast } = useToast();

  const fetchTransactions = async (pageNum: number) => {
    if (!address) return;

    try {
      setIsLoading(true);
      setError(null);

      // In a real implementation, you would:
      // 1. Query your indexer or blockchain for Transfer events
      // 2. Format and store them in state
      // 3. Update in real-time with websocket subscriptions

      // For now, we'll show some mock data
      const mockTransactions: Transaction[] = Array.from({ length: ITEMS_PER_PAGE }, (_, i) => ({
        hash: `0x${Math.random().toString(16).slice(2)}`,
        from: i % 2 === 0 ? '0x0000000000000000000000000000000000000000' : address,
        to: i % 2 === 0 ? address : '0x1111111111111111111111111111111111111111',
        value: BigInt(Math.floor(Math.random() * 1000000000000000000)),
        timestamp: Date.now() - (i + (pageNum - 1) * ITEMS_PER_PAGE) * 3600000,
        status: 'completed',
      }));

      setTransactions(prev => 
        pageNum === 1 ? mockTransactions : [...prev, ...mockTransactions]
      );
      setHasMore(mockTransactions.length === ITEMS_PER_PAGE);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
      setError(error instanceof Error ? error : new Error('Failed to fetch transactions'));
      toast({
        title: "Error",
        description: "Failed to load transactions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions(page);
  }, [address, page]);

  const loadMore = () => {
    setPage(prev => prev + 1);
  };

  if (error) {
    return (
      <div className="text-center py-4">
        <p className="text-red-500 mb-4">{error.message}</p>
        <Button onClick={() => fetchTransactions(1)}>Retry</Button>
      </div>
    );
  }

  if (isLoading && transactions.length === 0) {
    return (
      <div className="flex items-center justify-center py-4">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2">Loading transactions...</span>
      </div>
    );
  }

  if (transactions.length === 0) {
    return <div className="text-center py-4">No transactions yet</div>;
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {transactions.map((tx) => (
          <div
            key={tx.hash}
            className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium">
                  {tx.from === address ? 'Sent' : 'Received'}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(tx.timestamp).toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">
                  {tx.from === address ? '-' : '+'}
                  {Number(tx.value) / 1e18} PATA
                </p>
                <p className="text-xs text-gray-500 truncate max-w-[150px]">
                  {tx.hash}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="text-center">
          <Button
            onClick={loadMore}
            disabled={isLoading}
            variant="outline"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Loading...
              </>
            ) : (
              'Load More'
            )}
          </Button>
        </div>
      )}
    </div>
  );
} 