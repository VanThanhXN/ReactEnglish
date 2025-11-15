import { API_ENDPOINTS } from "../constants/api";
import apiClient from "./apiClient";
import type {
  Exam,
  ApiResponse,
  GetAllExamsResponse,
  GetExamByIdResponse,
} from "../types/api";

/**
 * Lấy danh sách exams cho user
 */
export const getUserExams = async (): Promise<GetAllExamsResponse> => {
  try {
    const response = await apiClient.get<GetAllExamsResponse>(
      API_ENDPOINTS.GET_USER_EXAMS
    );
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const errorMessage =
        error.response.data?.message ||
        error.response.data?.error ||
        `Lỗi ${error.response.status}: ${error.response.statusText}`;
      throw new Error(errorMessage);
    } else if (error.request) {
      throw new Error("Không thể kết nối đến server. Vui lòng kiểm tra server có đang chạy không.");
    } else {
      throw new Error(error.message || "Có lỗi xảy ra khi lấy danh sách exams");
    }
  }
};

/**
 * Lấy thông tin exam theo ID cho user
 */
export const getUserExamById = async (examId: string): Promise<GetExamByIdResponse> => {
  try {
    const response = await apiClient.get<GetExamByIdResponse>(
      `${API_ENDPOINTS.GET_USER_EXAM_BY_ID}/${examId}`
    );
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const errorMessage =
        error.response.data?.message ||
        error.response.data?.error ||
        `Lỗi ${error.response.status}: ${error.response.statusText}`;
      throw new Error(errorMessage);
    } else if (error.request) {
      throw new Error("Không thể kết nối đến server. Vui lòng kiểm tra server có đang chạy không.");
    } else {
      throw new Error(error.message || "Có lỗi xảy ra khi lấy thông tin exam");
    }
  }
};

