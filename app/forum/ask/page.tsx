"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, User, Tag, AlertCircle, X, Plus } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { LoadingOverlay } from "@/components/loading"

const DIFFICULTY_OPTIONS = [
  { value: 'easy', label: 'Easy', color: 'bg-green-100 text-green-800' },
  { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'hard', label: 'Hard', color: 'bg-red-100 text-red-800' }
]

const POPULAR_TAGS = [
  'accenture', 'tcs', 'infosys', 'wipro', 'cognizant', 'capgemini',
  'aptitude', 'coding', 'hr-interview', 'technical-interview',
  'placement', 'preparation', 'recruitment-process', 'salary',
  'fresher', 'experienced', 'campus-placement', 'off-campus'
]

export default function AskQuestionPage() {
  const router = useRouter()
  const { user, isAuthenticated, loading: authLoading } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: '',
    difficulty: '',
    tags: [] as string[]
  })
  const [newTag, setNewTag] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please log in to ask a question.",
        variant: "destructive"
      })
      router.push('/auth/login?redirect=/forum/ask')
      return
    }
    
    if (!formData.title || !formData.content || !formData.author || !formData.difficulty) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      })
      return
    }

    if (formData.tags.length === 0) {
      toast({
        title: "Add Tags",
        description: "Please add at least one tag to help categorize your question.",
        variant: "destructive"
      })
      return
    }

    setLoading(true)

    try {
      const questionData = {
        id: `q_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title: formData.title,
        content: formData.content,
        author: formData.author,
        authorReputation: 0,
        tags: formData.tags,
        difficulty: formData.difficulty
      }

      const response = await fetch('/api/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(questionData),
      })

      if (!response.ok) {
        throw new Error('Failed to create question')
      }

      toast({
        title: "Question Posted!",
        description: "Your question has been posted successfully.",
      })

      router.push('/forum')
    } catch (error) {
      console.error('Error creating question:', error)
      toast({
        title: "Error",
        description: "Failed to post your question. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const addTag = (tag: string) => {
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }))
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const addCustomTag = () => {
    if (newTag.trim()) {
      addTag(newTag.trim().toLowerCase())
      setNewTag('')
    }
  }

  return (
    <>
      <LoadingOverlay message="Posting your question..." isVisible={loading} />
      <div className="mx-auto w-full max-w-4xl px-4 py-10">
        <Card className="shadow-lg">
        <CardHeader className="text-center pb-6">
          <div className="flex justify-center mb-4">
            <MessageSquare className="h-10 w-10 sm:h-12 sm:w-12 text-primary" />
          </div>
          <CardTitle className="text-xl sm:text-2xl font-bold">Ask a Question</CardTitle>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base">
            Get help from the community about recruitment processes, preparation tips, and more
          </p>
          {!isAuthenticated && !authLoading && (
            <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p className="text-sm text-yellow-800 dark:text-yellow-200 text-center">
                🔒 Please log in to ask questions and get help from the community
              </p>
            </div>
          )}
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Author Name */}
            <div className="space-y-3">
              <Label htmlFor="author" className="flex items-center gap-2 text-sm font-medium">
                <User className="h-4 w-4" />
                Your Name *
              </Label>
              <Input
                id="author"
                value={formData.author}
                onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                placeholder="Enter your name"
                required
                className="h-11"
              />
            </div>

            {/* Question Title */}
            <div className="space-y-3">
              <Label htmlFor="title" className="flex items-center gap-2 text-sm font-medium">
                <MessageSquare className="h-4 w-4" />
                Question Title *
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., What's the new Accenture recruitment process for 2024?"
                required
                className="h-11"
              />
            </div>

            {/* Question Content */}
            <div className="space-y-3">
              <Label htmlFor="content" className="flex items-center gap-2 text-sm font-medium">
                <AlertCircle className="h-4 w-4" />
                Question Details *
              </Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Provide more details about your question. Be specific about what you want to know..."
                rows={6}
                required
                className="resize-none"
              />
            </div>

            {/* Difficulty Level */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <Tag className="h-4 w-4" />
                Difficulty Level *
              </Label>
              <Select value={formData.difficulty} onValueChange={(value) => setFormData(prev => ({ ...prev, difficulty: value }))}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select difficulty level" />
                </SelectTrigger>
                <SelectContent>
                  {DIFFICULTY_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <div className={`px-2 py-1 rounded text-xs ${option.color}`}>
                          {option.label}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Tags */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <Tag className="h-4 w-4" />
                Tags * (Select relevant tags)
              </Label>
              
              {/* Selected Tags */}
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 p-3 bg-muted/50 rounded-lg">
                  {formData.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <X 
                        className="h-3 w-3 cursor-pointer hover:text-destructive" 
                        onClick={() => removeTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
              )}

              {/* Popular Tags */}
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Popular tags:</p>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_TAGS.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className={`cursor-pointer hover:bg-primary hover:text-primary-foreground ${
                        formData.tags.includes(tag) ? 'bg-primary text-primary-foreground' : ''
                      }`}
                      onClick={() => addTag(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Custom Tag Input */}
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add custom tag"
                  className="flex-1"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomTag())}
                />
                <Button type="button" variant="outline" onClick={addCustomTag}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              disabled={loading} 
              className="w-full h-12 text-base font-medium"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Posting Question...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Post Question
                </div>
              )}
            </Button>
          </form>
        </CardContent>
        </Card>
      </div>
    </>
  )
}