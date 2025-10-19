import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Question from '@/lib/models/Question'
import { verifyToken } from '@/lib/auth'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const token = request.cookies.get('auth-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Authentication required to post answers' }, { status: 401 })
    }

    const user = await verifyToken(token)
    if (!user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    await connectDB()
    
    const { content, author, authorReputation } = await request.json()
    const questionId = params.id

    // Verify the author matches the authenticated user
    if (author !== user.name) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const question = await Question.findOne({ id: questionId })
    if (!question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 })
    }

    // Create new answer
    const newAnswer = {
      id: `answer-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      content,
      author,
      authorReputation: authorReputation || 0,
      upvotes: [],
      downvotes: [],
      comments: [],
      isAccepted: false,
      expertVerified: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    question.answers.push(newAnswer)
    await question.save()

    return NextResponse.json(question)
  } catch (error) {
    console.error('Error adding answer:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}