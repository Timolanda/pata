import { createClient } from '@supabase/supabase-js'
import { Database } from './types/supabase'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

export type SupabaseError = {
  message: string
  details?: string
  hint?: string
  code?: string
}

export type ApiResponse<T> = {
  data: T | null
  error: SupabaseError | null
  loading: boolean
}

// Helper function to handle Supabase errors
const handleError = (error: any): SupabaseError => {
  console.error('Supabase error:', error)
  return {
    message: error.message || 'An error occurred',
    details: error.details,
    hint: error.hint,
    code: error.code
  }
}

// Helper function to check if user is authenticated
export const isAuthenticated = async (): Promise<ApiResponse<boolean>> => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error) throw error
    return { data: !!session, error: null, loading: false }
  } catch (error) {
    return { data: null, error: handleError(error), loading: false }
  }
}

// Helper function to get current user
export const getCurrentUser = async (): Promise<ApiResponse<Database['public']['Tables']['users']['Row']>> => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    if (!user) return { data: null, error: null, loading: false }

    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError) throw profileError
    return { data: profile, error: null, loading: false }
  } catch (error) {
    return { data: null, error: handleError(error), loading: false }
  }
}

// Helper function to sign out
export const signOut = async (): Promise<ApiResponse<void>> => {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    return { data: null, error: null, loading: false }
  } catch (error) {
    return { data: null, error: handleError(error), loading: false }
  }
}

// Helper function to update user location
export const updateUserLocation = async (
  userId: string,
  latitude: number,
  longitude: number
): Promise<ApiResponse<Database['public']['Tables']['user_locations']['Row']>> => {
  try {
    const { data, error } = await supabase
      .from('user_locations')
      .upsert({
        user_id: userId,
        latitude,
        longitude,
        updated_at: new Date().toISOString()
      })
      .select()
      .single()
    
    if (error) throw error
    return { data, error: null, loading: false }
  } catch (error) {
    return { data: null, error: handleError(error), loading: false }
  }
}

// Helper function to get user's discovered treasures
export const getUserDiscoveredTreasures = async (
  userId: string
): Promise<ApiResponse<(Database['public']['Tables']['discoveries']['Row'] & {
  treasure: Database['public']['Tables']['treasures']['Row']
})[]>> => {
  try {
    const { data, error } = await supabase
      .from('discoveries')
      .select(`
        *,
        treasure:treasures(*)
      `)
      .eq('user_id', userId)
    
    if (error) throw error
    return { data, error: null, loading: false }
  } catch (error) {
    return { data: null, error: handleError(error), loading: false }
  }
}

// Helper function to get nearby treasures
export const getNearbyTreasures = async (
  latitude: number,
  longitude: number,
  radius: number = 1000
): Promise<ApiResponse<Database['public']['Tables']['treasures']['Row'][]>> => {
  try {
    const { data, error } = await supabase
      .from('treasures')
      .select('*')
      .filter('latitude', 'gte', latitude - radius/111000) // Rough conversion to degrees
      .filter('latitude', 'lte', latitude + radius/111000)
      .filter('longitude', 'gte', longitude - radius/(111000 * Math.cos(latitude * Math.PI/180)))
      .filter('longitude', 'lte', longitude + radius/(111000 * Math.cos(latitude * Math.PI/180)))
    
    if (error) throw error
    return { data, error: null, loading: false }
  } catch (error) {
    return { data: null, error: handleError(error), loading: false }
  }
}

// Helper function to claim a treasure
export const claimTreasure = async (
  userId: string,
  treasureId: string
): Promise<ApiResponse<Database['public']['Tables']['discoveries']['Row']>> => {
  try {
    const { data, error } = await supabase
      .from('discoveries')
      .insert([
        {
          treasure_id: treasureId,
          user_id: userId,
          discovered_at: new Date().toISOString()
        }
      ])
      .select()
      .single()
    
    if (error) throw error
    return { data, error: null, loading: false }
  } catch (error) {
    return { data: null, error: handleError(error), loading: false }
  }
}

// Helper function to get collection progress
export const getCollectionProgress = async (
  userId: string,
  collectionId: string
): Promise<ApiResponse<{
  collection: Database['public']['Tables']['collections']['Row']
  discovered_count: number
  progress: number
}>> => {
  try {
    const { data, error } = await supabase
      .rpc('get_collection_progress', {
        p_user_id: userId,
        p_collection_id: collectionId
      })
    
    if (error) throw error
    return { data, error: null, loading: false }
  } catch (error) {
    return { data: null, error: handleError(error), loading: false }
  }
}

// Real-time subscriptions with TypeScript types
export const subscribeToUserLocation = (
  userId: string,
  callback: (location: Database['public']['Tables']['user_locations']['Row']) => void
) => {
  return supabase
    .channel(`user_location_${userId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'user_locations',
        filter: `user_id=eq.${userId}`
      },
      (payload) => callback(payload.new as Database['public']['Tables']['user_locations']['Row'])
    )
    .subscribe()
}

export const subscribeToTreasureDiscoveries = (
  callback: (discovery: Database['public']['Tables']['discoveries']['Row']) => void
) => {
  return supabase
    .channel('treasure_discoveries')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'discoveries'
      },
      (payload) => callback(payload.new as Database['public']['Tables']['discoveries']['Row'])
    )
    .subscribe()
} 