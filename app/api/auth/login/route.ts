import { NextRequest, NextResponse } from 'next/server'
import { loginUser } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Login user
    const result = await loginUser({
      email: email.trim(),
      password
    })

    if (!result) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Set HTTP-only cookie for token
    const response = NextResponse.json({
      success: true,
      user: result.user,
      message: 'Logged in successfully!'
    })

    response.cookies.set('auth-token', result.token, {
      httpOnly: true,
      secure: false, // Set to false for localhost
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}