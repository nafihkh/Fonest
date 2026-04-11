
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CheckCircle2, ChevronRight } from "lucide-react";
import { api } from "../../services/api";
import MobileLayout from "../../components/layout/MobileLayout";

function formatPrice(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

export default function OrderPlacedPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrder = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/api/orders/${orderId}`);
        setOrder(res.data.order);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      loadOrder();
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f6f8fc] dark:bg-[#0b1120] px-4">
        <div className="w-full max-w-md animate-pulse space-y-6">
          {/* Icon */}
          <div className="mx-auto h-24 w-24 rounded-full bg-slate-200 dark:bg-slate-700" />
          {/* Title */}
          <div className="mx-auto h-7 w-48 rounded bg-slate-200 dark:bg-slate-700" />
          <div className="mx-auto h-4 w-64 rounded bg-slate-200 dark:bg-slate-700" />
          {/* Order card */}
          <div className="rounded-3xl bg-white p-6 shadow-sm dark:bg-[#111827] space-y-4">
            <div className="h-4 w-24 rounded bg-slate-200 dark:bg-slate-700" />
            <div className="flex gap-4">
              <div className="h-16 w-16 rounded-2xl bg-slate-200 dark:bg-slate-700" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-full rounded bg-slate-200 dark:bg-slate-700" />
                <div className="h-3 w-2/3 rounded bg-slate-200 dark:bg-slate-700" />
                <div className="h-4 w-20 rounded bg-slate-200 dark:bg-slate-700" />
              </div>
            </div>
            <div className="border-t border-gray-100 pt-4 dark:border-gray-800 space-y-2">
              {[1,2,3].map(i => (
                <div key={i} className="flex justify-between">
                  <div className="h-3 w-24 rounded bg-slate-200 dark:bg-slate-700" />
                  <div className="h-3 w-16 rounded bg-slate-200 dark:bg-slate-700" />
                </div>
              ))}
            </div>
          </div>
          {/* Buttons */}
          <div className="space-y-3">
            <div className="h-14 w-full rounded-2xl bg-slate-200 dark:bg-slate-700" />
            <div className="h-14 w-full rounded-2xl bg-slate-200 dark:bg-slate-700" />
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f6f8fc] dark:bg-[#0b1120] px-4">
        <div className="rounded-3xl bg-white p-6 text-center shadow-sm dark:bg-[#111827]">
          <p className="text-[15px] font-semibold text-gray-900 dark:text-white">
            Order not found
          </p>
        </div>
      </div>
    );
  }

  return (
    <MobileLayout>
        {/* Success Icon */}
        <div className="mb-4 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-50 dark:bg-green-500/10">
            <CheckCircle2 className="h-12 w-12 text-green-500 dark:text-green-400" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-center text-[24px] font-bold text-gray-900 dark:text-white">
          Order Placed!
        </h1>

        <p className="mt-2 text-center text-[13px] leading-6 text-gray-600 dark:text-gray-400">
          Thank you for shopping with FONEST. Your order has been confirmed and
          will be shipped soon.
        </p>

      

        {/* Ordered Items */}
        <div className="mt-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-[15px] font-bold text-gray-900 dark:text-white">
              Ordered Items ({order.items?.length || 0})
            </h2>
          </div>

          <div className="overflow-x-auto no-scrollbar">
            <div className="flex gap-3 pb-1">
              {order.items?.map((item) => {
                const image =
                  item.image ||
                  item.product?.image ||
                  item.product?.images?.[0]?.url ||
                  item.product?.images?.[0];

                const name = item.name || item.product?.name || "Product";

                return (
                  <div
                    key={item._id}
                    className="w-[210px] shrink-0 rounded-3xl border border-gray-200 bg-gray-50 p-3 dark:border-gray-800 dark:bg-[#0f172a]"
                  >
                    <div className="h-28 overflow-hidden rounded-2xl bg-white dark:bg-[#1e293b]">
                      <img
                        src={image}
                        alt={name}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="mt-3">
                      <h3 className="line-clamp-2 text-[13px] font-semibold text-gray-900 dark:text-white">
                        {name}
                      </h3>

                      <p className="mt-1 text-[11px] text-gray-500 dark:text-gray-400">
                        Qty: {item.quantity}
                      </p>

                      <p className="mt-2 text-[13px] font-bold text-gray-900 dark:text-white">
                        {formatPrice(
                          item.totalPrice ||
                            item.price ||
                            item.unitPrice * item.quantity
                        )}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
          {/* Order Number */}
        <div className="mt-5 rounded-2xl bg-blue-50 px-4 py-3 text-center dark:bg-blue-500/10">
          <p className="text-[11px] font-medium uppercase tracking-wide text-blue-600 dark:text-blue-300">
            Order ID
          </p>
          <p className="mt-1 text-[14px] font-bold text-gray-900 dark:text-white">
            #{order.orderNumber || order._id?.slice(-8)}
          </p>
        </div>

        {/* Shipping Address */}
        <div className="mt-6 rounded-3xl border border-gray-200 p-4 dark:border-gray-800 dark:bg-[#0f172a]">
          <p className="text-[13px] font-semibold text-gray-900 dark:text-white">
            Shipping Address
          </p>

          <div className="mt-3 space-y-1 text-[13px] text-gray-600 dark:text-gray-400">
            <p className="font-medium text-gray-900 dark:text-white">
              {order.address?.fullName}
            </p>

            <p>
              {order.address?.line1}
              {order.address?.line2 ? `, ${order.address.line2}` : ""}
            </p>

            <p>
              {order.address?.city}, {order.address?.state} - {order.address?.pincode}
            </p>

            <p>{order.address?.phone}</p>
          </div>
        </div>

        {/* Delivery */}
        <div className="mt-4 rounded-3xl bg-blue-50 p-4 dark:bg-blue-500/10">
          <p className="text-[12px] font-semibold text-gray-900 dark:text-white">
            Estimated Delivery
          </p>

          <p className="mt-1 text-[15px] font-bold text-blue-700 dark:text-blue-300">
            {order.estimatedDeliveryText || "Within 3 - 5 business days"}
          </p>
        </div>

        {/* Total */}
        <div className="mt-4 flex items-center justify-between rounded-3xl border border-gray-200 px-4 py-4 dark:border-gray-800 dark:bg-[#0f172a]">
          <div>
            <p className="text-[12px] text-gray-500 dark:text-gray-400">
              Total Paid
            </p>
            <p className="mt-1 text-[18px] font-bold text-gray-900 dark:text-white">
              {formatPrice(order.pricing?.total || order.totalAmount)}
            </p>
          </div>

          <button
            onClick={() => navigate(`/orders/${order._id}`)}
            className="flex items-center gap-1 rounded-2xl bg-blue-500 px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-blue-600"
          >
            View Order
            <ChevronRight size={16} />
          </button>
        </div>
    </MobileLayout>
  );
}