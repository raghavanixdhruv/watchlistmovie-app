import { createClient } from '@supabase/supabase-js'
import { config, validateEnvironment } from '../config/environment'

// Validate environment variables
const validationErrors = validateEnvironment()
if (validationErrors.length > 0 && config.app.isProduction) {
  console.error('Environment validation errors:', validationErrors)
}

// Validate environment variables
if (!config.supabase.url || config.supabase.url === 'your_supabase_url_here') {
  throw new Error('Missing VITE_SUPABASE_URL environment variable. Please check your .env file.')
}

if (!config.supabase.anonKey || config.supabase.anonKey === 'your_supabase_anon_key_here') {
  throw new Error('Missing VITE_SUPABASE_ANON_KEY environment variable. Please check your .env file.')
}

export const supabase = createClient(config.supabase.url, config.supabase.anonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
})

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      watchlist_items: {
        Row: {
          id: string
          user_id: string
          tmdb_id: number
          title: string
          overview: string | null
          poster_path: string | null
          backdrop_path: string | null
          release_date: string | null
          genre_ids: number[] | null
          vote_average: number | null
          media_type: 'movie' | 'tv'
          is_watched: boolean
          rating: number | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          tmdb_id: number
          title: string
          overview?: string | null
          poster_path?: string | null
          backdrop_path?: string | null
          release_date?: string | null
          genre_ids?: number[] | null
          vote_average?: number | null
          media_type: 'movie' | 'tv'
          is_watched?: boolean
          rating?: number | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          tmdb_id?: number
          title?: string
          overview?: string | null
          poster_path?: string | null
          backdrop_path?: string | null
          release_date?: string | null
          genre_ids?: number[] | null
          vote_average?: number | null
          media_type?: 'movie' | 'tv'
          is_watched?: boolean
          rating?: number | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}