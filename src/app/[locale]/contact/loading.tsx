export default function Loading() {
  return (
    <div className="py-12 md:py-16 space-y-6">
      <div className="space-y-2 animate-pulse">
        <div className="h-8 w-48 bg-muted rounded-none" />
        <div className="h-4 w-64 bg-muted rounded" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="h-28 bg-muted rounded-none animate-pulse" />
        ))}
      </div>
    </div>
  )
}
