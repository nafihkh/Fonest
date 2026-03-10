export function StatCardSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-700 rounded-2xl p-5 shadow-sm animate-pulse">
      <div className="flex items-start justify-between">
        <div className="w-10 h-10 rounded-2xl bg-slate-200 dark:bg-slate-700" />
        <div className="w-14 h-6 rounded-full bg-slate-200 dark:bg-slate-700" />
      </div>

      <div className="mt-4">
        <div className="w-24 h-3 rounded bg-slate-200 dark:bg-slate-700" />
        <div className="mt-3 w-20 h-7 rounded bg-slate-200 dark:bg-slate-700" />
      </div>
    </div>
  );
}