// API Configuration
// Sử dụng proxy trong development để tránh CORS
// Vite proxy sẽ forward /api/* đến http://localhost:3000/api/*
// Trong development, sử dụng relative path để dùng proxy
// Trong production, có thể cần thay đổi thành full URL
export const API_BASE_URL = "/api/v1"; // Sử dụng proxy từ Vite để tránh CORS

export const API_ENDPOINTS = {
  LOGIN: "/login",
  REGISTER: "/signup",
  LOGOUT: "/logout",
  FORGOT_PASSWORD: "/forgotPassword",
  UPDATE_PASSWORD: "/updateMyPassword",
  UPDATE_PROFILE: "/updateMe",
  // Admin endpoints
  GET_ALL_USERS: "/users",
  // Exam endpoints
  CREATE_EXAM: "/create-exam",
  GET_ALL_EXAMS: "/get-all-exam",
  GET_EXAM_BY_ID: "/exam",
  // Thêm các endpoint khác nếu cần
};
