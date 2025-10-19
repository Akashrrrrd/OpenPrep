import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { UsageTracker } from '@/lib/usage-tracker'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await verifyToken(token)
    if (!user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const stats = await UsageTracker.getUserUsageStats(user.id)

    return NextResponse.json({
      success: true,
      stats
    })

  } catch (error) {
    console.error('Usage stats error:', error)
    return NextResponse.json(
      { error: 'Failed to get usage stats' },
      { status: 500 }
    )
  }
}