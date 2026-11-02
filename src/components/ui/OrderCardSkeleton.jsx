import React from "react";

/** Mobile order card skeleton */
export function MobileOrderCardSkeleton() {
  return (
    <div className="mb-4 rounded-3xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-[#10141f] animate-pulse">
      {/* Top row */}
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="space-y-2">
          <div className="h-3 w-28 rounded bg-slate-200 dark:bg-slate-700" />
          <div className="h-3 w-40 rounded bg-slate-200 dark:bg-slate-700" />
        </div>
        <div className="h-6 w-20 rounded-full bg-slate-200 dark:bg-slate-700" />
      </div>

      {/* Product strip */}
      <div className="mb-4 flex gap-3">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="flex w-[200px] shrink-0 items-center gap-3 rounded-2xl border border-gray-100 bg-gray-50 p-3 dark:border-gray-800 dark:bg-[#121622]"
          >
            <div className="h-16 w-16 rounded-2xl bg-slate-200 dark:bg-slate-700" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-full rounded bg-slate-200 dark:bg-slate-700" />
              <div className="h-3 w-12 rounded bg-slate-200 dark:bg-slate-700" />
              <div className="h-3 w-16 rounded bg-slate-200 dark:bg-slate-700" />
            </div>
          </div>
        ))}
      </div>

      {/* Bottom */}
      <div className="flex items-center justify-between border-t border-gray-100 pt-3 dark:border-gray-800">
        <div className="space-y-1">
          <div className="h-3 w-20 rounded bg-slate-200 dark:bg-slate-700" />
          <div className="h-4 w-16 rounded bg-slate-200 dark:bg-slate-700" />
        </div>
        <div className="h-4 w-20 rounded bg-slate-200 dark:bg-slate-700" />
      </div>
    </div>
  );
}

/** Desktop order card skeleton */
export function DesktopOrderCardSkeleton() {
  return (
    <div className="block rounded-2xl border border-gray-100 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 animate-pulse">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <div className="h-5 w-28 rounded bg-slate-200 dark:bg-slate-700" />
          <div className="h-4 w-36 rounded bg-slate-200 dark:bg-slate-700" />
        </div>
        <div className="h-8 w-24 rounded-full bg-slate-200 dark:bg-slate-700" />
      </div>

      <div className="mb-6 space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="h-20 w-20 rounded-xl bg-slate-200 dark:bg-slate-700" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-48 rounded bg-slate-200 dark:bg-slate-700" />
              <div className="h-3 w-20 rounded bg-slate-200 dark:bg-slate-700" />
            </div>
            <div className="h-5 w-16 rounded bg-slate-200 dark:bg-slate-700" />
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-4 border-t border-gray-100 pt-6 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="h-3 w-24 rounded bg-slate-200 dark:bg-slate-700" />
          <div className="h-6 w-20 rounded bg-slate-200 dark:bg-slate-700" />
        </div>
        <div className="flex gap-3">
          <div className="h-10 w-28 rounded-xl bg-slate-200 dark:bg-slate-700" />
          <div className="h-10 w-32 rounded-xl bg-slate-200 dark:bg-slate-700" />
        </div>
      </div>
    </div>
  );
}
