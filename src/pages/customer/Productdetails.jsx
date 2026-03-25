import React, { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Footer from "../../components/layout/SiteFooter";
import Header from "../../components/layout/SiteHeader";

const products = [
  {
    id: 5,
    name: "Samsung Galaxy Watch 6",
    category: "Smart Watch",
    brand: "Samsung",
    model: "Samsung Galaxy Watch 6",
    warranty: "2 Years",
    inStock: true,
    rating: 4.6,
    reviews: 654,
    price: 299,
    oldPrice: 349,
    description:
      "Experience premium quality with the Samsung Galaxy Watch 6. Designed for performance and style, this product combines cutting-edge technology with elegant design. Perfect for everyday use and built to last.",
    images: [
      "https://readdy.ai/api/search-image?query=samsung%20galaxy%20smartwatch%20with%20circular%20display%20black%20band%20on%20white%20background%20premium%20product%20photography%20studio%20lighting%20ultra%20realistic&width=800&height=800&seq=prod5&orientation=squarish",
      "https://readdy.ai/api/search-image?query=samsung%20galaxy%20smartwatch%20with%20circular%20display%20black%20band%20on%20white%20background%20premium%20product%20photography%20studio%20lighting%20ultra%20realistic&width=800&height=800&seq=prod5&orientation=squarish",
      "https://readdy.ai/api/search-image?query=samsung%20galaxy%20smartwatch%20with%20circular%20display%20black%20band%20on%20white%20background%20premium%20product%20photography%20studio%20lighting%20ultra%20realistic&width=800&height=800&seq=prod5&orientation=squarish",
    ],
    specifications: [
      { label: "Brand", value: "Samsung" },
      { label: "Category", value: "Smart Watch" },
      { label: "Model", value: "Samsung Galaxy Watch 6" },
      { label: "Warranty", value: "2 Years" },
      { label: "In Stock", value: "Yes" },
    ],
  },
  {
    id: 1,
    name: "Apple Watch Series 9",
    category: "Smart Watch",
    price: 399,
    image:
      "https://readdy.ai/api/search-image?query=premium%20luxury%20apple%20watch%20series%209%20smartwatch%20with%20sleek%20black%20band%20on%20pure%20white%20minimalist%20background%20product%20photography%20studio%20lighting%20ultra%20realistic%20high%20resolution%20close%20up%20detailed%20view&width=800&height=800&seq=prod1&orientation=squarish",
  },
];

function RatingStars({ rating }) {
  const fullStars = Math.floor(rating);

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, index) => (
        <i
          key={index}
          className={`text-[18px] text-yellow-400 ${
            index < fullStars ? "ri-star-fill" : "ri-star-line"
          }`}
        />
      ))}
    </div>
  );
}

function ProductCard({ product }) {
  return (
    <Link
      to={`/product/${product.id}`}
      className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
    >
      <div className="relative aspect-square bg-gray-50 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>

      <div className="p-5">
        <h3 className="text-[15px] font-semibold text-gray-900 mb-2 line-clamp-2">
          {product.name}
        </h3>

        <div className="flex items-center justify-between">
          <span className="text-[18px] font-bold text-gray-900">
            ${product.price}
          </span>

          <button
            type="button"
            className="w-10 h-10 flex items-center justify-center bg-red-600 text-white rounded-full hover:bg-red-700 transition-all duration-300"
          >
            <i className="ri-shopping-cart-line text-[18px]"></i>
          </button>
        </div>
      </div>
    </Link>
  );
}

export default function ProductDetailsPage() {
  const { id } = useParams();

  const product = useMemo(() => {
    return products.find((item) => String(item.id) === String(id)) || products[0];
  }, [id]);

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("specifications");

  const discountPercent = Math.round(
    ((product.oldPrice - product.price) / product.oldPrice) * 100
  );

  const relatedProducts = products.filter((item) => item.id !== product.id);

  const decreaseQty = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const increaseQty = () => {
    setQuantity((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="pt-24 pb-20">
        <div className="max-w-[1400px] mx-auto px-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-[14px] mb-8">
            <Link to="/" className="text-gray-500 hover:text-red-600">
              Home
            </Link>
            <i className="ri-arrow-right-s-line text-gray-400"></i>
            <Link to="/shop" className="text-gray-500 hover:text-red-600">
              Shop
            </Link>
            <i className="ri-arrow-right-s-line text-gray-400"></i>
            <span className="text-gray-900 font-medium">{product.name}</span>
          </div>

          {/* Product top section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
            {/* Left image section */}
            <div>
              <div className="bg-gray-50 rounded-3xl overflow-hidden mb-4 aspect-square">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`bg-gray-50 rounded-2xl overflow-hidden aspect-square transition-all duration-300 ${
                      selectedImage === index
                        ? "ring-2 ring-red-600"
                        : "hover:ring-2 hover:ring-gray-300"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`View ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Right content */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-[12px] font-semibold">
                  {product.category}
                </span>
              </div>

              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>

              <div className="flex items-center gap-3 mb-6">
                <RatingStars rating={product.rating} />
                <span className="text-[15px] font-semibold text-gray-900">
                  {product.rating}
                </span>
                <span className="text-[14px] text-gray-500">
                  ({product.reviews} reviews)
                </span>
              </div>

              <div className="flex items-baseline gap-4 mb-6">
                <span className="text-5xl font-bold text-gray-900">
                  ${product.price}
                </span>
                <span className="text-2xl text-gray-400 line-through">
                  ${product.oldPrice}
                </span>
                <span className="px-3 py-1 bg-red-600 text-white rounded-full text-[14px] font-bold">
                  Save {discountPercent}%
                </span>
              </div>

              <p className="text-[15px] text-gray-600 leading-relaxed mb-8">
                {product.description}
              </p>

              <div className="mb-8">
                <label className="text-[14px] font-semibold text-gray-900 mb-3 block">
                  Quantity
                </label>

                <div className="flex items-center gap-3">
                  <button
                    onClick={decreaseQty}
                    className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-xl hover:bg-gray-200 transition-all duration-300"
                  >
                    <i className="ri-subtract-line text-[20px]"></i>
                  </button>

                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(Math.max(1, Number(e.target.value) || 1))
                    }
                    className="w-20 h-12 text-center bg-gray-50 rounded-xl border border-gray-200 font-semibold text-[16px] focus:outline-none focus:border-red-600"
                  />

                  <button
                    onClick={increaseQty}
                    className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-xl hover:bg-gray-200 transition-all duration-300"
                  >
                    <i className="ri-add-line text-[20px]"></i>
                  </button>
                </div>
              </div>

              <div className="flex gap-4 mb-8">
                <button className="flex-1 py-4 bg-red-600 text-white rounded-2xl font-semibold text-[15px] hover:bg-red-700 transition-all duration-300 hover:shadow-2xl hover:shadow-red-500/50">
                  Add to Cart
                </button>

                <button className="flex-1 py-4 bg-gray-900 text-white rounded-2xl font-semibold text-[15px] hover:bg-gray-800 transition-all duration-300">
                  Buy Now
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                  <i className="ri-truck-line text-[24px] text-red-600"></i>
                  <div>
                    <p className="text-[13px] font-semibold text-gray-900">
                      Free Delivery
                    </p>
                    <p className="text-[12px] text-gray-500">
                      2-3 business days
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                  <i className="ri-shield-check-line text-[24px] text-red-600"></i>
                  <div>
                    <p className="text-[13px] font-semibold text-gray-900">
                      2 Year Warranty
                    </p>
                    <p className="text-[12px] text-gray-500">Full coverage</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-20">
            <div className="flex items-center gap-2 mb-8 border-b border-gray-200">
              <button
                onClick={() => setActiveTab("specifications")}
                className={`px-6 py-3 text-[15px] font-semibold transition-all duration-300 whitespace-nowrap ${
                  activeTab === "specifications"
                    ? "text-red-600 border-b-2 border-red-600"
                    : "text-gray-600 hover:text-red-600"
                }`}
              >
                Specifications
              </button>

              <button
                onClick={() => setActiveTab("reviews")}
                className={`px-6 py-3 text-[15px] font-semibold transition-all duration-300 whitespace-nowrap ${
                  activeTab === "reviews"
                    ? "text-red-600 border-b-2 border-red-600"
                    : "text-gray-600 hover:text-red-600"
                }`}
              >
                Reviews ({product.reviews})
              </button>
            </div>

            {activeTab === "specifications" ? (
              <div className="bg-gray-50 rounded-2xl p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {product.specifications.map((spec, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-3 border-b border-gray-200"
                    >
                      <span className="text-[14px] font-medium text-gray-600">
                        {spec.label}
                      </span>
                      <span className="text-[14px] font-semibold text-gray-900">
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-2xl p-8">
                <div className="space-y-6">
                  <div className="bg-white rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-[16px] font-semibold text-gray-900">
                        John D
                      </h3>
                      <span className="text-[13px] text-gray-500">
                        2 days ago
                      </span>
                    </div>
                    <div className="mb-2">
                      <RatingStars rating={5} />
                    </div>
                    <p className="text-[14px] text-gray-600 leading-relaxed">
                      Excellent product quality and very comfortable for daily
                      use. Battery life is also very good.
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-[16px] font-semibold text-gray-900">
                        Sarah M
                      </h3>
                      <span className="text-[13px] text-gray-500">
                        1 week ago
                      </span>
                    </div>
                    <div className="mb-2">
                      <RatingStars rating={4} />
                    </div>
                    <p className="text-[14px] text-gray-600 leading-relaxed">
                      Nice design and smooth performance. Worth the price.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Related products */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              You May Also Like
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {relatedProducts.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}