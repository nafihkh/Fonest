import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  Navigation,
  Plus,
  Home,
  Building2,
  X,
  Check,
} from "lucide-react";

export default function AddressBottomSheet({
  open,
  onClose,
  addresses = [],
  selectedAddressId,
  onSelectAddress,
  onAddAddress,
  onEnterPincode,
  onUseCurrentLocation,
}) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const navigate = useNavigate();

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.div
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-black/40"
          />

          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed bottom-0 left-0 right-0 z-[120] border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-[#0f1117]"
            style={{
              height: "42vh",
            }}
          >
            <div className="flex items-start justify-between px-4 pt-3">
              <div>
                <h2 className="text-[18px] font-bold text-gray-900 dark:text-white">
                  Choose your location
                </h2>
                <p className="max-w-[280px] text-[12px] leading-5 text-gray-500 dark:text-gray-400">
                  Select a delivery location to see product availability and
                  delivery options
                </p>
              </div>

              <button
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600 dark:bg-[#1b1f2a] dark:text-gray-300"
              >
                <X size={16} />
              </button>
            </div>

            <div className="mt-4 h-[calc(100%-92px)] overflow-y-auto px-4 pb-4">
              <div className="mb-4 overflow-x-auto no-scrollbar">
                <div className="flex gap-2">
                  {addresses.map((address) => {
                    const selected =
                      selectedAddressId === address._id || address.isDefault;

                    return (
                      <button
                        key={address._id}
                        onClick={() => onSelectAddress?.(address)}
                        className={`
                          relative min-h-[150px] w-[190px] shrink-0 rounded-2xl border px-3 py-3 text-left shadow-sm transition-all
                          ${
                            selected
                              ? "border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-[#111827]"
                              : "border-gray-200 bg-white dark:border-gray-800 dark:bg-[#121622]"
                          }
                        `}
                      >
                        {selected ? (
                          <div className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-white dark:bg-blue-400">
                            <Check size={12} />
                          </div>
                        ) : null}

                        <div className="mb-3 flex items-center gap-2">
                          <div
                            className={`
                              flex h-6 w-6 items-center justify-center rounded-lg
                              ${
                                selected
                                  ? "bg-blue-500 text-white dark:bg-blue-400"
                                  : "bg-gray-100 text-gray-600 dark:bg-[#1b1f2a] dark:text-gray-300"
                              }
                            `}
                          >
                            {address.type === "work" ? (
                              <Building2 size={12} />
                            ) : (
                              <Home size={12} />
                            )}
                          </div>

                          <div>
                            <p className="line-clamp-1 text-[13px] font-semibold text-gray-900 dark:text-white">
                              {address.fullName}
                            </p>
                            <p className="text-[10px] capitalize text-gray-500 dark:text-gray-400">
                              {address.type || "home"}
                            </p>
                          </div>
                        </div>

                        <p className="line-clamp-4 text-[12px] leading-5 text-gray-600 dark:text-gray-300">
                          {address.addressLine1}
                          {address.addressLine2
                            ? `, ${address.addressLine2}`
                            : ""}
                          , {address.city}, {address.state} {address.pincode}
                        </p>
                      </button>
                    );
                  })}

                  <button
                    onClick={() => navigate(`/profile/addresses`)}
                    className="flex min-h-[140px] w-[140px] shrink-0 flex-col items-center justify-center rounded-2xl border border-dashed border-blue-300 bg-blue-50 px-3 py-3 text-center shadow-sm dark:border-blue-500/40 dark:bg-[#111827]"
                  >
                    <div className="mb-2 flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-white dark:bg-blue-400">
                      <Plus size={12} />
                    </div>

                    <p className="text-[10px] font-semibold text-blue-600 dark:text-blue-300">
                      Add new address
                    </p>
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <button
                  onClick={onEnterPincode}
                  className="flex w-full items-center gap-3 rounded-2xl px-2 py-1 transition hover:bg-gray-50 dark:hover:bg-[#171b26]"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-300">
                    <MapPin size={12} />
                  </div>

                  <span className="text-[14px] font-medium text-blue-600 dark:text-blue-300">
                    Enter an Indian pincode
                  </span>
                </button>

                <button
                  onClick={onUseCurrentLocation}
                  className="flex w-full items-center gap-3 rounded-2xl px-2 py-1 transition hover:bg-gray-50 dark:hover:bg-[#171b26]"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-300">
                    <Navigation size={12} />
                  </div>

                  <span className="text-[14px] font-medium text-blue-600 dark:text-blue-300">
                    Use my current location
                  </span>
                </button>
              </div>
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
