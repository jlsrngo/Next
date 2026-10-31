export default function Loading() {
  return (
    <div className="py-12 md:py-16 space-y-6">
      <div className="h-4 w-32 bg-muted rounded animate-pulse" />
      <div className="max-w-3xl mx-auto space-y-4 animate-pulse text-center">
        <div className="h-6 w-28 mx-auto bg-muted rounded-none" />
        <div className="h-12 w-3/4 mx-auto bg-muted rounded-none" />
        <div className="h-5 w-48 mx-auto bg-muted rounded" />
        <div className="mt-8 space-y-3 text-left">
          <div className="h-5 w-full bg-muted rounded" />
          <div className="h-5 w-5/6 bg-muted rounded" />
          <div className="h-5 w-2/3 bg-muted rounded" />
        </div>
      </div>
    </div>
  )
}
