import { createSlice } from "@reduxjs/toolkit";

// Helper to safely load from localStorage
const loadFromStorage = (key) => {
  try {
    const serializedState = localStorage.getItem(key);
    return serializedState ? JSON.parse(serializedState) : null;
  } catch (err) {
    return null;
  }
};

const initialState = {
  accessToken: localStorage.getItem("accessToken") || null,
  user: loadFromStorage("user") || null,
  bootstrapped: false, // so UI knows auth check finished
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(state, action) {
      state.accessToken = action.payload.accessToken;
      state.user = action.payload.user;
      
      // Persist to localStorage to survive page refreshes
      localStorage.setItem("accessToken", action.payload.accessToken);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
    },
    clearAuth(state) {
      state.accessToken = null;
      state.user = null;
      
      // Clear from localStorage on logout
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
    },
    setBootstrapped(state, action) {
      state.bootstrapped = action.payload;
    },
  },
});

export const { setCredentials, clearAuth, setBootstrapped } = authSlice.actions;
export default authSlice.reducer;
