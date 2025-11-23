import apiClient from "./apiClient";

/**
 * Interface cho Exam Package (dành cho user)
 */
export interface ExamPackage {
  id: number;
  title: string;
  description: string;
  totalQuestions: number;
  duration: number;
  isActive?: boolean;
  category?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Interface cho Question trong exam
 */
export interface Question {
  id: number;
  examId: number;
  questionText: string;
  orderNumber: number;
  explanation?: string;
  createdAt?: string;
  answers: Answer[];
}

/**
 * Interface cho Answer
 */
export interface Answer {
  id: number;
  questionId: number;
  answerText: string;
  option: string;
  isCorrect: boolean;
  explanation?: string;
}

/**
 * Response từ API lấy danh sách exam packages
 */
export interface GetExamPackagesResponse {
  success: boolean;
  data?: ExamPackage[];
  message?: string;
}

/**
 * Response từ API lấy thông tin exam package theo ID
 */
export interface GetExamPackageByIdResponse {
  success: boolean;
  data?: ExamPackageDetail;
  message?: string;
}

/**
 * Interface cho Exam Package Detail (có thêm questions)
 */
export interface ExamPackageDetail extends ExamPackage {
  questions: Question[];
}

/**
 * Lấy danh sách tất cả exam packages (dành cho user)
 * @returns GetExamPackagesResponse với danh sách exam packages
 */
export const getExamPackages = async (): Promise<GetExamPackagesResponse> => {
  try {
    const response = await apiClient.get<GetExamPackagesResponse | any>("/exam/get-all-exam");
    
    // Xử lý response - API có thể trả về format khác nhau
    if (response.data) {
      // Nếu response.data đã có cấu trúc {success, data, message}
      if (response.data.success !== undefined && response.data.data) {
        // Kiểm tra nếu data là mảng
        if (Array.isArray(response.data.data)) {
          return response.data as GetExamPackagesResponse;
        }
        // Nếu data có exams array
        if (response.data.data.exams && Array.isArray(response.data.data.exams)) {
          return {
            success: response.data.success,
            data: response.data.data.exams,
            message: response.data.message,
          };
        }
      }
      // Nếu response.data là mảng trực tiếp
      if (Array.isArray(response.data)) {
        return {
          success: true,
          data: response.data,
        };
      }
      // Nếu response.data là object có data.exams
      if (response.data.data && Array.isArray(response.data.data)) {
        return {
          success: true,
          data: response.data.data,
        };
      }
      // Nếu response.data là object có exams array
      if (response.data.exams && Array.isArray(response.data.exams)) {
        return {
          success: true,
          data: response.data.exams,
        };
      }
    }
    
    // Fallback: trả về response.data nếu không match format nào
    return response.data as GetExamPackagesResponse;
  } catch (error: any) {
    console.error("Error fetching exam packages:", error);
    // Xử lý lỗi và trả về response lỗi
    if (error.response) {
      const errorMessage =
        error.response.data?.message ||
        error.response.data?.error ||
        `Lỗi ${error.response.status}: ${error.response.statusText}`;
      throw new Error(errorMessage);
    } else if (error.request) {
      throw new Error("Không thể kết nối đến server. Vui lòng kiểm tra server có đang chạy không.");
    } else {
      throw new Error(error.message || "Có lỗi xảy ra khi lấy danh sách đề thi");
    }
  }
};

/**
 * Lấy thông tin exam package theo ID (dành cho user)
 * @param examId - ID của exam package cần lấy
 * @returns GetExamPackageByIdResponse với thông tin exam package
 */
export const getExamPackageById = async (
  examId: number
): Promise<GetExamPackageByIdResponse> => {
  try {
    const response = await apiClient.get<GetExamPackageByIdResponse | any>(
      `/exam/exam-by-id/${examId}`
    );
    
    // Xử lý response - API có thể trả về format khác nhau
    if (response.data) {
      // Nếu response.data đã có cấu trúc {success, data, message}
      if (response.data.success !== undefined) {
        return response.data as GetExamPackageByIdResponse;
      }
      // Nếu response.data là exam object trực tiếp
      if (response.data.id && response.data.title) {
        return {
          success: true,
          data: response.data as ExamPackageDetail,
        };
      }
    }
    
    // Fallback: trả về response.data nếu không match format nào
    return response.data as GetExamPackageByIdResponse;
  } catch (error: any) {
    console.error("Error fetching exam package:", error);
    // Xử lý lỗi
    if (error.response) {
      const errorMessage =
        error.response.data?.message ||
        error.response.data?.error ||
        `Lỗi ${error.response.status}: ${error.response.statusText}`;
      throw new Error(errorMessage);
    } else if (error.request) {
      throw new Error("Không thể kết nối đến server. Vui lòng kiểm tra server có đang chạy không.");
    } else {
      throw new Error(error.message || "Có lỗi xảy ra khi lấy thông tin đề thi");
    }
  }
};
