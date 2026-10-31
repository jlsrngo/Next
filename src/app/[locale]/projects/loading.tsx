export default function Loading() {
  return (
    <div className="py-12 md:py-16 space-y-12">
      <div className="space-y-2 animate-pulse">
        <div className="h-8 w-48 bg-muted rounded-none" />
        <div className="h-4 w-64 bg-muted rounded" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-80 bg-muted rounded-none animate-pulse" />
        ))}
      </div>
    </div>
  )
}
