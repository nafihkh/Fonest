import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useIsMobile from "../../hooks/useIsMobile";
import useDebounce from "../../hooks/useDebounce";
import ShopMobileView from "../../components/customer/Mobile/Home";
import ShopDesktopView from "../../components/customer/Desktop/Home";
import {
  fetchShopProducts,
  fetchStoreFilters,
  selectShopProducts,
  selectShopPagination,
  selectStoreBrands,
  selectStoreCategories,
  selectProductsLoadingShop,
  selectProductsErrorShop,
} from "../../store/slices/productSlice";

export default function ShopPage() {
  const dispatch = useDispatch();
  const isMobile = useIsMobile(768);

  const products = useSelector(selectShopProducts);
  const pagination = useSelector(selectShopPagination);
  const brands = useSelector(selectStoreBrands);
  const categories = useSelector(selectStoreCategories);
  const loading = useSelector(selectProductsLoadingShop);
  const error = useSelector(selectProductsErrorShop);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [priceRange, setPriceRange] = useState(200000);
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(search, 400);

  useEffect(() => {
    dispatch(fetchStoreFilters());
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      fetchShopProducts({
        search: debouncedSearch,
        category: selectedCategory,
        brand: selectedBrand,
        minPrice: 0,
        maxPrice: priceRange,
        sortBy,
        order,
        page,
        limit: 12,
      })
    );
  }, [
    dispatch,
    debouncedSearch,
    selectedCategory,
    selectedBrand,
    priceRange,
    sortBy,
    order,
    page,
  ]);

  const handleSortChange = (value) => {
    if (value === "price-low") {
      setSortBy("price");
      setOrder("asc");
    } else if (value === "price-high") {
      setSortBy("price");
      setOrder("desc");
    } else if (value === "newest") {
      setSortBy("createdAt");
      setOrder("desc");
    } else {
      setSortBy("createdAt");
      setOrder("desc");
    }
    setPage(1);
  };


  const clearFilters = () => {
    setSearch("");
    setSelectedCategory("");
    setSelectedBrand("");
    setPriceRange(200000);
    setSortBy("createdAt");
    setOrder("desc");
    setPage(1);
  };

  const sharedProps = {
    products,
    pagination,
    brands,
    categories,
    loading,
    error,

    search,
    setSearch,

    selectedCategory,
    setSelectedCategory,

    selectedBrand,
    setSelectedBrand,

    priceRange,
    setPriceRange,

    page,
    setPage,

    clearFilters,
    handleSortChange,
  };

  return isMobile ? (
    <ShopMobileView {...sharedProps} />
  ) : (
    <ShopDesktopView {...sharedProps} />
  );
}