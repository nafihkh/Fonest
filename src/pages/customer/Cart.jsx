import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useIsMobile from "../../hooks/useIsMobile";
import CartMobileView from "../../components/customer/Mobile/CartPage";
import CartDesktopView from "../../components/customer/Desktop/CartPage";
import MobileLayout from "../../components/layout/MobileLayout";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import {
  fetchCart,
  selectCartItems,
  selectCartSubtotal,
  selectCartTotalItems,
  selectCartFetchLoading,
  selectCartError,
  updateCartQuantity,
  removeFromCart,
} from "../../store/slices/cartSlice";
import {
  fetchHomeProducts,
  selectFeaturedProducts,
  selectLatestProducts,
} from "../../store/slices/productSlice";

export default function CartPageContainer() {
  const dispatch = useDispatch();
  const isMobile = useIsMobile(768);
  const [search, setSearch] = useState("");

  const cartItems = useSelector(selectCartItems);
  const subtotal = useSelector(selectCartSubtotal);
  const totalItems = useSelector(selectCartTotalItems);
  const loading = useSelector(selectCartFetchLoading);
  const error = useSelector(selectCartError);

  const featuredProducts = useSelector(selectFeaturedProducts);
  const latestProducts = useSelector(selectLatestProducts);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchCart());
    dispatch(fetchHomeProducts());
  }, [dispatch]);
  

  const handleIncrease = (item) => {
    dispatch(
      updateCartQuantity({
        productId: item.product?._id || item.product,
        quantity: (item.quantity || 1) + 1,
        variantId: item.variantId || null,
      })
    );
  };
  

  const handleProceedToPayment = async () => {
    try {
      const defaultAddressId = null; // replace with selected address later
      const couponCode = ""; // replace with selected coupon later

      const res = await api.post("/api/checkout/create-cart-razorpay-order", {
        couponCode,
        addressId: defaultAddressId,
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
          const verifyRes = await api.post("/api/checkout/verify-cart-razorpay-payment", {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            couponCode,
            addressId: defaultAddressId,
          });

          if (verifyRes.data.success) {
            navigate(`/order-placed/${verifyRes.data.orderId}`);
          } else {
            alert("Payment verification failed");
          }
        },
        prefill: {
          name: "Demo User",
          email: "demo@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#2563eb",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to start payment");
    }
  };
  
  const handleDecrease = (item) => {
    const nextQty = Math.max((item.quantity || 1) - 1, 1);

    dispatch(
      updateCartQuantity({
        productId: item.product?._id || item.product,
        quantity: nextQty,
        variantId: item.variantId || null,
      })
    );
  };

  const handleRemove = (item) => {
    dispatch(
      removeFromCart({
        productId: item.product?._id || item.product,
        variantId: item.variantId || null,
      })
    );
  };

  const cartProductIds = new Set(
    cartItems.map((item) => String(item.product?._id || item.product))
  );

  const savedProducts = [...(featuredProducts || []), ...(latestProducts || [])]
    .filter(
      (product, index, arr) =>
        arr.findIndex((p) => String(p._id) === String(product._id)) === index
    )
    .filter((product) => !cartProductIds.has(String(product._id)))
    .slice(0, 8);

  const sharedProps = {
    cartItems,
    subtotal,
    totalItems,
    loading,
    error,
    savedProducts,
    onIncrease: handleIncrease,
    onDecrease: handleDecrease,
    onRemove: handleRemove,
    onProceedToPayment: handleProceedToPayment,
  };

  if (isMobile) {
    return (
      <MobileLayout
        headerProps={{
          searchValue: search,
          onSearchChange: setSearch,
          showDelivery: false,
        }}
      >
        <CartMobileView {...sharedProps} />
      </MobileLayout>
    );
  }

  return <CartDesktopView {...sharedProps} />;
}