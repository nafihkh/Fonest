import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {api} from "../../services/api"; // your axios instance

// -------------------------
// Async Thunks
// -------------------------

export const fetchCart = createAsyncThunk(
  "/api/cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/api/cart", {
        withCredentials: true,
      });

      return data;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || "Failed to fetch cart"
      );
    }
  }
);

export const addToCart = createAsyncThunk(
  "/api/cart/addToCart",
  async ({ productId, quantity = 1, variantId = null }, { rejectWithValue }) => {
    try {
      const { data } = await api.post(
        `/api/cart/add/${productId}`,
        { quantity, variantId },
        { withCredentials: true }
      );

      return data;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || "Failed to add to cart"
      );
    }
  }
);

export const updateCartQuantity = createAsyncThunk(
  "/api/cart/updateCartQuantity",
  async ({ productId, quantity, variantId = null }, { rejectWithValue }) => {
    try {
      const { data } = await api.patch(
        `/api/cart/update/${productId}`,
        { quantity, variantId },
        { withCredentials: true }
      );

      return data;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || "Failed to update cart"
      );
    }
  }
);

export const removeFromCart = createAsyncThunk(
  "/api/cart/removeFromCart",
  async ({ productId, variantId = null }, { rejectWithValue }) => {
    try {
      const query = variantId ? `?variantId=${variantId}` : "";

      const { data } = await api.delete(`/api/cart/remove/${productId}${query}`, {
        withCredentials: true,
      });

      return data;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || "Failed to remove item"
      );
    }
  }
);

export const clearCart = createAsyncThunk(
  "/api/cart/clearCart",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.delete("/api/cart/clear", {
        withCredentials: true,
      });

      return data;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || "Failed to clear cart"
      );
    }
  }
);

export const selectCartItemByProductId = (productId) => (state) =>
  state.cart.cart.items?.find(
    (item) => String(item.product?._id || item.product) === String(productId)
  );

export const selectCartQuantityByProductId = (productId) => (state) => {
  const item = state.cart.cart.items?.find(
    (item) => String(item.product?._id || item.product) === String(productId)
  );

  return item?.quantity || 0;
};


// -------------------------
// Initial State
// -------------------------

const initialState = {
  cart: {
    items: [],
    totalItems: 0,
    subtotal: 0,
  },

  loading: false,
  fetchLoading: false,
  addLoading: false,
  updateLoading: false,
  removeLoading: false,
  clearLoading: false,

  successMessage: "",
  error: "",
};

// -------------------------
// Slice
// -------------------------

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCartError: (state) => {
      state.error = "";
    },
    clearCartMessage: (state) => {
      state.successMessage = "";
    },
    resetCartState: (state) => {
      state.cart = {
        items: [],
        totalItems: 0,
        subtotal: 0,
      };
      state.loading = false;
      state.fetchLoading = false;
      state.addLoading = false;
      state.updateLoading = false;
      state.removeLoading = false;
      state.clearLoading = false;
      state.successMessage = "";
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder

      // fetchCart
      .addCase(fetchCart.pending, (state) => {
        state.fetchLoading = true;
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.fetchLoading = false;
        state.loading = false;
        state.cart = action.payload.cart || {
          items: [],
          totalItems: 0,
          subtotal: 0,
        };
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.fetchLoading = false;
        state.loading = false;
        state.error = action.payload || "Failed to fetch cart";
      })

      // addToCart
      .addCase(addToCart.pending, (state) => {
        state.addLoading = true;
        state.loading = true;
        state.error = "";
        state.successMessage = "";
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.addLoading = false;
        state.loading = false;
        state.cart = action.payload.cart || state.cart;
        state.successMessage =
          action.payload.message || "Product added to cart";
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.addLoading = false;
        state.loading = false;
        state.error = action.payload || "Failed to add to cart";
      })

      // updateCartQuantity
      .addCase(updateCartQuantity.pending, (state) => {
        state.updateLoading = true;
        state.loading = true;
        state.error = "";
        state.successMessage = "";
      })
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.loading = false;
        state.cart = action.payload.cart || state.cart;
        state.successMessage =
          action.payload.message || "Cart updated successfully";
      })
      .addCase(updateCartQuantity.rejected, (state, action) => {
        state.updateLoading = false;
        state.loading = false;
        state.error = action.payload || "Failed to update cart";
      })

      // removeFromCart
      .addCase(removeFromCart.pending, (state) => {
        state.removeLoading = true;
        state.loading = true;
        state.error = "";
        state.successMessage = "";
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.removeLoading = false;
        state.loading = false;
        state.cart = action.payload.cart || state.cart;
        state.successMessage =
          action.payload.message || "Item removed from cart";
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.removeLoading = false;
        state.loading = false;
        state.error = action.payload || "Failed to remove item";
      })

      // clearCart
      .addCase(clearCart.pending, (state) => {
        state.clearLoading = true;
        state.loading = true;
        state.error = "";
        state.successMessage = "";
      })
      .addCase(clearCart.fulfilled, (state, action) => {
        state.clearLoading = false;
        state.loading = false;
        state.cart = action.payload.cart || {
          items: [],
          totalItems: 0,
          subtotal: 0,
        };
        state.successMessage =
          action.payload.message || "Cart cleared successfully";
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.clearLoading = false;
        state.loading = false;
        state.error = action.payload || "Failed to clear cart";
      });
  },
});

export const { clearCartError, clearCartMessage, resetCartState } =
  cartSlice.actions;

export default cartSlice.reducer;

// -------------------------
// Selectors
// -------------------------

export const selectCart = (state) => state.cart.cart;
export const selectCartItems = (state) => state.cart.cart.items || [];
export const selectCartTotalItems = (state) => state.cart.cart.totalItems || 0;
export const selectCartSubtotal = (state) => state.cart.cart.subtotal || 0;

export const selectCartLoading = (state) => state.cart.loading;
export const selectCartFetchLoading = (state) => state.cart.fetchLoading;
export const selectCartAddLoading = (state) => state.cart.addLoading;
export const selectCartUpdateLoading = (state) => state.cart.updateLoading;
export const selectCartRemoveLoading = (state) => state.cart.removeLoading;
export const selectCartClearLoading = (state) => state.cart.clearLoading;

export const selectCartError = (state) => state.cart.error;
export const selectCartSuccessMessage = (state) => state.cart.successMessage;