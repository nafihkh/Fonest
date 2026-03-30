import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import AddressBottomSheet from "./ui/AddressBottomSheet";
import {
  fetchMyAddresses,
  selectProfileAddresses,
  selectAddressesLoading,
  selectAddressesError,
  setDefaultAddress,
} from "../store/slices/profileSlice";

export default function AddressBottomSheetContainer({
  open,
  onClose,
  onAddAddress,
  onEnterPincode,
  onUseCurrentLocation,
}) {
  const dispatch = useDispatch();

  const addresses = useSelector(selectProfileAddresses);
  const loading = useSelector(selectAddressesLoading);
  const error = useSelector(selectAddressesError);

  useEffect(() => {
    if (open) {
      dispatch(fetchMyAddresses());
    }
  }, [dispatch, open]);

  const selectedAddress = useMemo(() => {
    if (!addresses?.length) return null;

    return (
      addresses.find((item) => item.isDefault) ||
      addresses[0]
    );
  }, [addresses]);

  const selectedAddressId = selectedAddress?._id;

  const normalizedAddresses = useMemo(() => {
    return (addresses || []).map((item) => ({
      _id: item._id,
      fullName: item.fullName || item.name || "Customer",
      type: item.type || "home",
      addressLine1: item.addressLine1 || item.line1 || "",
      addressLine2: item.addressLine2 || item.line2 || "",
      city: item.city || "",
      state: item.state || "",
      pincode: item.pincode || "",
      isDefault: !!item.isDefault,
    }));
  }, [addresses]);

  const handleSelectAddress = async (address) => {
    if (!address?._id) return;

    try {
      await dispatch(setDefaultAddress(address._id)).unwrap();
      onClose?.();
    } catch (err) {
      console.error("Failed to set default address:", err);
    }
  };

  return (
    <>
      <AddressBottomSheet
        open={open}
        onClose={onClose}
        addresses={normalizedAddresses}
        selectedAddressId={selectedAddressId}
        onSelectAddress={handleSelectAddress}
        onAddAddress={onAddAddress}
        onEnterPincode={onEnterPincode}
        onUseCurrentLocation={onUseCurrentLocation}
      />

      {open && loading ? (
        <div className="fixed bottom-[76px] left-1/2 z-[140] -translate-x-1/2 rounded-full bg-black/70 px-3 py-1 text-xs text-white">
          Loading addresses...
        </div>
      ) : null}

      {open && error ? (
        <div className="fixed bottom-[76px] left-1/2 z-[140] -translate-x-1/2 rounded-full bg-red-600 px-3 py-1 text-xs text-white">
          {error}
        </div>
      ) : null}
    </>
  );
}