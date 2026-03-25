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
    <div className="min-h-screen bg-gray-50">
      <SiteHeader />

      <div className="pt-24 pb-20">
        <div className="mx-auto max-w-[1600px] px-6">
          <div className="mb-8">
            <h1 className="mb-3 text-4xl font-bold text-gray-900">
              Shop All Products
            </h1>
            <p className="text-[15px] text-gray-600">
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
                className="w-full rounded-2xl border border-gray-200 bg-white px-6 py-4 pr-12 text-[15px] transition-all duration-300 focus:border-red-600 focus:outline-none"
              />
              <i className="ri-search-line absolute right-5 top-1/2 -translate-y-1/2 text-[20px] text-gray-400"></i>
            </div>
          </div>

          <div className="flex flex-col gap-8 lg:flex-row">
            <aside className="w-full flex-shrink-0 lg:w-80">
              <div className="sticky top-28 rounded-2xl border border-gray-100 bg-white p-6">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-[16px] font-bold text-gray-900">Filters</h2>
                  <button
                    onClick={clearFilters}
                    className="text-[13px] font-medium text-red-600 hover:text-red-700"
                  >
                    Clear All
                  </button>
                </div>

                <div className="mb-6 border-b border-gray-100 pb-6">
                  <h3 className="mb-3 text-[14px] font-semibold text-gray-900">
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
                          className="h-4 w-4"
                        />
                        <span className="text-[14px] text-gray-700 transition-colors group-hover:text-red-600">
                          {category.name}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="mb-6 border-b border-gray-100 pb-6">
                  <h3 className="mb-3 text-[14px] font-semibold text-gray-900">
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
                          className="h-4 w-4"
                        />
                        <span className="text-[14px] text-gray-700 transition-colors group-hover:text-red-600">
                          {brand.name}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 text-[14px] font-semibold text-gray-900">
                    Price Range
                  </h3>
                  <div className="space-y-3">
                    <input
                      type="range"
                      min="0"
                      max="200000"
                      value={priceRange}
                      onChange={(e) => setPriceRange(Number(e.target.value))}
                      className="w-full cursor-pointer accent-red-600"
                    />
                    <div className="flex items-center justify-between">
                      <span className="text-[14px] font-medium text-gray-700">₹0</span>
                      <span className="text-[14px] font-medium text-gray-700">
                        ₹{priceRange}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            <div className="flex-1">
              <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-[14px] text-gray-600">
                  Showing <strong>{products.length}</strong> products
                </p>

                <div className="flex items-center gap-3">
                  <span className="text-[14px] text-gray-600">Sort by:</span>
                  <select
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="cursor-pointer rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-[14px] focus:border-red-600 focus:outline-none"
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
                <div className="rounded-2xl border border-gray-100 bg-white p-10 text-center text-red-600">
                  {error}
                </div>
              ) : products.length === 0 ? (
                <div className="rounded-2xl border border-gray-100 bg-white p-10">
                  <EmptyState
                    title="No products found"
                    message="Try changing your search, filters, or price range."
                  />
                </div>
              ) : (
                <div className="relative">
                  {loading && products.length > 0 && (
                    <div className="absolute inset-0 z-10 rounded-2xl bg-white/45 backdrop-blur-[1px]" />
                  )}

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {products.map((product) => (
                      <Link
                        key={product._id}
                        to={`/product/${product._id}`}
                        className="group overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
                      >
                        <div className="relative aspect-square overflow-hidden bg-gray-50">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />

                          {product.compareAtPrice > product.price && (
                            <div className="absolute right-4 top-4 rounded-full bg-red-600 px-3 py-1.5 text-[12px] font-bold text-white">
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
                            <div className="absolute left-4 top-4 rounded-full bg-green-500 px-3 py-1.5 text-[12px] font-bold text-white">
                              NEW
                            </div>
                          )}
                        </div>

                        <div className="p-5">
                          <span className="mb-2 block text-[12px] font-medium text-red-600">
                            {product.category}
                          </span>

                          <div className="mb-2 flex items-center gap-1">
                            <StarRating rating={4} />
                            <span className="ml-1 text-[13px] text-gray-500">
                              (120)
                            </span>
                          </div>

                          <h3 className="mb-2 line-clamp-2 text-[15px] font-semibold text-gray-900">
                            {product.name}
                          </h3>

                          <div className="mb-3 flex items-center gap-2">
                            <span className="text-[18px] font-bold text-gray-900">
                              ₹{product.price}
                            </span>

                            {product.compareAtPrice > 0 && (
                              <span className="text-[14px] text-gray-400 line-through">
                                ₹{product.compareAtPrice}
                              </span>
                            )}
                          </div>

                          <button
                            type="button"
                            className="w-full rounded-xl bg-red-600 py-2.5 text-[14px] font-medium text-white transition-all duration-300 hover:bg-red-700"
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