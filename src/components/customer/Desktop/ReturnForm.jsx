import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SiteHeader from "../../layout/SiteHeader";
import SiteFooter from "../../layout/SiteFooter";
import { RotateCcw, CheckCircle2, AlertCircle, ChevronLeft, Package } from "lucide-react";

const REASONS = [
  { value: "damaged_product",   label: "Damaged / Broken Product",          icon: "ri-alert-line" },
  { value: "wrong_product",     label: "Wrong Product Received",            icon: "ri-error-warning-line" },
  { value: "not_as_described",  label: "Not as Described",                  icon: "ri-file-unknow-line" },
  { value: "defective_product", label: "Defective / Not Working",           icon: "ri-tools-line" },
  { value: "changed_mind",      label: "Changed Mind",                      icon: "ri-refresh-line" },
  { value: "other",             label: "Other",                             icon: "ri-more-line" },
];

export default function DesktopReturnForm({
  order,
  loading,
  error,
  submitting,
  submitError,
  submitSuccess,
  lastSubmittedTicket,
  onSubmit,
}) {
  const navigate = useNavigate();
  const [selectedReason, setSelectedReason] = useState("");
  const [description, setDescription] = useState("");
  const [selectedItems, setSelectedItems] = useState({});

  const items = order?.items || [];

  const toggleItem = (itemId) => {
    setSelectedItems((prev) => {
      const next = { ...prev };
      if (next[itemId]) {
        delete next[itemId];
      } else {
        const item = items.find((i) => String(i._id) === String(itemId));
        next[itemId] = { orderItemId: itemId, quantity: item?.quantity || 1 };
      }
      return next;
    });
  };

  const handleQuantityChange = (itemId, qty) => {
    setSelectedItems((prev) => ({
      ...prev,
      [itemId]: { ...prev[itemId], quantity: Number(qty) },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const itemsArray = Object.entries(selectedItems).map(([orderItemId, val]) => ({
      orderItemId,
      quantity: val.quantity,
    }));
    onSubmit({
      orderId: order?._id,
      reason: selectedReason,
      description,
      items: itemsArray,
    });
  };

  const bg = "min-h-screen bg-gray-50 dark:bg-[radial-gradient(circle_at_top,_#1e3a8a_0%,_#111827_35%,_#030712_100%)]";

  if (loading) {
    return (
      <div className={bg}>
        <SiteHeader />
        <div className="pb-20 pt-24">
          <div className="mx-auto max-w-3xl px-6 animate-pulse space-y-4">
            <div className="h-8 w-48 rounded bg-slate-200 dark:bg-slate-700" />
            <div className="h-64 rounded-2xl bg-slate-200 dark:bg-slate-700" />
          </div>
        </div>
        <SiteFooter />
      </div>
    );
  }

  if (error) {
    return (
      <div className={bg}>
        <SiteHeader />
        <div className="pb-20 pt-24">
          <div className="mx-auto max-w-3xl px-6">
            <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-white p-6 text-red-600 dark:border-red-500/20 dark:bg-gray-900 dark:text-red-400">
              <AlertCircle size={22} />
              {error}
            </div>
          </div>
        </div>
        <SiteFooter />
      </div>
    );
  }

  if (submitSuccess) {
    return (
      <div className={bg}>
        <SiteHeader />
        <div className="flex min-h-[70vh] items-center justify-center pb-20 pt-24">
          <div className="mx-auto max-w-lg px-6 text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-500/15">
              <CheckCircle2 size={40} className="text-emerald-600 dark:text-emerald-400" />
            </div>
            <h1 className="mb-3 text-3xl font-bold text-gray-900 dark:text-gray-100">Return Submitted!</h1>
            <p className="mb-2 text-gray-500 dark:text-gray-400">Your return request has been submitted successfully.</p>
            {lastSubmittedTicket && (
              <p className="mb-8 text-lg font-bold text-blue-600 dark:text-blue-400">
                Ticket: {lastSubmittedTicket}
              </p>
            )}
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => navigate("/returns")}
                className="rounded-xl bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                View My Returns
              </button>
              <button
                onClick={() => navigate("/purchase-history")}
                className="rounded-xl border border-gray-200 bg-white px-6 py-3 font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
              >
                Back to Orders
              </button>
            </div>
          </div>
        </div>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className={bg}>
      <SiteHeader />

      <div className="pb-20 pt-24">
        <div className="mx-auto max-w-3xl px-6">
          {/* Back button */}
          <button
            onClick={() => navigate(-1)}
            className="mb-6 flex items-center gap-2 text-[14px] font-medium text-gray-500 transition hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
          >
            <ChevronLeft size={18} /> Back to Order
          </button>

          {/* Header */}
          <div className="mb-8 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 dark:bg-orange-500/15">
              <RotateCcw size={26} className="text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Request a Return</h1>
              <p className="text-[14px] text-gray-500 dark:text-gray-400">
                Order #{order?._id?.slice(-6).toUpperCase()}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Select Items */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
              <h2 className="mb-4 text-[16px] font-bold text-gray-900 dark:text-gray-100">
                Select Items to Return
              </h2>
              <div className="space-y-3">
                {items.map((item) => {
                  const id = String(item._id);
                  const isSelected = !!selectedItems[id];
                  const image = item.image || item.product?.image || item.product?.images?.[0]?.url;
                  const name = item.name || item.product?.name || "Product";

                  return (
                    <div
                      key={id}
                      onClick={() => toggleItem(id)}
                      className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition-all duration-200 ${
                        isSelected
                          ? "border-blue-400 bg-blue-50 dark:border-blue-500/40 dark:bg-blue-500/10"
                          : "border-gray-200 bg-gray-50 hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800/50"
                      }`}
                    >
                      <div className={`h-5 w-5 shrink-0 rounded-md border-2 transition ${
                        isSelected ? "border-blue-500 bg-blue-500" : "border-gray-300 dark:border-gray-600"
                      } flex items-center justify-center`}>
                        {isSelected && <i className="ri-check-line text-[12px] text-white" />}
                      </div>

                      {image ? (
                        <img src={image} alt={name} className="h-16 w-16 rounded-xl object-cover" />
                      ) : (
                        <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gray-200 dark:bg-gray-700">
                          <Package size={20} className="text-gray-400" />
                        </div>
                      )}

                      <div className="flex-1">
                        <p className="text-[14px] font-semibold text-gray-900 dark:text-gray-100">{name}</p>
                        <p className="text-[12px] text-gray-500 dark:text-gray-400">
                          Ordered: {item.quantity} unit{item.quantity !== 1 ? "s" : ""} · ₹{item.price || 0}
                        </p>
                      </div>

                      {isSelected && (
                        <div onClick={(e) => e.stopPropagation()} className="flex items-center gap-2">
                          <label className="text-[12px] font-medium text-gray-600 dark:text-gray-400">Qty:</label>
                          <select
                            value={selectedItems[id]?.quantity || 1}
                            onChange={(e) => handleQuantityChange(id, e.target.value)}
                            className="rounded-lg border border-gray-200 bg-white px-2 py-1 text-[13px] dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                          >
                            {Array.from({ length: item.quantity }, (_, i) => i + 1).map((n) => (
                              <option key={n} value={n}>{n}</option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Reason */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
              <h2 className="mb-4 text-[16px] font-bold text-gray-900 dark:text-gray-100">
                Reason for Return
              </h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {REASONS.map((r) => {
                  const active = selectedReason === r.value;
                  return (
                    <button
                      key={r.value}
                      type="button"
                      onClick={() => setSelectedReason(r.value)}
                      className={`flex flex-col items-center gap-2 rounded-xl border p-4 text-center transition-all duration-200 ${
                        active
                          ? "border-blue-400 bg-blue-50 text-blue-700 dark:border-blue-500/40 dark:bg-blue-500/10 dark:text-blue-400"
                          : "border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800/50 dark:text-gray-400"
                      }`}
                    >
                      <i className={`${r.icon} text-[22px]`} />
                      <span className="text-[12px] font-medium leading-tight">{r.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Description */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
              <h2 className="mb-4 text-[16px] font-bold text-gray-900 dark:text-gray-100">
                Additional Details <span className="font-normal text-gray-400">(Optional)</span>
              </h2>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the issue in more detail..."
                rows={4}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-[14px] text-gray-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-blue-500 dark:focus:ring-blue-500/20"
              />
            </div>

            {/* Error */}
            {submitError && (
              <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-[14px] text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
                <AlertCircle size={18} />
                {submitError}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="rounded-xl border border-gray-200 bg-white px-6 py-3 text-[14px] font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={
                  submitting ||
                  !selectedReason ||
                  Object.keys(selectedItems).length === 0
                }
                className="flex items-center gap-2 rounded-xl bg-orange-500 px-8 py-3 text-[14px] font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-orange-500 dark:hover:bg-orange-600"
              >
                {submitting ? (
                  <>
                    <i className="ri-loader-4-line animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <RotateCcw size={16} />
                    Submit Return Request
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
