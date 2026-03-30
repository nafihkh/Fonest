import React, { useState } from "react";
import {
  ChevronLeft,
  Info,
  Home,
  Building2,
  BriefcaseBusiness,
  MapPin,
  Save,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const locationOptions = [
  { key: "home", label: "Home", icon: Home },
  { key: "apt", label: "Apt", icon: Building2 },
  { key: "work", label: "Work", icon: BriefcaseBusiness },
  { key: "other", label: "Other", icon: MapPin },
];

export default function UpdateDeliveryInstructionsMobile({
  initialData,
  loading = false,
  onSave,
}) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: initialData?.fullName || "Alex Johnson",
    address:
      initialData?.address ||
      "Villa 42, Green Valley Estate, Phase 2, Kochi - 682001",
    locationType: initialData?.locationType || "home",
    saturdayDelivery: initialData?.saturdayDelivery ?? true,
    sundayDelivery: initialData?.sundayDelivery ?? false,
  });

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (onSave) {
      await onSave(form);
      return;
    }
    console.log("Delivery instructions saved:", form);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fb] pb-24 dark:bg-[radial-gradient(circle_at_top,_#1e3a8a_0%,_#111827_35%,_#030712_100%)]">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-[#f8f9fb] px-4 pb-3 pt-4 dark:bg-[#0b1220]/90 dark:backdrop-blur-md">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-gray-800 dark:text-gray-100"
          >
            <ChevronLeft size={18} />
          </button>

          <h1 className="text-[16px] font-semibold text-gray-900 dark:text-gray-100">
            Delivery Instructions
          </h1>
        </div>
      </div>

      <div className="space-y-4 px-4">
        {/* Info banner */}
        <div className="rounded-2xl bg-[#eaf3ff] px-4 py-3 dark:border dark:border-blue-500/20 dark:bg-blue-500/10">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-white text-blue-500 shadow-sm dark:bg-gray-900 dark:text-blue-400">
              <Info size={16} />
            </div>

            <div>
              <p className="text-[13px] font-semibold text-blue-600 dark:text-blue-400">
                Refining your delivery
              </p>
              <p className="mt-1 text-[11px] leading-4 text-gray-500 dark:text-gray-400">
                This helps our drivers find your door faster.
              </p>
            </div>
          </div>
        </div>

        {/* Recipient Info */}
        <div>
          <h2 className="mb-3 text-[13px] font-semibold text-gray-900 dark:text-gray-100">
            Recipient Info
          </h2>

          <div className="rounded-3xl bg-white p-4 shadow-sm dark:border dark:border-gray-800 dark:bg-gray-900">
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-[10px] font-bold uppercase tracking-wide text-gray-400 dark:text-gray-500">
                  Full Name
                </label>
                <input
                  type="text"
                  value={form.fullName}
                  onChange={(e) => handleChange("fullName", e.target.value)}
                  className="w-full rounded-2xl border border-gray-100 bg-[#fafafa] px-4 py-3 text-[13px] text-gray-800 outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-[10px] font-bold uppercase tracking-wide text-gray-400 dark:text-gray-500">
                  Delivery Address
                </label>

                <div className="rounded-2xl border border-gray-100 bg-[#fafafa] px-4 py-3 dark:border-gray-700 dark:bg-gray-800">
                  <div className="flex items-start gap-3">
                    <MapPin
                      size={15}
                      className="mt-0.5 text-gray-400 dark:text-gray-500"
                    />
                    <textarea
                      rows={3}
                      value={form.address}
                      onChange={(e) => handleChange("address", e.target.value)}
                      className="w-full resize-none bg-transparent text-[13px] leading-5 text-gray-700 outline-none dark:text-gray-300"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Where are we delivering */}
        <div>
          <h2 className="mb-3 text-[13px] font-semibold text-gray-900 dark:text-gray-100">
            Where are we delivering?
          </h2>

          <div className="grid grid-cols-4 gap-3">
            {locationOptions.map((item) => {
              const Icon = item.icon;
              const active = form.locationType === item.key;

              return (
                <button
                  key={item.key}
                  onClick={() => handleChange("locationType", item.key)}
                  className={`flex flex-col items-center rounded-2xl border px-2 py-4 transition ${
                    active
                      ? "border-blue-500 bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
                      : "border-gray-200 bg-white text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400"
                  }`}
                >
                  <Icon size={18} />
                  <span className="mt-2 text-[11px] font-medium">
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Weekend preferences */}
        <div>
          <h2 className="mb-3 text-[13px] font-semibold text-gray-900 dark:text-gray-100">
            Weekend Preferences
          </h2>

          <div className="rounded-3xl bg-white p-4 shadow-sm dark:border dark:border-gray-800 dark:bg-gray-900">
            <div className="space-y-4">
              <label className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[13px] font-semibold text-gray-900 dark:text-gray-100">
                    Saturday Delivery
                  </p>
                  <p className="mt-1 text-[11px] leading-4 text-gray-400 dark:text-gray-500">
                    Deliver any Saturday if the package arrives that day.
                  </p>
                </div>

                <input
                  type="checkbox"
                  checked={form.saturdayDelivery}
                  onChange={(e) =>
                    handleChange("saturdayDelivery", e.target.checked)
                  }
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-blue-400"
                />
              </label>

              <div className="border-t border-gray-100 dark:border-gray-800" />

              <label className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[13px] font-semibold text-gray-900 dark:text-gray-100">
                    Sunday Delivery
                  </p>
                  <p className="mt-1 text-[11px] leading-4 text-gray-400 dark:text-gray-500">
                    Deliver on Sunday. Best for home addresses.
                  </p>
                </div>

                <input
                  type="checkbox"
                  checked={form.sundayDelivery}
                  onChange={(e) =>
                    handleChange("sundayDelivery", e.target.checked)
                  }
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-blue-400"
                />
              </label>

              <div className="rounded-2xl bg-[#fafafa] px-3 py-3 dark:bg-gray-800">
                <p className="text-[10px] leading-4 text-gray-400 dark:text-gray-500">
                  Your preferences will be applied to future eligible orders.
                  Not all items or shipping tiers qualify.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom save button */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-[#f8f9fb] px-4 pb-5 pt-3 dark:bg-[#0b1220]/95 dark:backdrop-blur-md">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-500 py-3.5 text-[14px] font-semibold text-white shadow-sm transition disabled:opacity-60 dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          <Save size={16} />
          {loading ? "Saving..." : "Save Delivery Instructions"}
        </button>
      </div>
    </div>
  );
}