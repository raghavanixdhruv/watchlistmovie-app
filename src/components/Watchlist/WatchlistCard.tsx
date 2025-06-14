import React, { useState } from 'react'
import { 
  Star, 
  Calendar, 
  Eye, 
  EyeOff, 
  Trash2, 
  Film, 
  Tv,
  Edit3,
  Save,
  X,
  Info
} from 'lucide-react'
import { Database } from '../../lib/supabase'
import { getImageUrl } from '../../lib/tmdb'
import { DetailModal } from '../Details/DetailModal'

type WatchlistItem = Database['public']['Tables']['watchlist_items']['Row']

interface WatchlistCardProps {
  item: WatchlistItem
  onToggleWatched: (id: string, isWatched: boolean) => void
  onRemove: (id: string) => void
  onUpdateRating: (id: string, rating: number | null) => void
}

export const WatchlistCard: React.FC<WatchlistCardProps> = ({
  item,
  onToggleWatched,
  onRemove,
  onUpdateRating,
}) => {
  const [showRatingEdit, setShowRatingEdit] = useState(false)
  const [tempRating, setTempRating] = useState(item.rating || 0)
  const [showDetailModal, setShowDetailModal] = useState(false)

  const handleRatingSubmit = () => {
    onUpdateRating(item.id, tempRating > 0 ? tempRating : null)
    setShowRatingEdit(false)
  }

  const handleRatingCancel = () => {
    setTempRating(item.rating || 0)
    setShowRatingEdit(false)
  }

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't open modal if clicking on interactive elements
    const target = e.target as HTMLElement
    if (target.closest('button') || target.closest('input')) {
      return
    }
    setShowDetailModal(true)
  }

  return (
    <>
      <div 
        className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] animate-fade-in cursor-pointer"
        onClick={handleCardClick}
      >
        <div className="relative">
          <div className="aspect-[2/3] bg-gray-200 overflow-hidden">
            <img
              src={getImageUrl(item.poster_path, 'w500')}
              alt={item.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=500'
              }}
            />
          </div>
          
          <div className="absolute top-3 left-3">
            {item.media_type === 'movie' ? (
              <div className="flex items-center gap-1 px-2 py-1 bg-black/70 text-white rounded-full text-xs">
                <Film className="w-3 h-3" />
                <span>Movie</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 px-2 py-1 bg-black/70 text-white rounded-full text-xs">
                <Tv className="w-3 h-3" />
                <span>TV Show</span>
              </div>
            )}
          </div>

          <div className="absolute top-3 right-3 flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation()
                setShowDetailModal(true)
              }}
              className="p-2 bg-black/70 text-white rounded-full hover:bg-black/80 transition-all duration-200"
              title="View Details"
            >
              <Info className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onToggleWatched(item.id, !item.is_watched)
              }}
              className={`p-2 rounded-full transition-all duration-200 ${
                item.is_watched
                  ? 'bg-green-500 text-white hover:bg-green-600'
                  : 'bg-black/70 text-white hover:bg-black/80'
              }`}
            >
              {item.is_watched ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2">
            {item.title}
          </h3>

          <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
            {item.release_date && (
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{new Date(item.release_date).getFullYear()}</span>
              </div>
            )}
            {item.vote_average && (
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500" />
                <span>{item.vote_average.toFixed(1)}</span>
              </div>
            )}
          </div>

          <p className="text-sm text-gray-600 mb-4 line-clamp-3">
            {item.overview || 'No description available.'}
          </p>

          {/* Rating Section */}
          <div className="mb-4">
            {showRatingEdit ? (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Your Rating:</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={(e) => {
                        e.stopPropagation()
                        setTempRating(star)
                      }}
                      className={`p-1 transition-colors ${
                        star <= tempRating ? 'text-yellow-500' : 'text-gray-300'
                      }`}
                    >
                      <Star className="w-4 h-4 fill-current" />
                    </button>
                  ))}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRatingSubmit()
                  }}
                  className="p-1 text-green-600 hover:text-green-700"
                >
                  <Save className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRatingCancel()
                  }}
                  className="p-1 text-red-600 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Your Rating:</span>
                <div className="flex items-center gap-1">
                  {item.rating ? (
                    <>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= item.rating! ? 'text-yellow-500 fill-current' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </>
                  ) : (
                    <span className="text-sm text-gray-500">Not rated</span>
                  )}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowRatingEdit(true)
                  }}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <Edit3 className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>

          <div className="flex justify-between items-center">
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              item.is_watched
                ? 'bg-green-100 text-green-700'
                : 'bg-yellow-100 text-yellow-700'
            }`}>
              {item.is_watched ? 'Watched' : 'To Watch'}
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation()
                onRemove(item.id)
              }}
              className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <DetailModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        tmdbId={item.tmdb_id}
        mediaType={item.media_type}
        title={item.title}
      />
    </>
  )
}