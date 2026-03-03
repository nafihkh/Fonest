import { createBrowserRouter } from "react-router-dom";
import App from "./App";

import AuthPage from "../pages/auth/AuthPage";
import CompleteProfile from "../pages/auth/CompleteProfile";
import Home from "../pages/Home";
import AdminDashboard from "../pages/admin/AdminDashboard";
import ProtectedRoute from "../components/ProtectedRoute";
import AddProduct from "../pages/admin/AddProduct";
import AddBrandCategory from "../pages/admin/AddBrandCategory";

const router = createBrowserRouter([
  {
    element: <App />, // root wrapper
    children: [
      { path: "/auth", element: <AuthPage /> },
      { path: "/complete-profile", element: <CompleteProfile /> },
      {
        path: "/admin",
        element: (
          
            <ProtectedRoute >
              <AdminDashboard />
            </ProtectedRoute>
          
        ),
      },
      {
        path: "/admin/addproduct",
        element: (
          
            <ProtectedRoute >
              <AddProduct />
            </ProtectedRoute>
          
        ),
      },
      {
        path: "/admin/brand&catogary",
        element: (
          
            <ProtectedRoute >
              <AddBrandCategory />
            </ProtectedRoute>
          
        ),
      },
      {
        path: "/home",
        element: (
          <ProtectedRoute role="customer">
            <Home />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

export default router;