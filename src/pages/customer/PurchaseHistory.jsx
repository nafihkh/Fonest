import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useIsMobile from "../../hooks/useIsMobile";
import PurchaseHistoryMobileView from "../../components/customer/Mobile/PurchaseHistory";
import PurchaseHistoryDesktopView from "../../components/customer/Desktop/PurchaseHistory";
import MobileLayout from "../../components/layout/MobileLayout";
import {
  fetchMyOrders,
  selectMyOrders,
  selectMyOrdersLoading,
  selectMyOrdersError,
} from "../../store/slices/orderSlice";

export default function PurchaseHistoryPage() {
  const dispatch = useDispatch();
  const isMobile = useIsMobile(768);
  const [search, setSearch] = useState("");

  const orders = useSelector(selectMyOrders);
  const loading = useSelector(selectMyOrdersLoading);
  const error = useSelector(selectMyOrdersError);

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  const sharedProps = {
    orders,
    loading,
    error,
    search,
    setSearch,
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
        <PurchaseHistoryMobileView {...sharedProps} />
      </MobileLayout>
    );
  }

  return <PurchaseHistoryDesktopView {...sharedProps} />;
}