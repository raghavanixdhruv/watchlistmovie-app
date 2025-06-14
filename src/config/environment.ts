// Environment configuration for production deployment
export const config = {
  // API Configuration
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || '',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  },
  tmdb: {
    apiKey: import.meta.env.VITE_TMDB_API_KEY || '',
    baseUrl: 'https://api.themoviedb.org/3',
    imageBaseUrl: 'https://image.tmdb.org/t/p',
  },
  
  // App Configuration
  app: {
    name: 'WatchTracker',
    version: '1.0.0',
    environment: import.meta.env.MODE || 'development',
    isDevelopment: import.meta.env.DEV,
    isProduction: import.meta.env.PROD,
  },

  // Feature Flags
  features: {
    enableAnalytics: import.meta.env.PROD,
    enableErrorReporting: import.meta.env.PROD,
    enableRealtime: true,
  },
}

// Validation
export const validateEnvironment = () => {
  const errors: string[] = []

  if (!config.supabase.url || config.supabase.url === 'your_supabase_url_here') {
    errors.push('VITE_SUPABASE_URL is not configured')
  }

  if (!config.supabase.anonKey || config.supabase.anonKey === 'your_supabase_anon_key_here') {
    errors.push('VITE_SUPABASE_ANON_KEY is not configured')
  }

  if (!config.tmdb.apiKey || config.tmdb.apiKey === 'your_tmdb_api_key_here') {
    errors.push('VITE_TMDB_API_KEY is not configured')
  }

  if (errors.length > 0 && config.app.isProduction) {
    throw new Error(`Environment validation failed:\n${errors.join('\n')}`)
  }

  return errors
}