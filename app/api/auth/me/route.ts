import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, getUserById, updateUserProfile } from '@/lib/auth'

export async function GET(request: NextRequest) {
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

    // Get full user data
    const user = await getUserById(authUser.id)
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Return user data (excluding password)
    const { password, ...userWithoutPassword } = user
    return NextResponse.json({
      success: true,
      user: userWithoutPassword
    })
  } catch (error) {
    console.error('Auth verification error:', error)
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