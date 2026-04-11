import { createBrowserRouter } from "react-router-dom";
import App from "./App";

import AuthPage from "../pages/auth/AuthPage";
import CompleteProfile from "../pages/auth/CompleteProfile";
import Home from "../pages/customer/Home"
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
import AdminOrders from "../pages/admin/AdminOrders";
import ProductDetails from "../pages/customer/Productdetails";
import LandingPage from "../pages/customer/LandingPage";
import ProfilePage from "../pages/customer/Profile"
import CartPage from "../pages/customer/Cart";
import SearchResultsPage from "../pages/customer/SearchResultsPage";
import BuyNowPage from "../pages/customer/BuyNowPage";
import OrderPlacedPage from "../pages/customer/OrderPlacedPage";
import PurchaseHistory from "../pages/customer/PurchaseHistory"
import OrderDetailsPage from "../pages/customer/OrderDetailsPage";
import UpdateDeliveryInstructions from "../pages/customer/UpdateDeliveryInstructionsPage";
import CartCheckoutPage from "../pages/customer/CartCheckoutPage";
import AddressPage from "../pages/customer/AddressPage";
import AddNewAddressPage from "../pages/customer/AddNewAddressPage";
import EditProfilePage from "../pages/customer/EditProfilePage";
import NotFoundPage from "../pages/NotFoundPage";
import ReturnPage from "../pages/customer/ReturnPage";
import MyReturnsPage from "../pages/customer/MyReturnsPage";

const router = createBrowserRouter([
  {
    element: <App />, // root wrapper
    children: [
      { path: "/auth", element: <AuthPage /> },
      { path: "/complete-profile", element: <CompleteProfile /> },
      {
        path: "/admin",
        element: (

          <ProtectedRoute>
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
        path: "/admin/brand-category",
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
        path: "/admin/orders",
        element: (
          <ProtectedRoute role="admin">
            <AdminOrders />
          </ProtectedRoute>
        ),
      },
      {
        path: "/",
        element: (
          <ProtectedRoute role="customer">
            <LandingPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/search",
        element: (
          <ProtectedRoute role="customer">
            <SearchResultsPage />
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
      {
        path: "/shop",
        element: (
          <ProtectedRoute role="customer">
            <Home />
          </ProtectedRoute>
        ),
      },
      {
        path: "/cart",
        element: (
          <ProtectedRoute role="customer">
            <CartPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/purchase-history",
        element: (
          <ProtectedRoute role="customer">
            <PurchaseHistory />
          </ProtectedRoute>
        ),
      },
      {
        path: "/profile",
        element: (
          <ProtectedRoute role="customer">
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/product/:id",
        element: (
          <ProtectedRoute role="customer">
            <ProductDetails />
          </ProtectedRoute>
        ),
      },
      {
        path: "/buy-now/:id",
        element: (
          <ProtectedRoute role="customer">
            <BuyNowPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/order-placed/:orderId",
        element: (
          <ProtectedRoute role="customer">
            <OrderPlacedPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/orders/:id",
        element: (
          <ProtectedRoute role="customer">
            <OrderDetailsPage />
          </ProtectedRoute>
        ),
      },

      {
        path: "/delivery-instructions/:id",
        element: (
          <ProtectedRoute role="customer">
            <UpdateDeliveryInstructions />
          </ProtectedRoute>
        ),
      },
      {
        path: "/checkout/cart",
        element: (
          <ProtectedRoute role="customer">
            <CartCheckoutPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/profile/addresses",
        element: (
          <ProtectedRoute role="customer">
            <AddressPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/profile/addresses/new",
        element: (
          <ProtectedRoute role="customer">
            <AddNewAddressPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/profile/edit",
        element: (
          <ProtectedRoute role="customer">
            <EditProfilePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/returns/new",
        element: (
          <ProtectedRoute role="customer">
            <ReturnPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/returns",
        element: (
          <ProtectedRoute role="customer">
            <MyReturnsPage />
          </ProtectedRoute>
        ),
      },
      {
        // Alias: mobile uses /orders/:id, desktop uses /orders/:id
        path: "/orders/:id",
        element: (
          <ProtectedRoute role="customer">
            <OrderDetailsPage />
          </ProtectedRoute>
        ),
      },

      { path: "*", element: <NotFoundPage /> },

    ],
  },
]);

export default router;