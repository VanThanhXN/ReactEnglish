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
  const response =
    await apiClient.get<GetExamPackagesResponse>("/get-all-exam");
  return response.data;
};

/**
 * Lấy thông tin exam package theo ID (dành cho user)
 * @param examId - ID của exam package cần lấy
 * @returns GetExamPackageByIdResponse với thông tin exam package
 */
export const getExamPackageById = async (
  examId: number
): Promise<GetExamPackageByIdResponse> => {
  const response = await apiClient.get<GetExamPackageByIdResponse>(
    `/exam/${examId}`
  );
  return response.data;
};
