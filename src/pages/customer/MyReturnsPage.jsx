import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import useIsMobile from "../../hooks/useIsMobile";
import MobileLayout from "../../components/layout/MobileLayout";
import MyReturnsMobile from "../../components/customer/Mobile/MyReturns";
import MyReturnsDesktop from "../../components/customer/Desktop/MyReturns";
import {
  fetchMyReturns,
  selectMyReturns,
  selectMyReturnsMeta,
  selectMyReturnsLoading,
  selectMyReturnsError,
} from "../../store/slices/returnSlice";
import { useState } from "react";

export default function MyReturnsPage() {
  const dispatch = useDispatch();
  const isMobile = useIsMobile(768);

  const returns = useSelector(selectMyReturns);
  const meta    = useSelector(selectMyReturnsMeta);
  const loading = useSelector(selectMyReturnsLoading);
  const error   = useSelector(selectMyReturnsError);

  const [filters, setFilters] = useState({ page: 1, status: "all" });

  useEffect(() => {
    const params = { page: filters.page };
    if (filters.status && filters.status !== "all") {
      params.status = filters.status;
    }
    dispatch(fetchMyReturns(params));
  }, [dispatch, filters.page, filters.status]);

  const handleFilterChange = useCallback((updates) => {
    setFilters((prev) => ({ ...prev, ...updates, page: 1 }));
  }, []);

  const handlePageChange = useCallback((newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  }, []);

  const sharedProps = {
    returns,
    meta,
    loading,
    error,
    filters,
    onFilterChange: handleFilterChange,
    onPageChange: handlePageChange,
  };

  if (isMobile) {
    return (
      <MobileLayout headerProps={{ showDelivery: false }}>
        <MyReturnsMobile {...sharedProps} />
      </MobileLayout>
    );
  }

  return <MyReturnsDesktop {...sharedProps} />;
}
