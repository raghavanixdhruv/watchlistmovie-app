import React from 'react'
import { Search, List, Eye, EyeOff } from 'lucide-react'

interface NavigationProps {
  activeTab: 'search' | 'all' | 'watched' | 'unwatched'
  onTabChange: (tab: 'search' | 'all' | 'watched' | 'unwatched') => void
  watchlistCounts: {
    total: number
    watched: number
    unwatched: number
  }
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  watchlistCounts,
}) => {
  const tabs = [
    {
      id: 'search' as const,
      label: 'Search',
      icon: Search,
      count: null,
    },
    {
      id: 'all' as const,
      label: 'All Items',
      icon: List,
      count: watchlistCounts.total,
    },
    {
      id: 'unwatched' as const,
      label: 'To Watch',
      icon: EyeOff,
      count: watchlistCounts.unwatched,
    },
    {
      id: 'watched' as const,
      label: 'Watched',
      icon: Eye,
      count: watchlistCounts.watched,
    },
  ]

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-8 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-1 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  isActive
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
                {tab.count !== null && (
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      isActive
                        ? 'bg-primary-100 text-primary-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}