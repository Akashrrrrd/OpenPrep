import { QuestionListSkeleton } from '@/components/skeletons'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/skeletons'

export default function ForumLoading() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 space-y-8">
      {/* Header Skeleton */}
      <div className="text-center space-y-4">
        <Skeleton className="h-8 w-48 mx-auto" />
        <Skeleton className="h-4 w-96 mx-auto" />
      </div>

      {/* Search and Filters Skeleton */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Skeleton className="flex-1 h-10" />
            <Skeleton className="h-10 w-32" />
          </div>

          {/* Popular Tags Skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-14" />
              <Skeleton className="h-6 w-18" />
              <Skeleton className="h-6 w-22" />
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-18" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Questions Tabs Skeleton */}
      <div className="space-y-6">
        <div className="grid w-full grid-cols-3 bg-muted p-1 rounded-lg">
          <Skeleton className="h-8" />
          <Skeleton className="h-8" />
          <Skeleton className="h-8" />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
          
          <QuestionListSkeleton count={6} />
        </div>
      </div>
    </div>
  )
}