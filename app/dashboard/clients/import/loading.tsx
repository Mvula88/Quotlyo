import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ImportClientsLoading() {
  return (
    <div className="flex w-full flex-col">
      <main className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Skeleton className="h-10 w-[200px]" />
          <Skeleton className="h-10 w-[150px]" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-6 w-[200px]" />
            </CardTitle>
            <CardDescription>
              <Skeleton className="h-4 w-[300px]" />
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <Skeleton className="h-10 w-[150px]" />
                <Skeleton className="h-10 w-[180px]" />
              </div>

              <div className="space-y-4">
                <div className="rounded-md border">
                  <div className="p-4">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <Skeleton className="h-5 w-[100px]" />
                        <Skeleton className="h-5 w-[100px]" />
                        <Skeleton className="h-5 w-[100px]" />
                        <Skeleton className="h-5 w-[100px]" />
                        <Skeleton className="h-5 w-[100px]" />
                        <Skeleton className="h-5 w-[100px]" />
                      </div>

                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex justify-between">
                          <Skeleton className="h-4 w-[80px]" />
                          <Skeleton className="h-4 w-[120px]" />
                          <Skeleton className="h-4 w-[100px]" />
                          <Skeleton className="h-4 w-[150px]" />
                          <Skeleton className="h-4 w-[80px]" />
                          <Skeleton className="h-4 w-[60px]" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <Skeleton className="h-5 w-[200px]" />
                  <Skeleton className="h-10 w-[150px]" />
                </div>
              </div>
            </div>

            <div className="rounded-md border p-4">
              <Skeleton className="h-5 w-[200px] mb-2" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
