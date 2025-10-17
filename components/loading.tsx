import { BookOpen, Target, Users, Lightbulb } from "lucide-react"

interface LoadingProps {
  message?: string
  showLogo?: boolean
  variant?: 'default' | 'minimal' | 'detailed'
}

export default function Loading({ 
  message = "Loading...", 
  showLogo = true, 
  variant = 'default' 
}: LoadingProps) {
  if (variant === 'minimal') {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent"></div>
          <span className="text-sm text-muted-foreground">{message}</span>
        </div>
      </div>
    )
  }

  if (variant === 'detailed') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <div className="max-w-md w-full px-6 text-center space-y-8">
          {/* Logo and Brand */}
          {showLogo && (
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <img 
                  src="/logos/logo.png" 
                  alt="OpenPrep Logo" 
                  className="h-16 w-16 dark:invert animate-pulse"
                />
                <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-ping"></div>
              </div>
              <div className="space-y-2">
                <h1 className="text-2xl font-bold tracking-tight">OpenPrep</h1>
                <p className="text-sm text-muted-foreground">
                  Your Gateway to Placement Success
                </p>
              </div>
            </div>
          )}

          {/* Loading Animation */}
          <div className="space-y-6">
            <div className="flex justify-center">
              <div className="relative">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary/20 border-t-primary"></div>
                <div className="absolute inset-2 animate-pulse rounded-full bg-primary/10"></div>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-base font-medium">{message}</p>
              <div className="flex justify-center">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature Icons */}
          <div className="grid grid-cols-4 gap-4 pt-4">
            <div className="flex flex-col items-center space-y-2 opacity-60">
              <BookOpen className="h-6 w-6 text-primary animate-pulse" />
              <span className="text-xs text-muted-foreground">Study</span>
            </div>
            <div className="flex flex-col items-center space-y-2 opacity-60">
              <Target className="h-6 w-6 text-primary animate-pulse [animation-delay:0.2s]" />
              <span className="text-xs text-muted-foreground">Plan</span>
            </div>
            <div className="flex flex-col items-center space-y-2 opacity-60">
              <Users className="h-6 w-6 text-primary animate-pulse [animation-delay:0.4s]" />
              <span className="text-xs text-muted-foreground">Community</span>
            </div>
            <div className="flex flex-col items-center space-y-2 opacity-60">
              <Lightbulb className="h-6 w-6 text-primary animate-pulse [animation-delay:0.6s]" />
              <span className="text-xs text-muted-foreground">Tips</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Default variant
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6">
      {/* Logo */}
      {showLogo && (
        <div className="flex items-center gap-3">
          <img 
            src="/logos/logo.png" 
            alt="OpenPrep Logo" 
            className="h-10 w-10 dark:invert animate-pulse"
          />
          <span className="text-xl font-bold">OpenPrep</span>
        </div>
      )}

      {/* Loading Spinner */}
      <div className="relative">
        <div className="animate-spin rounded-full h-10 w-10 border-3 border-primary/20 border-t-primary"></div>
        <div className="absolute inset-2 animate-pulse rounded-full bg-primary/10"></div>
      </div>

      {/* Loading Message */}
      <div className="text-center space-y-2">
        <p className="text-sm font-medium text-foreground">{message}</p>
        <div className="flex justify-center">
          <div className="flex space-x-1">
            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Specialized loading components for different use cases
export function PageLoading({ message = "Loading page..." }: { message?: string }) {
  return <Loading variant="detailed" message={message} />
}

export function ComponentLoading({ message = "Loading..." }: { message?: string }) {
  return <Loading variant="default" message={message} showLogo={false} />
}

export function InlineLoading({ message = "Loading..." }: { message?: string }) {
  return <Loading variant="minimal" message={message} showLogo={false} />
}

// Full page loading overlay
export function LoadingOverlay({ 
  message = "Loading...", 
  isVisible = true 
}: { 
  message?: string
  isVisible?: boolean 
}) {
  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
      <Loading variant="detailed" message={message} />
    </div>
  )
}