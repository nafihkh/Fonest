import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCredentials, clearAuth, setBootstrapped } from "../store/slices/authSlice";

export default function AuthBootstrap({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    // 4. Hydration logic: On app load, read accessToken and user from localStorage
    const accessToken = localStorage.getItem("accessToken");
    let user = null;

    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser && storedUser !== "undefined") {
        user = JSON.parse(storedUser);
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
    }

    if (accessToken && user) {
      // Dispatch setCredentials to restore Redux state without calling API
      dispatch(setCredentials({ accessToken, user }));
    } else {
      // Clear if data is incomplete to avoid partial ghost states
      dispatch(clearAuth());
    }

    // Set bootstrapped to true so the UI knows auth check finished
    dispatch(setBootstrapped(true));

  }, [dispatch]);

  return children;
}