import React from "react";
import ReactDOM from "react-dom/client";
import ToastProvider from "./components/ui/ToastProvider";
import { RouterProvider } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import router from "./app/routes";
import { Provider } from "react-redux";
import { store } from "./store/store";
import "./index.css";


ReactDOM.createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId="826399908958-nn2ifkfg8lkne6c83fhq6c0cdnoth860.apps.googleusercontent.com">
     <Provider store={store}>
      <ToastProvider />
    <RouterProvider router={router} />
    </Provider>
  </GoogleOAuthProvider>
);