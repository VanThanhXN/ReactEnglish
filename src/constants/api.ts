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
  CREATE_EXAM: "/exam/create-exam",
  GET_ALL_EXAMS: "/exam/get-all-exam",
  GET_EXAM_BY_ID: "/exam/exam-by-id",
  UPDATE_EXAM: "/exam/update-exam",
  DELETE_EXAM: "/exam/delete-exam",
  CREATE_QUESTION: "/exam/create-question",
  UPDATE_QUESTION: "/exam/update-question",
  DELETE_QUESTION: "/exam/delete-question",
  GET_QUESTIONS_BY_EXAM: "/exam",
  // Flashcard endpoints
  CREATE_DECK: "/flashcard/create-deck",
  GET_ALL_DECKS: "/flashcard/get-all-deck",
  GET_DECK_BY_ID: "/flashcard/deck",
  UPDATE_DECK: "/flashcard/deck",
  DELETE_DECK: "/flashcard/deck",
  // Thêm các endpoint khác nếu cần
};
