import { CompanyCardSkeleton, ExperienceCardSkeleton } from '@/components/skeletons'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/skeletons'

export default function CompanyLoading() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 space-y-8">
      {/* Company Header Skeleton */}
      <Card>
        <CardHeader className="text-center pb-6">
          <div className="flex justify-center mb-4">
            <Skeleton className="h-16 w-16 rounded-full" />
          </div>
          <Skeleton className="h-8 w-48 mx-auto mb-2" />
          <Skeleton className="h-4 w-64 mx-auto" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center space-y-2">
              <Skeleton className="h-8 w-12 mx-auto" />
              <Skeleton className="h-4 w-16 mx-auto" />
            </div>
            <div className="text-center space-y-2">
              <Skeleton className="h-8 w-16 mx-auto" />
              <Skeleton className="h-4 w-20 mx-auto" />
            </div>
            <div className="text-center space-y-2">
              <Skeleton className="h-8 w-14 mx-auto" />
              <Skeleton className="h-4 w-18 mx-auto" />
            </div>
            <div className="text-center space-y-2">
              <Skeleton className="h-8 w-10 mx-auto" />
              <Skeleton className="h-4 w-12 mx-auto" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs Skeleton */}
      <div className="space-y-6">
        <div className="flex space-x-1 bg-muted p-1 rounded-lg">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-28" />
          <Skeleton className="h-8 w-20" />
        </div>

        {/* Content Skeleton */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
          
          <div className="space-y-4">
            <ExperienceCardSkeleton />
            <ExperienceCardSkeleton />
            <ExperienceCardSkeleton />
          </div>
        </div>
      </div>
    </div>
  )
}