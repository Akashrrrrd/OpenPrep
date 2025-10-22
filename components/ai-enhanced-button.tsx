"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Sparkles, Loader2 } from 'lucide-react'
import { ChromeAIService } from '@/lib/chrome-ai'

interface AIEnhancedButtonProps {
  children: React.ReactNode
  onAIResult?: (result: string) => void
  aiAction: 'improve' | 'summarize' | 'proofread' | 'generate'
  content?: string
  context?: string
  className?: string
  variant?: 'default' | 'outline' | 'secondary' | 'ghost'
  size?: 'default' | 'sm' | 'lg'
}

export function AIEnhancedButton({
  children,
  onAIResult,
  aiAction,
  content = '',
  context = '',
  className = '',
  variant = 'outline',
  size = 'sm'
}: AIEnhancedButtonProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [isAIAvailable, setIsAIAvailable] = useState(true)

  const handleAIAction = async () => {
    if (!content.trim()) return

    setIsProcessing(true)
    
    try {
      let result: string | null = null

      switch (aiAction) {
        case 'improve':
          result = await ChromeAIService.improveWriting(content, context as any)
          break
        case 'summarize':
          result = await ChromeAIService.summarizeContent(content)
          break
        case 'proofread':
          result = await ChromeAIService.proofreadContent(content)
          break
        case 'generate':
          // This would need specific implementation based on context
          result = await ChromeAIService.generateInterviewQuestions('technical')
          result = result ? result.join('\n') : null
          break
      }

      if (result && onAIResult) {
        onAIResult(result)
      } else if (!result) {
        setIsAIAvailable(false)
      }
    } catch (error) {
      console.error('AI action failed:', error)
      setIsAIAvailable(false)
    } finally {
      setIsProcessing(false)
    }
  }

  if (!isAIAvailable) {
    return null // Hide button if AI is not available
  }

  return (
    <Button
      onClick={handleAIAction}
      disabled={isProcessing || !content.trim()}
      variant={variant}
      size="sm"
      className={`${className} relative h-8 px-3 text-xs`}
    >
      {isProcessing ? (
        <Loader2 className="h-3 w-3 animate-spin mr-1" />
      ) : (
        <Sparkles className="h-3 w-3 mr-1 text-purple-500" />
      )}
      <span className="truncate">{children}</span>
      <Badge variant="secondary" className="ml-1 text-[10px] px-1 py-0 h-4 bg-purple-100 text-purple-700">
        AI
      </Badge>
    </Button>
  )
}