import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database tables
export interface User {
  id: string
  email: string
  username: string
  avatar_url?: string
  created_at: string
  last_login: string
}

export interface Treasure {
  id: string
  name: string
  description: string
  latitude: number
  longitude: number
  hint: string
  reward_type: string
  reward_value: number
  reward_description: string
  rarity: string
  collection?: string
  created_at: string
  created_by: string
}

export interface Discovery {
  id: string
  user_id: string
  treasure_id: string
  discovered_at: string
  claimed_at: string
  reward_claimed: boolean
}

export interface Collection {
  id: string
  name: string
  description: string
  required_treasures: number
  reward_type: string
  reward_value: number
  created_at: string
}

// Helper functions for common operations
export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()
  
  if (error) throw error
  return data as User
}

export async function getNearbyTreasures(latitude: number, longitude: number, radius: number) {
  const { data, error } = await supabase
    .rpc('get_nearby_treasures', {
      p_latitude: latitude,
      p_longitude: longitude,
      p_radius: radius
    })
  
  if (error) throw error
  return data as Treasure[]
}

export async function claimTreasure(userId: string, treasureId: string) {
  const { data, error } = await supabase
    .from('discoveries')
    .insert({
      user_id: userId,
      treasure_id: treasureId,
      discovered_at: new Date().toISOString(),
      claimed_at: new Date().toISOString(),
      reward_claimed: true
    })
    .select()
    .single()
  
  if (error) throw error
  return data as Discovery
}

export async function getUserDiscoveries(userId: string) {
  const { data, error } = await supabase
    .from('discoveries')
    .select(`
      *,
      treasure:treasures(*)
    `)
    .eq('user_id', userId)
  
  if (error) throw error
  return data as (Discovery & { treasure: Treasure })[]
}

export async function getCollectionProgress(userId: string, collectionId: string) {
  const { data, error } = await supabase
    .rpc('get_collection_progress', {
      p_user_id: userId,
      p_collection_id: collectionId
    })
  
  if (error) throw error
  return data
}

// Real-time subscriptions
export function subscribeToUserLocation(userId: string, callback: (location: any) => void) {
  return supabase
    .channel('user-location')
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'user_locations',
        filter: `user_id=eq.${userId}`
      },
      callback
    )
    .subscribe()
}

export function subscribeToTreasureDiscoveries(callback: (discovery: any) => void) {
  return supabase
    .channel('treasure-discoveries')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'discoveries'
      },
      callback
    )
    .subscribe()
} 