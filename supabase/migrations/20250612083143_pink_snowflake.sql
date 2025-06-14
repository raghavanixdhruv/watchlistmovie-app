/*
  # Create watchlist_items table

  1. New Tables
    - `watchlist_items`
      - `id` (uuid, primary key, auto-generated)
      - `user_id` (uuid, references auth.users, not null)
      - `tmdb_id` (integer, not null)
      - `title` (text, not null)
      - `overview` (text, nullable)
      - `poster_path` (text, nullable)
      - `backdrop_path` (text, nullable)
      - `release_date` (text, nullable)
      - `genre_ids` (integer array, nullable)
      - `vote_average` (numeric, nullable)
      - `media_type` (text, not null - 'movie' or 'tv')
      - `is_watched` (boolean, default false)
      - `rating` (integer, nullable)
      - `notes` (text, nullable)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `watchlist_items` table
    - Add policy for users to view their own watchlist items
    - Add policy for users to insert their own watchlist items
    - Add policy for users to update their own watchlist items
    - Add policy for users to delete their own watchlist items

  3. Constraints
    - Check constraint for media_type to ensure only 'movie' or 'tv' values
    - Check constraint for rating to ensure values between 1 and 10
*/

CREATE TABLE IF NOT EXISTS watchlist_items (
  id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  tmdb_id integer NOT NULL,
  title text NOT NULL,
  overview text,
  poster_path text,
  backdrop_path text,
  release_date text,
  genre_ids integer[],
  vote_average numeric,
  media_type text NOT NULL CHECK (media_type IN ('movie', 'tv')),
  is_watched boolean DEFAULT false NOT NULL,
  rating integer CHECK (rating >= 1 AND rating <= 10),
  notes text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE watchlist_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own watchlist items"
  ON watchlist_items
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own watchlist items"
  ON watchlist_items
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own watchlist items"
  ON watchlist_items
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own watchlist items"
  ON watchlist_items
  FOR DELETE
  USING (auth.uid() = user_id);