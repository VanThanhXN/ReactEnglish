/**
 * Utility functions để quản lý localStorage
 * Tập trung tất cả các thao tác với localStorage ở đây để dễ quản lý
 */

const STORAGE_KEYS = {
  TOKEN: "token",
  USER: "user",
} as const;

/**
 * Lưu token vào localStorage
 */
export const setToken = (token: string): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
  } catch (error) {
    console.error("❌ Lỗi khi lưu token:", error);
    throw new Error("Không thể lưu token vào localStorage");
  }
};

/**
 * Lấy token từ localStorage
 */
export const getToken = (): string | null => {
  try {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  } catch (error) {
    console.error("❌ Lỗi khi lấy token:", error);
    return null;
  }
};

/**
 * Xóa token khỏi localStorage
 */
export const removeToken = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
  } catch (error) {
    console.error("❌ Lỗi khi xóa token:", error);
  }
};

/**
 * Lưu user data vào localStorage
 */
export const setUser = (user: any): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  } catch (error) {
    console.error("❌ Lỗi khi lưu user:", error);
    throw new Error("Không thể lưu user vào localStorage");
  }
};

/**
 * Lấy user data từ localStorage
 */
export const getUser = (): any | null => {
  try {
    const userStr = localStorage.getItem(STORAGE_KEYS.USER);
    if (!userStr) return null;
    return JSON.parse(userStr);
  } catch (error) {
    console.error("❌ Lỗi khi lấy user:", error);
    return null;
  }
};

/**
 * Xóa user data khỏi localStorage
 */
export const removeUser = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEYS.USER);
  } catch (error) {
    console.error("❌ Lỗi khi xóa user:", error);
  }
};

/**
 * Xóa tất cả auth data (token và user)
 */
export const clearAuth = (): void => {
  removeToken();
  removeUser();
};

/**
 * Kiểm tra user đã đăng nhập chưa
 */
export const isAuthenticated = (): boolean => {
  return getToken() !== null;
};




