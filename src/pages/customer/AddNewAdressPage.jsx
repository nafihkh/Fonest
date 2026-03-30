import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import AddNewAddressMobile from "../../components/customer/Mobile/AddNewAddressMobile";
import MobileLayout from "../../components/layout/MobileLayout";
import {
  addAddress,
  selectAddressSaving,
} from "../../store/slices/profileSlice";

export default function AddNewAddressPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector(selectAddressSaving);
  const [search, setSearch] = useState("");

  const handleSubmit = async (formData) => {
    const result = await dispatch(addAddress(formData));
    if (addAddress.fulfilled.match(result)) {
      navigate("/profile/addresses");
    }
  };

  return (
    <MobileLayout
        headerProps={{
                searchValue: search,
                onSearchChange: setSearch,
                showDelivery: false,
            }}
    > 

        <AddNewAddressMobile
        loading={loading}
        onSubmit={handleSubmit}
        />
    </MobileLayout>
  );
}