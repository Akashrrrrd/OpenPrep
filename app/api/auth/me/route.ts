import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, getUserById, updateUserProfile } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 /api/auth/me - Checking authentication...')
    
    // Get token from cookie
    const token = request.cookies.get('auth-token')?.value
    console.log('🍪 Token found:', !!token)

    if (!token) {
      console.log('❌ No auth token found in cookies')
      return NextResponse.json(
        { error: 'Not authenticated - no token' },
        { status: 401 }
      )
    }

    console.log('🔐 Verifying token...')
    // Verify token (this now includes database retry logic)
    const authUser = await verifyToken(token)
    if (!authUser) {
      console.log('❌ Token verification failed')
      // Clear invalid cookie
      const response = NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      )
      response.cookies.set('auth-token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 0 // Expire immediately
      })
      return response
    }

    console.log('✅ Token verified for user:', authUser.id)

    // Try to get full user data with retry logic
    let user = null
    let retries = 3
    
    while (retries > 0 && !user) {
      try {
        console.log(`📊 Fetching user data (attempt ${4 - retries}/3)...`)
        user = await getUserById(authUser.id)
        break
      } catch (dbError) {
        retries--
        console.warn(`Database query failed, retries left: ${retries}`, dbError)
        
        if (retries > 0) {
          await new Promise(resolve => setTimeout(resolve, 1000))
        }
      }
    }

    if (!user) {
      console.log('❌ Failed to fetch user data after retries')
      return NextResponse.json(
        { error: 'User data temporarily unavailable' },
        { status: 503 } // Service Unavailable
      )
    }

    console.log('✅ User data fetched successfully:', user.name)

    // Return user data (excluding password)
    const { password, ...userWithoutPassword } = user
    return NextResponse.json({
      success: true,
      user: userWithoutPassword
    })
  } catch (error) {
    console.error('🚨 Auth verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    // Get token from cookie
    const token = request.cookies.get('auth-token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Verify token
    const authUser = await verifyToken(token)
    if (!authUser) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    // Get request body
    const body = await request.json()
    const { name, profile, preferences } = body

    // Update user profile
    const updatedUser = await updateUserProfile(authUser.id, {
      name,
      profile,
      preferences
    })

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'Failed to update profile' },
        { status: 400 }
      )
    }

    // Return updated user data (excluding password)
    const { password, ...userWithoutPassword } = updatedUser
    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
      message: 'Profile updated successfully'
    })
  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}