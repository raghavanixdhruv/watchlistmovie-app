import React, { useState, useEffect } from 'react'
import { X, User, Mail, Calendar, BarChart3, Film, Tv, Star } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'

interface ProfileModalProps {
  isOpen: boolean
  onClose: () => void
  watchlistStats: {
    total: number
    watched: number
    unwatched: number
    movies: number
    tvShows: number
    averageRating: number
  }
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  watchlistStats,
}) => {
  const { user } = useAuth()
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isOpen && user) {
      fetchProfile()
    }
  }, [isOpen, user])

  const fetchProfile = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle()

      if (error) throw error

      if (data) {
        setProfile(data)
      } else {
        // Profile doesn't exist, create one
        const newProfile = {
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || null,
          created_at: new Date().toISOString()
        }

        const { data: createdProfile, error: createError } = await supabase
          .from('profiles')
          .insert([newProfile])
          .select()
          .single()

        if (createError) {
          console.error('Error creating profile:', createError)
          // Set a basic profile even if creation fails
          setProfile(newProfile)
        } else {
          setProfile(createdProfile)
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
      // Set a basic profile as fallback
      setProfile({
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || null,
        created_at: new Date().toISOString()
      })
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-slide-up">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Profile</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin mx-auto"></div>
              <p className="text-gray-500 mt-4">Loading profile...</p>
            </div>
          ) : profile ? (
            <div className="space-y-6">
              {/* User Info */}
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">
                  {profile?.full_name || 'Anonymous User'}
                </h3>
                <div className="flex items-center justify-center gap-2 text-gray-600 mt-2">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">{profile?.email}</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-gray-600 mt-1">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">
                    Member since {new Date(profile?.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Stats */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Watching Statistics
                </h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-600">
                      {watchlistStats.total}
                    </div>
                    <div className="text-sm text-gray-600">Total Items</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {watchlistStats.watched}
                    </div>
                    <div className="text-sm text-gray-600">Watched</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">
                      {watchlistStats.unwatched}
                    </div>
                    <div className="text-sm text-gray-600">To Watch</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {watchlistStats.averageRating > 0 ? watchlistStats.averageRating.toFixed(1) : 'N/A'}
                    </div>
                    <div className="text-sm text-gray-600">Avg Rating</div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Film className="w-4 h-4 text-blue-500" />
                      <span>Movies: {watchlistStats.movies}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Tv className="w-4 h-4 text-green-500" />
                      <span>TV Shows: {watchlistStats.tvShows}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-semibold text-gray-800 mb-3">Progress</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Completion Rate</span>
                    <span>
                      {watchlistStats.total > 0
                        ? Math.round((watchlistStats.watched / watchlistStats.total) * 100)
                        : 0}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${
                          watchlistStats.total > 0
                            ? (watchlistStats.watched / watchlistStats.total) * 100
                            : 0
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Profile Not Found</h3>
              <p className="text-gray-600">Unable to load profile information.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}