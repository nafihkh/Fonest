import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../services/api";

export const fetchMyOrders = createAsyncThunk(
  "orders/fetchMyOrders",
  async (params = {}, thunkAPI) => {
    try {
      const res = await api.get("/api/orders/my-orders", { params });
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch orders"
      );
    }
  }
);

export const fetchOrderById = createAsyncThunk(
  "orders/fetchOrderById",
  async (id, thunkAPI) => {
    try {
      const res = await api.get(`/api/orders/${id}`);
      return res.data.order;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch order"
      );
    }
  }
);

export const fetchAdminOrders = createAsyncThunk(
  "orders/fetchAdminOrders",
  async (params = {}, thunkAPI) => {
    try {
      const res = await api.get("/api/admin/orders", { params });
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch admin orders"
      );
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  "orders/updateOrderStatus",
  async ({ id, orderStatus }, thunkAPI) => {
    try {
      const res = await api.patch(`/api/admin/orders/${id}/status`, {
        orderStatus,
      });
      return res.data.order;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update order status"
      );
    }
  }
);

const initialState = {
  myOrders: [],
  myOrdersMeta: null,
  myOrdersLoading: false,
  myOrdersError: "",
  myOrdersFilters: {
    page: 1,
    month: "",
    year: "",
    status: "all",
  },

  selectedOrder: null,
  selectedOrderLoading: false,
  selectedOrderError: "",

  adminOrders: [],
  adminOrdersMeta: null,
  adminOrdersLoading: false,
  adminOrdersError: "",

  updateStatusLoading: false,
  updateStatusError: "",
};

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    clearSelectedOrder(state) {
      state.selectedOrder = null;
      state.selectedOrderError = "";
    },
    setMyOrdersFilters(state, action) {
      state.myOrdersFilters = { ...state.myOrdersFilters, ...action.payload };
    },
    resetMyOrdersFilters(state) {
      state.myOrdersFilters = { page: 1, month: "", year: "", status: "all" };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyOrders.pending, (state) => {
        state.myOrdersLoading = true;
        state.myOrdersError = "";
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.myOrdersLoading = false;
        state.myOrders = action.payload.orders || [];
        state.myOrdersMeta = action.payload.meta || null;
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.myOrdersLoading = false;
        state.myOrdersError = action.payload || "Failed to fetch orders";
      })

      .addCase(fetchOrderById.pending, (state) => {
        state.selectedOrderLoading = true;
        state.selectedOrderError = "";
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.selectedOrderLoading = false;
        state.selectedOrder = action.payload;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.selectedOrderLoading = false;
        state.selectedOrderError = action.payload || "Failed to fetch order";
      })

      .addCase(fetchAdminOrders.pending, (state) => {
        state.adminOrdersLoading = true;
        state.adminOrdersError = "";
      })
      .addCase(fetchAdminOrders.fulfilled, (state, action) => {
        state.adminOrdersLoading = false;
        state.adminOrders = action.payload.orders || [];
        state.adminOrdersMeta = action.payload.meta || null;
      })
      .addCase(fetchAdminOrders.rejected, (state, action) => {
        state.adminOrdersLoading = false;
        state.adminOrdersError = action.payload || "Failed to fetch admin orders";
      })

      .addCase(updateOrderStatus.pending, (state) => {
        state.updateStatusLoading = true;
        state.updateStatusError = "";
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.updateStatusLoading = false;

        const updated = action.payload;

        state.adminOrders = state.adminOrders.map((order) =>
          order._id === updated._id ? updated : order
        );

        if (state.selectedOrder?._id === updated._id) {
          state.selectedOrder = updated;
        }

        state.myOrders = state.myOrders.map((order) =>
          order._id === updated._id ? updated : order
        );
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.updateStatusLoading = false;
        state.updateStatusError = action.payload || "Failed to update order status";
      });
  },
});

export const { clearSelectedOrder, setMyOrdersFilters, resetMyOrdersFilters } = orderSlice.actions;

export const selectMyOrders = (state) => state.orders.myOrders;
export const selectMyOrdersMeta = (state) => state.orders.myOrdersMeta;
export const selectMyOrdersLoading = (state) => state.orders.myOrdersLoading;
export const selectMyOrdersError = (state) => state.orders.myOrdersError;
export const selectMyOrdersFilters = (state) => state.orders.myOrdersFilters;

export const selectSelectedOrder = (state) => state.orders.selectedOrder;
export const selectSelectedOrderLoading = (state) => state.orders.selectedOrderLoading;
export const selectSelectedOrderError = (state) => state.orders.selectedOrderError;

export const selectAdminOrders = (state) => state.orders.adminOrders;
export const selectAdminOrdersMeta = (state) => state.orders.adminOrdersMeta;
export const selectAdminOrdersLoading = (state) => state.orders.adminOrdersLoading;
export const selectAdminOrdersError = (state) => state.orders.adminOrdersError;

export const selectUpdateStatusLoading = (state) => state.orders.updateStatusLoading;
export const selectUpdateStatusError = (state) => state.orders.updateStatusError;

export default orderSlice.reducer;