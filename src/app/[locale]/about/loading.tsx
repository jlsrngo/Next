export default function Loading() {
  return (
    <div className="py-12 md:py-16 space-y-20">
      <section className="space-y-4 animate-pulse">
        <div className="h-8 w-48 bg-muted rounded-none" />
        <div className="space-y-2 pt-2">
          <div className="h-4 w-full bg-muted rounded" />
          <div className="h-4 w-5/6 bg-muted rounded" />
          <div className="h-4 w-3/4 bg-muted rounded" />
        </div>
        <div className="pt-4 space-y-1">
          <div className="h-4 w-32 bg-muted rounded" />
          <div className="h-10 w-24 bg-muted rounded-none" />
        </div>
      </section>
      <section className="space-y-4">
        <div className="h-6 w-40 bg-muted rounded animate-pulse" />
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 w-full bg-muted rounded-none animate-pulse" />
          ))}
        </div>
      </section>
      <section className="space-y-4">
        <div className="h-6 w-32 bg-muted rounded animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map(i => (
            <div key={i} className="h-28 bg-muted rounded-none animate-pulse" />
          ))}
        </div>
      </section>
    </div>
  )
}
