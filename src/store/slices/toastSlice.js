import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  open: false,
  type: "info", // "success" | "error" | "warning" | "info"
  title: "",
  message: "",
  autoCloseMs: 3500,
};

const toastSlice = createSlice({
  name: "toast",
  initialState,
  reducers: {
    showToast: (state, action) => {
      const { type = "info", title = "", message = "", autoCloseMs = 3500 } = action.payload || {};
      state.open = true;
      state.type = type;
      state.title = title;
      state.message = message;
      state.autoCloseMs = autoCloseMs;
    },
    hideToast: (state) => {
      state.open = false;
    },
    clearToast: (state) => {
      state.open = false;
      state.type = "info";
      state.title = "";
      state.message = "";
      state.autoCloseMs = 3500;
    },
  },
});

export const { showToast, hideToast, clearToast } = toastSlice.actions;
export default toastSlice.reducer;