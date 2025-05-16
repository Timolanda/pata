'use client';

import { useState } from 'react';
import { Award, Gift, Star, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { useAccount } from 'wagmi';

interface Reward {
  id: string;
  title: string;
  description: string;
  tokenAmount: number;
  type: 'achievement' | 'treasure' | 'staking' | 'special';
  status: 'available' | 'claimed' | 'locked';
  expiresAt?: number;
}

export function Rewards() {
  const { address } = useAccount();
  const { toast } = useToast();
  const [rewards, setRewards] = useState<Reward[]>([
    {
      id: '1',
      title: 'First Treasure Found',
      description: 'Found your first treasure in the AR hunt',
      tokenAmount: 100,
      type: 'achievement',
      status: 'available',
    },
    {
      id: '2',
      title: 'Weekly Staking Reward',
      description: 'Reward for staking PATA tokens',
      tokenAmount: 50,
      type: 'staking',
      status: 'available',
      expiresAt: Date.now() + 604800000, // 7 days
    },
    {
      id: '3',
      title: 'Rare Artifact Discovery',
      description: 'Found a rare artifact in the AR hunt',
      tokenAmount: 500,
      type: 'treasure',
      status: 'locked',
    },
  ]);

  const handleClaim = async (rewardId: string) => {
    try {
      // In a real implementation, you would:
      // 1. Call the smart contract to claim the reward
      // 2. Wait for the transaction to be confirmed
      // 3. Update the UI

      // For now, we'll just update the UI
      setRewards((prev) =>
        prev.map((reward) =>
          reward.id === rewardId
            ? { ...reward, status: 'claimed' }
            : reward
        )
      );

      toast({
        title: 'Reward Claimed',
        description: 'Your PATA tokens have been added to your wallet.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to claim reward. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const getRewardIcon = (type: Reward['type']) => {
    switch (type) {
      case 'achievement':
        return <Trophy className="h-5 w-5" />;
      case 'treasure':
        return <Gift className="h-5 w-5" />;
      case 'staking':
        return <Award className="h-5 w-5" />;
      case 'special':
        return <Star className="h-5 w-5" />;
    }
  };

  const getRewardColors = (type: Reward['type']) => {
    switch (type) {
      case 'achievement':
        return 'bg-purple-100 text-purple-600 border-purple-200';
      case 'treasure':
        return 'bg-amber-100 text-amber-600 border-amber-200';
      case 'staking':
        return 'bg-green-100 text-green-600 border-green-200';
      case 'special':
        return 'bg-blue-100 text-blue-600 border-blue-200';
    }
  };

  return (
    <ScrollArea className="h-[400px] pr-4">
      <div className="space-y-4">
        {rewards.map((reward) => (
          <Card
            key={reward.id}
            className={`p-4 ${getRewardColors(reward.type)} border-2`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-2 rounded-full bg-white">
                  {getRewardIcon(reward.type)}
                </div>
                <div>
                  <h3 className="font-medium">{reward.title}</h3>
                  <p className="text-sm opacity-75">{reward.description}</p>
                  {reward.expiresAt && (
                    <p className="text-xs mt-1">
                      Expires:{' '}
                      {new Date(reward.expiresAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="flex flex-col items-end gap-2">
                  <Badge
                    variant="outline"
                    className="font-bold"
                  >
                    {reward.tokenAmount} PATA
                  </Badge>
                  <Button
                    size="sm"
                    variant={reward.status === 'claimed' ? 'outline' : 'default'}
                    onClick={() => handleClaim(reward.id)}
                    disabled={reward.status !== 'available'}
                  >
                    {reward.status === 'claimed'
                      ? 'Claimed'
                      : reward.status === 'locked'
                      ? 'Locked'
                      : 'Claim'}
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
} 