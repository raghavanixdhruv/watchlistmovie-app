import React, { useState } from 'react'
import { Header } from '../Layout/Header'
import { Navigation } from '../Layout/Navigation'
import { SearchBar } from '../Search/SearchBar'
import { WatchlistGrid } from '../Watchlist/WatchlistGrid'
import { ProfileModal } from '../Profile/ProfileModal'
import { useWatchlist } from '../../hooks/useWatchlist'
import { TMDBSearchResult } from '../../lib/tmdb'

export const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'search' | 'all' | 'watched' | 'unwatched'>('search')
  const [showProfileModal, setShowProfileModal] = useState(false)
  
  const {
    watchlist,
    loading,
    addToWatchlist,
    removeFromWatchlist,
    toggleWatched,
    updateRating,
    isInWatchlist,
    getWatchedItems,
    getUnwatchedItems,
  } = useWatchlist()

  const handleAddToWatchlist = async (item: TMDBSearchResult) => {
    try {
      await addToWatchlist(item)
    } catch (error) {
      console.error('Error adding to watchlist:', error)
    }
  }

  const handleToggleWatched = async (id: string, isWatched: boolean) => {
    try {
      await toggleWatched(id, isWatched)
    } catch (error) {
      console.error('Error toggling watched status:', error)
    }
  }

  const handleRemove = async (id: string) => {
    try {
      await removeFromWatchlist(id)
    } catch (error) {
      console.error('Error removing from watchlist:', error)
    }
  }

  const handleUpdateRating = async (id: string, rating: number | null) => {
    try {
      await updateRating(id, rating)
    } catch (error) {
      console.error('Error updating rating:', error)
    }
  }

  const watchedItems = getWatchedItems()
  const unwatchedItems = getUnwatchedItems()

  const watchlistCounts = {
    total: watchlist.length,
    watched: watchedItems.length,
    unwatched: unwatchedItems.length,
  }

  const watchlistStats = {
    ...watchlistCounts,
    movies: watchlist.filter(item => item.media_type === 'movie').length,
    tvShows: watchlist.filter(item => item.media_type === 'tv').length,
    averageRating: watchlist.filter(item => item.rating).length > 0
      ? watchlist.filter(item => item.rating).reduce((sum, item) => sum + (item.rating || 0), 0) / 
        watchlist.filter(item => item.rating).length
      : 0,
  }

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your watchlist...</p>
          </div>
        </div>
      )
    }

    switch (activeTab) {
      case 'search':
        return (
          <div className="py-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Discover Movies & TV Shows
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Search for your favorite movies and TV shows to add them to your personal watchlist.
                Track what you've watched and discover new content.
              </p>
            </div>
            <SearchBar
              onAddToWatchlist={handleAddToWatchlist}
              isInWatchlist={isInWatchlist}
            />
          </div>
        )

      case 'all':
        return (
          <div className="py-8">
            <WatchlistGrid
              items={watchlist}
              onToggleWatched={handleToggleWatched}
              onRemove={handleRemove}
              onUpdateRating={handleUpdateRating}
              title="All Items"
              emptyMessage="Your watchlist is empty. Start by searching for movies and TV shows to add!"
            />
          </div>
        )

      case 'watched':
        return (
          <div className="py-8">
            <WatchlistGrid
              items={watchedItems}
              onToggleWatched={handleToggleWatched}
              onRemove={handleRemove}
              onUpdateRating={handleUpdateRating}
              title="Watched"
              emptyMessage="You haven't marked any items as watched yet. Start watching and mark them as complete!"
            />
          </div>
        )

      case 'unwatched':
        return (
          <div className="py-8">
            <WatchlistGrid
              items={unwatchedItems}
              onToggleWatched={handleToggleWatched}
              onRemove={handleRemove}
              onUpdateRating={handleUpdateRating}
              title="To Watch"
              emptyMessage="No items in your to-watch list. Add some movies and TV shows to get started!"
            />
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onShowProfile={() => setShowProfileModal(true)} />
      
      <Navigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        watchlistCounts={watchlistCounts}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {renderContent()}
      </main>

      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        watchlistStats={watchlistStats}
      />
    </div>
  )
}