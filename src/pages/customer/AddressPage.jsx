import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useIsMobile from "../../hooks/useIsMobile";
import AddressPageMobile from "../../components/customer/Mobile/AddressPageMobile";
import MobileLayout from "../../components/layout/MobileLayout";
import SiteHeader from "../../components/layout/SiteHeader";
import SiteFooter from "../../components/layout/SiteFooter";
import {
  fetchMyAddresses,
  selectProfileAddresses,
  selectAddressesLoading,
  selectAddressesError,
  deleteAddress,
  setDefaultAddress,
} from "../../store/slices/profileSlice";

export default function AddressPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isMobile = useIsMobile(768);

  const addresses = useSelector(selectProfileAddresses);
  const loading = useSelector(selectAddressesLoading);
  const error = useSelector(selectAddressesError);
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(fetchMyAddresses());
  }, [dispatch]);

  const handleAddNew = () => navigate("/profile/addresses/new");
  const handleRemove = (address) => dispatch(deleteAddress(address._id));
  const handleSetDefault = (address) => dispatch(setDefaultAddress(address._id));

  if (isMobile) {
    return (
      <MobileLayout
        headerProps={{
          searchValue: search,
          onSearchChange: setSearch,
          showDelivery: false,
        }}
      >
        <AddressPageMobile
          addresses={addresses}
          loading={loading}
          error={error}
          onAddNew={handleAddNew}
          onEdit={(address) => navigate(`/profile/addresses/edit/${address._id}`)}
          onRemove={handleRemove}
        />
      </MobileLayout>
    );
  }

  // Desktop view
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0b1120]">
      <SiteHeader />
      <div className="mx-auto max-w-3xl px-6 pb-20 pt-28">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Saved Addresses
            </h1>
            <p className="mt-1 text-[15px] text-gray-500 dark:text-gray-400">
              Manage your delivery addresses
            </p>
          </div>
          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-[14px] font-semibold text-white shadow-md transition-all hover:bg-blue-700 hover:shadow-lg dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            <i className="ri-add-line text-[16px]" />
            Add New Address
          </button>
        </div>

        {loading && (
          <div className="grid place-items-center py-20 text-gray-400">
            <i className="ri-loader-4-line animate-spin text-[36px]" />
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-red-100 bg-red-50 px-6 py-4 text-[14px] text-red-600 dark:border-red-800/30 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}

        {!loading && !error && addresses?.length === 0 && (
          <div className="rounded-2xl border border-gray-100 bg-white py-20 text-center dark:border-gray-800 dark:bg-gray-900">
            <i className="ri-map-pin-line mb-4 text-[48px] text-gray-300 dark:text-gray-600" />
            <p className="text-[15px] font-semibold text-gray-600 dark:text-gray-400">
              No addresses saved yet
            </p>
            <button
              onClick={handleAddNew}
              className="mt-4 rounded-xl bg-blue-600 px-6 py-2.5 text-[14px] font-medium text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              Add Your First Address
            </button>
          </div>
        )}

        <div className="space-y-4">
          {(addresses || []).map((addr) => (
            <div
              key={addr._id}
              className="group rounded-2xl border border-gray-100 bg-white p-6 transition-all hover:border-blue-200 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-blue-500/30"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-500/10">
                    <i className="ri-map-pin-2-line text-[20px] text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <div className="mb-1 flex items-center gap-2">
                      <span className="text-[15px] font-semibold text-gray-900 dark:text-gray-100">
                        {addr.fullName}
                      </span>
                      <span className="rounded-full border border-gray-200 px-2 py-0.5 text-[11px] font-medium capitalize text-gray-500 dark:border-gray-700 dark:text-gray-400">
                        {addr.type || "home"}
                      </span>
                      {addr.isDefault && (
                        <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[11px] font-semibold text-blue-600 dark:bg-blue-500/20 dark:text-blue-300">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-[14px] text-gray-600 dark:text-gray-400">
                      {[addr.addressLine1, addr.addressLine2, addr.city, addr.state, addr.pincode]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                  {!addr.isDefault && (
                    <button
                      onClick={() => handleSetDefault(addr)}
                      className="rounded-lg border border-gray-200 px-3 py-1.5 text-[12px] font-medium text-gray-600 transition hover:border-blue-300 hover:text-blue-600 dark:border-gray-700 dark:text-gray-400 dark:hover:border-blue-500 dark:hover:text-blue-400"
                    >
                      Set Default
                    </button>
                  )}
                  <button
                    onClick={() => handleRemove(addr)}
                    className="rounded-lg p-1.5 text-gray-400 transition hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                    aria-label="Delete address"
                  >
                    <i className="ri-delete-bin-line text-[16px]" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}