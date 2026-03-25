import React from "react";

export default function MobileCategorySkeleton() {
  return (
    <div className="flex flex-col items-center gap-2 md:gap-3">
      <div className="flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-2xl bg-slate-200 dark:bg-slate-700 animate-pulse" />
      <div className="h-3 w-12 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
    </div>
  );
}