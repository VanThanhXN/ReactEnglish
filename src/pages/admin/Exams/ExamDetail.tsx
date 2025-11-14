import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { getUser, isAuthenticated } from "../../../utils/storage";
import { getExamById, type ExamDetail } from "../../../services/adminService";
import AdminLayout from "../../../components/admin/Layout/Layout";
import type { User } from "../../../types/api";
import styles from "./ExamDetail.module.css";

const AdminExamDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const currentUser: User | null = getUser();
  const [exam, setExam] = useState<ExamDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const loadedIdRef = useRef<string | null>(null);

  useEffect(() => {
    // Kiểm tra authentication và role
    if (!isAuthenticated()) {
      navigate("/admin/login");
      return;
    }

    if (currentUser?.role !== "admin") {
      navigate("/dashboard");
      return;
    }

    // Lấy thông tin exam - chỉ load khi id thay đổi hoặc chưa load id này
    if (id && id !== loadedIdRef.current) {
      loadedIdRef.current = id;
      fetchExam(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]); // Chỉ chạy khi id thay đổi

  const fetchExam = async (examId: string) => {
    try {
      setLoading(true);
      setError("");
      const response = await getExamById(examId);

      if (
        (response.success || response.status === "success") &&
        response.data
      ) {
        setExam(response.data);
      } else {
        setError(response.message || "Không thể lấy thông tin đề thi");
      }
    } catch (err: any) {
      console.error("❌ Lỗi khi lấy thông tin đề thi:", err);
      
      if (err.response?.status === 404) {
        setError("Không tìm thấy đề thi với ID này.");
      } else if (err.response?.status === 401) {
        setError("Token không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại.");
      } else if (err.response?.status === 403) {
        setError("Bạn không có quyền truy cập. Chỉ admin mới có thể xem thông tin đề thi.");
      } else if (err.response?.status === 429) {
        setError(err.message || "Quá nhiều yêu cầu. Vui lòng thử lại sau.");
      } else {
        setError(err.message || "Có lỗi xảy ra khi lấy thông tin đề thi");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser || currentUser.role !== "admin") {
    return null;
  }

  return (
    <AdminLayout>
      <div className={styles.container}>
        <div className={styles.header}>
          <Link to="/admin/exams" className={styles.backButton}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Quay lại
          </Link>
          <h1 className={styles.title}>Chi tiết đề thi</h1>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        {loading ? (
          <div className={styles.loading}>Đang tải thông tin...</div>
        ) : exam ? (
          <div className={styles.examCard}>
            <div className={styles.examHeader}>
              <h2 className={styles.examTitle}>{exam.title}</h2>
              <p className={styles.examDescription}>{exam.description}</p>
            </div>

            <div className={styles.examDetails}>
              <div className={styles.detailRow}>
                <span className={styles.label}>ID:</span>
                <span className={styles.value}>{exam.id}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.label}>Tiêu đề:</span>
                <span className={styles.value}>{exam.title}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.label}>Mô tả:</span>
                <span className={styles.value}>{exam.description || "-"}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.label}>Thời gian:</span>
                <span className={styles.value}>{exam.duration} phút</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.label}>Tổng điểm:</span>
                <span className={styles.value}>{exam.totalMarks}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.label}>Số câu hỏi:</span>
                <span className={styles.value}>{exam.totalQuestions || 0}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.label}>Trạng thái:</span>
                <span className={`${styles.status} ${exam.isActive ? styles.statusActive : styles.statusInactive}`}>
                  {exam.isActive ? "Hoạt động" : "Không hoạt động"}
                </span>
              </div>
              {exam.createdAt && (
                <div className={styles.detailRow}>
                  <span className={styles.label}>Ngày tạo:</span>
                  <span className={styles.value}>
                    {new Date(exam.createdAt).toLocaleString("vi-VN")}
                  </span>
                </div>
              )}
              {exam.updatedAt && (
                <div className={styles.detailRow}>
                  <span className={styles.label}>Ngày cập nhật:</span>
                  <span className={styles.value}>
                    {new Date(exam.updatedAt).toLocaleString("vi-VN")}
                  </span>
                </div>
              )}
            </div>

            <div className={styles.questionsSection}>
              <h3 className={styles.questionsTitle}>
                Danh sách câu hỏi ({exam.questions?.length || 0})
              </h3>
              {exam.questions && exam.questions.length > 0 ? (
                <div className={styles.questionsList}>
                  {exam.questions.map((question, index) => (
                    <div key={question.id || index} className={styles.questionItem}>
                      <div className={styles.questionHeader}>
                        <span className={styles.questionNumber}>Câu {index + 1}</span>
                        {question.marks && (
                          <span className={styles.questionMarks}>
                            {question.marks} điểm
                          </span>
                        )}
                      </div>
                      {question.questionText && (
                        <p className={styles.questionText}>{question.questionText}</p>
                      )}
                      {question.type && (
                        <span className={styles.questionType}>Loại: {question.type}</span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles.noQuestions}>
                  <p>Chưa có câu hỏi nào trong đề thi này.</p>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </AdminLayout>
  );
};

export default AdminExamDetail;



