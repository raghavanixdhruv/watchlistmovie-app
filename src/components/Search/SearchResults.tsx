import React from 'react'
import { Plus, Check, Star, Calendar, Film, Tv } from 'lucide-react'
import { TMDBSearchResult, getImageUrl } from '../../lib/tmdb'

interface SearchResultsProps {
  results: TMDBSearchResult[]
  onAddToWatchlist: (item: TMDBSearchResult) => void
  isInWatchlist: (tmdbId: number) => boolean
  onClose: () => void
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  onAddToWatchlist,
  isInWatchlist,
  onClose,
}) => {
  const handleAddToWatchlist = (item: TMDBSearchResult, event: React.MouseEvent) => {
    event.stopPropagation()
    onAddToWatchlist(item)
  }

  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-xl max-h-96 overflow-y-auto z-50 animate-slide-up">
      {results.map((item) => (
        <div
          key={item.id}
          className="flex items-center p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
        >
          <div className="flex-shrink-0 w-16 h-24 bg-gray-200 rounded-lg overflow-hidden">
            <img
              src={getImageUrl(item.poster_path, 'w154')}
              alt={item.title || item.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=154'
              }}
            />
          </div>

          <div className="flex-grow ml-4 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {item.media_type === 'movie' ? (
                <Film className="w-4 h-4 text-primary-500" />
              ) : (
                <Tv className="w-4 h-4 text-primary-500" />
              )}
              <h3 className="font-semibold text-gray-800 truncate">
                {item.title || item.name}
              </h3>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
              {item.release_date && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(item.release_date).getFullYear()}</span>
                </div>
              )}
              {item.vote_average > 0 && (
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span>{item.vote_average.toFixed(1)}</span>
                </div>
              )}
              <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium capitalize">
                {item.media_type}
              </span>
            </div>

            <p className="text-sm text-gray-600 line-clamp-2">
              {item.overview || 'No description available.'}
            </p>
          </div>

          <div className="flex-shrink-0 ml-4">
            {isInWatchlist(item.id) ? (
              <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-xl">
                <Check className="w-4 h-4" />
                <span className="text-sm font-medium">Added</span>
              </div>
            ) : (
              <button
                onClick={(e) => handleAddToWatchlist(item, e)}
                className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors transform hover:scale-105 active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span className="text-sm font-medium">Add</span>
              </button>
            )}
          </div>
        </div>
      ))}

      {results.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          <Search className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No results found. Try a different search term.</p>
        </div>
      )}
    </div>
  )
}