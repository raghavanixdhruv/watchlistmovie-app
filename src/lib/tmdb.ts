import { config } from '../config/environment'

const TMDB_API_KEY = config.tmdb.apiKey
const TMDB_BASE_URL = config.tmdb.baseUrl
const TMDB_IMAGE_BASE_URL = config.tmdb.imageBaseUrl

// Validate TMDB API key
const isValidApiKey = (key: string): boolean => {
  return key && key !== 'demo_key' && key !== 'your_tmdb_api_key_here' && key.length > 10
}

export interface TMDBSearchResult {
  id: number
  title?: string
  name?: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date?: string
  first_air_date?: string
  genre_ids: number[]
  vote_average: number
  media_type: 'movie' | 'tv'
}

export interface TMDBResponse {
  page: number
  results: TMDBSearchResult[]
  total_pages: number
  total_results: number
}

export interface Genre {
  id: number
  name: string
}

export interface ProductionCompany {
  id: number
  logo_path: string | null
  name: string
  origin_country: string
}

export interface ProductionCountry {
  iso_3166_1: string
  name: string
}

export interface SpokenLanguage {
  english_name: string
  iso_639_1: string
  name: string
}

export interface Collection {
  id: number
  name: string
  poster_path: string | null
  backdrop_path: string | null
}

export interface Network {
  id: number
  logo_path: string | null
  name: string
  origin_country: string
}

export interface Season {
  air_date: string | null
  episode_count: number
  id: number
  name: string
  overview: string
  poster_path: string | null
  season_number: number
}

export interface Episode {
  air_date: string | null
  episode_number: number
  id: number
  name: string
  overview: string
  production_code: string
  runtime: number | null
  season_number: number
  show_id: number
  still_path: string | null
  vote_average: number
  vote_count: number
}

export interface MovieDetails {
  id: number
  title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  runtime: number | null
  genres: Genre[]
  production_companies: ProductionCompany[]
  production_countries: ProductionCountry[]
  spoken_languages: SpokenLanguage[]
  vote_average: number
  vote_count: number
  budget: number
  revenue: number
  status: string
  tagline: string | null
  belongs_to_collection: Collection | null
}

export interface TVShowDetails {
  id: number
  name: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  first_air_date: string
  last_air_date: string | null
  episode_run_time: number[]
  genres: Genre[]
  production_companies: ProductionCompany[]
  production_countries: ProductionCountry[]
  spoken_languages: SpokenLanguage[]
  vote_average: number
  vote_count: number
  status: string
  tagline: string | null
  number_of_episodes: number
  number_of_seasons: number
  seasons: Season[]
  networks: Network[]
}

export const searchMulti = async (query: string): Promise<TMDBResponse> => {
  if (!query.trim()) {
    return { page: 1, results: [], total_pages: 0, total_results: 0 }
  }

  // Check if API key is properly configured
  if (!isValidApiKey(TMDB_API_KEY)) {
    console.error('TMDB API key is not properly configured. Please set VITE_TMDB_API_KEY in your .env file.')
    throw new Error('TMDB API key is not configured. Please check your environment variables.')
  }

  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&include_adult=false`
    )
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Invalid TMDB API key. Please check your VITE_TMDB_API_KEY in the .env file.')
      }
      throw new Error(`TMDB API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    
    // Filter out person results and add media_type
    const filteredResults = data.results
      .filter((item: any) => item.media_type === 'movie' || item.media_type === 'tv')
      .map((item: any) => ({
        ...item,
        title: item.title || item.name,
        release_date: item.release_date || item.first_air_date,
      }))

    return {
      ...data,
      results: filteredResults,
    }
  } catch (error) {
    console.error('Error searching TMDB:', error)
    throw error
  }
}

export const getMovieDetails = async (movieId: number): Promise<MovieDetails> => {
  if (!isValidApiKey(TMDB_API_KEY)) {
    throw new Error('TMDB API key is not configured. Please check your environment variables.')
  }

  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}`
    )
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Invalid TMDB API key. Please check your VITE_TMDB_API_KEY in the .env file.')
      }
      throw new Error(`TMDB API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching movie details:', error)
    throw error
  }
}

export const getTVShowDetails = async (tvId: number): Promise<TVShowDetails> => {
  if (!isValidApiKey(TMDB_API_KEY)) {
    throw new Error('TMDB API key is not configured. Please check your environment variables.')
  }

  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/tv/${tvId}?api_key=${TMDB_API_KEY}`
    )
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Invalid TMDB API key. Please check your VITE_TMDB_API_KEY in the .env file.')
      }
      throw new Error(`TMDB API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching TV show details:', error)
    throw error
  }
}

export const getSeasonDetails = async (tvId: number, seasonNumber: number): Promise<any> => {
  if (!isValidApiKey(TMDB_API_KEY)) {
    throw new Error('TMDB API key is not configured. Please check your environment variables.')
  }

  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/tv/${tvId}/season/${seasonNumber}?api_key=${TMDB_API_KEY}`
    )
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Invalid TMDB API key. Please check your VITE_TMDB_API_KEY in the .env file.')
      }
      throw new Error(`TMDB API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching season details:', error)
    throw error
  }
}

export const getImageUrl = (path: string | null, size: string = 'w500'): string => {
  if (!path) return 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=500'
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`
}

export const getTrendingMovies = async (): Promise<TMDBSearchResult[]> => {
  // Check if API key is properly configured
  if (!isValidApiKey(TMDB_API_KEY)) {
    console.error('TMDB API key is not properly configured. Please set VITE_TMDB_API_KEY in your .env file.')
    return []
  }

  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/trending/movie/week?api_key=${TMDB_API_KEY}`
    )
    
    if (!response.ok) {
      if (response.status === 401) {
        console.error('Invalid TMDB API key. Please check your VITE_TMDB_API_KEY in the .env file.')
        return []
      }
      throw new Error(`TMDB API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return data.results.map((item: any) => ({
      ...item,
      media_type: 'movie' as const,
    }))
  } catch (error) {
    console.error('Error fetching trending movies:', error)
    return []
  }
}

export const getTrendingTVShows = async (): Promise<TMDBSearchResult[]> => {
  // Check if API key is properly configured
  if (!isValidApiKey(TMDB_API_KEY)) {
    console.error('TMDB API key is not properly configured. Please set VITE_TMDB_API_KEY in your .env file.')
    return []
  }

  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/trending/tv/week?api_key=${TMDB_API_KEY}`
    )
    
    if (!response.ok) {
      if (response.status === 401) {
        console.error('Invalid TMDB API key. Please check your VITE_TMDB_API_KEY in the .env file.')
        return []
      }
      throw new Error(`TMDB API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return data.results.map((item: any) => ({
      ...item,
      title: item.name,
      release_date: item.first_air_date,
      media_type: 'tv' as const,
    }))
  } catch (error) {
    console.error('Error fetching trending TV shows:', error)
    return []
  }
}