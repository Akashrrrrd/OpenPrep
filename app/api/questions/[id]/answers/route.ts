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