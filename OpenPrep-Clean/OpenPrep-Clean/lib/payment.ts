// Payment integration for OpenPrep SaaS
export interface PaymentPlan {
  id: string
  name: string
  price: number
  currency: string
  interval: 'month' | 'year'
  features: string[]
}

export const PAYMENT_PLANS: PaymentPlan[] = [
  {
    id: 'pro_monthly',
    name: 'Pro Monthly',
    price: 299,
    currency: 'INR',
    interval: 'month',
    features: ['unlimited_study_plans', 'all_companies', 'full_forum', 'analytics']
  },
  {
    id: 'pro_yearly',
    name: 'Pro Yearly',
    price: 2999,
    currency: 'INR', 
    interval: 'year',
    features: ['unlimited_study_plans', 'all_companies', 'full_forum', 'analytics']
  },
  {
    id: 'premium_monthly',
    name: 'Premium Monthly',
    price: 599,
    currency: 'INR',
    interval: 'month',
    features: ['unlimited_study_plans', 'all_companies', 'full_forum', 'analytics', 'mentoring', 'ai_features']
  },
  {
    id: 'premium_yearly',
    name: 'Premium Yearly',
    price: 5999,
    currency: 'INR',
    interval: 'year',
    features: ['unlimited_study_plans', 'all_companies', 'full_forum', 'analytics', 'mentoring', 'ai_features']
  }
]

// Razorpay integration (Indian payment gateway)
export interface RazorpayOptions {
  key: string
  amount: number
  currency: string
  name: string
  description: string
  order_id: string
  handler: (response: any) => void
  prefill: {
    name: string
    email: string
  }
  theme: {
    color: string
  }
}

export function createRazorpayOrder(planId: string, userEmail: string, userName: string) {
  const plan = PAYMENT_PLANS.find(p => p.id === planId)
  if (!plan) throw new Error('Plan not found')

  return {
    amount: plan.price * 100, // Razorpay expects amount in paise
    currency: plan.currency,
    receipt: `receipt_${Date.now()}`,
    notes: {
      planId,
      userEmail,
      userName
    }
  }
}

export function initializeRazorpay(options: RazorpayOptions) {
  if (typeof window !== 'undefined' && (window as any).Razorpay) {
    const rzp = new (window as any).Razorpay(options)
    rzp.open()
  } else {
    console.error('Razorpay SDK not loaded')
  }
}