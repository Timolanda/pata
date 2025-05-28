'use client'

import { useEffect, useState } from 'react'
import { Database } from '@/lib/types/supabase'
import { useSupabase } from '@/lib/hooks/useSupabase'
import { LoadingSpinner } from '../ui/loading-spinner'
import { ErrorMessage } from '../ui/error-message'
import { Trophy, Star } from 'lucide-react'
import { supabase } from '@/lib/supabase-client'

type Collection = Database['public']['Tables']['collections']['Row'] & {
  progress: number
  total_required: number
}

interface CollectionProgressProps {
  userId: string | undefined
  discoveredCount: number
}

export function CollectionProgress({ userId, discoveredCount }: CollectionProgressProps) {
  const [collections, setCollections] = useState<Collection[]>([])
  const { data, error, loading, execute } = useSupabase()

  useEffect(() => {
    if (userId) {
      execute(async () => {
        const { data: collectionsData, error: collectionsError } = await supabase
          .from('collections')
          .select('*')
          .eq('user_id', userId)

        if (collectionsError) throw collectionsError

        // Transform the data to include progress and total_required
        const transformedCollections = collectionsData.map(collection => ({
          ...collection,
          progress: collection.required_treasures, // You might want to calculate this based on actual discoveries
          total_required: collection.required_treasures
        }))

        return transformedCollections
      })
    }
  }, [userId, execute])

  useEffect(() => {
    if (data) {
      setCollections(data as Collection[])
    }
  }, [data])

  if (loading) {
    return <LoadingSpinner size={24} />
  }

  if (error) {
    return <ErrorMessage error={error} />
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-6 h-6 text-yellow-500" />
        <h3 className="text-lg font-semibold">Collections</h3>
      </div>

      <div className="space-y-4">
        {/* Total Discoveries */}
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Total Discoveries</span>
          <span className="font-medium">{discoveredCount}</span>
        </div>

        {/* Collection Progress */}
        {collections.map((collection) => (
          <div key={collection.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">{collection.name}</span>
              <span className="font-medium">
                {collection.progress}/{collection.total_required}
              </span>
            </div>
            
            {/* Progress Bar */}
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 transition-all duration-300"
                style={{
                  width: `${(collection.progress / collection.total_required) * 100}%`,
                }}
              />
            </div>

            {/* Collection Reward */}
            {collection.progress >= collection.total_required && (
              <div className="flex items-center gap-2 text-yellow-600 text-sm">
                <Star className="w-4 h-4" />
                <span>Collection Complete!</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
} 