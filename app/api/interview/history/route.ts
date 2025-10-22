import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import { InterviewSession } from '@/lib/models/Interview'
import { verifyAuth } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    
    // Get user authentication (allow both authenticated and anonymous users)
    const user = await verifyAuth(request)
    const userId = user?.id

    // Get user's interview history
    let sessions = []
    if (userId) {
      sessions = await InterviewSession.find({
        userId: userId,
        status: 'completed'
      })
      .sort({ createdAt: -1 })
      .limit(20)
      .select('type startTime endTime totalDuration overallScore createdAt')
    }

    const history = sessions.map(session => ({
      sessionId: session._id,
      type: session.type,
      date: session.createdAt,
      duration: session.totalDuration,
      score: session.overallScore,
      startTime: session.startTime,
      endTime: session.endTime
    }))

    // Calculate statistics
    const stats = {
      totalInterviews: sessions.length,
      technicalInterviews: sessions.filter(s => s.type === 'technical').length,
      hrInterviews: sessions.filter(s => s.type === 'hr').length,
      averageScore: sessions.length > 0 
        ? Math.round(sessions.reduce((sum, s) => sum + (s.overallScore || 0), 0) / sessions.length)
        : 0,
      bestScore: sessions.length > 0 
        ? Math.max(...sessions.map(s => s.overallScore || 0))
        : 0,
      averageDuration: sessions.length > 0
        ? Math.round(sessions.reduce((sum, s) => sum + (s.totalDuration || 0), 0) / sessions.length)
        : 0
    }

    return NextResponse.json({
      history,
      stats
    })

  } catch (error) {
    console.error('Error fetching interview history:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}