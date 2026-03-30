import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddressPageMobile from "../../components/customer/Mobile/AddressPageMobile";
import MobileLayout from "../../components/layout/MobileLayout";
import {
  fetchMyAddresses,
  selectProfileAddresses,
  selectAddressesLoading,
  selectAddressesError,
  deleteAddress,
} from "../../store/slices/profileSlice";

export default function AddressPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const addresses = useSelector(selectProfileAddresses);
  const loading = useSelector(selectAddressesLoading);
  const error = useSelector(selectAddressesError);
  const [search, setSearch] = useState("");


  useEffect(() => {
    dispatch(fetchMyAddresses());
  }, [dispatch]);

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
      onAddNew={() => navigate("/profile/addresses/new")}
      onEdit={(address) => navigate(`/profile/addresses/edit/${address._id}`)}
      onRemove={(address) => dispatch(deleteAddress(address._id))}
    />
    </MobileLayout>
  );
}