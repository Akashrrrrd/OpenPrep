import { NextRequest, NextResponse } from 'next/server'
import { registerUser } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password, college, graduationYear } = body

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      )
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      )
    }

    // Register user
    const result = await registerUser({
      name: name.trim(),
      email: email.trim(),
      password,
      college: college?.trim(),
      graduationYear: graduationYear ? parseInt(graduationYear) : undefined
    })

    if (!result) {
      return NextResponse.json(
        { error: 'Failed to create account. Email might already be in use.' },
        { status: 400 }
      )
    }

    // Set HTTP-only cookie for token
    const response = NextResponse.json({
      success: true,
      user: result.user,
      message: 'Account created successfully!'
    }, { status: 201 })

    response.cookies.set('auth-token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    })

    return response
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}