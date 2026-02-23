import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  accessToken: null,
  user: null,
  bootstrapped: false, // so UI knows auth check finished
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(state, action) {
      state.accessToken = action.payload.accessToken;
      state.user = action.payload.user;
    },
    clearAuth(state) {
      state.accessToken = null;
      state.user = null;
    },
    setBootstrapped(state, action) {
      state.bootstrapped = action.payload;
    },
  },
});

export const { setCredentials, clearAuth, setBootstrapped } = authSlice.actions;
export default authSlice.reducer;