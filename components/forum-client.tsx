"use client"

import { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, MessageSquare, ThumbsUp, Eye, CheckCircle, Clock, TrendingUp } from "lucide-react"
import Link from "next/link"
import { ComponentLoading } from "@/components/loading"

// Define types locally to avoid importing Mongoose models on client
interface Answer {
  id: string
  content: string
  author: string
  authorReputation: number
  upvotes: number
  downvotes: number
  isAccepted: boolean
  expertVerified: boolean
  createdAt: string
  updatedAt: string
}

interface Question {
  id: string
  title: string
  content: string
  author: string
  authorReputation: number
  tags: string[]
  difficulty: 'easy' | 'medium' | 'hard'
  upvotes: number
  downvotes: number
  views: number
  answers: Answer[]
  hasAcceptedAnswer: boolean
  createdAt: string
  updatedAt: string
}

interface ForumClientProps {
  questions: Question[]
  allTags: string[]
}

export default function ForumClient({ questions, allTags }: ForumClientProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

  // Filter questions based on search and tag
  const filteredQuestions = useMemo(() => {
    let filtered = questions

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(q => 
        q.title.toLowerCase().includes(query) ||
        q.content.toLowerCase().includes(query) ||
        q.tags.some(tag => tag.toLowerCase().includes(query))
      )
    }

    if (selectedTag) {
      filtered = filtered.filter(q => q.tags.includes(selectedTag))
    }

    return filtered
  }, [questions, searchQuery, selectedTag])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      case 'hard': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  const getTagColor = (tag: string) => {
    const colors = [
      'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
      'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
      'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300'
    ]
    
    // Simple hash function to consistently assign colors
    let hash = 0
    for (let i = 0; i < tag.length; i++) {
      hash = ((hash << 5) - hash + tag.charCodeAt(i)) & 0xffffffff
    }
    
    return colors[Math.abs(hash) % colors.length]
  }

  const getReputationBadge = (reputation: number) => {
    if (reputation >= 1000) return { text: 'Expert', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300' }
    if (reputation >= 500) return { text: 'Advanced', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' }
    if (reputation >= 100) return { text: 'Intermediate', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' }
    return { text: 'Beginner', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300' }
  }

  const QuestionCard = ({ question }: { question: Question }) => {
    const repBadge = getReputationBadge(question.authorReputation)
    
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Question Header */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <Link href={`/forum/question/${question.id}`} className="hover:text-primary">
                  <h3 className="text-lg font-semibold leading-tight hover:underline">
                    {question.title}
                  </h3>
                </Link>
                <p className="text-muted-foreground text-sm mt-2 line-clamp-2">
                  {question.content}
                </p>
              </div>
              {question.hasAcceptedAnswer && (
                <div className="flex items-center gap-1 text-green-600 text-sm">
                  <CheckCircle className="h-4 w-4" />
                  <span className="hidden sm:inline">Solved</span>
                </div>
              )}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {question.tags.map((tag) => (
                <Badge
                  key={tag}
                  className={`${getTagColor(tag)} cursor-pointer hover:opacity-80`}
                  variant="outline"
                  onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                >
                  {tag}
                </Badge>
              ))}
              <Badge className={getDifficultyColor(question.difficulty)} variant="outline">
                {question.difficulty}
              </Badge>
            </div>

            {/* Question Stats */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <ThumbsUp className="h-4 w-4" />
                  <span>{question.upvotes - question.downvotes}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" />
                  <span>{question.answers.length}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span>{question.views}</span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <Badge className={repBadge.color} variant="outline">
                  {repBadge.text}
                </Badge>
                <div className="flex items-center gap-2">
                  <span className="truncate">by {question.author}</span>
                  <span className="hidden sm:inline">•</span>
                  <span className="text-xs">{formatDate(question.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-8">
      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button asChild>
              <Link href="/forum/ask">Ask Question</Link>
            </Button>
          </div>

          {/* Popular Tags */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Popular Tags:</h4>
            <div className="flex flex-wrap gap-2">
              {allTags.slice(0, 12).map((tag) => (
                <Badge
                  key={tag}
                  className={`cursor-pointer hover:opacity-80 ${
                    selectedTag === tag 
                      ? 'bg-primary text-primary-foreground' 
                      : getTagColor(tag)
                  }`}
                  variant="outline"
                  onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                >
                  {tag}
                </Badge>
              ))}
              {selectedTag && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedTag(null)}
                  className="h-6 px-2 text-xs"
                >
                  Clear filter
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Questions Tabs */}
      <Tabs defaultValue="recent" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="recent" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
            <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Recent</span>
            <span className="sm:hidden">New</span>
          </TabsTrigger>
          <TabsTrigger value="popular" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
            <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Popular</span>
            <span className="sm:hidden">Hot</span>
          </TabsTrigger>
          <TabsTrigger value="unanswered" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
            <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Unanswered</span>
            <span className="sm:hidden">Open</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="recent" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Recent Questions</h2>
            <span className="text-sm text-muted-foreground">
              {filteredQuestions.length} questions
            </span>
          </div>
          
          {filteredQuestions.length > 0 ? (
            <div className="space-y-4">
              {filteredQuestions
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .map((question) => (
                  <QuestionCard key={question.id} question={question} />
                ))}
            </div>
          ) : (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Search className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">No questions found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery || selectedTag 
                    ? "Try adjusting your search or filters" 
                    : "Be the first to ask a question!"
                  }
                </p>
                <Button asChild>
                  <Link href="/forum/ask">Ask Question</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="popular" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Popular Questions</h2>
            <span className="text-sm text-muted-foreground">Most upvoted</span>
          </div>
          
          <div className="space-y-4">
            {filteredQuestions
              .sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes))
              .map((question) => (
                <QuestionCard key={question.id} question={question} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="unanswered" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Unanswered Questions</h2>
            <span className="text-sm text-muted-foreground">Need your help!</span>
          </div>
          
          <div className="space-y-4">
            {filteredQuestions
              .filter(q => !q.hasAcceptedAnswer)
              .map((question) => (
                <QuestionCard key={question.id} question={question} />
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}