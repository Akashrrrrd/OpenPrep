import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Question from '@/lib/models/Question'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    
    const { content, author, authorReputation } = await request.json()
    const questionId = params.id

    const question = await Question.findOne({ id: questionId })
    if (!question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 })
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

    question.comments.push(newComment)
    await question.save()

    return NextResponse.json(question)
  } catch (error) {
    console.error('Error adding comment:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}