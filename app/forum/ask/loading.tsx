import { FormSkeleton } from '@/components/skeletons'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/skeletons'

export default function AskQuestionLoading() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10">
      <Card className="shadow-lg">
        <CardHeader className="text-center pb-6">
          <div className="flex justify-center mb-4">
            <Skeleton className="h-12 w-12" />
          </div>
          <Skeleton className="h-8 w-48 mx-auto mb-2" />
          <Skeleton className="h-4 w-80 mx-auto" />
        </CardHeader>
        
        <CardContent>
          <div className="space-y-6">
            {/* Author Name */}
            <div className="space-y-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-11 w-full" />
            </div>

            {/* Question Title */}
            <div className="space-y-3">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-11 w-full" />
            </div>

            {/* Question Content */}
            <div className="space-y-3">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-32 w-full" />
            </div>

            {/* Difficulty Level */}
            <div className="space-y-3">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-11 w-full" />
            </div>

            {/* Tags */}
            <div className="space-y-3">
              <Skeleton className="h-4 w-36" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <div className="flex flex-wrap gap-2">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-12" />
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-14" />
                  <Skeleton className="h-6 w-18" />
                  <Skeleton className="h-6 w-22" />
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-24" />
                </div>
              </div>
              <div className="flex gap-2">
                <Skeleton className="flex-1 h-10" />
                <Skeleton className="h-10 w-16" />
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