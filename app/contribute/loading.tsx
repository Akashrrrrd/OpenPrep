import { FormSkeleton } from '@/components/skeletons'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/skeletons'

export default function ContributeLoading() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10">
      <Card className="shadow-lg">
        <CardHeader className="text-center pb-6">
          <div className="flex justify-center mb-4">
            <Skeleton className="h-12 w-12" />
          </div>
          <Skeleton className="h-8 w-48 mx-auto mb-2" />
          <Skeleton className="h-4 w-64 mx-auto" />
        </CardHeader>
        <CardContent>
          <FormSkeleton />
        </CardContent>
      </Card>
    </div>
  )
}