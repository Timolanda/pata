'use client'

import { useState } from 'react'
import { Database } from '@/lib/types/supabase'
import { useSupabase } from '@/lib/hooks/useSupabase'
import { LoadingSpinner } from '../ui/loading-spinner'
import { ErrorMessage } from '../ui/error-message'
import { claimTreasure } from '@/lib/supabase-client'
import { MapPin, X, Trophy, Star, Gift, Clock } from 'lucide-react'

type Treasure = Database['public']['Tables']['treasures']['Row']

interface TreasureCardProps {
  treasure: Treasure
  isDiscovered: boolean
  onClose: () => void
}

export function TreasureCard({ treasure, isDiscovered, onClose }: TreasureCardProps) {
  const [isClaiming, setIsClaiming] = useState(false)
  const { error, execute } = useSupabase()

  const handleClaim = async () => {
    setIsClaiming(true)
    await execute(async () => {
      return await claimTreasure(treasure.id, treasure.created_by)
    })
    setIsClaiming(false)
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 max-w-md mx-auto">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <Trophy className="w-6 h-6 text-yellow-500" />
          <h3 className="text-lg font-semibold">{treasure.name}</h3>
        </div>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Location */}
      <div className="flex items-center gap-2 text-gray-600 mb-4">
        <MapPin className="w-4 h-4" />
        <span>{treasure.name}</span>
      </div>

      {/* Description */}
      <p className="text-gray-700 mb-4">{treasure.description}</p>

      {/* Reward */}
      <div className="bg-yellow-50 rounded-lg p-3 mb-4">
        <div className="flex items-center gap-2 text-yellow-700">
          <Gift className="w-5 h-5" />
          <span className="font-medium">Reward: {treasure.reward_description}</span>
        </div>
      </div>

      {/* Discovery Status */}
      <div className="flex items-center gap-2 text-gray-600 mb-4">
        <Clock className="w-4 h-4" />
        <span>
          {isDiscovered ? 'Discovered' : 'Not yet discovered'}
        </span>
      </div>

      {/* Claim Button */}
      {!isDiscovered && (
        <button
          onClick={handleClaim}
          disabled={isClaiming}
          className="w-full bg-blue-600 text-white rounded-lg py-2 px-4 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isClaiming ? (
            <div className="flex items-center justify-center gap-2">
              <LoadingSpinner size={20} />
              <span>Claiming...</span>
            </div>
          ) : (
            'Claim Treasure'
          )}
        </button>
      )}

      {/* Error Message */}
      {error && (
        <ErrorMessage error={error} className="mt-4" />
      )}
    </div>
  )
} 