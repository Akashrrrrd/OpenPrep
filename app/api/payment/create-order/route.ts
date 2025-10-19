import { NextRequest, NextResponse } from 'next/server'
import { createRazorpayOrder, PAYMENT_PLANS } from '@/lib/payment'
import { verifyToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await verifyToken(token)
    if (!user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const { planId } = await request.json()
    
    const plan = PAYMENT_PLANS.find(p => p.id === planId)
    if (!plan) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 })
    }

    // Create Razorpay order
    const orderData = createRazorpayOrder(planId, user.email, user.name)
    
    // In production, you would call Razorpay API here
    // For now, we'll simulate the order creation
    const order = {
      id: `order_${Date.now()}`,
      ...orderData,
      status: 'created'
    }

    return NextResponse.json({
      success: true,
      order,
      plan,
      user: {
        name: user.name,
        email: user.email
      }
    })

  } catch (error) {
    console.error('Payment order creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create payment order' },
      { status: 500 }
    )
  }
}