import { FormSkeleton } from '@/components/skeletons'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/skeletons'

export default function StudyPlannerLoading() {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-10">
      <Card>
        <CardHeader className="text-center">
          <Skeleton className="h-8 w-64 mx-auto mb-2" />
          <Skeleton className="h-4 w-80 mx-auto" />
        </CardHeader>
        <CardContent>
          <FormSkeleton />
        </CardContent>
      </Card>
    </div>
  )
}