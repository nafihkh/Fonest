import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import useIsMobile from "../../hooks/useIsMobile";
import useDebounce from "../../hooks/useDebounce";
import ShopMobileView from "../../components/customer/Mobile/Home";
import ShopDesktopView from "../../components/customer/Desktop/Home";
import MobileLayout from "../../components/layout/MobileLayout";
import {
  fetchHomeProducts,
  selectLatestProducts,
  selectFeaturedProducts,
  selectProductsLoadingHome,
  selectProductsErrorHome,
} from "../../store/slices/productSlice";

export default function ShopPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isMobile = useIsMobile(768);

  const featuredProducts = useSelector(selectFeaturedProducts);
  const latestProducts = useSelector(selectLatestProducts);
  const loading = useSelector(selectProductsLoadingHome);
  const error = useSelector(selectProductsErrorHome);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 400);

  useEffect(() => {
    dispatch(fetchHomeProducts());
  }, [dispatch]);

  useEffect(() => {
    const q = debouncedSearch.trim();
    if (q) {
      navigate(`/search?q=${encodeURIComponent(q)}`);
    }
  }, [debouncedSearch, navigate]);

  const sharedProps = {
    deals: featuredProducts,
    recommendedProducts: latestProducts,
    loading,
    error,
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
        <ShopMobileView {...sharedProps} />
      </MobileLayout>
    );
  }

  return <ShopDesktopView {...sharedProps} />;
}