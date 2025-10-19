"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check, Crown, Star, Zap, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

export default function PricingPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  const handleUpgrade = async (planId: string) => {
    if (!user) {
      router.push('/auth/login')
      return
    }

    setLoading(planId)
    
    try {
      // Create payment order
      const response = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId })
      })

      if (!response.ok) {
        throw new Error('Failed to create payment order')
      }

      const { order, plan, user: userData } = await response.json()

      // Initialize Razorpay payment
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_key',
        amount: order.amount,
        currency: order.currency,
        name: 'OpenPrep',
        description: `${plan.name} Subscription`,
        order_id: order.id,
        handler: async (response: any) => {
          try {
            // Verify payment
            const verifyResponse = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                planId
              })
            })

            if (verifyResponse.ok) {
              alert('Payment successful! Your subscription has been activated.')
              window.location.reload()
            } else {
              throw new Error('Payment verification failed')
            }
          } catch (error) {
            console.error('Payment verification error:', error)
            alert('Payment verification failed. Please contact support.')
          }
        },
        prefill: {
          name: userData.name,
          email: userData.email
        },
        theme: {
          color: '#3B82F6'
        }
      }

      // Load Razorpay script and open payment modal
      if (typeof window !== 'undefined') {
        const script = document.createElement('script')
        script.src = 'https://checkout.razorpay.com/v1/checkout.js'
        script.onload = () => {
          const rzp = new (window as any).Razorpay(options)
          rzp.open()
        }
        document.body.appendChild(script)
      }

    } catch (error) {
      console.error('Payment error:', error)
      alert('Failed to initiate payment. Please try again.')
    } finally {
      setLoading(null)
    }
  }

  const plans = [
    {
      name: 'Free',
      price: '₹0',
      period: 'forever',
      description: 'Perfect for getting started with placement preparation',
      features: [
        '1 study plan per month',
        'Access to 5 companies per month',
        'Basic forum access (read-only)',
        'Limited interview experiences',
        'Community support'
      ],
      limitations: [
        'Limited study plan generation',
        'Restricted company access',
        'No priority support',
        'Basic features only'
      ],
      buttonText: 'Current Plan',
      buttonVariant: 'outline' as const,
      popular: false,
      icon: <Star className="h-5 w-5" />
    },
    {
      name: 'Pro',
      price: '₹299',
      period: 'month',
      description: 'Ideal for serious placement preparation',
      features: [
        'Unlimited study plans',
        'Access to all 32+ companies',
        'Full forum participation',
        'All interview experiences',
        'Priority email support',
        'Advanced analytics dashboard',
        'Personalized recommendations',
        'Study progress tracking'
      ],
      limitations: [],
      buttonText: 'Upgrade to Pro',
      buttonVariant: 'default' as const,
      popular: true,
      icon: <Zap className="h-5 w-5" />
    },
    {
      name: 'Premium',
      price: '₹599',
      period: 'month',
      description: 'Complete placement preparation solution',
      features: [
        'Everything in Pro',
        '1-on-1 mentoring sessions (2/month)',
        'Custom company preparation plans',
        'AI-powered interview simulation',
        'Resume review & optimization',
        'Job referral network access',
        'Priority chat support',
        'Exclusive webinars & workshops',
        'Career guidance sessions'
      ],
      limitations: [],
      buttonText: 'Go Premium',
      buttonVariant: 'default' as const,
      popular: false,
      icon: <Crown className="h-5 w-5" />
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Unlock your potential with our comprehensive placement preparation platform. 
            Start free and upgrade as you grow.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {plans.map((plan, index) => (
            <Card 
              key={plan.name} 
              className={`relative ${
                plan.popular 
                  ? 'border-2 border-blue-500 shadow-xl scale-105' 
                  : 'border shadow-lg'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-500 text-white px-4 py-1">
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-8">
                <div className="flex items-center justify-center mb-4">
                  <div className={`p-3 rounded-full ${
                    plan.name === 'Premium' 
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                      : plan.name === 'Pro'
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {plan.icon}
                  </div>
                </div>
                
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300 mt-2">
                  {plan.description}
                </CardDescription>
                
                <div className="mt-6">
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                      {plan.price}
                    </span>
                    <span className="text-gray-600 dark:text-gray-300 ml-2">
                      /{plan.period}
                    </span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Features */}
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">What's included:</h4>
                  <ul className="space-y-2">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-600 dark:text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Button */}
                <div className="pt-4">
                  {user?.subscriptionTier === plan.name.toLowerCase() ? (
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      disabled
                    >
                      Current Plan
                    </Button>
                  ) : plan.name === 'Free' ? (
                    <Button 
                      variant="outline"
                      className="w-full"
                      asChild
                    >
                      <Link href={user ? '/dashboard' : '/auth/register'}>
                        {user ? 'Current Plan' : 'Get Started Free'}
                      </Link>
                    </Button>
                  ) : (
                    <Button 
                      variant={plan.buttonVariant}
                      className={`w-full ${
                        plan.name === 'Premium'
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
                          : plan.name === 'Pro'
                          ? 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600'
                          : ''
                      }`}
                      onClick={() => handleUpgrade(`${plan.name.toLowerCase()}_monthly`)}
                      disabled={loading === `${plan.name.toLowerCase()}_monthly`}
                    >
                      {loading === `${plan.name.toLowerCase()}_monthly` ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        plan.buttonText
                      )}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-100 mb-12">
            Frequently Asked Questions
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Can I change plans anytime?
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Is there a free trial?
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Our Free plan gives you access to core features. You can upgrade anytime to unlock premium features.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                We accept all major credit cards, debit cards, UPI, and net banking through secure payment gateways.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Do you offer student discounts?
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Yes! We offer special pricing for students. Contact our support team with your student ID for details.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Ready to ace your placements?
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Join thousands of students who have successfully prepared with OpenPrep
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/auth/register">Start Free Today</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/contact">Contact Sales</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}