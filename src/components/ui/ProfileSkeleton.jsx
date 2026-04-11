import React from "react";

/** Mobile profile page skeleton */
export function MobileProfileSkeleton() {
  return (
    <section className="pb-4 animate-pulse">
      {/* Header row */}
      <div className="mb-6 flex items-center justify-between">
        <div className="h-6 w-24 rounded bg-slate-200 dark:bg-slate-700" />
        <div className="h-5 w-5 rounded bg-slate-200 dark:bg-slate-700" />
      </div>

      {/* Avatar + name */}
      <div className="mb-6 flex flex-col items-center text-center">
        <div className="mb-4 h-24 w-24 rounded-full bg-slate-200 dark:bg-slate-700" />
        <div className="mb-2 h-7 w-36 rounded bg-slate-200 dark:bg-slate-700" />
        <div className="mb-3 h-4 w-44 rounded bg-slate-200 dark:bg-slate-700" />
        <div className="flex items-center gap-3">
          <div className="h-4 w-24 rounded bg-slate-200 dark:bg-slate-700" />
          <div className="h-4 w-20 rounded bg-slate-200 dark:bg-slate-700" />
        </div>
      </div>

      {/* Section — Recent Activity */}
      <div className="mb-6">
        <div className="mb-3 h-3 w-28 rounded bg-slate-200 dark:bg-slate-700" />
        <div className="overflow-hidden rounded-3xl bg-white shadow-sm dark:border dark:border-gray-800 dark:bg-gray-900">
          <div className="px-4 py-4">
            <div className="h-10 w-full rounded-xl bg-slate-200 dark:bg-slate-700" />
          </div>
          <div className="border-t border-gray-100 px-4 py-3 dark:border-gray-800">
            <div className="h-3 w-4/5 mx-auto rounded bg-slate-200 dark:bg-slate-700" />
          </div>
        </div>
      </div>

      {/* Section — Account & Security */}
      <div className="mb-6">
        <div className="mb-3 h-3 w-36 rounded bg-slate-200 dark:bg-slate-700" />
        <div className="overflow-hidden rounded-3xl bg-white shadow-sm dark:border dark:border-gray-800 dark:bg-gray-900">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i}>
              <div className="flex items-center gap-3 px-4 py-4">
                <div className="h-10 w-10 rounded-2xl bg-slate-200 dark:bg-slate-700" />
                <div className="flex-1 space-y-1">
                  <div className="h-4 w-32 rounded bg-slate-200 dark:bg-slate-700" />
                  <div className="h-3 w-48 rounded bg-slate-200 dark:bg-slate-700" />
                </div>
                <div className="h-4 w-4 rounded bg-slate-200 dark:bg-slate-700" />
              </div>
              {i < 6 && <div className="border-t border-gray-100 dark:border-gray-800" />}
            </div>
          ))}
        </div>
      </div>

      {/* Logout button skeleton */}
      <div className="mb-8">
        <div className="overflow-hidden rounded-3xl bg-white shadow-sm dark:border dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center gap-3 px-4 py-4">
            <div className="h-10 w-10 rounded-2xl bg-slate-200 dark:bg-slate-700" />
            <div className="h-4 w-16 rounded bg-slate-200 dark:bg-slate-700" />
          </div>
        </div>
      </div>
    </section>
  );
}

/** Desktop profile page skeleton */
export function DesktopProfileSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 animate-pulse">
      {/* Sidebar */}
      <div className="lg:col-span-1">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 h-32 w-32 rounded-full bg-slate-200 dark:bg-slate-700" />
            <div className="mx-auto mb-2 h-5 w-32 rounded bg-slate-200 dark:bg-slate-700" />
            <div className="mx-auto h-4 w-44 rounded bg-slate-200 dark:bg-slate-700" />
          </div>
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-11 rounded-xl bg-slate-200 dark:bg-slate-700" />
            ))}
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="space-y-8 lg:col-span-2">
        <div className="rounded-2xl border border-gray-100 bg-white p-8 dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-6 flex items-center justify-between">
            <div className="h-6 w-40 rounded bg-slate-200 dark:bg-slate-700" />
            <div className="h-10 w-28 rounded-xl bg-slate-200 dark:bg-slate-700" />
          </div>
          <div className="space-y-5">
            {[1, 2, 3].map((i) => (
              <div key={i}>
                <div className="mb-2 h-4 w-24 rounded bg-slate-200 dark:bg-slate-700" />
                <div className="h-12 w-full rounded-xl bg-slate-200 dark:bg-slate-700" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
