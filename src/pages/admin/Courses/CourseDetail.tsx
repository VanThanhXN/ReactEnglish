import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { getUser, isAuthenticated } from "../../../utils/storage";
import { getCourseById, type CourseDetail } from "../../../services/courseService";
import AdminLayout from "../../../components/admin/Layout/Layout";
import type { User } from "../../../types/api";
import styles from "./CourseDetail.module.css";

const AdminCourseDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const currentUser: User | null = getUser();
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const loadedIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (id && id !== loadedIdRef.current) {
      loadedIdRef.current = id;
      fetchCourse(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchCourse = async (courseId: string) => {
    try {
      setLoading(true);
      setError("");
      const response = await getCourseById(courseId);

      if (response.success && response.data) {
        setCourse(response.data);
      } else {
        setError("Không tìm thấy khóa học");
      }
    } catch (err: any) {
      console.error("❌ Lỗi khi lấy thông tin khóa học:", err);
      setError(err.message || "Có lỗi xảy ra khi lấy thông tin khóa học");
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

  if (!currentUser || currentUser.role !== "admin") {
    return null;
  }

  return (
    <AdminLayout>
      <div className={styles.container}>
        <div className={styles.header}>
          <Link to="/admin/courses" className={styles.backButton}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Quay lại
          </Link>
          <h1 className={styles.title}>Chi tiết khóa học</h1>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        {loading ? (
          <div className={styles.loading}>Đang tải thông tin...</div>
        ) : course ? (
          <div className={styles.courseCard}>
            <div className={styles.courseHeader}>
              <img
                src={course.image}
                alt={course.title}
                className={styles.courseImage}
              />
              <div className={styles.courseInfo}>
                <h2 className={styles.courseTitle}>{course.title}</h2>
                <p className={styles.courseDescription}>{course.description}</p>
              <div className={styles.courseMeta}>
                <span className={styles.metaItem}>{course.lessons} bài học</span>
                <span className={styles.metaItem}>{course.duration} giờ</span>
              </div>
              </div>
            </div>

            <div className={styles.courseDetails}>
              <div className={styles.detailSection}>
                <h3 className={styles.sectionTitle}>Thông tin cơ bản</h3>
                <div className={styles.detailGrid}>
                  <div className={styles.detailItem}>
                    <span className={styles.label}>ID:</span>
                    <span className={styles.value}>{course.id}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.label}>Giảng viên:</span>
                    <span className={styles.value}>{course.instructor}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.label}>Danh mục:</span>
                    <span className={styles.value}>{course.category}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.label}>Cấp độ:</span>
                    <span className={`${styles.level} ${
                      course.level === "beginner" ? styles.levelBeginner :
                      course.level === "intermediate" ? styles.levelIntermediate :
                      styles.levelAdvanced
                    }`}>
                      {getLevelLabel(course.level)}
                    </span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.label}>Giá:</span>
                    <span className={styles.value}>
                      {formatPrice(course.price)}
                      {course.originalPrice && course.originalPrice > course.price && (
                        <span className={styles.originalPrice}> ({formatPrice(course.originalPrice)})</span>
                      )}
                    </span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.label}>Trạng thái:</span>
                    <span className={`${styles.status} ${course.isFree ? styles.statusFree : styles.statusPaid}`}>
                      {course.isFree ? "Miễn phí" : "Trả phí"}
                    </span>
                  </div>
                </div>
              </div>

              {course.whatYouWillLearn && course.whatYouWillLearn.length > 0 && (
                <div className={styles.detailSection}>
                  <h3 className={styles.sectionTitle}>Bạn sẽ học được gì</h3>
                  <ul className={styles.learnList}>
                    {course.whatYouWillLearn.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {course.requirements && course.requirements.length > 0 && (
                <div className={styles.detailSection}>
                  <h3 className={styles.sectionTitle}>Yêu cầu</h3>
                  <ul className={styles.requirementsList}>
                    {course.requirements.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {course.curriculum && course.curriculum.length > 0 && (
                <div className={styles.detailSection}>
                  <h3 className={styles.sectionTitle}>Chương trình học ({course.curriculum.length} bài)</h3>
                  <div className={styles.curriculumList}>
                    {course.curriculum.map((lesson, index) => (
                      <div key={lesson.id} className={styles.lessonItem}>
                        <div className={styles.lessonNumber}>{index + 1}</div>
                        <div className={styles.lessonContent}>
                          <div className={styles.lessonTitle}>{lesson.title}</div>
                          <div className={styles.lessonMeta}>
                            <span className={styles.lessonType}>{lesson.type}</span>
                            <span className={styles.lessonDuration}>{formatDuration(lesson.duration)}</span>
                            {lesson.isPreview && (
                              <span className={styles.lessonPreview}>Xem trước</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {course.instructorBio && (
                <div className={styles.detailSection}>
                  <h3 className={styles.sectionTitle}>Về giảng viên</h3>
                  <p className={styles.instructorBio}>{course.instructorBio}</p>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </AdminLayout>
  );
};

export default AdminCourseDetail;

