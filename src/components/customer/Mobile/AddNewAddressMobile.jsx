import React, { useState } from "react";
import { ChevronLeft, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AddNewAddressMobile({
  initialData = null,
  loading = false,
  onSubmit,
}) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    label: initialData?.label || "home",
    fullName: initialData?.fullName || "",
    phone: initialData?.phone || "",
    line1: initialData?.line1 || "",
    line2: initialData?.line2 || "",
    landmark: initialData?.landmark || "",
    city: initialData?.city || "",
    state: initialData?.state || "",
    pincode: initialData?.pincode || "",
    isDefault: initialData?.isDefault || false,
  });

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (onSubmit) {
      await onSubmit(form);
    }
  };

  return (
    <>
      <div className="sticky top-0 z-20 bg-[#f8f9fb] px-4 pb-3 pt-4 dark:bg-[#0b1220]/90 dark:backdrop-blur-md">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-800 dark:text-gray-100"
          >
            <ChevronLeft size={18} />
          </button>

          <h1 className="text-[16px] font-semibold text-gray-900 dark:text-gray-100">
            Add New Address
          </h1>
        </div>
      </div>

      <div className="space-y-4 px-4">
        <div className="rounded-3xl bg-white p-4 shadow-sm dark:border dark:border-gray-800 dark:bg-gray-900">
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-[11px] font-semibold text-gray-500 dark:text-gray-400">
                Full Name
              </label>
              <input
                value={form.fullName}
                onChange={(e) => handleChange("fullName", e.target.value)}
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-[14px] text-gray-900 outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500"
                placeholder="Enter full name"
              />
            </div>

            <div>
              <label className="mb-2 block text-[11px] font-semibold text-gray-500 dark:text-gray-400">
                Phone Number
              </label>
              <input
                value={form.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-[14px] text-gray-900 outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500"
                placeholder="Enter phone number"
              />
            </div>

            <div>
              <label className="mb-2 block text-[11px] font-semibold text-gray-500 dark:text-gray-400">
                Address Line 1
              </label>
              <input
                value={form.line1}
                onChange={(e) => handleChange("line1", e.target.value)}
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-[14px] text-gray-900 outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500"
                placeholder="House no, street"
              />
            </div>

            <div>
              <label className="mb-2 block text-[11px] font-semibold text-gray-500 dark:text-gray-400">
                Address Line 2
              </label>
              <input
                value={form.line2}
                onChange={(e) => handleChange("line2", e.target.value)}
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-[14px] text-gray-900 outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500"
                placeholder="Area, locality"
              />
            </div>

            <div>
              <label className="mb-2 block text-[11px] font-semibold text-gray-500 dark:text-gray-400">
                Landmark
              </label>
              <input
                value={form.landmark}
                onChange={(e) => handleChange("landmark", e.target.value)}
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-[14px] text-gray-900 outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500"
                placeholder="Nearby landmark"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-2 block text-[11px] font-semibold text-gray-500 dark:text-gray-400">
                  City
                </label>
                <input
                  value={form.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-[14px] text-gray-900 outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500"
                  placeholder="City"
                />
              </div>

              <div>
                <label className="mb-2 block text-[11px] font-semibold text-gray-500 dark:text-gray-400">
                  State
                </label>
                <input
                  value={form.state}
                  onChange={(e) => handleChange("state", e.target.value)}
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-[14px] text-gray-900 outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500"
                  placeholder="State"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-[11px] font-semibold text-gray-500 dark:text-gray-400">
                Pincode
              </label>
              <input
                value={form.pincode}
                onChange={(e) => handleChange("pincode", e.target.value)}
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-[14px] text-gray-900 outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500"
                placeholder="Pincode"
              />
            </div>

            <div>
              <label className="mb-2 block text-[11px] font-semibold text-gray-500 dark:text-gray-400">
                Label
              </label>
              <select
                value={form.label}
                onChange={(e) => handleChange("label", e.target.value)}
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-[14px] text-gray-900 outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              >
                <option value="home">Home</option>
                <option value="office">Office</option>
                <option value="other">Other</option>
                <option value="pickup">Pickup</option>
              </select>
            </div>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={form.isDefault}
                onChange={(e) => handleChange("isDefault", e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-blue-400"
              />
              <span className="text-[13px] text-gray-700 dark:text-gray-300">
                Set as default address
              </span>
            </label>
          </div>
        </div>
      </div>

      <div className="bg-[#f8f9fb] px-4 pb-5 pt-3 dark:bg-[#0b1220]/95 dark:backdrop-blur-md">
        <button
          onClick={handleSave}
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-500 py-3.5 text-[14px] font-semibold text-white transition disabled:opacity-60 dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          <Save size={16} />
          {loading ? "Saving..." : "Save Address"}
        </button>
      </div>
    </>
  );
}