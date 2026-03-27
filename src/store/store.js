import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import toastReducer from "./slices/toastSlice";
import productReducer from "./slices/productSlice";
import cartReducer from "./slices/cartSlice";


export const store = configureStore({
  reducer: {
    auth: authReducer,
    toast: toastReducer,
    products: productReducer,
    cart: cartReducer,
  },
});