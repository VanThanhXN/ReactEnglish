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

// Mock data
const mockExamPackages: ExamPackage[] = [
  {
    id: 1,
    title: "Đề Thi Tiếng Anh Cơ Bản",
    description:
      "Đề thi kiểm tra kiến thức tiếng Anh cơ bản, phù hợp cho người mới bắt đầu",
    totalQuestions: 30,
    duration: 45,
    isActive: true,
    category: "Cơ bản",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    title: "Đề Thi IELTS Reading",
    description: "Luyện tập kỹ năng đọc hiểu với các đề thi IELTS thực tế",
    totalQuestions: 40,
    duration: 60,
    isActive: true,
    category: "IELTS",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 3,
    title: "Đề Thi TOEIC Listening",
    description:
      "Chuẩn bị cho kỳ thi TOEIC với các đề thi nghe hiểu chất lượng cao",
    totalQuestions: 100,
    duration: 45,
    isActive: true,
    category: "TOEIC",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 4,
    title: "Đề Thi Ngữ Pháp Nâng Cao",
    description:
      "Kiểm tra kiến thức ngữ pháp tiếng Anh từ trung cấp đến nâng cao",
    totalQuestions: 50,
    duration: 90,
    isActive: true,
    category: "Ngữ pháp",
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 5,
    title: "Đề Thi Từ Vựng Tiếng Anh",
    description: "Mở rộng vốn từ vựng với các đề thi từ vựng đa dạng",
    totalQuestions: 60,
    duration: 60,
    isActive: true,
    category: "Từ vựng",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 6,
    title: "Đề Thi Tiếng Anh Giao Tiếp",
    description: "Luyện tập các tình huống giao tiếp thực tế trong cuộc sống",
    totalQuestions: 25,
    duration: 30,
    isActive: false,
    category: "Giao tiếp",
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const generateMockQuestions = (
  examId: number,
  totalQuestions: number
): Question[] => {
  const questions: Question[] = [];
  for (let i = 1; i <= totalQuestions; i++) {
    questions.push({
      id: examId * 1000 + i,
      examId: examId,
      questionText: `Câu hỏi ${i}: Đây là câu hỏi mẫu số ${i} trong đề thi?`,
      orderNumber: i,
      explanation: `Giải thích cho câu hỏi ${i}`,
      createdAt: new Date().toISOString(),
      answers: [
        {
          id: (examId * 1000 + i) * 10 + 1,
          questionId: examId * 1000 + i,
          answerText: "Đáp án A",
          option: "A",
          isCorrect: i % 4 === 1,
          explanation: "Giải thích đáp án A",
        },
        {
          id: (examId * 1000 + i) * 10 + 2,
          questionId: examId * 1000 + i,
          answerText: "Đáp án B",
          option: "B",
          isCorrect: i % 4 === 2,
          explanation: "Giải thích đáp án B",
        },
        {
          id: (examId * 1000 + i) * 10 + 3,
          questionId: examId * 1000 + i,
          answerText: "Đáp án C",
          option: "C",
          isCorrect: i % 4 === 3,
          explanation: "Giải thích đáp án C",
        },
        {
          id: (examId * 1000 + i) * 10 + 4,
          questionId: examId * 1000 + i,
          answerText: "Đáp án D",
          option: "D",
          isCorrect: i % 4 === 0,
          explanation: "Giải thích đáp án D",
        },
      ],
    });
  }
  return questions;
};

/**
 * Lấy danh sách tất cả exam packages (dành cho user)
 * @returns GetExamPackagesResponse với danh sách exam packages
 */
export const getExamPackages = async (): Promise<GetExamPackagesResponse> => {
  try {
    const response =
      await apiClient.get<GetExamPackagesResponse>("/get-all-exam");
    return response.data;
  } catch (error: any) {
    // Fallback to mock data if API fails
    console.warn("API call failed, using mock data:", error);
    await new Promise((resolve) => setTimeout(resolve, 300));
    return {
      success: true,
      data: mockExamPackages,
    };
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
    const response = await apiClient.get<GetExamPackageByIdResponse>(
      `/exam/${examId}`
    );
    return response.data;
  } catch (error: any) {
    // Fallback to mock data if API fails
    console.warn("API call failed, using mock data:", error);
    await new Promise((resolve) => setTimeout(resolve, 300));

    const exam = mockExamPackages.find((e) => e.id === examId);

    if (!exam) {
      return {
        success: false,
        message: "Không tìm thấy đề thi",
      };
    }

    // Generate questions for the exam
    const examDetail: ExamPackageDetail = {
      ...exam,
      questions: generateMockQuestions(examId, exam.totalQuestions),
    };

    return {
      success: true,
      data: examDetail,
    };
  }
};
