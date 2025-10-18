import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Question from '@/lib/models/Question'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { userId, username } = body

    if (!userId || !username) {
      return NextResponse.json(
        { error: 'Missing userId or username' },
        { status: 400 }
      )
    }

    try {
      // Try to update in MongoDB first
      await connectDB()
      
      const question = await Question.findOne({ id: params.id })
      if (!question) {
        return NextResponse.json(
          { error: 'Question not found' },
          { status: 404 }
        )
      }

      // Check if user already voted
      const existingUpvote = question.upvotes.find((vote: any) => vote.userId === userId)
      const existingDownvote = question.downvotes.find((vote: any) => vote.userId === userId)

      if (existingUpvote) {
        // Remove upvote
        question.upvotes = question.upvotes.filter((vote: any) => vote.userId !== userId)
      } else {
        // Remove downvote if exists and add upvote
        if (existingDownvote) {
          question.downvotes = question.downvotes.filter((vote: any) => vote.userId !== userId)
        }
        question.upvotes.push({
          userId,
          username,
          timestamp: new Date().toISOString()
        })
      }

      await question.save()

      // Return updated question
      const updatedQuestion = {
        id: question.id,
        title: question.title,
        content: question.content,
        author: question.author,
        authorReputation: question.authorReputation,
        tags: question.tags,
        difficulty: question.difficulty,
        upvotes: question.upvotes,
        downvotes: question.downvotes,
        views: question.views,
        comments: question.comments,
        answers: question.answers,
        hasAcceptedAnswer: question.hasAcceptedAnswer,
        createdAt: question.createdAt.toISOString(),
        updatedAt: question.updatedAt.toISOString()
      }

      return NextResponse.json(updatedQuestion)
    } catch (dbError) {
      console.error('Database error, using fallback approach:', dbError)
      
      // Fallback: Return a mock updated question for demo purposes
      // In a real app, you might store this in localStorage or session storage
      const mockUpdatedQuestion = {
        id: params.id,
        title: "Mock Question (DB Unavailable)",
        content: "This is a fallback response when database is unavailable.",
        author: "system",
        authorReputation: 0,
        tags: ["demo"],
        difficulty: "easy" as const,
        upvotes: [{ userId, username, timestamp: new Date().toISOString() }],
        downvotes: [],
        views: 1,
        comments: [],
        answers: [],
        hasAcceptedAnswer: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      return NextResponse.json(mockUpdatedQuestion)
    }
  } catch (error) {
    console.error('Error processing upvote:', error)
    return NextResponse.json(
      { error: 'Failed to process upvote' },
      { status: 500 }
    )
  }
}