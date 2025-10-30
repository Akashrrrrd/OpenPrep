"use client"

import { useState, useEffect, useRef } from 'react'
import { Search, Filter, X, Clock, TrendingUp, Sparkles } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Checkbox } from '@/components/ui/checkbox'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface SearchResult {
  id: string
  type: 'question' | 'experience' | 'material' | 'company' | 'user'
  title: string
  description: string
  url: string
  relevanceScore: number
  metadata?: any
}

interface SearchFilters {
  type: string[]
  tags: string[]
  difficulty: string[]
  company: string[]
}

interface GlobalSearchProps {
  onResultClick?: () => void
}

export function GlobalSearch({ onResultClick }: GlobalSearchProps) {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [recommendations, setRecommendations] = useState<SearchResult[]>([])
  const [trending, setTrending] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [filters, setFilters] = useState<SearchFilters>({
    type: [],
    tags: [],
    difficulty: [],
    company: []
  })
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [navigating, setNavigating] = useState<string | null>(null)
  const searchRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Load recent searches from localStorage (client-side only)
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('recentSearches')
      if (saved) {
        try {
          setRecentSearches(JSON.parse(saved))
        } catch (error) {
          console.error('Error parsing recent searches:', error)
        }
      }
    }

    // Load recommendations and trending content
    if (isAuthenticated) {
      fetchRecommendations()
    }
    fetchTrending()

    // Click outside handler
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isAuthenticated])

  const fetchRecommendations = async () => {
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'recommendations' })
      })
      if (response.ok) {
        const data = await response.json()
        setRecommendations(data.recommendations)
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error)
    }
  }

  const fetchTrending = async () => {
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'trending' })
      })
      if (response.ok) {
        const data = await response.json()
        setTrending(data.trending)
      }
    } catch (error) {
      console.error('Error fetching trending:', error)
    }
  }

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      setSuggestions([])
      return
    }

    setLoading(true)
    try {
      const params = new URLSearchParams({
        q: searchQuery,
        limit: '10'
      })

      if (filters.type.length > 0) params.set('type', filters.type.join(','))
      if (filters.tags.length > 0) params.set('tags', filters.tags.join(','))
      if (filters.difficulty.length > 0) params.set('difficulty', filters.difficulty.join(','))
      if (filters.company.length > 0) params.set('company', filters.company.join(','))

      const response = await fetch(`/api/search?${params}`)
      if (response.ok) {
        const data = await response.json()
        setResults(data.results)
        setSuggestions(data.suggestions)
        
        // Save to recent searches (client-side only)
        const newRecentSearches = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5)
        setRecentSearches(newRecentSearches)
        if (typeof window !== 'undefined') {
          localStorage.setItem('recentSearches', JSON.stringify(newRecentSearches))
        }
      }
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (value: string) => {
    setQuery(value)
    setShowResults(true)

    // Debounce search
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    debounceRef.current = setTimeout(() => {
      performSearch(value)
    }, 300)
  }

  const handleResultClick = (result: SearchResult) => {
    // Set loading state for this specific result
    setNavigating(result.id)
    
    // Immediately close the search dropdown
    setShowResults(false)
    
    // Clear the search input for better UX
    setQuery('')
    
    // Call the optional callback (for mobile overlay close)
    if (onResultClick) {
      onResultClick()
    }
    
    // Navigate to the result URL
    router.push(result.url)
    
    // Track the click for analytics (optional)
    if (result.id) {
      console.log('Search result clicked:', result.type, result.id)
    }
    
    // Clear loading state after a short delay
    setTimeout(() => setNavigating(null), 1000)
  }

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion)
    performSearch(suggestion)
    // Keep search open when clicking suggestions so user can see results
  }

  const clearFilters = () => {
    setFilters({
      type: [],
      tags: [],
      difficulty: [],
      company: []
    })
  }

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'question': return '❓'
      case 'experience': return '💼'
      case 'material': return '📚'
      case 'company': return '🏢'
      case 'user': return '👤'
      default: return '📄'
    }
  }

  const getResultTypeColor = (type: string) => {
    switch (type) {
      case 'question': return 'bg-blue-100 text-blue-800'
      case 'experience': return 'bg-green-100 text-green-800'
      case 'material': return 'bg-purple-100 text-purple-800'
      case 'company': return 'bg-orange-100 text-orange-800'
      case 'user': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const hasActiveFilters = Object.values(filters).some(arr => arr.length > 0)

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search questions, experiences, materials, companies..."
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => setShowResults(true)}
          className="pl-10 pr-24"
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
          {query && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setQuery('')
                setResults([])
                setSuggestions([])
                setShowResults(false)
              }}
              className="h-6 w-6 p-0 hover:bg-gray-100"
              title="Clear search"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-6 w-6 p-0"
              title="Clear filters"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Filter className={`h-4 w-4 ${hasActiveFilters ? 'text-primary' : 'text-muted-foreground'}`} />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Content Type</h4>
                  <div className="space-y-2">
                    {['question', 'experience', 'material', 'company'].map((type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox
                          id={type}
                          checked={filters.type.includes(type)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFilters(prev => ({ ...prev, type: [...prev.type, type] }))
                            } else {
                              setFilters(prev => ({ ...prev, type: prev.type.filter(t => t !== type) }))
                            }
                          }}
                        />
                        <label htmlFor={type} className="text-sm capitalize">
                          {type}s
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Difficulty</h4>
                  <div className="space-y-2">
                    {['beginner', 'intermediate', 'advanced'].map((level) => (
                      <div key={level} className="flex items-center space-x-2">
                        <Checkbox
                          id={level}
                          checked={filters.difficulty.includes(level)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFilters(prev => ({ ...prev, difficulty: [...prev.difficulty, level] }))
                            } else {
                              setFilters(prev => ({ ...prev, difficulty: prev.difficulty.filter(d => d !== level) }))
                            }
                          }}
                        />
                        <label htmlFor={level} className="text-sm capitalize">
                          {level}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {showResults && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 max-h-96 overflow-y-auto">
          <CardContent className="p-0">
            {loading ? (
              <div className="p-4 text-center text-muted-foreground">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
                Searching...
              </div>
            ) : query.trim() ? (
              <>
                {results.length > 0 ? (
                  <div className="space-y-1">
                    {results.map((result) => (
                      <div
                        key={`${result.type}-${result.id}`}
                        className="p-3 hover:bg-muted cursor-pointer border-b last:border-b-0"
                        onClick={() => handleResultClick(result)}
                        style={{ 
                          opacity: navigating === result.id ? 0.6 : 1,
                          pointerEvents: navigating === result.id ? 'none' : 'auto'
                        }}
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-lg">{getResultIcon(result.type)}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium text-sm truncate">{result.title}</h4>
                              <Badge variant="outline" className={`text-xs ${getResultTypeColor(result.type)}`}>
                                {result.type}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {result.description}
                            </p>
                            {result.metadata?.tags && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {result.metadata.tags.slice(0, 3).map((tag: string, index: number) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-muted-foreground">
                    No results found for "{query}"
                  </div>
                )}

                {suggestions.length > 0 && (
                  <div className="border-t p-3">
                    <h4 className="text-sm font-medium mb-2">Suggestions</h4>
                    <div className="flex flex-wrap gap-1">
                      {suggestions.map((suggestion, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className="h-6 text-xs"
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="space-y-4 p-4">
                {recentSearches.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Recent Searches
                    </h4>
                    <div className="space-y-1">
                      {recentSearches.map((search, index) => (
                        <div
                          key={index}
                          className="text-sm text-muted-foreground hover:text-foreground cursor-pointer p-1 rounded hover:bg-muted"
                          onClick={() => handleSuggestionClick(search)}
                        >
                          {search}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {isAuthenticated && recommendations.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      Recommended for You
                    </h4>
                    <div className="space-y-1">
                      {recommendations.slice(0, 3).map((rec) => (
                        <div
                          key={`${rec.type}-${rec.id}`}
                          className="p-2 hover:bg-muted cursor-pointer rounded"
                          onClick={() => handleResultClick(rec)}
                          style={{ 
                            opacity: navigating === rec.id ? 0.6 : 1,
                            pointerEvents: navigating === rec.id ? 'none' : 'auto'
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <span>{getResultIcon(rec.type)}</span>
                            <span className="text-sm truncate">{rec.title}</span>
                            <Badge variant="outline" className="text-xs">
                              {rec.type}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {trending.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Trending
                    </h4>
                    <div className="space-y-1">
                      {trending.slice(0, 3).map((trend) => (
                        <div
                          key={`${trend.type}-${trend.id}`}
                          className="p-2 hover:bg-muted cursor-pointer rounded"
                          onClick={() => handleResultClick(trend)}
                          style={{ 
                            opacity: navigating === trend.id ? 0.6 : 1,
                            pointerEvents: navigating === trend.id ? 'none' : 'auto'
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <span>{getResultIcon(trend.type)}</span>
                            <span className="text-sm truncate">{trend.title}</span>
                            <Badge variant="outline" className="text-xs">
                              {trend.type}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}