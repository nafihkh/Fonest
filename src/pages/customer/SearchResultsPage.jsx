import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import useDebounce from "../../hooks/useDebounce";
import useIsMobile from "../../hooks/useIsMobile";
import MobileLayout from "../../components/layout/MobileLayout";
import MobileHeader from "../../components/layout/MobileHeader";
import SearchFilterChips from "../../components/customer/SearchFilterChips";
import SearchFilterDrawer from "../../components/customer/SearchFilterDrawer";
import SearchResultsSkeleton from "../../components/ui/SearchResultsSkeleton";
import SearchResultCard from "../../components/customer/SearchResultCard";
import { fetchCart , selectCartAddLoading } from "../../store/slices/cartSlice";
import {  } from "../../store/slices/cartSlice";
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

export default function SearchResultsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isMobile = useIsMobile(768);
  const [searchParams, setSearchParams] = useSearchParams();

  const query = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";
  const brand = searchParams.get("brand") || "";
  const maxPrice = Number(searchParams.get("maxPrice") || 200000);
  const sortBy = searchParams.get("sortBy") || "createdAt";
  const order = searchParams.get("order") || "desc";
  const page = Number(searchParams.get("page") || 1);

  const [searchValue, setSearchValue] = useState(query);
  const [filterOpen, setFilterOpen] = useState(false);

  const products = useSelector(selectShopProducts);
  const pagination = useSelector(selectShopPagination);
  const brands = useSelector(selectStoreBrands);
  const categories = useSelector(selectStoreCategories);
  const loading = useSelector(selectProductsLoadingShop);
  const error = useSelector(selectProductsErrorShop);

  const debouncedSearch = useDebounce(searchValue, 400);
  const addLoading = useSelector(selectCartAddLoading);

  useEffect(() => {
    dispatch(fetchStoreFilters());
  }, [dispatch]);

  useEffect(() => {
  dispatch(fetchCart());
}, );

  useEffect(() => {
    setSearchValue(query);
  }, [query]);

  useEffect(() => {
    const next = new URLSearchParams(searchParams);

    if (debouncedSearch.trim()) {
      next.set("q", debouncedSearch.trim());
      next.set("page", "1");
      setSearchParams(next);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    dispatch(
      fetchShopProducts({
        search: query,
        category,
        brand,
        minPrice: 0,
        maxPrice,
        sortBy,
        order,
        page,
        limit: 12,
      })
    );
  }, [dispatch, query, category, brand, maxPrice, sortBy, order, page]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (category) count += 1;
    if (brand) count += 1;
    if (maxPrice !== 200000) count += 1;
    return count;
  }, [category, brand, maxPrice]);

  const updateParams = (updates) => {
    const next = new URLSearchParams(searchParams);

    Object.entries(updates).forEach(([key, value]) => {
      if (value === "" || value === null || value === undefined) {
        next.delete(key);
      } else {
        next.set(key, String(value));
      }
    });

    if (updates.category !== undefined || updates.brand !== undefined || updates.maxPrice !== undefined) {
      next.set("page", "1");
    }

    setSearchParams(next);
  };

  const handleQuickFilter = (key) => {
    if (key === "all") {
      updateParams({ category: "", brand: "", maxPrice: 200000, page: 1 });
      return;
    }

    if (key === "discounts") {
      updateParams({ sortBy: "price", order: "asc", page: 1 });
      return;
    }

    if (key === "today-deals") {
      updateParams({ sortBy: "createdAt", order: "desc", page: 1 });
      return;
    }

    if (key === "mobiles") {
      const mobileCategory = categories.find((c) =>
        c.name?.toLowerCase().includes("mobile")
      );
      updateParams({ category: mobileCategory?._id || "", page: 1 });
      return;
    }

    if (key === "accessories") {
      const accessoryCategory = categories.find((c) =>
        c.name?.toLowerCase().includes("access")
      );
      updateParams({ category: accessoryCategory?._id || "", page: 1 });
    }
  };

  const handlePageChange = (nextPage) => {
    updateParams({ page: nextPage });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!isMobile) {
    return (
      <div className="min-h-screen bg-gray-50 px-6 py-10">
        <div className="mx-auto max-w-7xl">
          <h1 className="mb-4 text-2xl font-bold">Search Results</h1>
          <p className="text-sm text-gray-500">
            Mobile-first search page is ready. Desktop version can be added next.
          </p>
        </div>
      </div>
    );
  }

  return (
    <MobileLayout
      showHeader={true}
      headerProps={{
        searchValue,
        onSearchChange: setSearchValue,
      }}
      showDelivery={true}
      deliveryProps={{
        userName: "Nafih",
        place: "Kochi",
        pincode: "682001",
      }}
      showSearchFilters={true}
      searchFilterProps={{
        activeCount: activeFilterCount,
        onOpenFilters: () => setFilterOpen(true),
        onQuickFilter: handleQuickFilter,
      }}
    >
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h1 className="text-sm font-semibold text-gray-900">
            Results for "{query || searchValue || "All"}"
          </h1>
          <p className="text-[11px] text-gray-500">
            {pagination?.total || products?.length || 0} items found
          </p>
        </div>

        <select
          value={`${sortBy}-${order}`}
          onChange={(e) => {
            const value = e.target.value;

            if (value === "price-asc") {
              updateParams({ sortBy: "price", order: "asc", page: 1 });
            } else if (value === "price-desc") {
              updateParams({ sortBy: "price", order: "desc", page: 1 });
            } else {
              updateParams({ sortBy: "createdAt", order: "desc", page: 1 });
            }
          }}
          className="rounded-xl border border-gray-200 bg-white px-2 py-2 text-[11px] outline-none"
        >
          <option value="createdAt-desc">Newest</option>
          <option value="price-asc">Price Low</option>
          <option value="price-desc">Price High</option>
        </select>
      </div>

      {loading ? <SearchResultsSkeleton /> : null}

      {!loading && error ? (
        <div className="rounded-2xl bg-white p-6 text-center text-sm text-red-600 shadow-sm">
          {error}
        </div>
      ) : null}

      {!loading && !error && products?.length === 0 ? (
        <div className="rounded-2xl bg-white p-6 text-center text-sm text-gray-500 shadow-sm">
          No products found.
        </div>
      ) : null}

      {!loading && !error && products?.length > 0 ? (
        <div className="grid grid-cols-2 gap-3">
          {products.map((product) => (
            <SearchResultCard
              key={product._id}
              product={product}
            />
          ))}
        </div>
      ) : null}

      {!loading && pagination?.totalPages > 1 ? (
        <div className="mt-5 flex items-center justify-center gap-2">
          <button
            disabled={page <= 1}
            onClick={() => handlePageChange(page - 1)}
            className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs disabled:opacity-50"
          >
            Prev
          </button>

          <span className="text-xs text-gray-600">
            Page {page} / {pagination.totalPages}
          </span>

          <button
            disabled={page >= pagination.totalPages}
            onClick={() => handlePageChange(page + 1)}
            className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs disabled:opacity-50"
          >
            Next
          </button>
        </div>
      ) : null}

      <SearchFilterDrawer
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        categories={categories}
        brands={brands}
        selectedCategory={category}
        setSelectedCategory={(value) => updateParams({ category: value })}
        selectedBrand={brand}
        setSelectedBrand={(value) => updateParams({ brand: value })}
        priceRange={maxPrice}
        setPriceRange={(value) => updateParams({ maxPrice: value })}
        onClear={() =>
          updateParams({
            category: "",
            brand: "",
            maxPrice: 200000,
            page: 1,
          })
        }
      />
    </MobileLayout>
  );
}