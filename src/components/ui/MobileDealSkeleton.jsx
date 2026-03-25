import React from "react";

export default function MobileDealSkeleton() {
  return (
    <div className="relative h-36 md:h-44 min-w-[235px] md:min-w-[320px] overflow-hidden rounded-2xl bg-white shadow-sm">
      <div className="h-full w-full animate-pulse bg-slate-200 dark:bg-slate-700" />

      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
        <div className="mb-2 h-5 w-20 animate-pulse rounded-full bg-slate-300/80 dark:bg-slate-600" />
        <div className="mb-2 h-5 w-32 animate-pulse rounded bg-slate-300/80 dark:bg-slate-600" />
        <div className="h-4 w-24 animate-pulse rounded bg-slate-300/70 dark:bg-slate-600" />
      </div>
    </div>
  );
}