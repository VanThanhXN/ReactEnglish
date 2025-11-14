import { API_ENDPOINTS } from "../constants/api";
import apiClient from "./apiClient";
import { setToken, setUser, clearAuth } from "../utils/storage";
import type {
  LoginData,
  RegisterData,
  AuthResponse,
  ForgotPasswordData,
  ForgotPasswordResponse,
  ResetPasswordData,
  ResetPasswordResponse,
  UpdatePasswordData,
  UpdatePasswordResponse,
  UpdateProfileData,
  UpdateProfileResponse,
} from "../types/api";

/**
 * Đăng nhập user
 * @param data - Email và password
 * @returns AuthResponse với token và user data
 */
export const login = async (data: LoginData): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.LOGIN,
      data
    );

    // Lưu token và user data vào localStorage
    if (response.data.status === "success" && response.data.token) {
      setToken(response.data.token);

      if (response.data.data?.user) {
        setUser(response.data.data.user);
      }
    }

    return response.data;
  } catch (error: any) {
    // Xử lý lỗi từ API
    if (error.response) {
      // Server trả về response nhưng có lỗi
      const errorMessage =
        error.response.data?.message ||
        error.response.data?.error ||
        `Lỗi ${error.response.status}: ${error.response.statusText}`;
      throw new Error(errorMessage);
    } else if (error.request) {
      // Request đã được gửi nhưng không nhận được response
      if (
        error.code === "ERR_NETWORK" ||
        error.message.includes("Network Error")
      ) {
        throw new Error(
          "Lỗi kết nối: Có thể do CORS hoặc server không chạy. Vui lòng kiểm tra server và CORS settings."
        );
      }
      throw new Error(
        "Không thể kết nối đến server. Vui lòng kiểm tra server có đang chạy không."
      );
    } else {
      // Lỗi khi setup request
      throw new Error(error.message || "Có lỗi xảy ra khi đăng nhập");
    }
  }
};

/**
 * Đăng ký user mới
 * @param data - Name, email, password và passwordConfirm
 * @returns AuthResponse với token và user data
 */
export const register = async (data: RegisterData): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.REGISTER,
      data
    );

    // Lưu token và user data vào localStorage
    if (response.data.status === "success" && response.data.token) {
      setToken(response.data.token);

      if (response.data.data?.user) {
        setUser(response.data.data.user);
      }
    }

    return response.data;
  } catch (error: any) {
    // Xử lý lỗi từ API
    if (error.response) {
      const errorMessage =
        error.response.data?.message ||
        error.response.data?.error ||
        `Lỗi ${error.response.status}: ${error.response.statusText}`;
      throw new Error(errorMessage);
    } else if (error.request) {
      if (
        error.code === "ERR_NETWORK" ||
        error.message.includes("Network Error")
      ) {
        throw new Error(
          "Lỗi kết nối: Có thể do CORS hoặc server không chạy. Vui lòng kiểm tra server và CORS settings."
        );
      }
      throw new Error(
        "Không thể kết nối đến server. Vui lòng kiểm tra server có đang chạy không."
      );
    } else {
      throw new Error(error.message || "Có lỗi xảy ra khi đăng ký");
    }
  }
};

/**
 * Quên mật khẩu - Gửi email reset password
 * @param data - Email
 * @returns ForgotPasswordResponse với message
 */
export const forgotPassword = async (
  data: ForgotPasswordData
): Promise<ForgotPasswordResponse> => {
  try {
    const response = await apiClient.post<ForgotPasswordResponse>(
      API_ENDPOINTS.FORGOT_PASSWORD,
      data
    );

    return response.data;
  } catch (error: any) {
    // Xử lý lỗi từ API
    if (error.response) {
      const errorMessage =
        error.response.data?.message ||
        error.response.data?.error ||
        `Lỗi ${error.response.status}: ${error.response.statusText}`;
      throw new Error(errorMessage);
    } else if (error.request) {
      if (
        error.code === "ERR_NETWORK" ||
        error.message.includes("Network Error")
      ) {
        throw new Error(
          "Lỗi kết nối: Có thể do CORS hoặc server không chạy. Vui lòng kiểm tra server và CORS settings."
        );
      }
      throw new Error(
        "Không thể kết nối đến server. Vui lòng kiểm tra server có đang chạy không."
      );
    } else {
      throw new Error(error.message || "Có lỗi xảy ra khi gửi yêu cầu");
    }
  }
};

/**
 * Reset password với token
 * @param token - Token từ email reset password
 * @param data - Password và passwordConfirm
 * @returns ResetPasswordResponse với token và user data
 */
export const resetPassword = async (
  token: string,
  data: ResetPasswordData
): Promise<ResetPasswordResponse> => {
  try {
    const response = await apiClient.post<ResetPasswordResponse>(
      `/resetPassword/${token}`,
      data
    );

    // Lưu token và user data vào localStorage nếu có
    if (response.data.status === "success" && response.data.token) {
      setToken(response.data.token);

      if (response.data.data?.user) {
        setUser(response.data.data.user);
      }
    }

    return response.data;
  } catch (error: any) {
    // Xử lý lỗi từ API
    if (error.response) {
      const errorMessage =
        error.response.data?.message ||
        error.response.data?.error ||
        `Lỗi ${error.response.status}: ${error.response.statusText}`;
      throw new Error(errorMessage);
    } else if (error.request) {
      if (
        error.code === "ERR_NETWORK" ||
        error.message.includes("Network Error")
      ) {
        throw new Error(
          "Lỗi kết nối: Có thể do CORS hoặc server không chạy. Vui lòng kiểm tra server và CORS settings."
        );
      }
      throw new Error(
        "Không thể kết nối đến server. Vui lòng kiểm tra server có đang chạy không."
      );
    } else {
      throw new Error(error.message || "Có lỗi xảy ra khi đặt lại mật khẩu");
    }
  }
};

/**
 * Đổi mật khẩu
 * @param data - currentPassword, newPassword và passwordConfirm
 * @returns UpdatePasswordResponse với message
 */
export const updatePassword = async (
  data: UpdatePasswordData
): Promise<UpdatePasswordResponse> => {
  try {
    const response = await apiClient.patch<UpdatePasswordResponse>(
      API_ENDPOINTS.UPDATE_PASSWORD,
      data
    );

    // Cập nhật user data nếu có
    if (response.data.status === "success" && response.data.data?.user) {
      setUser(response.data.data.user);
    }

    return response.data;
  } catch (error: any) {
    // Xử lý lỗi từ API
    if (error.response) {
      const errorMessage =
        error.response.data?.message ||
        error.response.data?.error ||
        `Lỗi ${error.response.status}: ${error.response.statusText}`;
      throw new Error(errorMessage);
    } else if (error.request) {
      if (
        error.code === "ERR_NETWORK" ||
        error.message.includes("Network Error")
      ) {
        throw new Error(
          "Lỗi kết nối: Có thể do CORS hoặc server không chạy. Vui lòng kiểm tra server và CORS settings."
        );
      }
      throw new Error(
        "Không thể kết nối đến server. Vui lòng kiểm tra server có đang chạy không."
      );
    } else {
      throw new Error(error.message || "Có lỗi xảy ra khi đổi mật khẩu");
    }
  }
};

/**
 * Cập nhật thông tin profile
 * @param data - Name, email và photo
 * @returns UpdateProfileResponse với user data đã cập nhật
 */
export const updateProfile = async (
  data: UpdateProfileData
): Promise<UpdateProfileResponse> => {
  try {
    // Nếu có file photo, sử dụng FormData
    const isFormData = data.photo instanceof File;
    let requestData: any;

    if (isFormData) {
      const formData = new FormData();
      if (data.name) formData.append("name", data.name);
      if (data.email) formData.append("email", data.email);
      if (data.photo) formData.append("photo", data.photo);
      requestData = formData;
      // Không cần set config, apiClient sẽ tự xử lý FormData
    } else {
      requestData = {
        name: data.name,
        email: data.email,
        ...(data.photo && typeof data.photo === "string" && { photo: data.photo }),
      };
    }

    const response = await apiClient.patch<UpdateProfileResponse>(
      API_ENDPOINTS.UPDATE_PROFILE,
      requestData
    );

    // Cập nhật user data nếu có
    if (response.data.status === "success" && response.data.data?.user) {
      setUser(response.data.data.user);
    }

    return response.data;
  } catch (error: any) {
    // Xử lý lỗi từ API
    if (error.response) {
      const errorMessage =
        error.response.data?.message ||
        error.response.data?.error ||
        `Lỗi ${error.response.status}: ${error.response.statusText}`;
      throw new Error(errorMessage);
    } else if (error.request) {
      if (
        error.code === "ERR_NETWORK" ||
        error.message.includes("Network Error")
      ) {
        throw new Error(
          "Lỗi kết nối: Có thể do CORS hoặc server không chạy. Vui lòng kiểm tra server và CORS settings."
        );
      }
      throw new Error(
        "Không thể kết nối đến server. Vui lòng kiểm tra server có đang chạy không."
      );
    } else {
      throw new Error(error.message || "Có lỗi xảy ra khi cập nhật hồ sơ");
    }
  }
};

/**
 * Đăng xuất user
 */
export const logout = (): void => {
  clearAuth();
};
