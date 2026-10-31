export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="h-7 w-56 bg-slate-100 rounded-none animate-pulse" />
        <div className="h-4 w-40 bg-slate-100 rounded animate-pulse" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-none border border-slate-200 bg-white p-5 animate-pulse">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-slate-100 rounded-none" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-16 bg-slate-100 rounded" />
                <div className="h-7 w-10 bg-slate-100 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
