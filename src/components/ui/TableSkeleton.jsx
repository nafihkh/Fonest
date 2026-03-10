export function TableSkeleton({ rows = 6, columns = 5 }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/70 dark:border-slate-700">
      <div className="grid grid-cols-12 bg-slate-50 dark:bg-slate-800 px-5 py-3">
        {Array.from({ length: columns }).map((_, i) => (
          <div
            key={i}
            className="h-4 rounded bg-slate-200 dark:bg-slate-700 animate-pulse"
            style={{ width: `${60 + i * 10}px` }}
          />
        ))}
      </div>

      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div
          key={rowIdx}
          className="grid grid-cols-12 px-5 py-4 border-t border-slate-200/70 dark:border-slate-700 items-center"
        >
          <div className="col-span-5 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
            <div className="space-y-2">
              <div className="w-32 h-3 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
              <div className="w-44 h-3 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
            </div>
          </div>

          <div className="col-span-3">
            <div className="w-24 h-8 rounded-xl bg-slate-200 dark:bg-slate-700 animate-pulse" />
          </div>

          <div className="col-span-2">
            <div className="w-20 h-6 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
          </div>

          <div className="col-span-1">
            <div className="w-20 h-3 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
          </div>

          <div className="col-span-1 flex justify-end">
            <div className="w-9 h-9 rounded-xl bg-slate-200 dark:bg-slate-700 animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}