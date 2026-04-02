import axios from "axios";
import {store} from "../store/store";
import { setCredentials, clearAuth } from "../store/slices/authSlice";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// Request interceptor: Attach access token
api.interceptors.request.use((config) => {
  const token = store.getState()?.auth?.accessToken; 

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Response interceptor: Silent refresh on 401
api.interceptors.response.use(
  (response) => response, 
  async (error) => {
    const originalRequest = error.config;

    // Check if unauthorized and not already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      
      // Avoid intercepting auth routes to prevent loops
      if (originalRequest.url?.includes("/auth/login") || originalRequest.url?.includes("/api/auth/refresh")) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        // Call refresh token endpoint
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/auth/refresh`, 
          {}, 
          { withCredentials: true }
        );
        
        // Update store (and automatically localStorage via our updated slice)
        store.dispatch(setCredentials({
          accessToken: response.data.accessToken,
          user: response.data.user
        }));

        // Retry the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
        return api(originalRequest);
        
      } catch (refreshError) {
        // If refresh fails (because refresh token is totally expired), clear state
        store.dispatch(clearAuth());
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);