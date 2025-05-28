export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      treasures: {
        Row: {
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
          collection: string | null
          created_at: string
          created_by: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          latitude: number
          longitude: number
          hint: string
          reward_type: string
          reward_value: number
          reward_description: string
          rarity: string
          collection?: string | null
          created_at?: string
          created_by: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          latitude?: number
          longitude?: number
          hint?: string
          reward_type?: string
          reward_value?: number
          reward_description?: string
          rarity?: string
          collection?: string | null
          created_at?: string
          created_by?: string
        }
      }
      discoveries: {
        Row: {
          id: string
          user_id: string
          treasure_id: string
          discovered_at: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          treasure_id: string
          discovered_at: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          treasure_id?: string
          discovered_at?: string
          created_at?: string
        }
      }
      collections: {
        Row: {
          id: string
          name: string
          description: string
          required_treasures: number
          reward_type: string
          reward_value: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          required_treasures: number
          reward_type: string
          reward_value: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          required_treasures?: number
          reward_type?: string
          reward_value?: number
          created_at?: string
        }
      }
      user_locations: {
        Row: {
          id: string
          user_id: string
          latitude: number
          longitude: number
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          latitude: number
          longitude: number
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          latitude?: number
          longitude?: number
          updated_at?: string
        }
      }
      users: {
        Row: {
          id: string
          email: string
          username: string
          created_at: string
        }
        Insert: {
          id: string
          email: string
          username: string
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          username?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 