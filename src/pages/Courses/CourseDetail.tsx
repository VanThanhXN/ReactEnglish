import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getCourseById,
  type CourseDetail,
} from "../../services/courseService";
import styles from "./CourseDetail.module.css";

const CourseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchCourse();
    }
  }, [id]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const response = await getCourseById(id!);
      if (response.success && response.data) {
        setCourse(response.data);
      } else {
        navigate("/courses");
      }
    } catch (error) {
      console.error("Error fetching course:", error);
      navigate("/courses");
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    if (price === 0) return "Miễn phí";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "beginner":
        return "#10b981";
      case "intermediate":
        return "#f59e0b";
      case "advanced":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  const getLevelLabel = (level: string) => {
    switch (level) {
      case "beginner":
        return "Cơ bản";
      case "intermediate":
        return "Trung bình";
      case "advanced":
        return "Nâng cao";
      default:
        return level;
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins > 0 ? `${mins}m` : ""}`;
    }
    return `${mins}m`;
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div>Đang tải...</div>
      </div>
    );
  }

  if (!course) {
    return null;
  }

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroBackground}>
          <div className={styles.heroGradient}></div>
          <img
            src={course.image}
            alt={course.title}
            className={styles.heroImage}
          />
        </div>
        <div className={styles.heroContent}>
          <div className={styles.heroMeta}>
            <span
              className={styles.level}
              style={{ color: getLevelColor(course.level) }}
            >
              {getLevelLabel(course.level)}
            </span>
            <span className={styles.category}>{course.category}</span>
          </div>
          <h1 className={styles.heroTitle}>{course.title}</h1>
          <p className={styles.heroDescription}>{course.description}</p>
          <div className={styles.heroInfo}>
            <span className={styles.infoItem}>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              {course.duration} giờ
            </span>
            <span className={styles.infoItem}>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              {course.lessons} bài học
            </span>
            <span className={styles.infoItem}>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              {course.instructor}
            </span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className={styles.mainContent}>
        <div className={styles.contentWrapper}>
          {/* Left Column - Main Content */}
          <div className={styles.leftColumn}>
            {/* What You Will Learn */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Bạn sẽ học được gì</h2>
              <ul className={styles.learnList}>
                {course.whatYouWillLearn.map((item, index) => (
                  <li key={index} className={styles.learnItem}>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Requirements */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Yêu cầu</h2>
              <ul className={styles.requirementsList}>
                {course.requirements.map((item, index) => (
                  <li key={index} className={styles.requirementItem}>
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Curriculum */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Nội dung khóa học</h2>
              <div className={styles.curriculum}>
                {course.curriculum.map((lesson, index) => (
                  <div key={lesson.id} className={styles.lessonItem}>
                    <div className={styles.lessonHeader}>
                      <div className={styles.lessonNumber}>{index + 1}</div>
                      <div className={styles.lessonInfo}>
                        <h3 className={styles.lessonTitle}>{lesson.title}</h3>
                        <div className={styles.lessonMeta}>
                          <span className={styles.lessonType}>
                            {lesson.type === "video"
                              ? "Video"
                              : lesson.type === "quiz"
                              ? "Quiz"
                              : "Bài tập"}
                          </span>
                          <span className={styles.lessonDuration}>
                            {formatDuration(lesson.duration)}
                          </span>
                          {lesson.isPreview && (
                            <span className={styles.previewBadge}>Xem trước</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Instructor */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Giảng viên</h2>
              <div className={styles.instructorCard}>
                <div className={styles.instructorAvatar}>
                  {course.instructor.charAt(0).toUpperCase()}
                </div>
                <div className={styles.instructorInfo}>
                  <h3 className={styles.instructorName}>{course.instructor}</h3>
                  <p className={styles.instructorBio}>{course.instructorBio}</p>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column - Sidebar */}
          <div className={styles.rightColumn}>
            <div className={styles.sidebar}>
              <div className={styles.sidebarImage}>
                <img src={course.image} alt={course.title} />
              </div>
              <div className={styles.sidebarPrice}>
                {course.originalPrice && (
                  <span className={styles.originalPrice}>
                    {formatPrice(course.originalPrice)}
                  </span>
                )}
                <span className={styles.currentPrice}>
                  {formatPrice(course.price)}
                </span>
              </div>
              <button className={styles.enrollButton}>Thanh toán</button>
              <div className={styles.sidebarInfo}>
                <div className={styles.sidebarInfoItem}>
                  <span className={styles.sidebarInfoLabel}>Thời lượng:</span>
                  <span className={styles.sidebarInfoValue}>
                    {course.duration} giờ
                  </span>
                </div>
                <div className={styles.sidebarInfoItem}>
                  <span className={styles.sidebarInfoLabel}>Số bài học:</span>
                  <span className={styles.sidebarInfoValue}>
                    {course.lessons} bài
                  </span>
                </div>
                <div className={styles.sidebarInfoItem}>
                  <span className={styles.sidebarInfoLabel}>Trình độ:</span>
                  <span className={styles.sidebarInfoValue}>
                    {getLevelLabel(course.level)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;

