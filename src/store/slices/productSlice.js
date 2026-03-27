import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../services/api";

// Home products
export const fetchHomeProducts = createAsyncThunk(
  "/api/products/fetchHomeProducts",
  async (_, thunkAPI) => {
    try {
      const [featuredRes, latestRes] = await Promise.all([
        api.get("/api/store/products?featured=true&limit=8"),
        api.get("/api/store/products?limit=12"),
      ]);

      return {
        featured: featuredRes.data?.products || [],
        latest: latestRes.data?.products || [],
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to load products"
      );
    }
  }
);

// Shop products
export const fetchShopProducts = createAsyncThunk(
  "/api/products/fetchShopProducts",
  async (params = {}, thunkAPI) => {
    try {
      const query = new URLSearchParams();

      if (params.search) query.append("search", params.search);
      if (params.category) query.append("category", params.category);
      if (params.brand) query.append("brand", params.brand);
      if (params.minPrice !== undefined) query.append("minPrice", params.minPrice);
      if (params.maxPrice !== undefined) query.append("maxPrice", params.maxPrice);
      if (params.sortBy) query.append("sortBy", params.sortBy);
      if (params.order) query.append("order", params.order);
      if (params.page) query.append("page", params.page);
      if (params.limit) query.append("limit", params.limit);

      const res = await api.get(`/api/store/products?${query.toString()}`);

      return {
        products: res.data?.products || [],
        pagination: res.data?.pagination || null,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to load shop products"
      );
    }
  }
);
export const fetchStoreFilters = createAsyncThunk(
  "/api/products/fetchStoreFilters",
  async (_, thunkAPI) => {
    try {
      const res = await api.get("/api/store/filters");
      return {
        brands: res.data?.brands || [],
        categories: res.data?.categories || [],
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to load filters"
      );
    }
  }
);

// Single product details
export const fetchProductById = createAsyncThunk(
  "/api/products/fetchProductById",
  async (id, thunkAPI) => {
    try {
      const res = await api.get(`/api/store/products/${id}`);
      return res.data?.product;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to load product details"
      );
    }
  }
);

const initialState = {
  featured: [],
  latest: [],
  shopList: [],
  shopPagination: null,
  storeBrands: [],
  storeCategories: [],
  byId: {},

  shopSearch: "",
  shopSelectedCategory: "",
  shopSelectedBrand: "",
  shopPriceRange: 200000,
  shopSortBy: "createdAt",
  shopOrder: "desc",
  shopPage: 1,

  loadingHome: false,
  loadingShop: false,
  loadingDetails: false,
  loadingFilters: false,
  errorHome: "",
  errorShop: "",
  errorDetails: "",
  errorFilters: "",
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    clearProductErrors: (state) => {
      state.errorHome = "";
      state.errorShop = "";
      state.errorDetails = "";
    },

    clearShopProducts: (state) => {
      state.shopList = [];
    },

    setShopSearch: (state, action) => {
      state.shopSearch = action.payload;
      state.shopPage = 1;
    },

    setShopSelectedCategory: (state, action) => {
      state.shopSelectedCategory = action.payload;
      state.shopPage = 1;
    },

    setShopSelectedBrand: (state, action) => {
      state.shopSelectedBrand = action.payload;
      state.shopPage = 1;
    },

    setShopPriceRange: (state, action) => {
      state.shopPriceRange = action.payload;
      state.shopPage = 1;
    },

    setShopSort: (state, action) => {
      state.shopSortBy = action.payload.sortBy;
      state.shopOrder = action.payload.order;
      state.shopPage = 1;
    },

    setShopPage: (state, action) => {
      state.shopPage = action.payload;
    },

    clearShopFilters: (state) => {
      state.shopSearch = "";
      state.shopSelectedCategory = "";
      state.shopSelectedBrand = "";
      state.shopPriceRange = 200000;
      state.shopSortBy = "createdAt";
      state.shopOrder = "desc";
      state.shopPage = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      // Home
      .addCase(fetchHomeProducts.pending, (state) => {
        state.loadingHome = true;
        state.errorHome = "";
      })
      .addCase(fetchHomeProducts.fulfilled, (state, action) => {
        state.loadingHome = false;
        state.featured = action.payload.featured;
        state.latest = action.payload.latest;
      })
      .addCase(fetchHomeProducts.rejected, (state, action) => {
        state.loadingHome = false;
        state.errorHome = action.payload || "Failed to load products";
      })

      // Shop
      .addCase(fetchShopProducts.pending, (state) => {
        state.loadingShop = true;
        state.errorShop = "";
      })
      .addCase(fetchShopProducts.fulfilled, (state, action) => {
        state.loadingShop = false;
        state.shopList = action.payload.products;
        state.shopPagination = action.payload.pagination;
      })
      .addCase(fetchShopProducts.rejected, (state, action) => {
        state.loadingShop = false;
        state.errorShop = action.payload || "Failed to load shop products";
      })

      .addCase(fetchStoreFilters.pending, (state) => {
        state.loadingFilters = true;
        state.errorFilters = "";
      })
      .addCase(fetchStoreFilters.fulfilled, (state, action) => {
        state.loadingFilters = false;
        state.storeBrands = action.payload.brands;
        state.storeCategories = action.payload.categories;
      })
      .addCase(fetchStoreFilters.rejected, (state, action) => {
        state.loadingFilters = false;
        state.errorFilters = action.payload || "Failed to load filters";
      })

      // Details
      .addCase(fetchProductById.pending, (state) => {
        state.loadingDetails = true;
        state.errorDetails = "";
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loadingDetails = false;
        const product = action.payload;
        if (product?._id) {
          state.byId[product._id] = product;
        }
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loadingDetails = false;
        state.errorDetails = action.payload || "Failed to load product";
      });
  },
});

export const {
  clearProductErrors,
  clearShopProducts,
  setShopSearch,
  setShopSelectedCategory,
  setShopSelectedBrand,
  setShopPriceRange,
  setShopSort,
  setShopPage,
  clearShopFilters,
} = productSlice.actions;
export const selectFeaturedProducts = (state) => state.products.featured;
export const selectLatestProducts = (state) => state.products.latest;
export const selectShopProducts = (state) => state.products.shopList;
export const selectShopPagination = (state) => state.products.shopPagination;
export const selectStoreBrands = (state) => state.products.storeBrands;
export const selectStoreCategories = (state) => state.products.storeCategories;
export const selectLoadingFilters = (state) => state.products.loadingFilters;
export const selectProductById = (id) => (state) => state.products.byId[id];

export const selectProductsLoadingHome = (state) => state.products.loadingHome;
export const selectProductsLoadingShop = (state) => state.products.loadingShop;
export const selectProductsLoadingDetails = (state) =>
  state.products.loadingDetails;

export const selectProductsErrorHome = (state) => state.products.errorHome;
export const selectProductsErrorShop = (state) => state.products.errorShop;
export const selectProductsErrorDetails = (state) => state.products.errorDetails;

export const selectShopSearch = (state) => state.products.shopSearch;
export const selectShopSelectedCategory = (state) => state.products.shopSelectedCategory;
export const selectShopSelectedBrand = (state) => state.products.shopSelectedBrand;
export const selectShopPriceRange = (state) => state.products.shopPriceRange;
export const selectShopSortBy = (state) => state.products.shopSortBy;
export const selectShopOrder = (state) => state.products.shopOrder;
export const selectCurrentShopPage = (state) => state.products.shopPage;  

export default productSlice.reducer;