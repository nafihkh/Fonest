import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import MobileLayout from "../../components/layout/MobileLayout";
import useIsMobile from "../../hooks/useIsMobile";
import { api } from "../../services/api";
import {
  fetchCart,
  selectCartItems,
  selectCartSubtotal,
  selectCartFetchLoading,
  selectCartError,
} from "../../store/slices/cartSlice";
import {
  fetchMyAddresses,
  selectProfileAddresses,
} from "../../store/slices/profileSlice";

function formatPrice(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

export default function CartCheckoutPage() {
  const dispatch = useDispatch();
  const isMobile = useIsMobile(768);

  const cartItems = useSelector(selectCartItems);
  const cartSubtotal = useSelector(selectCartSubtotal);
  const loading = useSelector(selectCartFetchLoading);
  const error = useSelector(selectCartError);
  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState("");
  const [couponMessage, setCouponMessage] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);

  const addresses = useSelector(selectProfileAddresses);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const selectedAddress =
  addresses.find((addr) => String(addr._id) === String(selectedAddressId)) || null;

  const [pricing, setPricing] = useState({
    subtotal: 0,
    couponDiscount: 0,
    deliveryCharge: 0,
    finalAmount: 0,
  });

    useEffect(() => {
        dispatch(fetchCart());
    }, [dispatch]);
    useEffect(() => {
        dispatch(fetchMyAddresses());
    }, [dispatch]);

  useEffect(() => {
    const subtotal = Number(cartSubtotal || 0);
    const deliveryCharge = 0;

    setPricing({
      subtotal,
      couponDiscount: 0,
      deliveryCharge,
      finalAmount: subtotal + deliveryCharge,
    });
  }, [cartSubtotal]);
  useEffect(() => {
    if (!addresses?.length) return;

    const defaultAddress =
        addresses.find((addr) => addr.isDefault) || addresses[0];

    setSelectedAddressId(defaultAddress._id);
  }, [addresses]);

  const totalItems = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  }, [cartItems]);

  const handleApplyCoupon = async () => {
    try {
      setCouponLoading(true);
      setCouponMessage("");

      const res = await api.post("/api/checkout/apply-cart-coupon", {
        couponCode,
      });

      setPricing(res.data.pricing);
      setCouponMessage(res.data.message || "Coupon applied");
    } catch (error) {
      const subtotal = Number(cartSubtotal || 0);
      const deliveryCharge = 0;

      setPricing({
        subtotal,
        couponDiscount: 0,
        deliveryCharge,
        finalAmount: subtotal + deliveryCharge,
      });

      setCouponMessage(
        error.response?.data?.message || "Failed to apply coupon"
      );
    } finally {
      setCouponLoading(false);
    }
  };

  const handleContinueToPayment = async () => {
    try {
      if (!selectedAddress) {
        alert("Please select a delivery address");
        return;
      }
      const res = await api.post("/api/checkout/create-cart-razorpay-order", {
        couponCode,
        addressId: null, // later selected real address
      });

      const data = res.data;

      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: "FONEST",
        description: "Cart Checkout",
        order_id: data.orderId,
        handler: async function (response) {
          const verifyRes = await api.post(
            "/api/checkout/verify-cart-razorpay-payment",
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              couponCode,
              addressId: selectedAddressId, // later selected real address
            }
          );

          if (verifyRes.data.success) {
            console.log("verify response", verifyRes.data);
            navigate(`/order-placed/${verifyRes.data.orderId}`);
          } else {
            alert("Payment verification failed");
          }
        },
        prefill: {
          name: selectedAddress.fullName,
          Address: selectedAddress.line1,
          contact: selectedAddress.phone,
        },
        theme: {
          color: "#3B82F6",
        },
        addressId: selectedAddressId,
        address: selectedAddress
        ? {
            fullName: selectedAddress.fullName,
            phone: selectedAddress.phone,
            line1: selectedAddress.line1,
            line2: selectedAddress.line2 || "",
            city: selectedAddress.city,
            state: selectedAddress.state,
            pincode: selectedAddress.pincode,
            country: "India",
            }
        : null,
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to start payment");
    }
  };

  if (loading) {
    return <div className="p-4">Loading checkout...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }
  

  const content = (
    <div className="min-h-screen bg-gray-50 p-4 pb-28">
      <h1 className="mb-4 text-[20px] font-bold text-gray-900">
        Cart Checkout
      </h1>

      <div className="mb-4 rounded-2xl bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-[15px] font-bold text-gray-900">
          Order Items ({totalItems})
        </h2>

        <div className="space-y-4">
          {cartItems.map((item, index) => {
            const product = item.product || {};
            const name = product.name || item.name || "Product";
            const image =
              product.images?.[0]?.url || product.images?.[0] || item.image || "";
            const price = item.price ?? product.price ?? 0;

            return (
              <div
                key={item._id || `${item.product}-${index}`}
                className="flex gap-3 border-b border-gray-100 pb-4 last:border-b-0 last:pb-0"
              >
                <div className="h-20 w-20 overflow-hidden rounded-xl bg-gray-100">
                  <img
                    src={image}
                    alt={name}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="flex-1">
                  <h3 className="text-[14px] font-semibold text-gray-900">
                    {name}
                  </h3>

                  <p className="mt-1 text-[12px] text-gray-500">
                    Qty: {item.quantity}
                  </p>

                  <p className="mt-2 text-[14px] font-bold text-gray-900">
                    {formatPrice(price)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mb-4 rounded-2xl bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
                <h2 className="text-[15px] font-bold text-gray-900">Delivery Address</h2>

                <button
                onClick={() => navigate("/profile/addresses")}
                className="text-[12px] font-semibold text-blue-500"
                >
                Manage
                </button>
            </div>

            {!addresses?.length ? (
                <button
                onClick={() => navigate("/profile/addresses/new")}
                className="w-full rounded-xl border border-dashed border-gray-300 p-4 text-left text-[13px] text-gray-500"
                >
                Add new address
                </button>
            ) : (
                <div className="grid grid-cols-1 gap-3">
                {addresses.map((address) => {
                    const active = String(selectedAddressId) === String(address._id);

                    return (
                    <button
                        key={address._id}
                        onClick={() => setSelectedAddressId(address._id)}
                        className={`rounded-2xl border p-3 text-left transition ${
                        active
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 bg-white"
                        }`}
                    >
                        <div className="flex items-center gap-2">
                        <p className="text-[13px] font-semibold text-gray-900">
                            {address.fullName}
                        </p>

                        {address.isDefault ? (
                            <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold text-blue-600">
                            Default
                            </span>
                        ) : null}
                        </div>

                        <p className="mt-1 text-[12px] text-gray-600">
                        {address.line1}
                        {address.line2 ? `, ${address.line2}` : ""}
                        {address.landmark ? `, ${address.landmark}` : ""}
                        </p>

                        <p className="mt-1 text-[12px] text-gray-600">
                        {address.city}, {address.state} - {address.pincode}
                        </p>

                        <p className="mt-1 text-[12px] text-gray-500">
                        {address.phone}
                        </p>
                    </button>
                    );
                })}
                </div>
            )}
      </div>

      <div className="mb-4 rounded-2xl bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-[15px] font-bold text-gray-900">
          Coupon Code
        </h2>

        <div className="flex gap-2">
          <input
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
            placeholder="Enter coupon"
            className="flex-1 rounded-xl border border-gray-200 px-3 py-3 text-[14px] outline-none"
          />

          <button
            onClick={handleApplyCoupon}
            disabled={couponLoading}
            className="rounded-xl bg-blue-500 px-4 py-3 text-[14px] font-semibold text-white disabled:opacity-60"
          >
            {couponLoading ? "Applying..." : "Apply"}
          </button>
        </div>

        {couponMessage ? (
          <p className="mt-2 text-[12px] text-gray-600">{couponMessage}</p>
        ) : null}
      </div>

      <div className="mb-6 rounded-2xl bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-[15px] font-bold text-gray-900">
          Price Details
        </h2>

        <div className="space-y-2 text-[14px]">
          <div className="flex items-center justify-between text-gray-600">
            <span>Subtotal</span>
            <span>{formatPrice(pricing.subtotal)}</span>
          </div>

          <div className="flex items-center justify-between text-gray-600">
            <span>Coupon Discount</span>
            <span>- {formatPrice(pricing.couponDiscount)}</span>
          </div>

          <div className="flex items-center justify-between text-gray-600">
            <span>Delivery Charge</span>
            <span>{formatPrice(pricing.deliveryCharge)}</span>
          </div>

          <div className="mt-3 border-t border-gray-100 pt-3">
            <div className="flex items-center justify-between text-[16px] font-bold text-gray-900">
              <span>Total Payable</span>
              <span>{formatPrice(pricing.finalAmount)}</span>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={handleContinueToPayment}
        disabled={!cartItems.length}
        className="w-full rounded-2xl bg-blue-500 py-3.5 text-[15px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        Continue to Payment
      </button>
    </div>
  );

  if (isMobile) {
   return (
    <MobileLayout showDelivery={false}>
        {content}
    </MobileLayout>
    );
  }

  return content;
}