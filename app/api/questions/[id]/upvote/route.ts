import { NextRequest, NextResponse } from 'next/server'
import { upvoteQuestion } from '@/lib/forum'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const success = await upvoteQuestion(params.id)
    
    if (!success) {
      return NextResponse.json(
        { error: 'Question not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: 'Question upvoted successfully' })
  } catch (error) {
    console.error('Error upvoting question:', error)
    return NextResponse.json(
      { error: 'Failed to upvote question' },
      { status: 500 }
    )
  }
}