import { createBrowserRouter } from "react-router-dom";
import App from "./App";

import AuthPage from "../pages/auth/AuthPage";
import CompleteProfile from "../pages/auth/CompleteProfile";
import Shop from "../pages/customer/Home"
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
import StockHistory from "../pages/admin/StockHistory";
import ProductDetails from "../pages/customer/Productdetails";
import HomePage from "../pages/customer/LandingPage";
import OrdersEntry from "../pages/enterys/OrdersEntry";
import ProfileEntry from "../pages/enterys/ProfileEntry"
import CartEntry from "../pages/enterys/CartEntry";

const router = createBrowserRouter([
  {
    element: <App />, // root wrapper
    children: [
      { path: "/auth", element: <AuthPage /> },
      { path: "/complete-profile", element: <CompleteProfile /> },
      {
        path: "/admin",
        element: (
          
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          
        ),
      },
      {
        path: "/admin/addproduct",
        element: (
          
            <ProtectedRoute role="admin" >
              <AddProduct />
            </ProtectedRoute>
          
        ),
      },
      {
        path: "/admin/brand&catogary",
        element: (
          
            <ProtectedRoute role="admin" >
              <AddBrandCategory />
            </ProtectedRoute>
          
        ),
      },
      {
        path: "/admin/users",
        element: (
          
            <ProtectedRoute role="admin" >
              <Users />
            </ProtectedRoute>
          
        ),
      },
      {
        path: "/admin/products",
        element: (
          
            <ProtectedRoute role="admin" >
              <Products />
            </ProtectedRoute>
          
        ),
      },
      {
        path: "/admin/products",
        element: (
          
            <ProtectedRoute role="admin" >
              <Products />
            </ProtectedRoute>
          
        ),
      },
      {
        path: "/admin/stock",
        element: (
          
            <ProtectedRoute role="admin" >
              <StockOps />
            </ProtectedRoute>
          
        ),
      },
      {
        path: "/admin/returns",
        element: (
          
            <ProtectedRoute role="admin" >
              <Returns />
            </ProtectedRoute>
          
        ),
      },
      {
        path: "/admin/profit",
        element: (
          
            <ProtectedRoute role="admin" >
              <ProfitAnalysis />
            </ProtectedRoute>
          
        ),
      },
      {
        path: "/admin/reports",
        element: (
          
            <ProtectedRoute role="admin" >
              <Reports />
            </ProtectedRoute>
          
        ),
      },
      {
        path: "/admin/settings",
        element: (
          
            <ProtectedRoute role="admin" >
              <Settings />
            </ProtectedRoute>
          
        ),
      },
      {
        path: "/admin/stock-history",
        element: (
          
            <ProtectedRoute role="admin" >
              <StockHistory />
            </ProtectedRoute>
          
        ),
      },
      {
        path: "/",
        element: (
          <ProtectedRoute role="customer">
            <HomePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/home",
        element: (
          <ProtectedRoute role="customer">
            <Shop />
          </ProtectedRoute>
        ),
      },
      {
        path: "/cart",
        element: (
          <ProtectedRoute role="customer">
            <CartEntry />
          </ProtectedRoute>
        ),
      },
      {
        path: "/purchase-history",
        element: (
          <ProtectedRoute role="customer">
            <OrdersEntry />
          </ProtectedRoute>
        ),
      },
      {
        path: "/profile",
        element: (
          <ProtectedRoute role="customer">
            <ProfileEntry />
          </ProtectedRoute>
        ),
      },
      {
        path: "/product-details",
        element: (
          <ProtectedRoute role="customer">
            <ProductDetails />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

export default router;