import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { API_BASE_URL } from "../constants/api";
import { getToken, clearAuth } from "../utils/storage";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 10000, // 10 giây timeout
  withCredentials: false,
});

// Request interceptor: Gắn token vào header
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Không gắn token cho request login/register/signup
    if (
      config.url?.includes("/login") ||
      config.url?.includes("/register") ||
      config.url?.includes("/signup")
    ) {
      return config;
    }

    // Gắn token nếu có
    const token = getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
      // Debug: Log token để kiểm tra (chỉ trong development)
      if (process.env.NODE_ENV === "development") {
        console.log("🔑 Token được gửi:", token.substring(0, 20) + "...");
        console.log("📡 Request URL:", config.url);
      }
    } else {
      // Debug: Log khi không có token
      if (process.env.NODE_ENV === "development") {
        console.warn("⚠️ Không có token để gửi cho request:", config.url);
      }
    }

    // Nếu là FormData, không set Content-Type để browser tự set với boundary
    if (config.data instanceof FormData && config.headers) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: Xử lý lỗi và token hết hạn
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    // Xử lý lỗi 401 (Unauthorized) - Token hết hạn hoặc không hợp lệ
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;
      // Không redirect nếu đang ở trang login/register
      if (
        currentPath !== "/login" &&
        currentPath !== "/register" &&
        currentPath !== "/admin/login"
      ) {
        clearAuth();
        // Nếu đang ở trang admin, redirect về admin login
        if (currentPath.startsWith("/admin")) {
          window.location.href = "/admin/login";
        } else {
          // Nếu đang ở trang user, redirect về user login
          window.location.href = "/login";
        }
      }
    }
    // Xử lý lỗi 403 (Forbidden) - Không có quyền truy cập
    if (error.response?.status === 403) {
      const currentPath = window.location.pathname;
      // Nếu đang ở trang admin nhưng không có quyền, redirect về admin login
      if (currentPath.startsWith("/admin")) {
        clearAuth();
        window.location.href = "/admin/login";
      }
      // Nếu đang ở trang user nhưng không có quyền, redirect về user login
      else if (
        currentPath !== "/login" &&
        currentPath !== "/register" &&
        !currentPath.startsWith("/admin")
      ) {
        clearAuth();
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
