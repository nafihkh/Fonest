import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../services/api";

// ─── Thunks ───────────────────────────────────────────────────────────────────

export const submitReturn = createAsyncThunk(
  "returns/submitReturn",
  async (payload, thunkAPI) => {
    try {
      const res = await api.post("/api/returns", payload);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to submit return request"
      );
    }
  }
);

export const fetchMyReturns = createAsyncThunk(
  "returns/fetchMyReturns",
  async (params = {}, thunkAPI) => {
    try {
      const res = await api.get("/api/returns/my-returns", { params });
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch returns"
      );
    }
  }
);

export const fetchReturnById = createAsyncThunk(
  "returns/fetchReturnById",
  async (id, thunkAPI) => {
    try {
      const res = await api.get(`/api/returns/${id}`);
      return res.data.return;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch return"
      );
    }
  }
);

// ─── Initial State ────────────────────────────────────────────────────────────

const initialState = {
  // My returns list
  myReturns: [],
  myReturnsMeta: null,
  myReturnsLoading: false,
  myReturnsError: "",

  // Single return detail
  returnDetail: null,
  returnDetailLoading: false,
  returnDetailError: "",

  // Submit form
  submitting: false,
  submitError: "",
  submitSuccess: false,
  lastSubmittedTicket: null,
};

// ─── Slice ────────────────────────────────────────────────────────────────────

const returnSlice = createSlice({
  name: "returns",
  initialState,
  reducers: {
    clearSubmitState(state) {
      state.submitting = false;
      state.submitError = "";
      state.submitSuccess = false;
      state.lastSubmittedTicket = null;
    },
    clearReturnDetail(state) {
      state.returnDetail = null;
      state.returnDetailError = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // submitReturn
      .addCase(submitReturn.pending, (state) => {
        state.submitting = true;
        state.submitError = "";
        state.submitSuccess = false;
      })
      .addCase(submitReturn.fulfilled, (state, action) => {
        state.submitting = false;
        state.submitSuccess = true;
        state.lastSubmittedTicket = action.payload.ticketNo || null;
      })
      .addCase(submitReturn.rejected, (state, action) => {
        state.submitting = false;
        state.submitError = action.payload || "Failed to submit return";
      })

      // fetchMyReturns
      .addCase(fetchMyReturns.pending, (state) => {
        state.myReturnsLoading = true;
        state.myReturnsError = "";
      })
      .addCase(fetchMyReturns.fulfilled, (state, action) => {
        state.myReturnsLoading = false;
        state.myReturns = action.payload.returns || [];
        state.myReturnsMeta = action.payload.meta || null;
      })
      .addCase(fetchMyReturns.rejected, (state, action) => {
        state.myReturnsLoading = false;
        state.myReturnsError = action.payload || "Failed to fetch returns";
      })

      // fetchReturnById
      .addCase(fetchReturnById.pending, (state) => {
        state.returnDetailLoading = true;
        state.returnDetailError = "";
      })
      .addCase(fetchReturnById.fulfilled, (state, action) => {
        state.returnDetailLoading = false;
        state.returnDetail = action.payload;
      })
      .addCase(fetchReturnById.rejected, (state, action) => {
        state.returnDetailLoading = false;
        state.returnDetailError = action.payload || "Failed to fetch return";
      });
  },
});

export const { clearSubmitState, clearReturnDetail } = returnSlice.actions;

// ─── Selectors ────────────────────────────────────────────────────────────────

export const selectMyReturns        = (state) => state.returns.myReturns;
export const selectMyReturnsMeta    = (state) => state.returns.myReturnsMeta;
export const selectMyReturnsLoading = (state) => state.returns.myReturnsLoading;
export const selectMyReturnsError   = (state) => state.returns.myReturnsError;

export const selectReturnDetail        = (state) => state.returns.returnDetail;
export const selectReturnDetailLoading = (state) => state.returns.returnDetailLoading;
export const selectReturnDetailError   = (state) => state.returns.returnDetailError;

export const selectSubmitting        = (state) => state.returns.submitting;
export const selectSubmitError       = (state) => state.returns.submitError;
export const selectSubmitSuccess     = (state) => state.returns.submitSuccess;
export const selectLastSubmittedTicket = (state) => state.returns.lastSubmittedTicket;

export default returnSlice.reducer;
