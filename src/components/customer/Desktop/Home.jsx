import React from "react";
import { Link } from "react-router-dom";
import SiteFooter from "../../layout/SiteFooter";
import SiteHeader from "../../layout/SiteHeader";
import EmptyState from "../../ui/EmptyState";
import ProductGridSkeleton from "../../ui/ProductGridSkeleton";

function StarRating({ rating = 4 }) {
  return (
    <div className="mb-2 flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <i
          key={i}
          className={`text-[14px] text-yellow-400 ${
            i < rating ? "ri-star-fill" : "ri-star-line"
          }`}
        />
      ))}
    </div>
  );
}

export default function ShopPage({
  products = [],
  pagination,
  brands = [],
  categories = [],
  loading = false,
  error = "",

  search,
  setSearch,

  selectedCategory,
  setSelectedCategory,

  selectedBrand,
  setSelectedBrand,

  priceRange,
  setPriceRange,

  clearFilters,
  handleSortChange,
}) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[radial-gradient(circle_at_top,_#1e3a8a_0%,_#111827_35%,_#030712_100%)]">
      <SiteHeader />

      <div className="pb-20 pt-24">
        <div className="mx-auto max-w-[1600px] px-6">
          <div className="mb-8">
            <h1 className="mb-3 text-4xl font-bold text-gray-900 dark:text-gray-100">
              Shop All Products
            </h1>

            <p className="text-[15px] text-gray-600 dark:text-gray-400">
              Discover our complete collection of premium gadgets
            </p>
          </div>

          <div className="mb-8">
            <div className="relative max-w-2xl">
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-2xl border border-gray-200 bg-white px-6 py-4 pr-12 text-[15px] transition-all duration-300 focus:border-blue-600 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-blue-500"
              />

              <i className="ri-search-line absolute right-5 top-1/2 -translate-y-1/2 text-[20px] text-gray-400 dark:text-gray-500"></i>
            </div>
          </div>

          <div className="flex flex-col gap-8 lg:flex-row">
            <aside className="w-full flex-shrink-0 lg:w-80">
              <div className="sticky top-28 rounded-2xl border border-gray-100 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-[16px] font-bold text-gray-900 dark:text-gray-100">
                    Filters
                  </h2>

                  <button
                    onClick={clearFilters}
                    className="text-[13px] font-medium text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    Clear All
                  </button>
                </div>

                <div className="mb-6 border-b border-gray-100 pb-6 dark:border-gray-800">
                  <h3 className="mb-3 text-[14px] font-semibold text-gray-900 dark:text-gray-100">
                    Categories
                  </h3>

                  <div className="space-y-2">
                    {categories.map((category) => (
                      <label
                        key={category._id}
                        className="group flex cursor-pointer items-center gap-3"
                      >
                        <input
                          type="checkbox"
                          name="category"
                          checked={selectedCategory === category._id}
                          onChange={() => setSelectedCategory(category._id)}
                          className="h-4 w-4 cursor-pointer accent-blue-600 dark:accent-blue-500"
                        />

                        <span className="text-[14px] text-gray-700 transition-colors group-hover:text-blue-600 dark:text-gray-300 dark:group-hover:text-blue-400">
                          {category.name}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="mb-6 border-b border-gray-100 pb-6 dark:border-gray-800">
                  <h3 className="mb-3 text-[14px] font-semibold text-gray-900 dark:text-gray-100">
                    Brands
                  </h3>

                  <div className="space-y-2">
                    {brands.map((brand) => (
                      <label
                        key={brand._id}
                        className="group flex cursor-pointer items-center gap-3"
                      >
                        <input
                          type="checkbox"
                          name="brand"
                          checked={selectedBrand === brand._id}
                          onChange={() => setSelectedBrand(brand._id)}
                          className="h-4 w-4 cursor-pointer accent-blue-600 dark:accent-blue-500"
                        />

                        <span className="text-[14px] text-gray-700 transition-colors group-hover:text-blue-600 dark:text-gray-300 dark:group-hover:text-blue-400">
                          {brand.name}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 text-[14px] font-semibold text-gray-900 dark:text-gray-100">
                    Price Range
                  </h3>

                  <div className="space-y-3">
                    <input
                      type="range"
                      min="0"
                      max="200000"
                      value={priceRange}
                      onChange={(e) => setPriceRange(Number(e.target.value))}
                      className="w-full cursor-pointer accent-blue-600 dark:accent-blue-500"
                    />

                    <div className="flex items-center justify-between">
                      <span className="text-[14px] font-medium text-gray-700 dark:text-gray-300">
                        ₹0
                      </span>

                      <span className="text-[14px] font-medium text-gray-700 dark:text-gray-300">
                        ₹{priceRange}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            <div className="flex-1">
              <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-900 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-[14px] text-gray-600 dark:text-gray-400">
                  Showing <strong>{products.length}</strong> products
                </p>

                <div className="flex items-center gap-3">
                  <span className="text-[14px] text-gray-600 dark:text-gray-400">
                    Sort by:
                  </span>

                  <select
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="cursor-pointer rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-[14px] focus:border-blue-600 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-blue-500"
                  >
                    <option value="featured">Featured</option>
                    <option value="newest">Newest</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                  </select>
                </div>
              </div>

              {loading && products.length === 0 ? (
                <ProductGridSkeleton count={6} />
              ) : error ? (
                <div className="rounded-2xl border border-gray-100 bg-white p-10 text-center text-blue-600 dark:border-gray-800 dark:bg-gray-900 dark:text-blue-400">
                  {error}
                </div>
              ) : products.length === 0 ? (
                <div className="rounded-2xl border border-gray-100 bg-white p-10 dark:border-gray-800 dark:bg-gray-900">
                  <EmptyState
                    title="No products found"
                    message="Try changing your search, filters, or price range."
                  />
                </div>
              ) : (
                <div className="relative">
                  {loading && products.length > 0 && (
                    <div className="absolute inset-0 z-10 rounded-2xl bg-white/45 backdrop-blur-[1px] dark:bg-black/40" />
                  )}

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {products.map((product) => (
                      <Link
                        key={product._id}
                        to={`/product/${product._id}`}
                        className="group overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl dark:border-gray-800 dark:bg-gray-900 dark:hover:border-blue-500/40"
                      >
                        <div className="relative aspect-square overflow-hidden bg-gray-50 dark:bg-gray-800">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />

                          {product.compareAtPrice > product.price && (
                            <div className="absolute right-4 top-4 rounded-full bg-blue-600 px-3 py-1.5 text-[12px] font-bold text-white dark:bg-blue-500">
                              -
                              {Math.round(
                                ((product.compareAtPrice - product.price) /
                                  product.compareAtPrice) *
                                  100
                              )}
                              %
                            </div>
                          )}

                          {product.isFeatured && (
                            <div className="absolute left-4 top-4 rounded-full bg-emerald-500 px-3 py-1.5 text-[12px] font-bold text-white dark:bg-emerald-500">
                              NEW
                            </div>
                          )}
                        </div>

                        <div className="p-5">
                          <span className="mb-2 block text-[12px] font-medium text-blue-600 dark:text-blue-400">
                            {product.category}
                          </span>

                          <div className="mb-2 flex items-center gap-1">
                            <StarRating rating={4} />
                            <span className="ml-1 text-[13px] text-gray-500 dark:text-gray-400">
                              (120)
                            </span>
                          </div>

                          <h3 className="mb-2 line-clamp-2 text-[15px] font-semibold text-gray-900 dark:text-gray-100">
                            {product.name}
                          </h3>

                          <div className="mb-3 flex items-center gap-2">
                            <span className="text-[18px] font-bold text-gray-900 dark:text-gray-100">
                              ₹{product.price}
                            </span>

                            {product.compareAtPrice > 0 && (
                              <span className="text-[14px] text-gray-400 line-through dark:text-gray-500">
                                ₹{product.compareAtPrice}
                              </span>
                            )}
                          </div>

                          <button
                            type="button"
                            className="w-full rounded-xl bg-blue-600 py-2.5 text-[14px] font-medium text-white transition-all duration-300 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                          >
                            Add to Cart
                          </button>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}