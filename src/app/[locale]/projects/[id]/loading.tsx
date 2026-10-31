export default function Loading() {
  return (
    <div className="py-12 md:py-16 space-y-6">
      <div className="h-4 w-32 bg-muted rounded animate-pulse" />
      <div className="max-w-3xl mx-auto space-y-6 animate-pulse">
        <div className="text-center space-y-3">
          <div className="h-6 w-24 mx-auto bg-muted rounded-none" />
          <div className="h-12 w-3/4 mx-auto bg-muted rounded-none" />
          <div className="h-6 w-2/3 mx-auto bg-muted rounded" />
        </div>
        <div className="aspect-video bg-muted rounded-none" />
        <div className="flex justify-center gap-2">
          <div className="h-8 w-20 bg-muted rounded-none" />
          <div className="h-8 w-20 bg-muted rounded-none" />
        </div>
      </div>
    </div>
  )
}
