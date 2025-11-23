import { API_ENDPOINTS, API_BASE_URL } from "../constants/api";
import apiClient from "./apiClient";
import type { User } from "../types/api";

/**
 * Response từ API lấy danh sách users
 */
export interface GetAllUsersResponse {
  status: string;
  results?: number;
  data?: {
    users: User[];
  };
  message?: string;
}

/**
 * Lấy tất cả users (chỉ dành cho admin)
 * @returns GetAllUsersResponse với danh sách users
 */
export const getAllUsers = async (): Promise<GetAllUsersResponse> => {
  try {
    const response = await apiClient.get<User[] | GetAllUsersResponse>(
      API_ENDPOINTS.GET_ALL_USERS
    );

    // Xử lý cả hai trường hợp: API trả về mảng trực tiếp hoặc object có cấu trúc
    if (Array.isArray(response.data)) {
      // API trả về mảng trực tiếp
      return {
        status: "success",
        data: {
          users: response.data,
        },
        results: response.data.length,
      };
    } else {
      // API trả về object có cấu trúc
      return response.data as GetAllUsersResponse;
    }
  } catch (error: any) {
    // Xử lý lỗi từ API
    if (error.response) {
      // Xử lý lỗi 429 riêng
      if (error.response.status === 429) {
        const retryAfter = error.response.headers?.["retry-after"] || "5";
        throw new Error(
          `Quá nhiều yêu cầu. Vui lòng đợi ${retryAfter} giây trước khi thử lại.`
        );
      }
      
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
      throw new Error(error.message || "Có lỗi xảy ra khi lấy danh sách users");
    }
  }
};

/**
 * Response từ API lấy thông tin user theo ID
 */
export interface GetUserByIdResponse {
  status: string;
  data?: {
    user: User;
  };
  message?: string;
}

/**
 * Lấy thông tin user theo ID (chỉ dành cho admin)
 * @param userId - ID của user cần lấy
 * @returns GetUserByIdResponse với thông tin user
 */
export const getUserById = async (userId: string): Promise<GetUserByIdResponse> => {
  try {
    const response = await apiClient.get<User | GetUserByIdResponse>(
      `${API_ENDPOINTS.GET_ALL_USERS}/${userId}`
    );

    // Xử lý cả hai trường hợp: API trả về user trực tiếp hoặc object có cấu trúc
    if (response.data && !("status" in response.data)) {
      // API trả về user trực tiếp
      return {
        status: "success",
        data: {
          user: response.data as User,
        },
      };
    } else {
      // API trả về object có cấu trúc
      return response.data as GetUserByIdResponse;
    }
  } catch (error: any) {
    // Xử lý lỗi từ API
    if (error.response) {
      // Xử lý lỗi 429 riêng
      if (error.response.status === 429) {
        const retryAfter = error.response.headers?.["retry-after"] || "5";
        throw new Error(
          `Quá nhiều yêu cầu. Vui lòng đợi ${retryAfter} giây trước khi thử lại.`
        );
      }
      
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
      throw new Error(error.message || "Có lỗi xảy ra khi lấy thông tin user");
    }
  }
};

/**
 * Data để tạo user mới
 */
export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
  role: "admin" | "user";
}

/**
 * Response từ API tạo user mới
 */
export interface CreateUserResponse {
  status: string;
  data?: {
    user: User;
  };
  message?: string;
}

/**
 * Tạo user mới (chỉ dành cho admin)
 * @param userData - Dữ liệu user cần tạo
 * @returns CreateUserResponse với thông tin user vừa tạo
 */
export const createUser = async (userData: CreateUserData): Promise<CreateUserResponse> => {
  try {
    const response = await apiClient.post<User | CreateUserResponse>(
      API_ENDPOINTS.GET_ALL_USERS,
      userData
    );

    // Xử lý cả hai trường hợp: API trả về user trực tiếp hoặc object có cấu trúc
    if (response.data && !("status" in response.data)) {
      // API trả về user trực tiếp
      return {
        status: "success",
        data: {
          user: response.data as User,
        },
      };
    } else {
      // API trả về object có cấu trúc
      return response.data as CreateUserResponse;
    }
  } catch (error: any) {
    // Xử lý lỗi từ API
    if (error.response) {
      // Xử lý lỗi 429 riêng
      if (error.response.status === 429) {
        const retryAfter = error.response.headers?.["retry-after"] || "5";
        throw new Error(
          `Quá nhiều yêu cầu. Vui lòng đợi ${retryAfter} giây trước khi thử lại.`
        );
      }
      
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
      throw new Error(error.message || "Có lỗi xảy ra khi tạo user");
    }
  }
};

/**
 * Data để cập nhật user
 */
export interface UpdateUserData {
  name?: string;
  email?: string;
  role?: "admin" | "user";
}

/**
 * Response từ API cập nhật user
 */
export interface UpdateUserResponse {
  status: string;
  data?: {
    user: User;
  };
  message?: string;
}

/**
 * Cập nhật user (chỉ dành cho admin)
 * @param userId - ID của user cần cập nhật
 * @param userData - Dữ liệu user cần cập nhật
 * @returns UpdateUserResponse với thông tin user đã cập nhật
 */
export const updateUser = async (
  userId: string,
  userData: UpdateUserData
): Promise<UpdateUserResponse> => {
  try {
    const response = await apiClient.patch<User | UpdateUserResponse>(
      `${API_ENDPOINTS.GET_ALL_USERS}/${userId}`,
      userData
    );

    // Xử lý cả hai trường hợp: API trả về user trực tiếp hoặc object có cấu trúc
    if (response.data && !("status" in response.data)) {
      // API trả về user trực tiếp
      return {
        status: "success",
        data: {
          user: response.data as User,
        },
      };
    } else {
      // API trả về object có cấu trúc
      return response.data as UpdateUserResponse;
    }
  } catch (error: any) {
    // Xử lý lỗi từ API
    if (error.response) {
      // Xử lý lỗi 429 riêng
      if (error.response.status === 429) {
        const retryAfter = error.response.headers?.["retry-after"] || "5";
        throw new Error(
          `Quá nhiều yêu cầu. Vui lòng đợi ${retryAfter} giây trước khi thử lại.`
        );
      }
      
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
      throw new Error(error.message || "Có lỗi xảy ra khi cập nhật user");
    }
  }
};

/**
 * Response từ API xóa user
 */
export interface DeleteUserResponse {
  status: string;
  message?: string;
}

/**
 * Xóa user (chỉ dành cho admin)
 * @param userId - ID của user cần xóa
 * @returns DeleteUserResponse với thông báo xóa thành công
 */
export const deleteUser = async (userId: string): Promise<DeleteUserResponse> => {
  try {
    const response = await apiClient.delete<DeleteUserResponse>(
      `${API_ENDPOINTS.GET_ALL_USERS}/${userId}`
    );

    // Xử lý response
    if (response.data) {
      return response.data as DeleteUserResponse;
    } else {
      return {
        status: "success",
        message: "User deleted successfully",
      };
    }
  } catch (error: any) {
    // Xử lý lỗi từ API
    if (error.response) {
      // Xử lý lỗi 429 riêng
      if (error.response.status === 429) {
        const retryAfter = error.response.headers?.["retry-after"] || "5";
        throw new Error(
          `Quá nhiều yêu cầu. Vui lòng đợi ${retryAfter} giây trước khi thử lại.`
        );
      }
      
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
      throw new Error(error.message || "Có lỗi xảy ra khi xóa user");
    }
  }
};

/**
 * Interface cho Exam
 */
export interface Exam {
  id: string | number;
  title: string;
  description: string;
  duration: number;
  totalMarks: number;
  totalQuestions?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Data để tạo exam mới
 */
export interface CreateExamData {
  title: string;
  description: string;
  duration: number;
  totalMarks: number;
}

/**
 * Response từ API tạo exam mới
 */
export interface CreateExamResponse {
  success: boolean;
  data?: Exam;
  message?: string;
}

/**
 * Tạo exam mới (chỉ dành cho admin)
 * @param examData - Dữ liệu exam cần tạo
 * @returns CreateExamResponse với thông tin exam vừa tạo
 */
export const createExam = async (examData: CreateExamData): Promise<CreateExamResponse> => {
  try {
    const response = await apiClient.post<Exam | CreateExamResponse>(
      API_ENDPOINTS.CREATE_EXAM,
      examData
    );

    // Xử lý cả hai trường hợp: API trả về exam trực tiếp hoặc object có cấu trúc
    if (response.data && !("success" in response.data)) {
      // API trả về exam trực tiếp
      return {
        success: true,
        data: response.data as Exam,
        message: "Exam created successfully",
      };
    } else {
      // API trả về object có cấu trúc
      return response.data as CreateExamResponse;
    }
  } catch (error: any) {
    // Xử lý lỗi từ API
    if (error.response) {
      // Xử lý lỗi 429 riêng
      if (error.response.status === 429) {
        const retryAfter = error.response.headers?.["retry-after"] || "5";
        throw new Error(
          `Quá nhiều yêu cầu. Vui lòng đợi ${retryAfter} giây trước khi thử lại.`
        );
      }
      
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
      throw new Error(error.message || "Có lỗi xảy ra khi tạo exam");
    }
  }
};

/**
 * Response từ API lấy danh sách exams
 */
export interface GetAllExamsResponse {
  success?: boolean;
  status?: string;
  results?: number;
  data?: {
    exams?: Exam[];
  };
  message?: string;
}

/**
 * Lấy tất cả exams (chỉ dành cho admin)
 * @returns GetAllExamsResponse với danh sách exams
 */
export const getAllExams = async (): Promise<GetAllExamsResponse> => {
  try {
    // Debug: Log endpoint trước khi gọi
    const response = await apiClient.get<Exam[] | GetAllExamsResponse>(
      API_ENDPOINTS.GET_ALL_EXAMS
    );

    // Xử lý cả hai trường hợp: API trả về mảng trực tiếp hoặc object có cấu trúc
    if (Array.isArray(response.data)) {
      // API trả về mảng trực tiếp
      return {
        success: true,
        status: "success",
        data: {
          exams: response.data,
        },
        results: response.data.length,
      };
    } else {
      // API trả về object có cấu trúc
      return response.data as GetAllExamsResponse;
    }
  } catch (error: any) {
    // Xử lý lỗi từ API
    if (error.response) {
      // Xử lý lỗi 429 riêng
      if (error.response.status === 429) {
        const retryAfter = error.response.headers?.["retry-after"] || "5";
        throw new Error(
          `Quá nhiều yêu cầu. Vui lòng đợi ${retryAfter} giây trước khi thử lại.`
        );
      }
      
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
      throw new Error(error.message || "Có lỗi xảy ra khi lấy danh sách exams");
    }
  }
};

/**
 * Interface cho Answer trong Question
 */
export interface Answer {
  id?: number | string;
  questionId?: number | string;
  answerText: string;
  option: string;
  isCorrect: boolean;
  explanation?: string | null;
  [key: string]: any;
}

/**
 * Interface cho Question trong Exam
 */
export interface Question {
  id?: number | string;
  examId?: number | string;
  questionText?: string;
  type?: string;
  questionType?: string;
  options?: string[];
  correctAnswer?: string | string[];
  marks?: number;
  points?: number;
  orderNumber?: number;
  explanation?: string | null;
  answers?: Answer[];
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

/**
 * Interface cho Exam Detail (có thêm questions)
 */
export interface ExamDetail extends Exam {
  questions?: Question[];
}

/**
 * Response từ API lấy thông tin exam theo ID
 */
export interface GetExamByIdResponse {
  success?: boolean;
  status?: string;
  data?: ExamDetail;
  message?: string;
}

/**
 * Lấy thông tin exam theo ID (chỉ dành cho admin)
 * @param examId - ID của exam cần lấy
 * @returns GetExamByIdResponse với thông tin exam và tất cả câu hỏi
 */
export const getExamById = async (examId: string): Promise<GetExamByIdResponse> => {
  try {
    const response = await apiClient.get<ExamDetail | GetExamByIdResponse>(
      `${API_ENDPOINTS.GET_EXAM_BY_ID}/${examId}`
    );

    let examData: ExamDetail | null = null;

    // Xử lý cả hai trường hợp: API trả về exam trực tiếp hoặc object có cấu trúc
    if (response.data && !("success" in response.data) && !("status" in response.data)) {
      // API trả về exam trực tiếp
      examData = response.data as ExamDetail;
    } else {
      // API trả về object có cấu trúc
      const structuredResponse = response.data as GetExamByIdResponse;
      examData = structuredResponse.data || null;
    }

    // Nếu có examData nhưng không có questions hoặc questions rỗng, lấy questions từ API riêng
    if (examData && (!examData.questions || examData.questions.length === 0)) {
      try {
        const questionsResponse = await getQuestionsByExamId(examId);
        if (questionsResponse.data?.questions) {
          examData.questions = questionsResponse.data.questions;
        }
      } catch (questionsError) {
        // Nếu lấy questions thất bại, vẫn trả về exam data nhưng không có questions
        console.warn("Không thể lấy danh sách câu hỏi:", questionsError);
      }
    }

    // Trả về kết quả
    if (examData) {
      return {
        success: true,
        status: "success",
        data: examData,
      };
    } else {
      return response.data as GetExamByIdResponse;
    }
  } catch (error: any) {
    // Xử lý lỗi từ API
    if (error.response) {
      // Xử lý lỗi 429 riêng
      if (error.response.status === 429) {
        const retryAfter = error.response.headers?.["retry-after"] || "5";
        throw new Error(
          `Quá nhiều yêu cầu. Vui lòng đợi ${retryAfter} giây trước khi thử lại.`
        );
      }
      
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
      throw new Error(error.message || "Có lỗi xảy ra khi lấy thông tin exam");
    }
  }
};

/**
 * Data để cập nhật exam
 */
export interface UpdateExamData {
  title?: string;
  description?: string;
  duration?: number;
  totalMarks?: number;
  isActive?: boolean;
}

/**
 * Response từ API cập nhật exam
 */
export interface UpdateExamResponse {
  success?: boolean;
  status?: string;
  data?: Exam;
  message?: string;
}

/**
 * Cập nhật exam (chỉ dành cho admin)
 * @param examId - ID của exam cần cập nhật
 * @param examData - Dữ liệu exam cần cập nhật
 * @returns UpdateExamResponse với thông tin exam đã cập nhật
 */
export const updateExam = async (
  examId: string | number,
  examData: UpdateExamData
): Promise<UpdateExamResponse> => {
  try {
    // Chỉ gửi các trường có giá trị (loại bỏ undefined)
    const cleanData: UpdateExamData = {};
    if (examData.title !== undefined) cleanData.title = examData.title;
    if (examData.description !== undefined) cleanData.description = examData.description;
    if (examData.duration !== undefined) cleanData.duration = examData.duration;
    if (examData.totalMarks !== undefined) cleanData.totalMarks = examData.totalMarks;
    if (examData.isActive !== undefined) cleanData.isActive = examData.isActive;

    const response = await apiClient.patch<Exam | UpdateExamResponse>(
      `${API_ENDPOINTS.UPDATE_EXAM}/${examId}`,
      cleanData
    );

    // Xử lý cả hai trường hợp: API trả về exam trực tiếp hoặc object có cấu trúc
    if (response.data && !("success" in response.data) && !("status" in response.data)) {
      // API trả về exam trực tiếp
      return {
        success: true,
        status: "success",
        data: response.data as Exam,
        message: "Exam updated successfully",
      };
    } else {
      // API trả về object có cấu trúc
      return response.data as UpdateExamResponse;
    }
  } catch (error: any) {
    // Xử lý lỗi từ API
    if (error.response) {
      // Xử lý lỗi 429 riêng
      if (error.response.status === 429) {
        const retryAfter = error.response.headers?.["retry-after"] || "5";
        throw new Error(
          `Quá nhiều yêu cầu. Vui lòng đợi ${retryAfter} giây trước khi thử lại.`
        );
      }
      
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
      throw new Error(error.message || "Có lỗi xảy ra khi cập nhật exam");
    }
  }
};

/**
 * Response từ API xóa exam
 */
export interface DeleteExamResponse {
  success?: boolean;
  status?: string;
  message?: string;
}

/**
 * Xóa exam (chỉ dành cho admin)
 * @param examId - ID của exam cần xóa
 * @returns DeleteExamResponse với thông báo xóa thành công
 */
export const deleteExam = async (
  examId: string | number
): Promise<DeleteExamResponse> => {
  try {
    const response = await apiClient.delete<DeleteExamResponse>(
      `${API_ENDPOINTS.DELETE_EXAM}/${examId}`
    );

    // Xử lý response
    if (response.data) {
      return response.data as DeleteExamResponse;
    } else {
      return {
        success: true,
        status: "success",
        message: "Exam deleted successfully",
      };
    }
  } catch (error: any) {
    // Xử lý lỗi từ API
    if (error.response) {
      // Xử lý lỗi 429 riêng
      if (error.response.status === 429) {
        const retryAfter = error.response.headers?.["retry-after"] || "5";
        throw new Error(
          `Quá nhiều yêu cầu. Vui lòng đợi ${retryAfter} giây trước khi thử lại.`
        );
      }
      
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
      throw new Error(error.message || "Có lỗi xảy ra khi xóa exam");
    }
  }
};

/**
 * Data để tạo question mới
 */
export interface CreateQuestionData {
  questionText: string;
  orderNumber?: number;
  explanation?: string;
  answers?: Answer[];
  // Các trường cũ vẫn giữ để tương thích
  questionType?: string;
  points?: number;
  options?: string[];
  correctAnswer?: string | string[];
}

/**
 * Response từ API tạo question mới
 */
export interface CreateQuestionResponse {
  success: boolean;
  data?: Question;
  message?: string;
}

/**
 * Tạo question mới cho exam (chỉ dành cho admin)
 * @param examId - ID của exam
 * @param questionData - Dữ liệu question cần tạo
 * @returns CreateQuestionResponse với thông tin question vừa tạo
 */
export const createQuestion = async (
  examId: string | number,
  questionData: CreateQuestionData
): Promise<CreateQuestionResponse> => {
  try {
    const response = await apiClient.post<Question | CreateQuestionResponse>(
      `${API_ENDPOINTS.CREATE_QUESTION}/${examId}`,
      questionData
    );

    // Xử lý cả hai trường hợp: API trả về question trực tiếp hoặc object có cấu trúc
    if (response.data && !("success" in response.data)) {
      // API trả về question trực tiếp
      return {
        success: true,
        data: response.data as Question,
        message: "Question created successfully",
      };
    } else {
      // API trả về object có cấu trúc
      return response.data as CreateQuestionResponse;
    }
  } catch (error: any) {
    // Xử lý lỗi từ API
    if (error.response) {
      // Xử lý lỗi 429 riêng
      if (error.response.status === 429) {
        const retryAfter = error.response.headers?.["retry-after"] || "5";
        throw new Error(
          `Quá nhiều yêu cầu. Vui lòng đợi ${retryAfter} giây trước khi thử lại.`
        );
      }
      
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
      throw new Error(error.message || "Có lỗi xảy ra khi tạo question");
    }
  }
};

/**
 * Data để cập nhật question
 */
export interface UpdateQuestionData {
  questionText?: string;
  orderNumber?: number;
  explanation?: string;
  answers?: Answer[];
  // Các trường cũ vẫn giữ để tương thích
  questionType?: string;
  points?: number;
  options?: string[];
  correctAnswer?: string | string[];
}

/**
 * Response từ API cập nhật question
 */
export interface UpdateQuestionResponse {
  success?: boolean;
  status?: string;
  data?: Question;
  message?: string;
}

/**
 * Cập nhật question (chỉ dành cho admin)
 * @param questionId - ID của question cần cập nhật
 * @param questionData - Dữ liệu question cần cập nhật
 * @returns UpdateQuestionResponse với thông tin question đã cập nhật
 */
export const updateQuestion = async (
  questionId: string | number,
  questionData: UpdateQuestionData
): Promise<UpdateQuestionResponse> => {
  try {
    // Chỉ gửi các trường có giá trị (loại bỏ undefined)
    const cleanData: UpdateQuestionData = {};
    if (questionData.questionText !== undefined) cleanData.questionText = questionData.questionText;
    if (questionData.orderNumber !== undefined) cleanData.orderNumber = questionData.orderNumber;
    if (questionData.explanation !== undefined) cleanData.explanation = questionData.explanation;
    if (questionData.answers !== undefined) cleanData.answers = questionData.answers;
    if (questionData.questionType !== undefined) cleanData.questionType = questionData.questionType;
    if (questionData.points !== undefined) cleanData.points = questionData.points;
    if (questionData.options !== undefined) cleanData.options = questionData.options;
    if (questionData.correctAnswer !== undefined) cleanData.correctAnswer = questionData.correctAnswer;

    const response = await apiClient.patch<Question | UpdateQuestionResponse>(
      `${API_ENDPOINTS.UPDATE_QUESTION}/${questionId}`,
      cleanData
    );

    // Xử lý cả hai trường hợp: API trả về question trực tiếp hoặc object có cấu trúc
    if (response.data && !("success" in response.data) && !("status" in response.data)) {
      // API trả về question trực tiếp
      return {
        success: true,
        status: "success",
        data: response.data as Question,
        message: "Question updated successfully",
      };
    } else {
      // API trả về object có cấu trúc
      return response.data as UpdateQuestionResponse;
    }
  } catch (error: any) {
    // Xử lý lỗi từ API
    if (error.response) {
      // Xử lý lỗi 429 riêng
      if (error.response.status === 429) {
        const retryAfter = error.response.headers?.["retry-after"] || "5";
        throw new Error(
          `Quá nhiều yêu cầu. Vui lòng đợi ${retryAfter} giây trước khi thử lại.`
        );
      }
      
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
      throw new Error(error.message || "Có lỗi xảy ra khi cập nhật question");
    }
  }
};

/**
 * Response từ API lấy danh sách questions theo exam ID
 */
export interface GetQuestionsByExamResponse {
  success?: boolean;
  status?: string;
  data?: {
    questions: Question[];
  };
  message?: string;
}

/**
 * Lấy danh sách questions theo exam ID (chỉ dành cho admin)
 * @param examId - ID của exam
 * @returns GetQuestionsByExamResponse với danh sách questions
 */
export const getQuestionsByExamId = async (
  examId: string | number
): Promise<GetQuestionsByExamResponse> => {
  try {
    const response = await apiClient.get<Question[] | GetQuestionsByExamResponse>(
      `${API_ENDPOINTS.GET_QUESTIONS_BY_EXAM}/${examId}/questions`
    );

    // Xử lý cả hai trường hợp: API trả về mảng trực tiếp hoặc object có cấu trúc
    if (Array.isArray(response.data)) {
      return {
        success: true,
        status: "success",
        data: {
          questions: response.data,
        },
      };
    } else {
      return response.data as GetQuestionsByExamResponse;
    }
  } catch (error: any) {
    if (error.response) {
      if (error.response.status === 429) {
        const retryAfter = error.response.headers?.["retry-after"] || "5";
        throw new Error(
          `Quá nhiều yêu cầu. Vui lòng đợi ${retryAfter} giây trước khi thử lại.`
        );
      }
      
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
      throw new Error(error.message || "Có lỗi xảy ra khi lấy danh sách câu hỏi");
    }
  }
};

/**
 * Response từ API xóa question
 */
export interface DeleteQuestionResponse {
  success?: boolean;
  status?: string;
  message?: string;
}

/**
 * Xóa question (chỉ dành cho admin)
 * @param questionId - ID của question cần xóa
 * @returns DeleteQuestionResponse với thông báo xóa thành công
 */
export const deleteQuestion = async (
  questionId: string | number
): Promise<DeleteQuestionResponse> => {
  try {
    const response = await apiClient.delete<DeleteQuestionResponse>(
      `${API_ENDPOINTS.DELETE_QUESTION}/${questionId}`
    );

    if (response.data) {
      return response.data as DeleteQuestionResponse;
    } else {
      return {
        success: true,
        status: "success",
        message: "Question deleted successfully",
      };
    }
  } catch (error: any) {
    if (error.response) {
      if (error.response.status === 429) {
        const retryAfter = error.response.headers?.["retry-after"] || "5";
        throw new Error(
          `Quá nhiều yêu cầu. Vui lòng đợi ${retryAfter} giây trước khi thử lại.`
        );
      }
      
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
      throw new Error(error.message || "Có lỗi xảy ra khi xóa question");
    }
  }
};

