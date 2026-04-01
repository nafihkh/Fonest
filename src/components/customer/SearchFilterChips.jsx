import React from "react";
import { SlidersHorizontal } from "lucide-react";

export default function SearchFilterChips({
  activeCount = 0,
  onOpenFilters = () => {},
  onQuickFilter = () => {},
}) {
  const chips = [
    { key: "all", label: "All" },
    { key: "discounts", label: "Discounts" },
    { key: "today-deals", label: "Today's Deals" },
    { key: "mobiles", label: "Mobiles" },
    { key: "accessories", label: "Accessories" },
  ];

  return (
    <div className="mb-3 overflow-x-auto no-scrollbar">
      <div className="flex gap-2">
        {/* Filters Button */}
        <button
          onClick={onOpenFilters}
          className="flex shrink-0 items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-[12px] font-medium text-gray-800 shadow-sm transition
          dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
        >
          <SlidersHorizontal size={14} />
          <span>Filters</span>

          {activeCount > 0 ? (
            <span className="rounded-full bg-gray-900 px-2 py-[2px] text-[10px] text-white
            dark:bg-blue-500 dark:text-white">
              {activeCount}
            </span>
          ) : null}
        </button>

        {/* Chips */}
        {chips.map((chip) => (
          <button
            key={chip.key}
            onClick={() => onQuickFilter(chip.key)}
            className="shrink-0 rounded-xl border border-gray-200 bg-white px-3 py-2 text-[12px] font-medium text-gray-800 shadow-sm transition
            hover:bg-gray-100
            dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:hover:bg-gray-800"
          >
            {chip.label}
          </button>
        ))}
      </div>
    </div>
  );
}