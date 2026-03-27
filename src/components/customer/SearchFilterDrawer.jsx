import React from "react";
import { X } from "lucide-react";

export default function SearchFilterDrawer({
  open,
  onClose,
  categories = [],
  brands = [],
  selectedCategory = "",
  setSelectedCategory = () => {},
  selectedBrand = "",
  setSelectedBrand = () => {},
  priceRange = 200000,
  setPriceRange = () => {},
  onClear = () => {},
}) {
  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/30 transition-opacity duration-300 ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <div
        className={`fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl bg-white shadow-2xl transition-transform duration-300 ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="flex items-center justify-between border-b px-4 py-4">
          <button onClick={onClose} className="rounded-full p-1 hover:bg-gray-100">
            <X size={20} />
          </button>

          <h3 className="text-sm font-semibold">Filters</h3>

          <button
            onClick={onClear}
            className="text-xs font-medium text-red-600"
          >
            Clear
          </button>
        </div>

        <div className="max-h-[72vh] overflow-y-auto px-4 py-4">
          <div className="mb-6">
            <h4 className="mb-3 text-sm font-semibold text-gray-900">Price</h4>
            <input
              type="range"
              min="500"
              max="200000"
              step="500"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full"
            />
            <p className="mt-2 text-xs text-gray-500">Up to ₹{priceRange}</p>
          </div>

          <div className="mb-6">
            <h4 className="mb-3 text-sm font-semibold text-gray-900">Category</h4>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory("")}
                className={`rounded-xl border px-3 py-2 text-xs ${
                  selectedCategory === ""
                    ? "border-gray-900 bg-gray-900 text-white"
                    : "border-gray-200 bg-white text-gray-700"
                }`}
              >
                All
              </button>

              {categories.map((item) => (
                <button
                  key={item._id}
                  onClick={() => setSelectedCategory(item._id)}
                  className={`rounded-xl border px-3 py-2 text-xs ${
                    selectedCategory === item._id
                      ? "border-gray-900 bg-gray-900 text-white"
                      : "border-gray-200 bg-white text-gray-700"
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h4 className="mb-3 text-sm font-semibold text-gray-900">Brand</h4>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedBrand("")}
                className={`rounded-xl border px-3 py-2 text-xs ${
                  selectedBrand === ""
                    ? "border-gray-900 bg-gray-900 text-white"
                    : "border-gray-200 bg-white text-gray-700"
                }`}
              >
                All
              </button>

              {brands.map((item) => (
                <button
                  key={item._id}
                  onClick={() => setSelectedBrand(item._id)}
                  className={`rounded-xl border px-3 py-2 text-xs ${
                    selectedBrand === item._id
                      ? "border-gray-900 bg-gray-900 text-white"
                      : "border-gray-200 bg-white text-gray-700"
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t px-4 py-4">
          <button
            onClick={onClose}
            className="w-full rounded-2xl bg-gray-900 py-3 text-sm font-semibold text-white"
          >
            Show Results
          </button>
        </div>
      </div>
    </>
  );
}