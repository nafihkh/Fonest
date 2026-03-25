import React from "react";

export function ProductCardSkeleton() {
  return (
    <div className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="aspect-square animate-pulse bg-slate-200 dark:bg-slate-700" />

      <div className="p-5">
        <div className="mb-2 h-3 w-20 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
        <div className="mb-2 h-4 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
        <div className="mb-4 h-4 w-2/3 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
        <div className="mb-4 h-5 w-24 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
        <div className="h-10 w-full animate-pulse rounded-xl bg-slate-200 dark:bg-slate-700" />
      </div>
    </div>
  );
}