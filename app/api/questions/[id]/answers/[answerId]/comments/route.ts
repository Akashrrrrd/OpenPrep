import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Question from '@/lib/models/Question'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string; answerId: string } }
) {
  try {
    await connectDB()
    
    const { content, author, authorReputation } = await request.json()
    const { id: questionId, answerId } = params

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