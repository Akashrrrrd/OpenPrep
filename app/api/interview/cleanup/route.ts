import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import { InterviewSession } from '@/lib/models/Interview'
import { verifyAuth } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    // Allow both authenticated and anonymous users
    const user = await verifyAuth(request)
    const userId = user?.id || `anonymous-${Date.now()}`

    // Mark all active sessions as abandoned for this user
    const result = await InterviewSession.updateMany(
      {
        userId: userId,
        status: 'in-progress'
      },
      {
        status: 'abandoned',
        endTime: new Date()
      }
    )

    return NextResponse.json({ 
      success: true, 
      message: `Cleaned up ${result.modifiedCount} active sessions` 
    })

  } catch (error) {
    console.error('Error cleaning up sessions:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}