import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../../components/layout/SiteFooter";
import Header from "../../components/layout/SiteHeader"

const initialCartItems = [
  {
    id: 1,
    name: "Apple Watch Series 9",
    category: "Smart Watch",
    price: 399,
    quantity: 1,
    image:
      "https://readdy.ai/api/search-image?query=premium%20luxury%20apple%20watch%20series%209%20smartwatch%20with%20sleek%20black%20band%20on%20pure%20white%20minimalist%20background%20product%20photography%20studio%20lighting%20ultra%20realistic%20high%20resolution%20close%20up%20detailed%20view&width=800&height=800&seq=prod1&orientation=squarish",
  },
  {
    id: 2,
    name: "AirPods Pro 2nd Gen",
    category: "Airpods",
    price: 249,
    quantity: 2,
    image:
      "https://readdy.ai/api/search-image?query=apple%20airpods%20pro%20second%20generation%20white%20wireless%20earbuds%20with%20charging%20case%20on%20clean%20white%20background%20premium%20product%20photography%20studio%20lighting%20ultra%20realistic%20high%20detail%20close%20up%20shot&width=800&height=800&seq=prod2&orientation=squarish",
  },
  {
    id: 3,
    name: "iPhone 15 Pro Max",
    category: "Used Phones",
    price: 1199,
    quantity: 1,
    image:
      "https://readdy.ai/api/search-image?query=flagship%20apple%20iphone%2015%20pro%20max%20titanium%20smartphone%20with%20triple%20camera%20system%20on%20pristine%20white%20background%20premium%20product%20photography%20studio%20lighting%20ultra%20realistic%20high%20resolution%20detailed%20close%20up%20view&width=800&height=800&seq=prod3&orientation=squarish",
  },
];


function CartItem({ item, onIncrease, onDecrease, onRemove }) {
  const total = item.price * item.quantity;

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all duration-300">
      <div className="flex flex-col sm:flex-row gap-6">
        <Link
          to={`/product/${item.id}`}
          className="w-full sm:w-32 h-32 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0"
        >
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
          />
        </Link>

        <div className="flex-1">
          <div className="flex items-start justify-between mb-3">
            <div>
              <Link
                to={`/product/${item.id}`}
                className="text-[17px] font-semibold text-gray-900 hover:text-red-600 transition-colors"
              >
                {item.name}
              </Link>
              <p className="text-[13px] text-gray-500 mt-1">{item.category}</p>
            </div>

            <button
              onClick={() => onRemove(item.id)}
              className="p-2 hover:bg-red-50 rounded-lg transition-all duration-300"
            >
              <i className="ri-delete-bin-line text-[20px] text-red-600"></i>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => onDecrease(item.id)}
                className="w-9 h-9 flex items-center justify-center bg-gray-100 rounded-lg hover:bg-gray-200 transition-all duration-300"
              >
                <i className="ri-subtract-line text-[16px]"></i>
              </button>

              <span className="w-12 text-center font-semibold text-[15px]">
                {item.quantity}
              </span>

              <button
                onClick={() => onIncrease(item.id)}
                className="w-9 h-9 flex items-center justify-center bg-gray-100 rounded-lg hover:bg-gray-200 transition-all duration-300"
              >
                <i className="ri-add-line text-[16px]"></i>
              </button>
            </div>

            <div className="text-left sm:text-right">
              <p className="text-[20px] font-bold text-gray-900">
                ₹{total.toFixed(2)}
              </p>
              <p className="text-[13px] text-gray-500">
                ₹{item.price} each
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function OrderSummary({ subtotal, tax, total }) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 sticky top-28">
      <h2 className="text-[18px] font-bold text-gray-900 mb-6">Order Summary</h2>

      <div className="space-y-4 mb-6">
        <div className="flex items-center justify-between">
          <span className="text-[14px] text-gray-600">Subtotal</span>
          <span className="text-[15px] font-semibold text-gray-900">
            ₹{subtotal.toFixed(2)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[14px] text-gray-600">Delivery</span>
          <span className="text-[15px] font-semibold text-gray-900">FREE</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[14px] text-gray-600">Tax (8%)</span>
          <span className="text-[15px] font-semibold text-gray-900">
            ₹{tax.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-200 mb-6">
        <div className="flex items-center justify-between">
          <span className="text-[16px] font-bold text-gray-900">Total</span>
          <span className="text-[24px] font-bold text-red-600">
            ₹{total.toFixed(2)}
          </span>
        </div>
      </div>

      <button className="w-full py-4 bg-red-600 text-white rounded-2xl font-semibold text-[15px] hover:bg-red-700 transition-all duration-300 mb-3">
        Proceed to Checkout
      </button>

      <Link
        to="/shop"
        className="block w-full py-4 bg-gray-100 text-gray-900 rounded-2xl font-semibold text-[15px] hover:bg-gray-200 transition-all duration-300 text-center"
      >
        Continue Shopping
      </Link>
    </div>
  );
}



export default function CartPage() {
  const [cartItems, setCartItems] = useState(initialCartItems);

  const handleIncrease = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const handleDecrease = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity > 1 ? item.quantity - 1 : 1 }
          : item
      )
    );
  };

  const handleRemove = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const { subtotal, tax, total } = useMemo(() => {
    const subtotalValue = cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    const taxValue = subtotalValue * 0.08;
    const totalValue = subtotalValue + taxValue;

    return {
      subtotal: subtotalValue,
      tax: taxValue,
      total: totalValue,
    };
  }, [cartItems]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="pt-24 pb-20">
        <div className="max-w-[1600px] mx-auto px-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

          {cartItems.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 border border-gray-100 text-center">
              <i className="ri-shopping-cart-line text-5xl text-gray-300"></i>
              <h2 className="text-2xl font-bold text-gray-900 mt-4 mb-2">
                Your cart is empty
              </h2>
              <p className="text-gray-500 mb-6">
                Add some products to continue shopping.
              </p>
              <Link
                to="/shop"
                className="inline-block px-6 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-all duration-300"
              >
                Go to Shop
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onIncrease={handleIncrease}
                    onDecrease={handleDecrease}
                    onRemove={handleRemove}
                  />
                ))}
              </div>

              <div className="lg:col-span-1">
                <OrderSummary subtotal={subtotal} tax={tax} total={total} />
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}