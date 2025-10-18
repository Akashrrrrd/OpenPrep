"use client"

import { useState, useEffect } from 'react'
import ForumClient from '@/components/forum-client'
import { ComponentLoading } from '@/components/loading'

export default function ForumPage() {
  const [questions, setQuestions] = useState<any[]>([])
  const [allTags, setAllTags] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch('/api/questions')
        if (response.ok) {
          const data = await response.json()
          setQuestions(data)
          
          // Get all unique tags
          const tags = Array.from(
            new Set(data.flatMap((q: any) => q.tags))
          ).sort()
          setAllTags(tags)
        }
      } catch (error) {
        console.error('Error fetching questions:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchQuestions()
  }, [])

  if (loading) {
    return <ComponentLoading />
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-2xl sm:text-3xl font-bold">Q&A Forum</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base px-4 sm:px-0">
          Get help from the community. Ask questions, share knowledge, and learn from experienced students and professionals.
        </p>
      </div>

      {/* Client Component with Interactive Features */}
      <ForumClient questions={questions} allTags={allTags} />
    </div>
  )
}