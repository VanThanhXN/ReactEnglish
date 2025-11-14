/**
 * Types cho API requests và responses
 */

// User interface
export interface User {
  id: string;
  name: string;
  email: string;
  photo: string | null;
  role: string;
  isActive: boolean;
  passwordChangedAt: string | null;
  passwordResetToken?: string;
  passwordResetExpires?: string;
}

// Login request
export interface LoginData {
  email: string;
  password: string;
}

// Register request
export interface RegisterData {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

// Forgot password request
export interface ForgotPasswordData {
  email: string;
}

// Forgot password response
export interface ForgotPasswordResponse {
  status: string;
  message?: string;
}

// Reset password request
export interface ResetPasswordData {
  password: string;
  passwordConfirm: string;
}

// Reset password response
export interface ResetPasswordResponse {
  status: string;
  token?: string;
  data?: {
    user: User;
  };
  message?: string;
}

// Login/Register response
export interface AuthResponse {
  status: string;
  token?: string;
  data?: {
    user: User;
  };
  message?: string;
}

// Alias for backward compatibility
export type LoginResponse = AuthResponse;

// Update password request
export interface UpdatePasswordData {
  currentPassword: string;
  newPassword: string;
  passwordConfirm: string;
}

// Update password response
export interface UpdatePasswordResponse {
  status: string;
  message?: string;
  data?: {
    user: User;
  };
}

// Update profile request
export interface UpdateProfileData {
  name?: string;
  email?: string;
  photo?: File | string;
}

// Update profile response
export interface UpdateProfileResponse {
  status: string;
  message?: string;
  data?: {
    user: User;
  };
}

// API Error response
export interface ApiError {
  status?: number;
  message?: string;
  error?: string;
  data?: any;
}

