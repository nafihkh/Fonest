import React from "react";
import { Search, Mic, ScanLine, MapPin } from "lucide-react";

export default function MobileHeader() {
  return (
    <div className="px-4 pt-4">
      {/* Search */}
      <div className="mb-4 rounded-2xl bg-white p-3 shadow-sm">
        <div className="flex items-center gap-3 rounded-full border border-gray-200 bg-gray-50 px-4 py-3">
          <Search size={18} className="text-gray-400" />

          <input
            type="text"
            placeholder="Search for phones, gadgets..."
            className="flex-1 bg-transparent text-[14px] outline-none placeholder:text-gray-400"
          />

          <Mic size={18} className="text-gray-400" />
          <ScanLine size={18} className="text-gray-400" />
        </div>
      </div>
    </div>
  );
}