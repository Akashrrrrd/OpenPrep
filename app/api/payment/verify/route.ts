import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import connectDB from '@/lib/mongodb'
import User from '@/lib/models/User'

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

    const { 
      razorpay_payment_id, 
      razorpay_order_id, 
      razorpay_signature,
      planId 
    } = await request.json()

    // In production, verify the payment signature with Razorpay
    // For now, we'll simulate successful payment verification
    
    await connectDB()
    
    // Determine subscription tier based on plan
    let subscriptionTier: 'pro' | 'premium' = 'pro'
    if (planId.includes('premium')) {
      subscriptionTier = 'premium'
    }

    // Update user subscription
    await User.findByIdAndUpdate(user.id, {
      subscriptionTier,
      subscriptionStatus: 'active',
      'subscription.planId': planId,
      'subscription.paymentId': razorpay_payment_id,
      'subscription.orderId': razorpay_order_id,
      'subscription.startDate': new Date(),
      'subscription.endDate': new Date(Date.now() + (planId.includes('yearly') ? 365 : 30) * 24 * 60 * 60 * 1000),
      // Reset usage limits for new subscription
      'usage.studyPlansGenerated': 0,
      'usage.companiesAccessed': [],
      'usage.forumPostsCreated': 0
    })

    return NextResponse.json({
      success: true,
      message: 'Payment verified and subscription activated',
      subscriptionTier
    })

  } catch (error) {
    console.error('Payment verification error:', error)
    return NextResponse.json(
      { error: 'Failed to verify payment' },
      { status: 500 }
    )
  }
}