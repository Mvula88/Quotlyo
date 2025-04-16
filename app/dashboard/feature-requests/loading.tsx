import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export default function FeatureRequestsLoading() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex-1 p-3 md:p-6 lg:p-8 pt-4">
        <div className="flex flex-col space-y-2">
          <div className="flex justify-between items-center">
            <div>
              <Skeleton className="h-8 w-64 mb-2" />
              <Skeleton className="h-4 w-96" />
            </div>
            <Skeleton className="h-10 w-32" />
          </div>
        </div>

        <div className="mt-6">
          <Skeleton className="h-10 w-96 mb-6" />

          <div className="space-y-4">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex">
                      <div className="flex flex-col items-center justify-start p-4 border-r bg-muted/30 w-[80px]">
                        <Skeleton className="h-16 w-12" />
                      </div>
                      <div className="flex-1 p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <Skeleton className="h-6 w-64 mb-2" />
                            <div className="flex items-center gap-2 mt-1">
                              <Skeleton className="h-5 w-24" />
                              <Skeleton className="h-5 w-32" />
                            </div>
                          </div>
                          <Skeleton className="h-4 w-32" />
                        </div>
                        <Skeleton className="h-4 w-full mt-4" />
                        <Skeleton className="h-4 w-3/4 mt-2" />
                        <div className="mt-4 flex items-center">
                          <Skeleton className="h-8 w-32" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      </main>
    </div>
  )
}
