import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import useIsMobile from "../../hooks/useIsMobile";
import PurchaseHistoryMobileView from "../../components/customer/Mobile/PurchaseHistory";
import PurchaseHistoryDesktopView from "../../components/customer/Desktop/PurchaseHistory";
import MobileLayout from "../../components/layout/MobileLayout";
import {
  fetchMyOrders,
  setMyOrdersFilters,
  selectMyOrders,
  selectMyOrdersMeta,
  selectMyOrdersLoading,
  selectMyOrdersError,
  selectMyOrdersFilters,
} from "../../store/slices/orderSlice";

export default function PurchaseHistoryPage() {
  const dispatch = useDispatch();
  const isMobile = useIsMobile(768);

  const orders = useSelector(selectMyOrders);
  const meta = useSelector(selectMyOrdersMeta);
  const loading = useSelector(selectMyOrdersLoading);
  const error = useSelector(selectMyOrdersError);
  const filters = useSelector(selectMyOrdersFilters);

  // Fetch whenever filters change
  useEffect(() => {
    const params = {};
    if (filters.page) params.page = filters.page;
    if (filters.status && filters.status !== "all") params.status = filters.status;
    if (filters.month) params.month = filters.month;
    if (filters.year) params.year = filters.year;
    dispatch(fetchMyOrders(params));
  }, [dispatch, filters.page, filters.status, filters.month, filters.year]);

  const handleFilterChange = useCallback(
    (updates) => {
      // Any filter change resets to page 1
      dispatch(setMyOrdersFilters({ ...updates, page: 1 }));
    },
    [dispatch]
  );

  const handlePageChange = useCallback(
    (newPage) => {
      dispatch(setMyOrdersFilters({ page: newPage }));
    },
    [dispatch]
  );

  const sharedProps = {
    orders,
    meta,
    loading,
    error,
    filters,
    onFilterChange: handleFilterChange,
    onPageChange: handlePageChange,
  };

  if (isMobile) {
    return (
      <MobileLayout
        headerProps={{
          showDelivery: false,
        }}
      >
        <PurchaseHistoryMobileView {...sharedProps} />
      </MobileLayout>
    );
  }

  return <PurchaseHistoryDesktopView {...sharedProps} />;
}