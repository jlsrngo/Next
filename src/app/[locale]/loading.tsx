export default function Loading() {
  return (
    <div className="py-12 md:py-20 space-y-16">
      <div className="space-y-4 animate-pulse">
        <div className="h-10 w-64 bg-muted rounded-none" />
        <div className="h-4 w-48 bg-muted rounded" />
        <div className="space-y-2 pt-2">
          <div className="h-4 w-full bg-muted rounded" />
          <div className="h-4 w-5/6 bg-muted rounded" />
          <div className="h-4 w-3/4 bg-muted rounded" />
        </div>
      </div>
      <div className="border-t border-muted pt-8 space-y-8">
        <div className="space-y-2">
          <div className="h-6 w-32 bg-muted rounded" />
          <div className="h-3 w-48 bg-muted rounded" />
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-x-4 gap-y-6">
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 bg-muted rounded-none" />
              <div className="h-2 w-8 bg-muted rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
