import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Question from '@/lib/models/Question'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    
    const { userId, username } = await request.json()
    const questionId = params.id

    const question = await Question.findOne({ id: questionId })
    if (!question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 })
    }

    // Check if user already downvoted
    const existingDownvote = question.downvotes.find((vote: any) => vote.userId === userId)
    const existingUpvote = question.upvotes.find((vote: any) => vote.userId === userId)

    if (existingDownvote) {
      // Remove downvote
      question.downvotes = question.downvotes.filter((vote: any) => vote.userId !== userId)
    } else {
      // Remove upvote if exists
      if (existingUpvote) {
        question.upvotes = question.upvotes.filter((vote: any) => vote.userId !== userId)
      }
      
      // Add downvote
      question.downvotes.push({
        userId,
        username,
        timestamp: new Date()
      })
    }

    await question.save()

    return NextResponse.json(question)
  } catch (error) {
    console.error('Error downvoting question:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}