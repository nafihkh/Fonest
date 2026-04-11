import React from "react";

/** Mobile product detail skeleton */
export function MobileProductDetailSkeleton() {
  return (
    <div className="pb-6 animate-pulse">
      {/* Brand + rating row */}
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="h-3 w-24 rounded bg-slate-200 dark:bg-slate-700" />
        <div className="flex flex-col items-end gap-1">
          <div className="h-3 w-20 rounded bg-slate-200 dark:bg-slate-700" />
          <div className="h-3 w-16 rounded bg-slate-200 dark:bg-slate-700" />
        </div>
      </div>

      {/* Product title */}
      <div className="mb-3 space-y-2">
        <div className="h-5 w-3/4 rounded bg-slate-200 dark:bg-slate-700" />
        <div className="h-5 w-1/2 rounded bg-slate-200 dark:bg-slate-700" />
      </div>

      {/* Image */}
      <div className="mb-4 h-[300px] w-full rounded-xl bg-slate-200 dark:bg-slate-700" />

      {/* Description */}
      <div className="mb-5 space-y-2">
        <div className="h-4 w-28 rounded bg-slate-200 dark:bg-slate-700" />
        <div className="h-3 w-full rounded bg-slate-200 dark:bg-slate-700" />
        <div className="h-3 w-5/6 rounded bg-slate-200 dark:bg-slate-700" />
        <div className="h-3 w-4/6 rounded bg-slate-200 dark:bg-slate-700" />
      </div>

      {/* Colors */}
      <div className="mb-5">
        <div className="mb-3 h-4 w-20 rounded bg-slate-200 dark:bg-slate-700" />
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl border border-gray-100 p-2 dark:border-gray-800">
              <div className="mx-auto mb-2 h-20 w-20 rounded-xl bg-slate-200 dark:bg-slate-700" />
              <div className="mx-auto h-3 w-12 rounded bg-slate-200 dark:bg-slate-700" />
            </div>
          ))}
        </div>
      </div>

      {/* Price */}
      <div className="mb-5">
        <div className="h-8 w-28 rounded bg-slate-200 dark:bg-slate-700" />
        <div className="mt-2 h-3 w-16 rounded bg-slate-200 dark:bg-slate-700" />
        <div className="mt-3 h-7 w-20 rounded-full bg-slate-200 dark:bg-slate-700" />
      </div>

      {/* Buttons */}
      <div className="mb-6 grid grid-cols-2 gap-3">
        <div className="h-12 rounded-2xl bg-slate-200 dark:bg-slate-700" />
        <div className="h-12 rounded-2xl bg-slate-200 dark:bg-slate-700" />
      </div>
    </div>
  );
}

/** Desktop product detail skeleton */
export function DesktopProductDetailSkeleton() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-8">
        <div className="h-3 w-12 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
        <div className="h-3 w-3 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
        <div className="h-3 w-12 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
        <div className="h-3 w-3 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
        <div className="h-3 w-32 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20 animate-pulse">
        {/* Left: image */}
        <div>
          <div className="aspect-square rounded-3xl bg-slate-200 dark:bg-slate-700 mb-4" />
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="aspect-square rounded-2xl bg-slate-200 dark:bg-slate-700" />
            ))}
          </div>
        </div>

        {/* Right: details */}
        <div>
          <div className="mb-3 h-6 w-24 rounded-full bg-slate-200 dark:bg-slate-700" />
          <div className="mb-4 h-10 w-3/4 rounded bg-slate-200 dark:bg-slate-700" />
          <div className="mb-6 flex items-center gap-3">
            <div className="h-4 w-24 rounded bg-slate-200 dark:bg-slate-700" />
            <div className="h-4 w-8 rounded bg-slate-200 dark:bg-slate-700" />
          </div>
          <div className="mb-6 flex items-baseline gap-4">
            <div className="h-12 w-28 rounded bg-slate-200 dark:bg-slate-700" />
            <div className="h-8 w-20 rounded bg-slate-200 dark:bg-slate-700" />
            <div className="h-8 w-16 rounded-full bg-slate-200 dark:bg-slate-700" />
          </div>
          <div className="mb-8 space-y-2">
            <div className="h-3 w-full rounded bg-slate-200 dark:bg-slate-700" />
            <div className="h-3 w-5/6 rounded bg-slate-200 dark:bg-slate-700" />
            <div className="h-3 w-4/6 rounded bg-slate-200 dark:bg-slate-700" />
          </div>
          <div className="mb-8">
            <div className="mb-3 h-4 w-16 rounded bg-slate-200 dark:bg-slate-700" />
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-slate-200 dark:bg-slate-700" />
              <div className="h-12 w-20 rounded-xl bg-slate-200 dark:bg-slate-700" />
              <div className="h-12 w-12 rounded-xl bg-slate-200 dark:bg-slate-700" />
            </div>
          </div>
          <div className="flex gap-4 mb-8">
            <div className="flex-1 h-14 rounded-2xl bg-slate-200 dark:bg-slate-700" />
            <div className="flex-1 h-14 rounded-2xl bg-slate-200 dark:bg-slate-700" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-16 rounded-xl bg-slate-200 dark:bg-slate-700" />
            <div className="h-16 rounded-xl bg-slate-200 dark:bg-slate-700" />
          </div>
        </div>
      </div>
    </div>
  );
}
