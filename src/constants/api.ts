// API Configuration
// Development: Sử dụng relative path để dùng Vite proxy
// Production: Sử dụng VITE_API_BASE_URL environment variable hoặc fallback về relative path
// Nếu không có VITE_API_BASE_URL, sẽ dùng relative path (cho dev với proxy)
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api/v1";

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
