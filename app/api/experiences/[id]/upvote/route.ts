import { NextRequest, NextResponse } from 'next/server'
import { upvoteExperience } from '@/lib/experiences'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const success = await upvoteExperience(params.id)
    
    if (!success) {
      return NextResponse.json(
        { error: 'Experience not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: 'Experience upvoted successfully' })
  } catch (error) {
    console.error('Error upvoting experience:', error)
    return NextResponse.json(
      { error: 'Failed to upvote experience' },
      { status: 500 }
    )
  }
}