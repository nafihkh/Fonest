import React from "react";

function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
      <div className="aspect-square animate-pulse bg-gray-200" />

      <div className="p-3">
        <div className="mb-2 h-4 w-3/4 animate-pulse rounded bg-gray-200" />
        <div className="mb-2 h-3 w-1/2 animate-pulse rounded bg-gray-200" />
        <div className="mb-3 h-3 w-1/3 animate-pulse rounded bg-gray-200" />

        <div className="mb-3 flex items-center gap-2">
          <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />
          <div className="h-3 w-12 animate-pulse rounded bg-gray-200" />
        </div>

        <div className="h-10 w-full animate-pulse rounded-xl bg-gray-200" />
      </div>
    </div>
  );
}

export default function SearchResultsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {Array.from({ length: 8 }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}