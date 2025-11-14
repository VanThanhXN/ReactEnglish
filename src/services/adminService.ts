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
 * Interface cho Exam
 */
export interface Exam {
  id: string;
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
    if (process.env.NODE_ENV === "development") {
      console.log("📡 Gọi API getAllExams:", API_ENDPOINTS.GET_ALL_EXAMS);
      console.log("📡 Full URL sẽ là:", `${API_BASE_URL}${API_ENDPOINTS.GET_ALL_EXAMS}`);
    }
    
    const response = await apiClient.get<Exam[] | GetAllExamsResponse>(
      API_ENDPOINTS.GET_ALL_EXAMS
    );

    // Debug: Log response
    if (process.env.NODE_ENV === "development") {
      console.log("✅ Response từ getAllExams:", response);
      console.log("✅ Response data:", response.data);
      console.log("✅ Response status:", response.status);
    }

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
 * Interface cho Question trong Exam
 */
export interface Question {
  id?: string;
  questionText?: string;
  type?: string;
  options?: string[];
  correctAnswer?: string | string[];
  marks?: number;
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
 * @returns GetExamByIdResponse với thông tin exam
 */
export const getExamById = async (examId: string): Promise<GetExamByIdResponse> => {
  try {
    const response = await apiClient.get<ExamDetail | GetExamByIdResponse>(
      `${API_ENDPOINTS.GET_EXAM_BY_ID}/${examId}`
    );

    // Xử lý cả hai trường hợp: API trả về exam trực tiếp hoặc object có cấu trúc
    if (response.data && !("success" in response.data) && !("status" in response.data)) {
      // API trả về exam trực tiếp
      return {
        success: true,
        status: "success",
        data: response.data as ExamDetail,
      };
    } else {
      // API trả về object có cấu trúc
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

