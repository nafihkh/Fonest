import { createBrowserRouter } from "react-router-dom";
import App from "./App";

import AuthPage from "../pages/auth/AuthPage";
import CompleteProfile from "../pages/auth/CompleteProfile";
import Home from "../pages/Home";
import AdminDashboard from "../pages/admin/AdminDashboard";
import ProtectedRoute from "../components/ProtectedRoute";
import AddProduct from "../pages/admin/AddProduct";
import AddBrandCategory from "../pages/admin/AddBrandCategory";
import Users from "../pages/admin/Users";
import Products from "../pages/admin/Products";
import StockOps from "../pages/admin/StockOps";
import Returns from "../pages/admin/Returns";
import ProfitAnalysis from "../pages/admin/ProfitAnalysis";
import Reports from "../pages/admin/Reports";
import Settings from "../pages/admin/Settings"


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
        path: "/admin/users",
        element: (
          
            <ProtectedRoute >
              <Users />
            </ProtectedRoute>
          
        ),
      },
      {
        path: "/admin/products",
        element: (
          
            <ProtectedRoute >
              <Products />
            </ProtectedRoute>
          
        ),
      },
      {
        path: "/admin/products",
        element: (
          
            <ProtectedRoute >
              <Products />
            </ProtectedRoute>
          
        ),
      },
      {
        path: "/admin/stock",
        element: (
          
            <ProtectedRoute >
              <StockOps />
            </ProtectedRoute>
          
        ),
      },
      {
        path: "/admin/returns",
        element: (
          
            <ProtectedRoute >
              <Returns />
            </ProtectedRoute>
          
        ),
      },
      {
        path: "/admin/profit",
        element: (
          
            <ProtectedRoute >
              <ProfitAnalysis />
            </ProtectedRoute>
          
        ),
      },
      {
        path: "/admin/reports",
        element: (
          
            <ProtectedRoute >
              <Reports />
            </ProtectedRoute>
          
        ),
      },
      {
        path: "/admin/settings",
        element: (
          
            <ProtectedRoute >
              <Settings />
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