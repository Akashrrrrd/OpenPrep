"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Crown, Lock, Zap, ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface UpgradePromptProps {
  feature: string
  currentLimit: number
  usedCount: number
  variant?: 'card' | 'banner' | 'modal'
  className?: string
}

export function UpgradePrompt({ 
  feature, 
  currentLimit, 
  usedCount, 
  variant = 'card',
  className = '' 
}: UpgradePromptProps) {
  // HACKATHON MODE: Hide upgrade prompts
  return null
  const features = {
    'study_plan': {
      title: 'Study Plan Generation',
      icon: <Zap className="h-5 w-5" />,
      proLimit: '∞',
      benefits: ['Unlimited study plans', 'Advanced customization', 'Progress tracking']
    },
    'company_access': {
      title: 'Company Resources',
      icon: <Lock className="h-5 w-5" />,
      proLimit: '∞',
      benefits: ['Access all 32+ companies', 'Latest materials', 'Premium resources']
    },
    'forum_post': {
      title: 'Forum Participation',
      icon: <Crown className="h-5 w-5" />,
      proLimit: '∞',
      benefits: ['Unlimited posts', 'Priority support', 'Expert answers']
    }
  }

  const featureInfo = features[feature as keyof typeof features] || {
    title: 'Premium Feature',
    icon: <Crown className="h-5 w-5" />,
    proLimit: '∞',
    benefits: ['Unlimited access', 'Premium features', 'Priority support']
  }

  if (variant === 'banner') {
    return (
      <div className={`bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {featureInfo.icon}
            <div>
              <h3 className="font-semibold text-sm">Upgrade to Continue</h3>
              <p className="text-xs text-muted-foreground">
                You've used {usedCount} of {currentLimit} {featureInfo.title.toLowerCase()} this month
              </p>
            </div>
          </div>
          <Link href="/pricing">
            <Button size="sm">
              <Crown className="h-3 w-3 mr-1" />
              Upgrade
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <Card className={`border-2 border-dashed border-primary/30 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20 ${className}`}>
      <CardHeader className="text-center pb-4">
        <div className="mx-auto mb-3 p-3 bg-primary/10 rounded-full w-fit">
          {featureInfo.icon}
        </div>
        <CardTitle className="text-lg">
          {featureInfo.title} Limit Reached
        </CardTitle>
        <div className="flex items-center justify-center gap-2 mt-2">
          <Badge variant="secondary" className="text-xs">
            {usedCount} / {currentLimit} used
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground text-center">
          Upgrade to Pro for unlimited access and premium features
        </p>
        
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Pro Plan Includes:</h4>
          <ul className="space-y-1">
            {featureInfo.benefits.map((benefit, index) => (
              <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="h-1.5 w-1.5 bg-primary rounded-full" />
                {benefit}
              </li>
            ))}
          </ul>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="text-lg font-bold text-muted-foreground">{currentLimit}</div>
            <div className="text-xs text-muted-foreground">Free Plan</div>
          </div>
          <div className="text-center p-3 bg-primary/10 rounded-lg">
            <div className="text-lg font-bold text-primary">{featureInfo.proLimit}</div>
            <div className="text-xs text-primary">Pro Plan</div>
          </div>
        </div>

        <Link href="/pricing" className="w-full">
          <Button className="w-full" size="lg">
            <Crown className="h-4 w-4 mr-2" />
            Upgrade to Pro
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </Link>

        <p className="text-xs text-center text-muted-foreground">
          Starting at ₹299/month • Cancel anytime
        </p>
      </CardContent>
    </Card>
  )
}