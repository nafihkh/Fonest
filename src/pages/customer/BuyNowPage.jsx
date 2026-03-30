import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import MobileLayout from "../../components/layout/MobileLayout";
import useIsMobile from "../../hooks/useIsMobile";
import {api} from "../../services/api";


import {
  fetchProductById,
  selectProductById,
  selectProductsLoadingDetails,
  selectProductsErrorDetails,
} from "../../store/slices/productSlice";
import {
  fetchMyAddresses,
  selectProfileAddresses,
} from "../../store/slices/profileSlice";

function formatPrice(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

export default function BuyNowPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const isMobile = useIsMobile(768);

  const product = useSelector(selectProductById(id));
  const loading = useSelector(selectProductsLoadingDetails);
  const error = useSelector(selectProductsErrorDetails);

  const addresses = useSelector(selectProfileAddresses);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const selectedAddress =
addresses.find((addr) => String(addr._id) === String(selectedAddressId)) || null;

  const [qty, setQty] = useState(1);
  const [couponCode, setCouponCode] = useState("");
  const navigate = useNavigate();

  const [pricing, setPricing] = useState({
    subtotal: 0,
    couponDiscount: 0,
    deliveryCharge: 0,
    finalAmount: 0,
    });

    const [couponMessage, setCouponMessage] = useState("");
    const [couponLoading, setCouponLoading] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    const subtotal = Number(product?.price || 0) * qty;
    const deliveryCharge = 0;

    setPricing({
        subtotal,
        couponDiscount: 0,
        deliveryCharge,
        finalAmount: subtotal + deliveryCharge,
    });
    }, [product, qty]);
    useEffect(() => {
      dispatch(fetchMyAddresses());
    }, [dispatch]);
    useEffect(() => {
      dispatch(fetchMyAddresses());
    }, [dispatch]);
    const handleApplyCoupon = async () => {
        try {
            setCouponLoading(true);
            setCouponMessage("");

            const res = await api.post("/api/checkout/apply-coupon", {
            productId: product._id,
            quantity: qty,
            couponCode,
            });

            setPricing(res.data.pricing);
            setCouponMessage(res.data.message || "Coupon applied");
        } catch (error) {
            const message =
            error.response?.data?.message || "Failed to apply coupon";

            const subtotal = Number(product?.price || 0) * qty;
            const deliveryCharge = 0;

            setPricing({
            subtotal,
            couponDiscount: 0,
            deliveryCharge,
            finalAmount: subtotal + deliveryCharge,
            });

            setCouponMessage(message);
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
        const res = await api.post("/api/checkout/create-razorpay-order", {
        productId: product._id,
        quantity: qty,
        couponCode,
        });

        const data = res.data;

        const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: "FONEST",
        description: product.name,
        order_id: data.orderId,
        handler: async function (response) {
        const verifyRes = await api.post("/api/checkout/verify-razorpay-payment", {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            productId: product._id,
            quantity: qty,
            couponCode,
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
        });

        if (verifyRes.data.success) {
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
        modal: {
            ondismiss: function () {
            console.log("Checkout closed");
            },
        },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
        } 
        catch (error) {
            alert(error.response?.data?.message || "Failed to start payment");
        }
    };

  if (loading && !product) {
    return <div className="p-4">Loading...</div>;
  }

  if (error && !product) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  if (!product) {
    return <div className="p-4">Product not found</div>;
  }

  

   
  const content = (
    <div className="min-h-screen bg-gray-50 p-4 pb-28">
      <h1 className="mb-4 text-[20px] font-bold text-gray-900">Buy Now</h1>

      <div className="mb-4 rounded-2xl bg-white p-4 shadow-sm">
        <div className="flex gap-3">
          <div className="h-24 w-24 overflow-hidden rounded-xl bg-gray-100">
            <img
              src={product.images?.[0]?.url || product.images?.[0] || ""}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="flex-1">
            <p className="text-[12px] text-gray-500">
              {product.brand?.name || product.brand || "FONEST"}
            </p>
            <h2 className="mt-1 text-[15px] font-semibold text-gray-900">
              {product.name}
            </h2>
            <p className="mt-2 text-[16px] font-bold text-gray-900">
              {formatPrice(product.price)}
            </p>
            <p
              className={`mt-1 text-[12px] font-medium ${
                product.stock > 0 ? "text-green-600" : "text-red-500"
              }`}
            >
              {product.stock > 0 ? "In Stock" : "Out of Stock"}
            </p>
          </div>
        </div>
      </div>

      <div className="mb-4 rounded-2xl bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-[15px] font-bold text-gray-900">Quantity</h2>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setQty((prev) => Math.max(prev - 1, 1))}
            className="h-10 w-10 rounded-xl border border-gray-200 text-lg font-semibold"
          >
            -
          </button>

          <div className="min-w-[48px] text-center text-[15px] font-semibold">
            {qty}
          </div>

          <button
            onClick={() =>
              setQty((prev) => Math.min(prev + 1, Math.max(product.stock || 1, 1)))
            }
            className="h-10 w-10 rounded-xl border border-gray-200 text-lg font-semibold"
          >
            +
          </button>
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
        <h2 className="mb-3 text-[15px] font-bold text-gray-900">Coupon Code</h2>

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
        <h2 className="mb-3 text-[15px] font-bold text-gray-900">Price Details</h2>

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
        disabled={product.stock <= 0}
        className="w-full rounded-2xl bg-blue-500 py-3.5 text-[15px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        Continue to Payment
      </button>
    </div>
  );

  if (isMobile) {
    return <MobileLayout headerProps={{ showDelivery: false }}>{content}</MobileLayout>;
  }

  return content;
}