import React from "react";
import { Search, Mic, ScanLine } from "lucide-react";

export default function MobileHeader({
  searchValue = "",
  onSearchChange = () => {},
}) {
  return (
    <div className="mb-3 rounded-3xl border border-gray-200 bg-white/95 p-3 shadow-sm backdrop-blur-sm transition-colors dark:border-gray-800 dark:bg-gray-900/95">
      <div className="flex items-center gap-3 rounded-full border border-gray-200 bg-gray-50 px-4 py-3 transition-colors dark:border-gray-700 dark:bg-gray-800/80">
        <Search
          size={18}
          className="text-gray-400 dark:text-gray-500"
        />

        <input
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          type="text"
          placeholder="Search for phones, gadgets..."
          className="flex-1 bg-transparent text-[14px] text-gray-900 outline-none placeholder:text-gray-400 dark:text-gray-100 dark:placeholder:text-gray-500"
        />

        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-full transition hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          <Mic
            size={18}
            className="text-gray-400 dark:text-gray-500"
          />
        </button>

        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-full transition hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          <ScanLine
            size={18}
            className="text-gray-400 dark:text-gray-500"
          />
        </button>
      </div>
    </div>
  );
}