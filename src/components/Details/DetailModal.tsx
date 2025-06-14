import React, { useState, useEffect } from 'react'
import { 
  X, 
  Star, 
  Calendar, 
  Clock, 
  Play, 
  Users, 
  Globe,
  Film,
  Tv,
  ChevronDown,
  ChevronRight,
  Eye,
  EyeOff
} from 'lucide-react'
import { getMovieDetails, getTVShowDetails, MovieDetails, TVShowDetails, getImageUrl } from '../../lib/tmdb'

interface DetailModalProps {
  isOpen: boolean
  onClose: () => void
  tmdbId: number
  mediaType: 'movie' | 'tv'
  title: string
}

export const DetailModal: React.FC<DetailModalProps> = ({
  isOpen,
  onClose,
  tmdbId,
  mediaType,
  title,
}) => {
  const [details, setDetails] = useState<MovieDetails | TVShowDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedSeasons, setExpandedSeasons] = useState<Set<number>>(new Set())

  useEffect(() => {
    if (isOpen && tmdbId) {
      fetchDetails()
    }
  }, [isOpen, tmdbId, mediaType])

  const fetchDetails = async () => {
    setLoading(true)
    setError(null)
    
    try {
      let data
      if (mediaType === 'movie') {
        data = await getMovieDetails(tmdbId)
      } else {
        data = await getTVShowDetails(tmdbId)
      }
      setDetails(data)
    } catch (err) {
      console.error('Error fetching details:', err)
      setError('Failed to load details')
    } finally {
      setLoading(false)
    }
  }

  const toggleSeason = (seasonNumber: number) => {
    const newExpanded = new Set(expandedSeasons)
    if (newExpanded.has(seasonNumber)) {
      newExpanded.delete(seasonNumber)
    } else {
      newExpanded.add(seasonNumber)
    }
    setExpandedSeasons(newExpanded)
  }

  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-slide-up">
        {loading ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading details...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Details</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              Close
            </button>
          </div>
        ) : details ? (
          <>
            {/* Header */}
            <div className="relative">
              {details.backdrop_path && (
                <div className="h-64 bg-gradient-to-t from-black/60 to-transparent">
                  <img
                    src={getImageUrl(details.backdrop_path, 'w1280')}
                    alt={title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>
              )}
              
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-4 text-white">
                <div className="flex items-center gap-2 mb-2">
                  {mediaType === 'movie' ? (
                    <Film className="w-5 h-5" />
                  ) : (
                    <Tv className="w-5 h-5" />
                  )}
                  <span className="text-sm font-medium capitalize">{mediaType}</span>
                </div>
                <h1 className="text-3xl font-bold mb-2">{title}</h1>
                {details.tagline && (
                  <p className="text-lg italic opacity-90">{details.tagline}</p>
                )}
              </div>
            </div>

            <div className="p-6">
              {/* Main Info */}
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="md:col-span-2">
                  <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-gray-600">
                    {(details as MovieDetails).release_date && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate((details as MovieDetails).release_date)}</span>
                      </div>
                    )}
                    {(details as TVShowDetails).first_air_date && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate((details as TVShowDetails).first_air_date)}</span>
                      </div>
                    )}
                    {(details as MovieDetails).runtime && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{formatRuntime((details as MovieDetails).runtime)}</span>
                      </div>
                    )}
                    {details.vote_average > 0 && (
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span>{details.vote_average.toFixed(1)}/10</span>
                      </div>
                    )}
                    {details.status && (
                      <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium">
                        {details.status}
                      </span>
                    )}
                  </div>

                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Overview</h3>
                    <p className="text-gray-600 leading-relaxed">
                      {details.overview || 'No overview available.'}
                    </p>
                  </div>

                  {details.genres && details.genres.length > 0 && (
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">Genres</h3>
                      <div className="flex flex-wrap gap-2">
                        {details.genres.map((genre) => (
                          <span
                            key={genre.id}
                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                          >
                            {genre.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  {details.poster_path && (
                    <div className="aspect-[2/3] bg-gray-200 rounded-lg overflow-hidden mb-4">
                      <img
                        src={getImageUrl(details.poster_path, 'w500')}
                        alt={title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="space-y-3 text-sm">
                    {details.production_companies && details.production_companies.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1">Production</h4>
                        <p className="text-gray-600">
                          {details.production_companies.map(company => company.name).join(', ')}
                        </p>
                      </div>
                    )}

                    {details.production_countries && details.production_countries.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1">Countries</h4>
                        <p className="text-gray-600">
                          {details.production_countries.map(country => country.name).join(', ')}
                        </p>
                      </div>
                    )}

                    {details.spoken_languages && details.spoken_languages.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1">Languages</h4>
                        <p className="text-gray-600">
                          {details.spoken_languages.map(lang => lang.english_name).join(', ')}
                        </p>
                      </div>
                    )}

                    {(details as MovieDetails).budget && (details as MovieDetails).budget > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1">Budget</h4>
                        <p className="text-gray-600">
                          ${(details as MovieDetails).budget.toLocaleString()}
                        </p>
                      </div>
                    )}

                    {(details as MovieDetails).revenue && (details as MovieDetails).revenue > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1">Revenue</h4>
                        <p className="text-gray-600">
                          ${(details as MovieDetails).revenue.toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Movie Collection */}
              {(details as MovieDetails).belongs_to_collection && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Part of Collection</h3>
                  <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl p-4">
                    <div className="flex items-center gap-4">
                      {(details as MovieDetails).belongs_to_collection.poster_path && (
                        <div className="w-16 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={getImageUrl((details as MovieDetails).belongs_to_collection.poster_path, 'w154')}
                            alt={(details as MovieDetails).belongs_to_collection.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1">
                          {(details as MovieDetails).belongs_to_collection.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          This movie is part of a collection
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TV Show Seasons */}
              {mediaType === 'tv' && (details as TVShowDetails).seasons && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    Seasons ({(details as TVShowDetails).seasons.length})
                  </h3>
                  <div className="space-y-4">
                    {(details as TVShowDetails).seasons.map((season) => (
                      <div key={season.id} className="border border-gray-200 rounded-xl overflow-hidden">
                        <button
                          onClick={() => toggleSeason(season.season_number)}
                          className="w-full p-4 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between"
                        >
                          <div className="flex items-center gap-4">
                            {season.poster_path && (
                              <div className="w-12 h-18 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                                <img
                                  src={getImageUrl(season.poster_path, 'w154')}
                                  alt={season.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                            <div className="text-left">
                              <h4 className="font-semibold text-gray-800">{season.name}</h4>
                              <p className="text-sm text-gray-600">
                                {season.episode_count} episodes
                                {season.air_date && ` • ${new Date(season.air_date).getFullYear()}`}
                              </p>
                            </div>
                          </div>
                          {expandedSeasons.has(season.season_number) ? (
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                          )}
                        </button>
                        
                        {expandedSeasons.has(season.season_number) && (
                          <div className="p-4 bg-white border-t border-gray-200">
                            {season.overview && (
                              <p className="text-gray-600 mb-4">{season.overview}</p>
                            )}
                            <div className="text-sm text-gray-500">
                              <p>Episodes will be loaded when you expand this season.</p>
                              <p className="mt-2">
                                <strong>Air Date:</strong> {season.air_date ? formatDate(season.air_date) : 'TBA'}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional TV Show Info */}
              {mediaType === 'tv' && (
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Show Information</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Seasons:</span>
                        <span className="font-medium">{(details as TVShowDetails).number_of_seasons}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Episodes:</span>
                        <span className="font-medium">{(details as TVShowDetails).number_of_episodes}</span>
                      </div>
                      {(details as TVShowDetails).episode_run_time && (details as TVShowDetails).episode_run_time.length > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Episode Runtime:</span>
                          <span className="font-medium">
                            {(details as TVShowDetails).episode_run_time.join(', ')} min
                          </span>
                        </div>
                      )}
                      {(details as TVShowDetails).last_air_date && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Last Aired:</span>
                          <span className="font-medium">
                            {formatDate((details as TVShowDetails).last_air_date)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {(details as TVShowDetails).networks && (details as TVShowDetails).networks.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">Networks</h3>
                      <div className="space-y-2">
                        {(details as TVShowDetails).networks.map((network) => (
                          <div key={network.id} className="flex items-center gap-3">
                            {network.logo_path && (
                              <div className="w-8 h-8 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                                <img
                                  src={getImageUrl(network.logo_path, 'w92')}
                                  alt={network.name}
                                  className="w-full h-full object-contain"
                                />
                              </div>
                            )}
                            <span className="text-sm font-medium text-gray-700">{network.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        ) : null}
      </div>
    </div>
  )
}