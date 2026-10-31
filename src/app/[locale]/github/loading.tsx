export default function Loading() {
  return (
    <div className="py-12 md:py-20 space-y-6">
      <div className="space-y-2 animate-pulse">
        <div className="h-8 w-48 bg-muted rounded-none" />
        <div className="h-4 w-64 bg-muted rounded" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-24 bg-muted rounded-none animate-pulse" />
        ))}
      </div>
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-16 bg-muted rounded-none animate-pulse" />
        ))}
      </div>
    </div>
  )
}
