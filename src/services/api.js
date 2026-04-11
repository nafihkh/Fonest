import axios from "axios";
import {store} from "../store/store";
import { setCredentials, clearAuth } from "../store/slices/authSlice";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// Request interceptor: Attach access token
api.interceptors.request.use((config) => {
  // Read token from Redux store first, fallback to localStorage
  const token = store.getState()?.auth?.accessToken || localStorage.getItem("accessToken"); 

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Variables for managing concurrent refresh requests
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

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

      if (isRefreshing) {
        // If already refreshing, queue the request until refresh is complete
        return new Promise(function(resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Call refresh token endpoint
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/auth/refresh`, 
          {}, 
          { withCredentials: true }
        );
        
        const newAccessToken = response.data.accessToken;

        // Update store (and automatically localStorage via our updated slice)
        store.dispatch(setCredentials({
          accessToken: newAccessToken,
          user: response.data.user
        }));

        processQueue(null, newAccessToken);
        
        // Retry the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
        
      } catch (refreshError) {
        processQueue(refreshError, null);
        // If refresh fails (because refresh token is expired/invalid), clear state
        store.dispatch(clearAuth());
        // Redirect user to login page
        if (window.location.pathname !== "/login") {
            window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);