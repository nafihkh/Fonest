import { Link } from "react-router-dom";

export default function ProductCard({
  product,
  variant = "deal", // "deal" | "arrival"
  onAddToCart,
}) {
  const isDeal = variant === "deal";
  const productId = product._id || product.id;

  const handleAddToCart = (e) => {
    e.preventDefault(); // prevent Link navigation when clicking button
    e.stopPropagation();
    onAddToCart?.(product);
  };

  return (
    <Link
      to={productId ? `/product/${productId}` : "#"}
      className="group block overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl dark:border-gray-800 dark:bg-gray-900 dark:hover:border-blue-500/40 dark:hover:shadow-blue-500/10"
    >
      <div
        className={`relative overflow-hidden bg-gray-50 dark:bg-gray-800 ${
          isDeal ? "aspect-square" : "aspect-[4/3]"
        }`}
      >
        <img
          alt={product.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          src={product.image}
        />

        {isDeal && product.discountLabel && (
          <div className="absolute right-4 top-4 rounded-full bg-blue-600 px-3 py-1.5 text-[12px] font-bold text-white dark:bg-blue-500">
            {product.discountLabel}
          </div>
        )}

        {!isDeal && product.isNew && (
          <div className="absolute left-4 top-4 rounded-full bg-emerald-500 px-3 py-1.5 text-[12px] font-bold text-white dark:bg-emerald-500">
            NEW
          </div>
        )}
      </div>

      <div className="p-5">
        {!isDeal && (
          <span className="mb-2 block text-[12px] font-medium text-blue-600 dark:text-blue-400">
            {product.category}
          </span>
        )}

        <h3 className="mb-2 line-clamp-2 text-[15px] font-semibold text-gray-900 dark:text-gray-100">
          {product.title}
        </h3>

        {isDeal ? (
          <>
            <div className="mb-3 flex items-center gap-2">
              <span className="text-[18px] font-bold text-gray-900 dark:text-gray-100">
                {product.price}
              </span>

              {product.oldPrice && (
                <span className="text-[14px] text-gray-400 line-through dark:text-gray-500">
                  {product.oldPrice}
                </span>
              )}
            </div>

            <button
              onClick={handleAddToCart}
              className="w-full whitespace-nowrap rounded-xl bg-blue-600 py-2.5 text-[14px] font-medium text-white transition-all duration-300 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
              type="button"
            >
              Add to Cart
            </button>
          </>
        ) : (
          <div className="flex items-center justify-between">
            <span className="text-[18px] font-bold text-gray-900 dark:text-gray-100">
              {product.price}
            </span>

            <button
              onClick={handleAddToCart}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white transition-all duration-300 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
              type="button"
              aria-label="Add to cart"
            >
              <i className="ri-shopping-cart-line text-[18px]" />
            </button>
          </div>
        )}
      </div>
    </Link>
  );
}