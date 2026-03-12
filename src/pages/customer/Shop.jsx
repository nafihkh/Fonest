import React, { useState } from "react";
import { Link } from "react-router-dom";
import SiteFooter from "../../components/layout/SiteFooter";
import SiteHeader from "../../components/layout/SiteHeader"

const categories = [
  { name: "Watches", count: 45 },
  { name: "Smart Watch", count: 32 },
  { name: "Airpods", count: 28 },
  { name: "Headphone", count: 41 },
  { name: "Charger", count: 67 },
  { name: "Data Cable", count: 53 },
  { name: "Neckband", count: 19 },
  { name: "Used Phones", count: 89 },
  { name: "Bluetooth Speaker", count: 24 },
];

const brands = [
  "Apple",
  "Samsung",
  "Sony",
  "JBL",
  "Bose",
  "Anker",
  "Belkin",
  "Garmin",
  "OnePlus",
  "Xiaomi",
];

const products = [
  {
    id: 1,
    name: "Apple Watch Series 9",
    category: "Smart Watch",
    rating: 4,
    reviews: 1247,
    price: 399,
    oldPrice: 499,
    discount: "-20%",
    badge: "NEW",
    image:
      "https://readdy.ai/api/search-image?query=premium%20luxury%20apple%20watch%20series%209%20smartwatch%20with%20sleek%20black%20band%20on%20pure%20white%20minimalist%20background%20product%20photography%20studio%20lighting%20ultra%20realistic%20high%20resolution%20close%20up%20detailed%20view&width=800&height=800&seq=prod1&orientation=squarish",
  },
  {
    id: 2,
    name: "AirPods Pro 2nd Gen",
    category: "Airpods",
    rating: 4,
    reviews: 2156,
    price: 249,
    oldPrice: 299,
    discount: "-17%",
    badge: "NEW",
    image:
      "https://readdy.ai/api/search-image?query=apple%20airpods%20pro%20second%20generation%20white%20wireless%20earbuds%20with%20charging%20case%20on%20clean%20white%20background%20premium%20product%20photography%20studio%20lighting%20ultra%20realistic%20high%20detail%20close%20up%20shot&width=800&height=800&seq=prod2&orientation=squarish",
  },
  {
    id: 3,
    name: "iPhone 15 Pro Max",
    category: "Used Phones",
    rating: 4,
    reviews: 3421,
    price: 1199,
    oldPrice: 1399,
    discount: "-14%",
    badge: "",
    image:
      "https://readdy.ai/api/search-image?query=flagship%20apple%20iphone%2015%20pro%20max%20titanium%20smartphone%20with%20triple%20camera%20system%20on%20pristine%20white%20background%20premium%20product%20photography%20studio%20lighting%20ultra%20realistic%20high%20resolution%20detailed%20close%20up%20view&width=800&height=800&seq=prod3&orientation=squarish",
  },
  {
    id: 5,
    name: "Samsung Galaxy Watch 6",
    category: "Smart Watch",
    rating: 4,
    reviews: 654,
    price: 299,
    oldPrice: 349,
    discount: "-14%",
    badge: "",
    image:
      "https://readdy.ai/api/search-image?query=samsung%20galaxy%20smartwatch%20with%20circular%20display%20black%20band%20on%20white%20background%20premium%20product%20photography%20studio%20lighting%20ultra%20realistic&width=800&height=800&seq=prod5&orientation=squarish",
  },
  {
    id: 10,
    name: "Bose QuietComfort 45",
    category: "Headphone",
    rating: 4,
    reviews: 756,
    price: 279,
    oldPrice: 329,
    discount: "-15%",
    badge: "",
    image:
      "https://readdy.ai/api/search-image?query=bose%20premium%20noise%20cancelling%20headphones%20black%20elegant%20design%20on%20white%20background%20product%20photography%20studio%20lighting%20ultra%20realistic&width=800&height=800&seq=prod10&orientation=squarish",
  },
  {
    id: 4,
    name: "Sony WH-1000XM5",
    category: "Headphone",
    rating: 4,
    reviews: 892,
    price: 349,
    oldPrice: 399,
    discount: "-13%",
    badge: "NEW",
    image:
      "https://readdy.ai/api/search-image?query=sony%20premium%20noise%20cancelling%20over%20ear%20headphones%20black%20sleek%20design%20on%20white%20background%20product%20photography%20studio%20lighting%20ultra%20realistic%20high%20detail&width=800&height=800&seq=prod4&orientation=squarish",
  },
  {
    id: 6,
    name: "Anker PowerCore 20K",
    category: "Charger",
    rating: 4,
    reviews: 1823,
    price: 49,
    oldPrice: 69,
    discount: "-29%",
    badge: "",
    image:
      "https://readdy.ai/api/search-image?query=anker%20portable%20power%20bank%20charger%20black%20sleek%20design%20on%20white%20background%20product%20photography%20studio%20lighting%20ultra%20realistic%20high%20detail&width=800&height=800&seq=prod6&orientation=squarish",
  },
  {
    id: 7,
    name: "USB-C Braided Cable",
    category: "Data Cable",
    rating: 4,
    reviews: 567,
    price: 19,
    oldPrice: 29,
    discount: "-34%",
    badge: "",
    image:
      "https://readdy.ai/api/search-image?query=premium%20braided%20usb%20c%20charging%20cable%20black%20on%20white%20background%20product%20photography%20studio%20lighting%20ultra%20realistic%20high%20detail&width=800&height=800&seq=prod7&orientation=squarish",
  },
  {
    id: 8,
    name: "JBL Tune 760NC",
    category: "Neckband",
    rating: 4,
    reviews: 423,
    price: 129,
    oldPrice: 179,
    discount: "-28%",
    badge: "",
    image:
      "https://readdy.ai/api/search-image?query=jbl%20wireless%20neckband%20headphones%20black%20sleek%20design%20on%20white%20background%20product%20photography%20studio%20lighting%20ultra%20realistic&width=800&height=800&seq=prod8&orientation=squarish",
  },
  {
    id: 9,
    name: "JBL Flip 6",
    category: "Bluetooth Speaker",
    rating: 4,
    reviews: 1092,
    price: 129,
    oldPrice: 149,
    discount: "-13%",
    badge: "NEW",
    image:
      "https://readdy.ai/api/search-image?query=jbl%20portable%20bluetooth%20speaker%20cylindrical%20design%20black%20on%20white%20background%20product%20photography%20studio%20lighting%20ultra%20realistic%20high%20detail&width=800&height=800&seq=prod9&orientation=squarish",
  },
  {
    id: 11,
    name: "Samsung Galaxy Buds 2 Pro",
    category: "Airpods",
    rating: 4,
    reviews: 834,
    price: 199,
    oldPrice: 229,
    discount: "-13%",
    badge: "NEW",
    image:
      "https://readdy.ai/api/search-image?query=samsung%20galaxy%20wireless%20earbuds%20with%20charging%20case%20black%20on%20white%20background%20premium%20product%20photography%20studio%20lighting%20ultra%20realistic&width=800&height=800&seq=prod11&orientation=squarish",
  },
  {
    id: 12,
    name: "Garmin Venu 3",
    category: "Watches",
    rating: 4,
    reviews: 512,
    price: 449,
    oldPrice: 499,
    discount: "-10%",
    badge: "NEW",
    image:
      "https://readdy.ai/api/search-image?query=garmin%20fitness%20smartwatch%20with%20amoled%20display%20black%20band%20on%20white%20background%20product%20photography%20studio%20lighting%20ultra%20realistic&width=800&height=800&seq=prod12&orientation=squarish",
  },
];

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-1 mb-2">
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

export default function ShopPage() {
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState(2000);
  const [sortBy, setSortBy] = useState("featured");

  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((item) => item !== category)
        : [...prev, category]
    );
  };

  const toggleBrand = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand)
        ? prev.filter((item) => item !== brand)
        : [...prev, brand]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setPriceRange(2000);
    setSearch("");
    setSortBy("featured");
  };

  const filteredProducts = products
    .filter((product) =>
      product.name.toLowerCase().includes(search.toLowerCase())
    )
    .filter((product) =>
      selectedCategories.length
        ? selectedCategories.includes(product.category)
        : true
    )
    .filter((product) => product.price <= priceRange)
    .sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "rating") return b.reviews - a.reviews;
      if (sortBy === "newest") return b.id - a.id;
      return 0;
    });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <SiteHeader />

      {/* Main */}
      <div className="pt-24 pb-20">
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              Shop All Products
            </h1>
            <p className="text-[15px] text-gray-600">
              Discover our complete collection of premium gadgets
            </p>
          </div>

          {/* Search */}
          <div className="mb-8">
            <div className="relative max-w-2xl">
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-6 py-4 pr-12 bg-white rounded-2xl border border-gray-200 focus:border-red-600 focus:outline-none text-[15px] transition-all duration-300"
              />
              <i className="ri-search-line text-[20px] text-gray-400 absolute right-5 top-1/2 -translate-y-1/2"></i>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <aside className="w-full lg:w-80 flex-shrink-0">
              <div className="bg-white rounded-2xl p-6 border border-gray-100 sticky top-28">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-[16px] font-bold text-gray-900">Filters</h2>
                  <button
                    onClick={clearFilters}
                    className="text-[13px] text-red-600 hover:text-red-700 font-medium"
                  >
                    Clear All
                  </button>
                </div>

                {/* Categories */}
                <div className="mb-6 pb-6 border-b border-gray-100">
                  <h3 className="text-[14px] font-semibold text-gray-900 mb-3">
                    Categories
                  </h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <label
                        key={category.name}
                        className="flex items-center gap-3 cursor-pointer group"
                      >
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category.name)}
                          onChange={() => toggleCategory(category.name)}
                          className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500 cursor-pointer"
                        />
                        <span className="text-[14px] text-gray-700 group-hover:text-red-600 transition-colors">
                          {category.name}
                        </span>
                        <span className="text-[12px] text-gray-400 ml-auto">
                          {category.count}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Brands */}
                <div className="mb-6 pb-6 border-b border-gray-100">
                  <h3 className="text-[14px] font-semibold text-gray-900 mb-3">
                    Brands
                  </h3>
                  <div className="space-y-2">
                    {brands.map((brand) => (
                      <label
                        key={brand}
                        className="flex items-center gap-3 cursor-pointer group"
                      >
                        <input
                          type="checkbox"
                          checked={selectedBrands.includes(brand)}
                          onChange={() => toggleBrand(brand)}
                          className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500 cursor-pointer"
                        />
                        <span className="text-[14px] text-gray-700 group-hover:text-red-600 transition-colors">
                          {brand}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price */}
                <div>
                  <h3 className="text-[14px] font-semibold text-gray-900 mb-3">
                    Price Range
                  </h3>
                  <div className="space-y-3">
                    <input
                      type="range"
                      min="0"
                      max="2000"
                      value={priceRange}
                      onChange={(e) => setPriceRange(Number(e.target.value))}
                      className="w-full accent-red-600 cursor-pointer"
                    />
                    <div className="flex items-center justify-between">
                      <span className="text-[14px] text-gray-700 font-medium">
                        $0
                      </span>
                      <span className="text-[14px] text-gray-700 font-medium">
                        ${priceRange}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            {/* Product Area */}
            <div className="flex-1">
              <div className="bg-white rounded-2xl p-4 mb-6 border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <p className="text-[14px] text-gray-600">
                  Showing <strong>{filteredProducts.length}</strong> products
                </p>

                <div className="flex items-center gap-3">
                  <span className="text-[14px] text-gray-600">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 bg-gray-50 rounded-xl border border-gray-200 text-[14px] focus:outline-none focus:border-red-600 cursor-pointer"
                  >
                    <option value="featured">Featured</option>
                    <option value="newest">Newest</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <Link
                    key={product.id}
                    to={`/product/${product.id}`}
                    className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                  >
                    <div className="relative aspect-square bg-gray-50 overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />

                      {product.discount && (
                        <div className="absolute top-4 right-4 bg-red-600 text-white text-[12px] font-bold px-3 py-1.5 rounded-full">
                          {product.discount}
                        </div>
                      )}

                      {product.badge && (
                        <div className="absolute top-4 left-4 bg-green-500 text-white text-[12px] font-bold px-3 py-1.5 rounded-full">
                          {product.badge}
                        </div>
                      )}
                    </div>

                    <div className="p-5">
                      <span className="text-[12px] font-medium text-red-600 mb-2 block">
                        {product.category}
                      </span>

                      <div className="flex items-center gap-1 mb-2">
                        <StarRating rating={product.rating} />
                        <span className="text-[13px] text-gray-500 ml-1">
                          ({product.reviews})
                        </span>
                      </div>

                      <h3 className="text-[15px] font-semibold text-gray-900 mb-2 line-clamp-2">
                        {product.name}
                      </h3>

                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-[18px] font-bold text-gray-900">
                          ${product.price}
                        </span>
                        <span className="text-[14px] text-gray-400 line-through">
                          ${product.oldPrice}
                        </span>
                      </div>

                      <button
                        type="button"
                        className="w-full py-2.5 bg-red-600 text-white rounded-xl font-medium text-[14px] hover:bg-red-700 transition-all duration-300"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <SiteFooter />
    </div>
  );
}