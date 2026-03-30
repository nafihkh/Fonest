import React from "react";
import {
  ChevronLeft,
  MapPin,
  Phone,
  Pencil,
  Trash2,
  Plus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function AddressCard({ address, onEdit, onRemove }) {
  return (
    <div className="rounded-3xl bg-white p-4 shadow-sm dark:border dark:border-gray-800 dark:bg-gray-900">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-[15px] font-bold text-gray-900 dark:text-gray-100">
              {address.fullName}
            </h3>

            {address.isDefault ? (
              <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                Default
              </span>
            ) : null}
          </div>

          <p className="mt-1 text-[11px] font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">
            {address.label || "Personal Address"}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-start gap-2">
          <MapPin size={14} className="mt-0.5 text-gray-400 dark:text-gray-500" />
          <p className="text-[13px] leading-5 text-gray-600 dark:text-gray-300">
            {address.line1}
            {address.line2 ? `, ${address.line2}` : ""}
            {address.landmark ? `, ${address.landmark}` : ""}
            {address.city ? `, ${address.city}` : ""}
            {address.state ? `, ${address.state}` : ""}
            {address.pincode ? ` - ${address.pincode}` : ""}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Phone size={14} className="text-gray-400 dark:text-gray-500" />
          <p className="text-[13px] text-gray-600 dark:text-gray-300">
            {address.phone}
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <button
          onClick={() => onEdit(address)}
          className="flex items-center justify-center gap-2 rounded-2xl border border-gray-200 py-3 text-[13px] font-semibold text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
        >
          <Pencil size={14} />
          Edit
        </button>

        <button
          onClick={() => onRemove(address)}
          className="flex items-center justify-center gap-2 rounded-2xl border border-red-100 bg-red-50 py-3 text-[13px] font-semibold text-red-500 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400"
        >
          <Trash2 size={14} />
          Remove
        </button>
      </div>
    </div>
  );
}

export default function AddressPageMobile({
  addresses = [],
  loading,
  error,
  onAddNew,
  onEdit,
  onRemove,
}) {
  const navigate = useNavigate();

  return (
    <>
      <div className="sticky top-0 z-20 bg-[#f8f9fb] px-4 pb-3 pt-4 dark:bg-[#0b1220]/90 dark:backdrop-blur-md">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-gray-800 dark:text-gray-100"
          >
            <ChevronLeft size={18} />
          </button>

          <h1 className="text-[16px] font-semibold text-gray-900 dark:text-gray-100">
            Your Addresses
          </h1>
        </div>
      </div>

      <div className="space-y-4 px-4">
        <button
          onClick={onAddNew}
          className="flex w-full items-center justify-center gap-2 rounded-3xl bg-blue-500 py-4 text-[14px] font-semibold text-white shadow-sm transition dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          <Plus size={16} />
          Add New Address
        </button>

        <div>
          <h2 className="mb-3 text-[13px] font-semibold text-gray-900 dark:text-gray-100">
            Saved in this app
          </h2>

          {loading ? (
            <div className="rounded-3xl bg-white p-5 text-center text-gray-500 shadow-sm dark:border dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400">
              Loading addresses...
            </div>
          ) : error ? (
            <div className="rounded-3xl bg-white p-5 text-center text-red-500 shadow-sm dark:border dark:border-gray-800 dark:bg-gray-900 dark:text-red-400">
              {error}
            </div>
          ) : addresses.length === 0 ? (
            <div className="rounded-3xl bg-white p-6 text-center shadow-sm dark:border dark:border-gray-800 dark:bg-gray-900">
              <p className="text-[14px] font-semibold text-gray-900 dark:text-gray-100">
                No saved address
              </p>
              <p className="mt-1 text-[12px] text-gray-500 dark:text-gray-400">
                Add your first address to continue faster checkout.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {addresses.map((address) => (
                <AddressCard
                  key={address._id}
                  address={address}
                  onEdit={onEdit}
                  onRemove={onRemove}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}