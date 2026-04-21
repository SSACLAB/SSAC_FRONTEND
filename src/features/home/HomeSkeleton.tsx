// Skeleton UI components for each home section.
// Used as Suspense fallbacks while Server Components fetch data.

function SkeletonBlock({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-lg bg-gray-200 ${className}`} />;
}

export function CarouselSkeleton() {
  return (
    <section className="mb-12">
      <SkeletonBlock className="h-10 w-48 mb-6" />
      <SkeletonBlock className="h-72 w-full rounded-xl" />
      <div className="mt-4 flex justify-center gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <SkeletonBlock key={i} className="h-2.5 w-2.5 rounded-full" />
        ))}
      </div>
    </section>
  );
}

export function QuizSkeleton() {
  return (
    <section className="mb-12">
      <SkeletonBlock className="h-10 w-36 mb-6" />
      <div className="grid gap-6 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-gray-100 bg-white p-6">
            <SkeletonBlock className="h-5 w-full mb-2" />
            <SkeletonBlock className="h-5 w-3/4 mb-6" />
            {Array.from({ length: 4 }).map((_, j) => (
              <SkeletonBlock key={j} className="h-10 w-full mb-2" />
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

export function ContentSkeleton() {
  return (
    <section className="mb-12">
      <SkeletonBlock className="h-10 w-40 mb-6" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-gray-100 bg-white p-6">
            <SkeletonBlock className="h-5 w-full mb-2" />
            <SkeletonBlock className="h-5 w-5/6 mb-4" />
            <SkeletonBlock className="h-4 w-full mb-1" />
            <SkeletonBlock className="h-4 w-full mb-1" />
            <SkeletonBlock className="h-4 w-2/3" />
          </div>
        ))}
      </div>
    </section>
  );
}

export function NewsSkeleton() {
  return (
    <section className="mb-12">
      <SkeletonBlock className="h-10 w-24 mb-6" />
      <div className="divide-y divide-gray-100 rounded-xl border border-gray-200 bg-white">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-start gap-4 p-5">
            <SkeletonBlock className="h-16 w-16 flex-shrink-0 rounded-lg" />
            <div className="flex-1">
              <SkeletonBlock className="h-5 w-3/4 mb-2" />
              <SkeletonBlock className="h-4 w-full mb-1" />
              <SkeletonBlock className="h-3 w-24 mt-2" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
