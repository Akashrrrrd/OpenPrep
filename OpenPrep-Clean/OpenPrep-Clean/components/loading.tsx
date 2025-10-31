// Main loading component - uses the same design as app/loading.tsx
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
  "Preparing study plans..."
]

const tips = [
  "Practice coding problems daily for better placement results",
  "Research company culture before applying to roles",
  "Keep your resume updated with latest projects",
  "Network with alumni and industry professionals",
  "Start preparation at least 6 months before placements",
  "Focus on both technical and soft skills development"
]

export default function Loading() {
  const randomMessage = loadingMessages[Math.floor(Math.random() * loadingMessages.length)]
  const randomTip = tips[Math.floor(Math.random() * tips.length)]

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-slate-950">
      <div className="max-w-md w-full px-6 text-center">
        {/* Card Container */}
        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm p-8 space-y-6">
          {/* Logo and Brand */}
          <div className="flex flex-col items-center space-y-3">
            <div className="relative">
              <img 
                src="/logos/logo.png" 
                alt="OpenPrep Logo" 
                className="h-14 w-14 dark:invert"
              />
              <div className="absolute inset-0 rounded-full border border-slate-300 dark:border-slate-700 animate-ping"></div>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">OpenPrep</h1>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Your Gateway to Placement Success</p>
            </div>
          </div>

          {/* Loading Spinner */}
          <div className="flex flex-col items-center space-y-3">
            <div className="relative">
              <div className="animate-spin rounded-full h-10 w-10 border-2 border-slate-200 dark:border-slate-800 border-t-slate-900 dark:border-t-slate-100"></div>
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-300">{randomMessage}</p>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5">
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1 overflow-hidden">
              <div 
                className="bg-slate-900 dark:bg-slate-100 h-1 rounded-full animate-pulse" 
                style={{ width: '65%' }}
              ></div>
            </div>
          </div>

          {/* Tip */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-start gap-2 text-left">
              <svg 
                className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path 
                  fillRule="evenodd" 
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" 
                  clipRule="evenodd" 
                />
              </svg>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{randomTip}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Simplified loading overlay for components
export function LoadingOverlay({ 
  message = "Loading...", 
  isVisible = true 
}: { 
  message?: string
  isVisible?: boolean 
}) {
  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm">
      <Loading />
    </div>
  )
}

// Component loading for smaller areas
export function ComponentLoading({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="flex items-center gap-3">
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-slate-200 dark:border-slate-800 border-t-slate-900 dark:border-t-slate-100"></div>
        <span className="text-sm text-slate-700 dark:text-slate-300">{message}</span>
      </div>
    </div>
  )
}