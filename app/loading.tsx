import { PageLoading } from '@/components/loading'

const loadingMessages = [
  "Preparing your content...",
  "Loading placement resources...",
  "Fetching the latest opportunities...",
  "Organizing study materials...",
  "Connecting to the community...",
  "Setting up your dashboard...",
  "Syncing with database...",
  "Loading interview experiences...",
  "Fetching company data...",
  "Preparing study plans...",
  "Connecting to server...",
  "Establishing secure connection...",
  "Loading from cache..."
]

const tips = [
  "💡 Tip: Practice coding problems daily for better placement results",
  "🎯 Tip: Research company culture before applying",
  "📚 Tip: Keep your resume updated with latest projects",
  "🤝 Tip: Network with alumni and industry professionals",
  "⏰ Tip: Start preparation at least 6 months before placements",
  "🔍 Tip: Focus on both technical and soft skills",
  "📊 Tip: Track your progress with study plans",
  "🗣️ Tip: Practice mock interviews regularly",
  "📝 Tip: Keep notes of important concepts",
  "🎓 Tip: Learn from others' interview experiences",
  "⚡ Tip: Slow connection? We're optimizing your experience",
  "🔄 Tip: Having network issues? We'll keep trying for you"
]

export default function Loading() {
  const randomMessage = loadingMessages[Math.floor(Math.random() * loadingMessages.length)]
  const randomTip = tips[Math.floor(Math.random() * tips.length)]
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="max-w-md w-full px-6 text-center space-y-8">
        {/* Logo and Brand */}
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

        {/* Loading Animation */}
        <div className="space-y-6">
          <div className="flex justify-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary/20 border-t-primary"></div>
              <div className="absolute inset-2 animate-pulse rounded-full bg-primary/10"></div>
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="text-base font-medium">{randomMessage}</p>
            <div className="flex justify-center">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Random Tip */}
        <div className="p-4 bg-muted/50 rounded-lg border border-dashed">
          <p className="text-sm text-muted-foreground">{randomTip}</p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="w-full bg-muted rounded-full h-2">
            <div className="bg-primary h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
          </div>
          <p className="text-xs text-muted-foreground">Almost ready...</p>
        </div>
      </div>
    </div>
  )
}