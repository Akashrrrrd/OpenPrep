import { NextRequest, NextResponse } from 'next/server'
import { loginUser } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    console.log('🔐 Login API called')
    
    const body = await request.json()
    const { email, password } = body

    console.log('📧 Login attempt for email:', email)

    // Validation
    if (!email || !password) {
      console.log('❌ Missing email or password')
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Login user
    console.log('🔍 Attempting to authenticate user...')
    const result = await loginUser({
      email: email.trim(),
      password
    })

    if (!result) {
      console.log('❌ Authentication failed')
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    console.log('✅ User authenticated successfully:', result.user.name)

    // Set HTTP-only cookie for token
    const response = NextResponse.json({
      success: true,
      user: result.user,
      message: 'Logged in successfully!'
    })

    console.log('🍪 Setting auth cookie...')
    response.cookies.set('auth-token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
    })

    console.log('✅ Login complete, cookie set')
    return response
  } catch (error) {
    console.error('🚨 Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}