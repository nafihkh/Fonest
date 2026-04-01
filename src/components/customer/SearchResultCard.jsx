import React from "react";
import { ShoppingCart, Minus, Plus, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  updateCartQuantity,
  removeFromCart,
  selectCartQuantityByProductId,
  selectCartAddLoading,
  selectCartUpdateLoading,
} from "../../store/slices/cartSlice";

function formatPrice(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

export default function SearchResultCard({ product }) {
  const dispatch = useDispatch();

  const quantity = useSelector(selectCartQuantityByProductId(product._id));
  const addLoading = useSelector(selectCartAddLoading);
  const updateLoading = useSelector(selectCartUpdateLoading);

  const isInCart = quantity > 0;
  const isBusy = addLoading || updateLoading;

  const price = Number(product.price || 0);
  const oldPrice = Number(product.compareAtPrice || 0);
  const hasDiscount = oldPrice > price;

  const handleAddToCart = async () => {
    await dispatch(addToCart({ productId: product._id, quantity: 1 }));
  };

  const handleIncrease = async () => {
    await dispatch(
      updateCartQuantity({
        productId: product._id,
        quantity: quantity + 1,
      })
    );
  };

  const handleDecrease = async () => {
    if (quantity <= 1) {
      await dispatch(removeFromCart({ productId: product._id }));
      return;
    }

    await dispatch(
      updateCartQuantity({
        productId: product._id,
        quantity: quantity - 1,
      })
    );
  };

  return (
    <div className="overflow-hidden rounded-2xl bg-white dark:bg-gray-900 shadow-sm border border-gray-100 dark:border-gray-800">
      {/* Image */}
      <Link to={`/product/${product.id || product._id}`} className="block">
        <div className="aspect-square bg-gray-100 dark:bg-gray-800">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-gray-400 dark:text-gray-500">
              No Image
            </div>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-3">
        <Link to={`/product/${product.id || product._id}`}>
          <h3 className="line-clamp-2 min-h-[40px] text-[13px] font-semibold text-gray-900 dark:text-gray-100">
            {product.name}
          </h3>
        </Link>

        <p className="mt-1 text-[11px] text-gray-500 dark:text-gray-400">
          {product.brand?.name || product.brand || "FONEST"}
        </p>

        {/* Price */}
        <div className="mt-2 flex items-center gap-2">
          <span className="text-[14px] font-bold text-gray-900 dark:text-white">
            {formatPrice(price)}
          </span>

          {hasDiscount && (
            <span className="text-[11px] text-gray-400 line-through dark:text-gray-500">
              {formatPrice(oldPrice)}
            </span>
          )}
        </div>

        {/* Cart Controls */}
        {quantity > 0 ? (
          <div className="mt-3 flex h-10 items-center justify-between rounded-xl border border-gray-200 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 px-2">
            <button
              onClick={handleDecrease}
              disabled={isBusy}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow-sm disabled:opacity-50"
            >
              <Minus size={14} />
            </button>

            <div className="flex items-center gap-2 text-[13px] font-semibold text-gray-900 dark:text-gray-100">
              {isBusy && <Loader2 size={14} className="animate-spin" />}
              <span>{quantity}</span>
            </div>

            <button
              onClick={handleIncrease}
              disabled={isBusy || quantity >= product.stock}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow-sm disabled:opacity-50"
            >
              <Plus size={14} />
            </button>
          </div>
        ) : (
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0 || isBusy}
            className={`mt-3 flex h-10 w-full items-center justify-center gap-2 rounded-xl text-[12px] font-semibold transition ${
              product.stock === 0
                ? "cursor-not-allowed bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
                : "bg-gray-900 text-white hover:bg-black dark:bg-blue-600 dark:hover:bg-blue-700 disabled:opacity-70"
            }`}
          >
            {isBusy ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <ShoppingCart size={14} />
                {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}