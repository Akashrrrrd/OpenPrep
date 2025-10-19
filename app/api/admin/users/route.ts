import { NextRequest, NextResponse } from 'next/server'
import { getAllUsers, getUserStats } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')

    if (action === 'stats') {
      // Get user statistics
      const stats = await getUserStats()
      return NextResponse.json({
        success: true,
        stats
      })
    } else {
      // Get all users (excluding passwords)
      const users = await getAllUsers()
      return NextResponse.json({
        success: true,
        users: users.slice(0, 50), // Limit to first 50 users for performance
        total: users.length
      })
    }
  } catch (error) {
    console.error('Admin users API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user data' },
      { status: 500 }
    )
  }
}