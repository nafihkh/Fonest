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
        <button
          onClick={onOpenFilters}
          className="flex shrink-0 items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-[12px] font-medium shadow-sm"
        >
          <SlidersHorizontal size={14} />
          <span>Filters</span>
          {activeCount > 0 ? (
            <span className="rounded-full bg-gray-900 px-2 py-[2px] text-[10px] text-white">
              {activeCount}
            </span>
          ) : null}
        </button>

        {chips.map((chip) => (
          <button
            key={chip.key}
            onClick={() => onQuickFilter(chip.key)}
            className="shrink-0 rounded-xl border border-gray-200 bg-white px-3 py-2 text-[12px] font-medium shadow-sm"
          >
            {chip.label}
          </button>
        ))}
      </div>
    </div>
  );
}