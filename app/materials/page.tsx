"use client"

import { Suspense, useState, useMemo, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { MaterialCard } from "@/components/material-card"
import { ChromeAIService } from "@/lib/chrome-ai"
import { Sparkles, Brain, Wand2, CheckCircle } from "lucide-react"

interface Material {
  id: string
  name: string
  description: string
  driveLink: string
  category: string
  accessCount?: number
  tags?: string[]
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
}

export default function MaterialsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [materials, setMaterials] = useState<Material[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [showAIFeatures, setShowAIFeatures] = useState(false)
  const [aiCapabilities, setAiCapabilities] = useState<any>(null)

  useEffect(() => {
    fetchMaterials()
    checkAICapabilities()
  }, [])

  const checkAICapabilities = async () => {
    const capabilities = await ChromeAIService.getCapabilities()
    setAiCapabilities(capabilities)
    setShowAIFeatures(capabilities.summarizer || capabilities.writer || capabilities.translator)
  }

  const fetchMaterials = async () => {
    try {
      const response = await fetch('/api/materials')
      if (response.ok) {
        const data = await response.json()
        setMaterials(data)
        
        // Extract unique categories
        const uniqueCategories = [...new Set(data.map((m: Material) => m.category))].sort()
        setCategories(uniqueCategories)
      }
    } catch (error) {
      console.error('Failed to fetch materials:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredMaterials = useMemo(() => {
    return materials.filter((material) => {
      const matchesSearch = material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           material.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === "all" || material.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [materials, searchTerm, selectedCategory])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="mx-auto w-full max-w-7xl px-4 py-10 space-y-8">
          <div className="text-center space-y-4">
            <div className="h-8 bg-muted rounded w-64 mx-auto animate-pulse"></div>
            <div className="h-4 bg-muted rounded w-96 mx-auto animate-pulse"></div>
          </div>
          <Card className="border">
            <CardContent className="py-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-8 bg-muted rounded w-16 mx-auto animate-pulse"></div>
                    <div className="h-4 bg-muted rounded w-24 mx-auto animate-pulse"></div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="mx-auto w-full max-w-7xl px-4 py-10 space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl sm:text-4xl font-bold">Study Materials</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Access comprehensive study materials and resources for all major programming topics and technologies
          </p>
        </div>

        {/* Chrome AI Powered Features */}
        {showAIFeatures && (
          <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200 dark:border-purple-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-purple-500" />
                Chrome AI Enhanced Study Experience
                <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                  NEW
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-blue-500" />
                    <h4 className="font-semibold">Smart Summarization</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    AI-powered content summarization using Chrome's Summarizer API
                  </p>
                  {aiCapabilities?.summarizer && (
                    <div className="flex items-center gap-1 text-green-600 text-xs">
                      <CheckCircle className="h-3 w-3" />
                      Available
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Wand2 className="h-5 w-5 text-purple-500" />
                    <h4 className="font-semibold">Content Enhancement</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Improve and rewrite study notes using Chrome's Writer API
                  </p>
                  {aiCapabilities?.writer && (
                    <div className="flex items-center gap-1 text-green-600 text-xs">
                      <CheckCircle className="h-3 w-3" />
                      Available
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-yellow-500" />
                    <h4 className="font-semibold">Multi-language Support</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Translate materials using Chrome's Translator API
                  </p>
                  {aiCapabilities?.translator && (
                    <div className="flex items-center gap-1 text-green-600 text-xs">
                      <CheckCircle className="h-3 w-3" />
                      Available
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Card */}
        <Card className="border">
          <CardContent className="py-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">{materials.length}+</div>
                <div className="text-sm text-muted-foreground">Study Topics</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">{categories.length}</div>
                <div className="text-sm text-muted-foreground">Categories</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">Free</div>
                <div className="text-sm text-muted-foreground">Access</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search and Filter Section */}
        <Card className="border">
          <CardHeader>
            <CardTitle>Find Study Materials</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input 
                placeholder="Search materials..." 
                className="w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Materials Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">
              {selectedCategory === "all" ? "All Study Materials" : `${selectedCategory} Materials`}
            </h2>
            <p className="text-sm text-muted-foreground">
              {filteredMaterials.length} of {materials.length} materials
            </p>
          </div>
          
          {filteredMaterials.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMaterials.map((material) => (
                <MaterialCard key={material.id} material={material} />
              ))}
            </div>
          ) : (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-muted p-3 mb-4">
                  <svg className="h-6 w-6 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-2">No materials found</h3>
                <p className="text-muted-foreground mb-4 max-w-sm">
                  Try adjusting your search terms or category filter to find what you're looking for.
                </p>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setSearchTerm("")}
                    className="text-sm text-primary hover:underline"
                  >
                    Clear search
                  </button>
                  <span className="text-muted-foreground">•</span>
                  <button 
                    onClick={() => setSelectedCategory("all")}
                    className="text-sm text-primary hover:underline"
                  >
                    Show all categories
                  </button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}