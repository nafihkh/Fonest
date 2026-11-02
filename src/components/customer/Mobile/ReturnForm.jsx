import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RotateCcw, CheckCircle2, AlertCircle, ChevronLeft, Package } from "lucide-react";

const REASONS = [
  { value: "damaged_product",   label: "Damaged / Broken",    icon: "ri-alert-line" },
  { value: "wrong_product",     label: "Wrong Product",       icon: "ri-error-warning-line" },
  { value: "not_as_described",  label: "Not as Described",    icon: "ri-file-unknow-line" },
  { value: "defective_product", label: "Defective / Broken",  icon: "ri-tools-line" },
  { value: "changed_mind",      label: "Changed Mind",        icon: "ri-refresh-line" },
  { value: "other",             label: "Other",               icon: "ri-more-line" },
];

export default function MobileReturnForm({
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
  const [step, setStep] = useState(1); // 1=items, 2=reason
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

  const handleSubmit = () => {
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

  if (loading) {
    return (
      <div className="animate-pulse space-y-4 pb-4">
        <div className="h-7 w-40 rounded bg-slate-200 dark:bg-slate-700" />
        {[1, 2].map((i) => (
          <div key={i} className="h-24 rounded-2xl bg-slate-200 dark:bg-slate-700" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-white p-5 text-[13px] text-red-600 dark:border-red-500/20 dark:bg-gray-900 dark:text-red-400">
        <AlertCircle size={18} />
        {error}
      </div>
    );
  }

  if (submitSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-500/15">
          <CheckCircle2 size={40} className="text-emerald-600 dark:text-emerald-400" />
        </div>
        <h2 className="mb-2 text-[22px] font-bold text-gray-900 dark:text-gray-100">Return Submitted!</h2>
        {lastSubmittedTicket && (
          <p className="mb-1 text-[14px] font-bold text-blue-600 dark:text-blue-400">
            Ticket: {lastSubmittedTicket}
          </p>
        )}
        <p className="mb-8 text-[13px] text-gray-500 dark:text-gray-400">
          We'll review your request and get back to you.
        </p>
        <button
          onClick={() => navigate("/returns")}
          className="mb-3 w-full rounded-2xl bg-blue-600 py-3 text-[14px] font-semibold text-white dark:bg-blue-500"
        >
          View My Returns
        </button>
        <button
          onClick={() => navigate("/purchase-history")}
          className="w-full rounded-2xl border border-gray-200 py-3 text-[14px] font-medium text-gray-700 dark:border-gray-700 dark:text-gray-300"
        >
          Back to Orders
        </button>
      </div>
    );
  }

  return (
    <section className="pb-6">
      {/* Back + Title */}
      <button
        onClick={() => navigate(-1)}
        className="mb-4 flex items-center gap-1 text-[13px] font-medium text-gray-500 dark:text-gray-400"
      >
        <ChevronLeft size={16} /> Back
      </button>

      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-100 dark:bg-orange-500/15">
          <RotateCcw size={20} className="text-orange-600 dark:text-orange-400" />
        </div>
        <div>
          <h1 className="text-[20px] font-bold text-gray-900 dark:text-gray-100">Request Return</h1>
          <p className="text-[11px] text-gray-400">Order #{order?._id?.slice(-6).toUpperCase()}</p>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="mb-6 flex items-center gap-2">
        {[1, 2].map((s) => (
          <React.Fragment key={s}>
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-full text-[12px] font-bold transition ${
                step >= s
                  ? "bg-orange-500 text-white"
                  : "border border-gray-300 bg-white text-gray-400 dark:border-gray-700 dark:bg-gray-900"
              }`}
            >
              {s}
            </div>
            {s < 2 && (
              <div className={`h-0.5 flex-1 rounded ${step > s ? "bg-orange-400" : "bg-gray-200 dark:bg-gray-700"}`} />
            )}
          </React.Fragment>
        ))}
        <div className="ml-3 text-[12px] text-gray-500 dark:text-gray-400">
          {step === 1 ? "Select Items" : "Choose Reason"}
        </div>
      </div>

      {/* Step 1 — Items */}
      {step === 1 && (
        <>
          <h2 className="mb-3 text-[14px] font-bold text-gray-900 dark:text-gray-100">
            Which items are you returning?
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
                  className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-4 transition-all duration-200 ${
                    isSelected
                      ? "border-orange-400 bg-orange-50 dark:border-orange-500/40 dark:bg-orange-500/10"
                      : "border-gray-200 bg-white dark:border-gray-800 dark:bg-[#10141f]"
                  }`}
                >
                  <div className={`h-5 w-5 shrink-0 rounded-md border-2 transition ${
                    isSelected ? "border-orange-500 bg-orange-500" : "border-gray-300 dark:border-gray-600"
                  } flex items-center justify-center`}>
                    {isSelected && <i className="ri-check-line text-[11px] text-white" />}
                  </div>

                  {image ? (
                    <img src={image} alt={name} className="h-14 w-14 rounded-xl object-cover" />
                  ) : (
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
                      <Package size={18} className="text-gray-400" />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <p className="line-clamp-2 text-[13px] font-semibold text-gray-900 dark:text-gray-100">{name}</p>
                    <p className="text-[11px] text-gray-400">Qty ordered: {item.quantity}</p>
                  </div>

                  {isSelected && (
                    <div onClick={(e) => e.stopPropagation()}>
                      <select
                        value={selectedItems[id]?.quantity || 1}
                        onChange={(e) => handleQuantityChange(id, e.target.value)}
                        className="rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-[12px] dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                      >
                        {Array.from({ length: item.quantity }, (_, i) => i + 1).map((n) => (
                          <option key={n} value={n}>×{n}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <button
            onClick={() => setStep(2)}
            disabled={Object.keys(selectedItems).length === 0}
            className="mt-6 w-full rounded-2xl bg-orange-500 py-3 text-[14px] font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50 dark:bg-orange-500"
          >
            Next: Choose Reason →
          </button>
        </>
      )}

      {/* Step 2 — Reason */}
      {step === 2 && (
        <>
          <h2 className="mb-3 text-[14px] font-bold text-gray-900 dark:text-gray-100">
            Why are you returning?
          </h2>
          <div className="grid grid-cols-2 gap-3 mb-5">
            {REASONS.map((r) => {
              const active = selectedReason === r.value;
              return (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setSelectedReason(r.value)}
                  className={`flex flex-col items-center gap-2 rounded-2xl border p-4 text-center transition-all ${
                    active
                      ? "border-orange-400 bg-orange-50 text-orange-700 dark:border-orange-500/40 dark:bg-orange-500/10 dark:text-orange-400"
                      : "border-gray-200 bg-white text-gray-600 dark:border-gray-800 dark:bg-[#10141f] dark:text-gray-400"
                  }`}
                >
                  <i className={`${r.icon} text-[24px]`} />
                  <span className="text-[11px] font-medium leading-tight">{r.label}</span>
                </button>
              );
            })}
          </div>

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Additional details (optional)..."
            rows={3}
            className="mb-4 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-[13px] text-gray-900 outline-none transition focus:border-orange-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
          />

          {submitError && (
            <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-[12px] text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
              <AlertCircle size={14} />
              {submitError}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="rounded-2xl border border-gray-200 py-3 text-[13px] font-medium text-gray-700 dark:border-gray-700 dark:text-gray-300"
            >
              ← Back
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting || !selectedReason}
              className="flex items-center justify-center gap-2 rounded-2xl bg-orange-500 py-3 text-[13px] font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? (
                <><i className="ri-loader-4-line animate-spin" /> Submitting...</>
              ) : (
                <><RotateCcw size={14} /> Submit</>
              )}
            </button>
          </div>
        </>
      )}
    </section>
  );
}
