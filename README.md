# WatchTracker 🎬

A modern, production-ready movie and TV show tracking application built with React, TypeScript, Supabase, and TMDB API.

## Features

- 🔍 **Search & Discovery**: Search for movies and TV shows using TMDB API
- 📝 **Personal Watchlist**: Add items to your personal watchlist
- ✅ **Watch Status**: Mark items as watched/unwatched
- ⭐ **Rating System**: Rate your watched content (1-5 stars)
- 📱 **Responsive Design**: Works perfectly on all devices
- 🔐 **User Authentication**: Secure sign-up and sign-in
- 📊 **Statistics**: View your watching statistics and progress
- 🎭 **Detailed Information**: View comprehensive details about movies and TV shows
- 🔄 **Real-time Updates**: Live updates across all your devices

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Authentication, Real-time)
- **API**: The Movie Database (TMDB) API
- **Deployment**: Vercel
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- TMDB API key

### Environment Variables

Create a `.env` file in the root directory:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# TMDB API Configuration
VITE_TMDB_API_KEY=your_tmdb_api_key_here
```

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up your environment variables (see above)

4. Start the development server:
   ```bash
   npm run dev
   ```

### Database Setup

The application uses Supabase for the backend. The database schema includes:

- **profiles**: User profile information
- **watchlist_items**: User's watchlist with movies and TV shows

Migration files are included in the `supabase/migrations` directory.

## Deployment

### Vercel (Recommended)

#### Option 1: Deploy via Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel --prod
   ```

#### Option 2: Deploy via GitHub Integration

1. Push your code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "New Project"
4. Import your GitHub repository
5. Configure environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_TMDB_API_KEY`
6. Deploy!

#### Option 3: One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/watchtracker&env=VITE_SUPABASE_URL,VITE_SUPABASE_ANON_KEY,VITE_TMDB_API_KEY)

### Environment Variables for Production

Make sure to set these environment variables in your Vercel dashboard:

- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `VITE_TMDB_API_KEY`: Your TMDB API key

### Custom Domain (Optional)

1. Go to your project settings in Vercel
2. Navigate to "Domains"
3. Add your custom domain
4. Configure DNS settings as instructed

## Features in Detail

### Authentication
- Email/password authentication via Supabase
- Automatic profile creation on sign-up
- Secure session management

### Watchlist Management
- Add movies and TV shows from search results
- Mark items as watched/unwatched
- Rate watched content (1-5 stars)
- Remove items from watchlist
- Filter by watched/unwatched status

### Search & Discovery
- Real-time search using TMDB API
- Search both movies and TV shows
- Detailed information including ratings, release dates, and overviews
- High-quality poster and backdrop images

### User Interface
- Modern, responsive design
- Smooth animations and transitions
- Intuitive navigation
- Mobile-first approach
- Production-ready performance

## API Integration

### TMDB API
- Search for movies and TV shows
- Get detailed information about content
- Fetch high-quality images
- Access ratings and metadata

### Supabase
- User authentication and management
- Real-time database operations
- Row Level Security (RLS) for data protection
- Automatic data synchronization

## Security

- Row Level Security (RLS) enabled on all tables
- Environment variables for sensitive data
- Content Security Policy headers
- XSS and CSRF protection
- Secure authentication flows

## Performance

- Optimized bundle size with Vite
- Image lazy loading
- Efficient API caching
- Real-time updates without polling
- Global CDN delivery via Vercel Edge Network
- Automatic static optimization

## Monitoring & Analytics

Vercel provides built-in analytics and monitoring:
- Real-time performance metrics
- Error tracking
- Usage analytics
- Core Web Vitals monitoring

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Troubleshooting

### Common Issues

1. **Build Errors**: Make sure all environment variables are set
2. **API Errors**: Verify your TMDB API key is valid
3. **Database Issues**: Check Supabase connection and RLS policies
4. **Deployment Issues**: Ensure Node.js version is 18+

### Getting Help

- Check the [Vercel Documentation](https://vercel.com/docs)
- Review [Supabase Documentation](https://supabase.com/docs)
- Open an issue on GitHub

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue on GitHub or contact the development team.

---

Built with ❤️ using modern web technologies and deployed on Vercel