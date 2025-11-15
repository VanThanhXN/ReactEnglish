export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  instructorAvatar?: string;
  image: string;
  price: number;
  originalPrice?: number;
  level: "beginner" | "intermediate" | "advanced";
  category: string;
  duration: number; // in hours
  lessons: number;
  rating: number;
  reviews: number;
  isFree: boolean;
  isNew?: boolean;
  isPopular?: boolean;
}

export interface CourseDetail extends Course {
  whatYouWillLearn: string[];
  requirements: string[];
  curriculum: Lesson[];
  instructorBio: string;
}

export interface Lesson {
  id: string;
  title: string;
  duration: number; // in minutes
  type: "video" | "quiz" | "assignment";
  isPreview: boolean;
}

// Mock data
const mockCourses: Course[] = [
  {
    id: "1",
    title: "Tiếng Anh Giao Tiếp Cơ Bản",
    description: "Khóa học giúp bạn tự tin giao tiếp tiếng Anh trong các tình huống hàng ngày",
    instructor: "Nguyễn Văn A",
    image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&h=600&fit=crop&q=80",
    price: 299000,
    originalPrice: 499000,
    level: "beginner",
    category: "Giao tiếp",
    duration: 20,
    lessons: 45,
    rating: 4.8,
    reviews: 1250,
    isFree: false,
    isNew: true,
    isPopular: true,
  },
  {
    id: "2",
    title: "Ngữ Pháp Tiếng Anh Nâng Cao",
    description: "Nắm vững ngữ pháp tiếng Anh từ cơ bản đến nâng cao với phương pháp học hiện đại",
    instructor: "Trần Thị B",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=600&fit=crop&q=80",
    price: 399000,
    level: "advanced",
    category: "Ngữ pháp",
    duration: 30,
    lessons: 60,
    rating: 4.9,
    reviews: 890,
    isFree: false,
    isPopular: true,
  },
  {
    id: "3",
    title: "Luyện Thi IELTS",
    description: "Chuẩn bị tốt nhất cho kỳ thi IELTS với các bài luyện tập và tips từ chuyên gia",
    instructor: "Lê Văn C",
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=600&fit=crop&q=80",
    price: 599000,
    originalPrice: 899000,
    level: "intermediate",
    category: "IELTS",
    duration: 40,
    lessons: 80,
    rating: 4.7,
    reviews: 2100,
    isFree: false,
    isPopular: true,
  },
  {
    id: "4",
    title: "Phát Âm Chuẩn Tiếng Anh",
    description: "Cải thiện phát âm và ngữ điệu tiếng Anh với các bài tập thực hành",
    instructor: "Phạm Thị D",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600&fit=crop&q=80",
    price: 249000,
    level: "beginner",
    category: "Giao tiếp",
    duration: 15,
    lessons: 30,
    rating: 4.6,
    reviews: 650,
    isFree: false,
  },
  {
    id: "5",
    title: "Tiếng Anh Thương Mại",
    description: "Học tiếng Anh chuyên ngành thương mại và kinh doanh quốc tế",
    instructor: "Hoàng Văn E",
    image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=600&fit=crop&q=80",
    price: 449000,
    level: "intermediate",
    category: "Từ vựng",
    duration: 25,
    lessons: 50,
    rating: 4.8,
    reviews: 1100,
    isFree: false,
    isNew: true,
  },
  {
    id: "6",
    title: "Tiếng Anh Miễn Phí - Cơ Bản",
    description: "Khóa học miễn phí giúp bạn bắt đầu học tiếng Anh từ con số 0",
    instructor: "Nguyễn Thị F",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop&q=80",
    price: 0,
    level: "beginner",
    category: "Cơ bản",
    duration: 10,
    lessons: 20,
    rating: 4.5,
    reviews: 3200,
    isFree: true,
    isPopular: true,
  },
];

export const getCourses = async (filters?: {
  category?: string;
  level?: string;
  search?: string;
}): Promise<{ success: boolean; data: Course[] }> => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 300));

  let filteredCourses = [...mockCourses];

  if (filters?.category && filters.category !== "all") {
    filteredCourses = filteredCourses.filter(
      (course) => course.category === filters.category
    );
  }

  if (filters?.level && filters.level !== "all") {
    filteredCourses = filteredCourses.filter(
      (course) => course.level === filters.level
    );
  }

  if (filters?.search) {
    const searchLower = filters.search.toLowerCase();
    filteredCourses = filteredCourses.filter(
      (course) =>
        course.title.toLowerCase().includes(searchLower) ||
        course.description.toLowerCase().includes(searchLower) ||
        course.instructor.toLowerCase().includes(searchLower)
    );
  }

  return {
    success: true,
    data: filteredCourses,
  };
};

export const getCourseById = async (
  id: string
): Promise<{ success: boolean; data: CourseDetail | null }> => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 300));

  const course = mockCourses.find((c) => c.id === id);

  if (!course) {
    return { success: false, data: null };
  }

  const courseDetail: CourseDetail = {
    ...course,
    whatYouWillLearn: [
      "Tự tin giao tiếp tiếng Anh trong các tình huống hàng ngày",
      "Nắm vững từ vựng và ngữ pháp cơ bản",
      "Phát âm chuẩn và tự nhiên",
      "Hiểu và sử dụng các thành ngữ phổ biến",
    ],
    requirements: [
      "Không cần kiến thức trước",
      "Có kết nối internet ổn định",
      "Máy tính hoặc điện thoại để học",
    ],
    curriculum: [
      {
        id: "1",
        title: "Giới thiệu khóa học",
        duration: 10,
        type: "video",
        isPreview: true,
      },
      {
        id: "2",
        title: "Chào hỏi và giới thiệu bản thân",
        duration: 25,
        type: "video",
        isPreview: false,
      },
      {
        id: "3",
        title: "Bài tập thực hành chào hỏi",
        duration: 15,
        type: "quiz",
        isPreview: false,
      },
      {
        id: "4",
        title: "Mua sắm và đàm phán giá",
        duration: 30,
        type: "video",
        isPreview: false,
      },
    ],
    instructorBio:
      "Giáo viên có hơn 10 năm kinh nghiệm giảng dạy tiếng Anh, chuyên về giao tiếp và phát âm. Đã giúp hàng nghìn học viên tự tin giao tiếp tiếng Anh.",
  };

  return {
    success: true,
    data: courseDetail,
  };
};

export const getCategories = (): string[] => {
  const categories = new Set(mockCourses.map((course) => course.category));
  return Array.from(categories);
};

