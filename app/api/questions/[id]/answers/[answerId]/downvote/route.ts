import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Question from '@/lib/models/Question'
import { verifyToken } from '@/lib/auth'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string; answerId: string } }
) {
  try {
    // Check authentication
    const token = request.cookies.get('auth-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const user = await verifyToken(token)
    if (!user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    await connectDB()
    
    const { userId, username } = await request.json()
    const { id: questionId, answerId } = params

    // Verify the userId matches the authenticated user
    if (userId !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const question = await Question.findOne({ id: questionId })
    if (!question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 })
    }

    const answer = question.answers.find((a: any) => a.id === answerId)
    if (!answer) {
      return NextResponse.json({ error: 'Answer not found' }, { status: 404 })
    }

    // Check if user already downvoted this answer
    const existingDownvote = answer.downvotes.find((vote: any) => vote.userId === userId)
    const existingUpvote = answer.upvotes.find((vote: any) => vote.userId === userId)

    if (existingDownvote) {
      // Remove downvote
      answer.downvotes = answer.downvotes.filter((vote: any) => vote.userId !== userId)
    } else {
      // Remove upvote if exists
      if (existingUpvote) {
        answer.upvotes = answer.upvotes.filter((vote: any) => vote.userId !== userId)
      }
      
      // Add downvote
      answer.downvotes.push({
        userId,
        username,
        timestamp: new Date()
      })
    }

    await question.save()
    return NextResponse.json(question)
  } catch (error) {
    console.error('Error downvoting answer:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}