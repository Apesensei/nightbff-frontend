import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import * as SecureStore from "expo-secure-store";
import { Alert } from "react-native";
import eventEmitter from "./eventEmitter";

// Use the same key as in AuthContext for consistency
const AUTH_TOKEN_KEY = "userAuthToken";

// Create axios instance with default config
const api = axios.create({
  baseURL: "/api", // Replace with your actual API base URL
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const token = await SecureStore.getItemAsync(AUTH_TOKEN_KEY);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log(
          "[apiService] Request interceptor - Token attached to request",
        );
      } else {
        console.log("[apiService] Request interceptor - No token found");
      }
    } catch (error) {
      console.error(
        "[apiService] Request interceptor - Error retrieving token:",
        error,
      );
    }
    return config;
  },
  (error) => {
    console.error("[apiService] Request interceptor - Error:", error);
    return Promise.reject(error);
  },
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Pass through successful responses
    return response;
  },
  async (error: AxiosError) => {
    // Define known placeholder URLs that are expected to fail with Network Errors
    const KNOWN_PLACEHOLDER_URLS = ['/chat/list-placeholder', '/auth/login-placeholder'];

    // Check if this is an expected Network Error for a known placeholder URL
    if (error.isAxiosError && !error.response && error.config?.url && KNOWN_PLACEHOLDER_URLS.includes(error.config.url)) {
      // This is an expected Network Error for a known placeholder URL
      console.warn(`[apiService] Expected Network Error for placeholder URL: ${error.config.url}. Error: ${error.message}`);
      return Promise.reject(error); // Reject so mockService can catch it
    }

    // Log other error details
    console.error("[apiService] Response interceptor - Error:", {
      status: error.response?.status,
      message: error.message,
      url: error.config?.url,
    });

    // Handle authentication errors
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.log(
        "[apiService] Authentication error detected:",
        error.response.status,
      );

      // Show user-friendly alert
      Alert.alert(
        "Session Expired",
        "Your session has expired. Please log in again.",
        [{ text: "OK" }],
      );

      // Emit auth error event
      eventEmitter.emit("authError");

      // Reject with a user-friendly error message
      return Promise.reject(new Error("Session expired. Please log in again."));
    }

    // For other errors, pass through the original error
    return Promise.reject(error);
  },
);

// Type for the logout handler function
type LogoutHandler = (options?: { navigate?: boolean }) => Promise<void>;

// Variable to store the logout handler
let logoutHandler: LogoutHandler | null = null;

// Function to set the logout handler
export const setLogoutHandler = (handler: LogoutHandler | null) => {
  logoutHandler = handler;
  console.log(
    "[apiService] Logout handler updated:",
    handler ? "Handler set" : "Handler cleared",
  );
};

export default api;
