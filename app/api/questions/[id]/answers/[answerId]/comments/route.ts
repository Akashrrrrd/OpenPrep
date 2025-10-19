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
      return NextResponse.json({ error: 'Authentication required to comment' }, { status: 401 })
    }

    const user = await verifyToken(token)
    if (!user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    await connectDB()
    
    const { content, author, authorReputation } = await request.json()
    const { id: questionId, answerId } = params

    // Verify the author matches the authenticated user
    if (author !== user.name) {
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

    // Create new comment
    const newComment = {
      id: `comment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      content,
      author,
      authorReputation: authorReputation || 0,
      likes: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }

    answer.comments.push(newComment)
    await question.save()

    return NextResponse.json(question)
  } catch (error) {
    console.error('Error adding comment to answer:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}