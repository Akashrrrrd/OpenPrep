import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Question from '@/lib/models/Question'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string; answerId: string } }
) {
  try {
    await connectDB()
    
    const { userId, username } = await request.json()
    const { id: questionId, answerId } = params

    const question = await Question.findOne({ id: questionId })
    if (!question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 })
    }

    const answer = question.answers.find((a: any) => a.id === answerId)
    if (!answer) {
      return NextResponse.json({ error: 'Answer not found' }, { status: 404 })
    }

    // Check if user already upvoted this answer
    const existingUpvote = answer.upvotes.find((vote: any) => vote.userId === userId)
    const existingDownvote = answer.downvotes.find((vote: any) => vote.userId === userId)

    if (existingUpvote) {
      // Remove upvote
      answer.upvotes = answer.upvotes.filter((vote: any) => vote.userId !== userId)
    } else {
      // Remove downvote if exists
      if (existingDownvote) {
        answer.downvotes = answer.downvotes.filter((vote: any) => vote.userId !== userId)
      }
      
      // Add upvote
      answer.upvotes.push({
        userId,
        username,
        timestamp: new Date()
      })
    }

    await question.save()
    return NextResponse.json(question)
  } catch (error) {
    console.error('Error upvoting answer:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}