import React from 'react'
import { WatchlistCard } from './WatchlistCard'
import { Database } from '../../lib/supabase'
import { Film, Tv } from 'lucide-react'

type WatchlistItem = Database['public']['Tables']['watchlist_items']['Row']

interface WatchlistGridProps {
  items: WatchlistItem[]
  onToggleWatched: (id: string, isWatched: boolean) => void
  onRemove: (id: string) => void
  onUpdateRating: (id: string, rating: number | null) => void
  title: string
  emptyMessage: string
}

export const WatchlistGrid: React.FC<WatchlistGridProps> = ({
  items,
  onToggleWatched,
  onRemove,
  onUpdateRating,
  title,
  emptyMessage,
}) => {
  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <div className="flex items-center gap-1">
            <Film className="w-6 h-6 text-primary-500" />
            <Tv className="w-6 h-6 text-primary-500" />
          </div>
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">{title}</h3>
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
        {title}
        <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
          {items.length}
        </span>
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {items.map((item) => (
          <WatchlistCard
            key={item.id}
            item={item}
            onToggleWatched={onToggleWatched}
            onRemove={onRemove}
            onUpdateRating={onUpdateRating}
          />
        ))}
      </div>
    </div>
  )
}