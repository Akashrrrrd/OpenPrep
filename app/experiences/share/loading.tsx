import { FormSkeleton } from '@/components/skeletons'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/skeletons'

export default function ShareExperienceLoading() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10">
      <Card className="shadow-lg">
        <CardHeader className="text-center pb-6">
          <div className="flex justify-center mb-4">
            <Skeleton className="h-12 w-12" />
          </div>
          <Skeleton className="h-8 w-64 mx-auto mb-2" />
          <Skeleton className="h-4 w-96 mx-auto" />
        </CardHeader>
        
        <CardContent>
          <div className="space-y-6">
            {/* Company Selection */}
            <div className="space-y-3">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-11 w-full" />
            </div>

            {/* Role and Date */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-3">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-11 w-full" />
              </div>
              <div className="space-y-3">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-11 w-full" />
              </div>
            </div>

            {/* Interview Rounds */}
            <div className="space-y-3">
              <Skeleton className="h-4 w-36" />
              
              {/* Add Round Form */}
              <Card className="p-4 border-dashed">
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </Card>
            </div>

            {/* Overall Difficulty and Outcome */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-3">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-11 w-full" />
              </div>
              <div className="space-y-3">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-11 w-full" />
              </div>
            </div>

            {/* Tips Section */}
            <div className="space-y-3">
              <Skeleton className="h-4 w-40" />
              <div className="flex gap-2">
                <Skeleton className="flex-1 h-16" />
                <Skeleton className="h-16 w-12" />
              </div>
            </div>

            {/* Options */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-48" />
              </div>
            </div>

            {/* Submit Button */}
            <Skeleton className="h-12 w-full" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}