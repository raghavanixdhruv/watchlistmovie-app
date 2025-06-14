import { useState, useEffect } from 'react'
import { supabase, Database } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { TMDBSearchResult } from '../lib/tmdb'

type WatchlistItem = Database['public']['Tables']['watchlist_items']['Row']
type WatchlistInsert = Database['public']['Tables']['watchlist_items']['Insert']
type WatchlistUpdate = Database['public']['Tables']['watchlist_items']['Update']

export const useWatchlist = () => {
  const { user } = useAuth()
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchWatchlist()
      const cleanup = subscribeToWatchlist()
      return cleanup
    } else {
      setWatchlist([])
      setLoading(false)
    }
  }, [user])

  const fetchWatchlist = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('watchlist_items')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setWatchlist(data || [])
    } catch (error) {
      console.error('Error fetching watchlist:', error)
    } finally {
      setLoading(false)
    }
  }

  const subscribeToWatchlist = () => {
    if (!user) return () => {}

    try {
      const channel = supabase
        .channel(`watchlist_${user.id}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'watchlist_items',
            filter: `user_id=eq.${user.id}`,
          },
          () => {
            fetchWatchlist()
          }
        )
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            console.log('Successfully subscribed to watchlist changes')
          } else if (status === 'CHANNEL_ERROR') {
            console.warn('Failed to subscribe to watchlist changes - realtime updates disabled')
          }
        })

      return () => {
        try {
          supabase.removeChannel(channel)
        } catch (error) {
          console.error('Error removing channel:', error)
        }
      }
    } catch (error) {
      console.error('Error setting up realtime subscription:', error)
      // Return empty cleanup function if subscription fails
      return () => {}
    }
  }

  const addToWatchlist = async (item: TMDBSearchResult): Promise<void> => {
    if (!user) throw new Error('User not authenticated')

    const watchlistItem: WatchlistInsert = {
      user_id: user.id,
      tmdb_id: item.id,
      title: item.title || item.name || 'Unknown Title',
      overview: item.overview,
      poster_path: item.poster_path,
      backdrop_path: item.backdrop_path,
      release_date: item.release_date || item.first_air_date || null,
      genre_ids: item.genre_ids,
      vote_average: item.vote_average,
      media_type: item.media_type,
      is_watched: false,
    }

    const { error } = await supabase
      .from('watchlist_items')
      .insert(watchlistItem)

    if (error) throw error
  }

  const removeFromWatchlist = async (id: string): Promise<void> => {
    if (!user) throw new Error('User not authenticated')

    const { error } = await supabase
      .from('watchlist_items')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) throw error
  }

  const toggleWatched = async (id: string, isWatched: boolean): Promise<void> => {
    if (!user) throw new Error('User not authenticated')

    const { error } = await supabase
      .from('watchlist_items')
      .update({ 
        is_watched: isWatched,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) throw error
  }

  const updateRating = async (id: string, rating: number | null): Promise<void> => {
    if (!user) throw new Error('User not authenticated')

    const { error } = await supabase
      .from('watchlist_items')
      .update({ 
        rating,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) throw error
  }

  const isInWatchlist = (tmdbId: number): boolean => {
    return watchlist.some(item => item.tmdb_id === tmdbId)
  }

  const getWatchedItems = (): WatchlistItem[] => {
    return watchlist.filter(item => item.is_watched)
  }

  const getUnwatchedItems = (): WatchlistItem[] => {
    return watchlist.filter(item => !item.is_watched)
  }

  return {
    watchlist,
    loading,
    addToWatchlist,
    removeFromWatchlist,
    toggleWatched,
    updateRating,
    isInWatchlist,
    getWatchedItems,
    getUnwatchedItems,
    refetch: fetchWatchlist,
  }
}