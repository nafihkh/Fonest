import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import useIsMobile from "../../hooks/useIsMobile";
import AddNewAddressMobile from "../../components/customer/Mobile/AddNewAddressMobile";
import MobileLayout from "../../components/layout/MobileLayout";
import SiteHeader from "../../components/layout/SiteHeader";
import SiteFooter from "../../components/layout/SiteFooter";
import {
  addAddress,
  selectAddressSaving,
} from "../../store/slices/profileSlice";

const FIELDS = [
  { key: "fullName", label: "Full Name", placeholder: "Enter full name", col: 2 },
  { key: "phone", label: "Phone Number", placeholder: "Enter phone number", col: 2 },
  { key: "line1", label: "Address Line 1", placeholder: "House no, building, street", col: 2 },
  { key: "line2", label: "Address Line 2", placeholder: "Area, locality (optional)", col: 2 },
  { key: "landmark", label: "Landmark", placeholder: "Nearby landmark (optional)", col: 2 },
  { key: "city", label: "City", placeholder: "City", col: 1 },
  { key: "state", label: "State", placeholder: "State", col: 1 },
  { key: "pincode", label: "Pincode", placeholder: "Pincode", col: 1 },
];

export default function AddNewAddressPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isMobile = useIsMobile(768);
  const loading = useSelector(selectAddressSaving);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    label: "home",
    fullName: "",
    phone: "",
    line1: "",
    line2: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
    isDefault: false,
  });

  const handleChange = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (formData) => {
    const result = await dispatch(addAddress(formData || form));
    if (addAddress.fulfilled.match(result)) {
      navigate("/profile/addresses");
    }
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
        <AddNewAddressMobile loading={loading} onSubmit={handleSubmit} />
      </MobileLayout>
    );
  }

  // Desktop view
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0b1120]">
      <SiteHeader />
      <div className="mx-auto max-w-2xl px-6 pb-20 pt-28">
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="mb-4 flex items-center gap-1 text-[14px] text-gray-500 transition hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <i className="ri-arrow-left-line" /> Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Add New Address
          </h1>
          <p className="mt-1 text-[15px] text-gray-500 dark:text-gray-400">
            Fill in your delivery details
          </p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="grid grid-cols-2 gap-5">
            {FIELDS.map((f) => (
              <div
                key={f.key}
                className={f.col === 2 ? "col-span-2" : "col-span-1"}
              >
                <label className="mb-1.5 block text-[13px] font-semibold text-gray-600 dark:text-gray-400">
                  {f.label}
                </label>
                <input
                  value={form[f.key]}
                  onChange={(e) => handleChange(f.key, e.target.value)}
                  placeholder={f.placeholder}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-[14px] text-gray-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-blue-500 dark:focus:bg-gray-800"
                />
              </div>
            ))}

            <div className="col-span-2">
              <label className="mb-1.5 block text-[13px] font-semibold text-gray-600 dark:text-gray-400">
                Address Type
              </label>
              <div className="flex gap-3">
                {["home", "office", "other", "pickup"].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleChange("label", type)}
                    className={`rounded-xl border px-4 py-2 text-[13px] font-medium capitalize transition ${
                      form.label === type
                        ? "border-blue-500 bg-blue-50 text-blue-600 dark:bg-blue-500/20 dark:text-blue-300"
                        : "border-gray-200 text-gray-600 hover:border-gray-300 dark:border-gray-700 dark:text-gray-400"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="col-span-2">
              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={form.isDefault}
                  onChange={(e) => handleChange("isDefault", e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 accent-blue-600 dark:border-gray-600"
                />
                <span className="text-[14px] text-gray-700 dark:text-gray-300">
                  Set as my default address
                </span>
              </label>
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 rounded-xl border border-gray-200 py-3 text-[14px] font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => handleSubmit()}
              disabled={loading}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-[14px] font-semibold text-white shadow-md transition hover:bg-blue-700 disabled:opacity-60 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              <i className="ri-save-line text-[16px]" />
              {loading ? "Saving..." : "Save Address"}
            </button>
          </div>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}