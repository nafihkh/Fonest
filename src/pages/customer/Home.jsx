import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";
import useIsMobile from "../../hooks/useIsMobile";
import ShopMobileView from "../../components/customer/Mobile/Home";
import ShopDesktopView from "../../components/customer/Desktop/Home";
import MobileLayout from "../../components/layout/MobileLayout";
import {
  fetchShopProducts,
  fetchStoreFilters,
  selectShopProducts,
  selectShopPagination,
  selectStoreBrands,
  selectStoreCategories,
  selectProductsLoadingShop,
  selectProductsErrorShop,
  selectShopSearch,
  selectShopSelectedCategory,
  selectShopSelectedBrand,
  selectShopPriceRange,
  selectShopSortBy,
  selectShopOrder,
  selectCurrentShopPage,
  setShopSearch,
  setShopSelectedCategory,
  setShopSelectedBrand,
  setShopPriceRange,
  setShopSort,
  setShopPage,
  clearShopFilters,
} from "../../store/slices/productSlice";
import {
  fetchHomeProducts,
  selectFeaturedProducts,
  selectLatestProducts,
} from "../../store/slices/productSlice";
import { addToCart } from "../../store/slices/cartSlice";

export default function ShopPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isMobile = useIsMobile(768);

  // Shop-page Redux state (desktop)
  const products = useSelector(selectShopProducts);
  const pagination = useSelector(selectShopPagination);
  const brands = useSelector(selectStoreBrands);
  const categories = useSelector(selectStoreCategories);
  const loading = useSelector(selectProductsLoadingShop);
  const error = useSelector(selectProductsErrorShop);

  const search = useSelector(selectShopSearch);
  const selectedCategory = useSelector(selectShopSelectedCategory);
  const selectedBrand = useSelector(selectShopSelectedBrand);
  const priceRange = useSelector(selectShopPriceRange);
  const sortBy = useSelector(selectShopSortBy);
  const order = useSelector(selectShopOrder);
  const page = useSelector(selectCurrentShopPage);

  // Mobile home-page Redux state
  const featuredProducts = useSelector(selectFeaturedProducts);
  const latestProducts = useSelector(selectLatestProducts);

  // Desktop: fetch shop products whenever filters change
  useEffect(() => {
    if (!isMobile) {
      dispatch(
        fetchShopProducts({
          search,
          category: selectedCategory,
          brand: selectedBrand,
          maxPrice: priceRange,
          sortBy,
          order,
          page,
          limit: 12,
        })
      );
    }
  }, [dispatch, isMobile, search, selectedCategory, selectedBrand, priceRange, sortBy, order, page]);

  // Desktop: fetch filter options once
  useEffect(() => {
    if (!isMobile) {
      dispatch(fetchStoreFilters());
    }
  }, [dispatch, isMobile]);

  // Mobile: fetch home products
  useEffect(() => {
    if (isMobile) {
      dispatch(fetchHomeProducts());
    }
  }, [dispatch, isMobile]);

  const handleSortChange = useCallback(
    (value) => {
      const map = {
        featured: { sortBy: "isFeatured", order: "desc" },
        newest: { sortBy: "createdAt", order: "desc" },
        "price-low": { sortBy: "price", order: "asc" },
        "price-high": { sortBy: "price", order: "desc" },
      };
      dispatch(setShopSort(map[value] || map.featured));
    },
    [dispatch]
  );

  const handleAddToCart = useCallback(
    (product) => {
      dispatch(addToCart({ productId: product._id || product.id, quantity: 1 }));
    },
    [dispatch]
  );

  const handleSearchChange = useCallback(
    (val) => {
      dispatch(setShopSearch(val));
      // If mobile, redirect to search page
      if (isMobile && val.trim()) {
        navigate(`/search?q=${encodeURIComponent(val.trim())}`);
      }
    },
    [dispatch, isMobile, navigate]
  );

  const desktopProps = {
    products,
    pagination,
    brands,
    categories,
    loading,
    error,
    search,
    setSearch: (v) => dispatch(setShopSearch(v)),
    selectedCategory,
    setSelectedCategory: (v) => dispatch(setShopSelectedCategory(v)),
    selectedBrand,
    setSelectedBrand: (v) => dispatch(setShopSelectedBrand(v)),
    priceRange,
    setPriceRange: (v) => dispatch(setShopPriceRange(v)),
    clearFilters: () => dispatch(clearShopFilters()),
    handleSortChange,
    onAddToCart: handleAddToCart,
    page,
    setPage: (v) => dispatch(setShopPage(v)),
  };

  const mobileSharedProps = {
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
          onSearchChange: handleSearchChange,
          showDelivery: false,
        }}
      >
        <ShopMobileView {...mobileSharedProps} />
      </MobileLayout>
    );
  }

  return <ShopDesktopView {...desktopProps} />;
}