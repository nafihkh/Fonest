import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { api } from "../../services/api";


export default function OrderPlacedPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const res = await api.get(`/api/orders/${orderId}`);
        setOrder(res.data.order);
      } catch (error) {
        console.error(error);
      }
    };

    loadOrder();
  }, [orderId]);

  if (!order) return <div className="p-4">Loading...</div>;

  const item = order.items?.[0];

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="mx-auto max-w-md rounded-3xl bg-white p-6 shadow-sm">
        <div className="mb-4 flex justify-center">
          <CheckCircle2 className="h-16 w-16 text-green-500" />
        </div>

        <h1 className="text-center text-[24px] font-bold text-gray-900">
          Order Placed, Thank You!
        </h1>

        <p className="mt-2 text-center text-[14px] text-gray-600">
          Confirmation message will be sent to your message center.
        </p>

        <div className="mt-6 flex gap-3 rounded-2xl bg-gray-50 p-3">
          <div className="h-20 w-20 overflow-hidden rounded-xl bg-white">
            <img
              src={item?.image}
              alt={item?.name}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="flex-1">
            <h2 className="text-[15px] font-semibold text-gray-900">
              {item?.name}
            </h2>
            <p className="mt-1 text-[13px] text-gray-600">
              Qty: {item?.quantity}
            </p>
            <p className="mt-1 text-[13px] font-medium text-gray-900">
              ₹{Number(order.pricing?.total || 0).toLocaleString("en-IN")}
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-gray-200 p-4">
          <p className="text-[13px] font-semibold text-gray-900">
            Shipping to
          </p>
          <p className="mt-2 text-[13px] text-gray-600">
            {order.address?.fullName}
          </p>
          <p className="text-[13px] text-gray-600">
            {order.address?.line1}
          </p>
          {order.address?.line2 ? (
            <p className="text-[13px] text-gray-600">{order.address?.line2}</p>
          ) : null}
          <p className="text-[13px] text-gray-600">
            {order.address?.city}, {order.address?.state} - {order.address?.pincode}
          </p>
        </div>

        <div className="mt-4 rounded-2xl bg-blue-50 p-4">
          <p className="text-[13px] font-semibold text-gray-900">
            Estimated delivery date
          </p>
          <p className="mt-1 text-[15px] font-bold text-blue-700">
            {order.estimatedDeliveryText}
          </p>
        </div>
      </div>
    </div>
  );
}