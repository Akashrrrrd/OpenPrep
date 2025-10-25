"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

// HACKATHON MODE: Redirect pricing page to dashboard
// Original pricing code is preserved in git history
export default function PricingPage() {
  const router = useRouter()
  
  useEffect(() => {
    router.push('/dashboard')
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Redirecting...</h1>
        <p className="text-gray-600">Taking you to the dashboard</p>
      </div>
    </div>
  )
}