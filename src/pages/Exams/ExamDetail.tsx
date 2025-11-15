import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getExamPackageById,
  type ExamPackageDetail,
} from "../../services/examService";
import styles from "./ExamDetail.module.css";

const ExamDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [exam, setExam] = useState<ExamPackageDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  useEffect(() => {
    if (id) {
      fetchExam();
    }
  }, [id]);

  const fetchExam = async () => {
    try {
      setLoading(true);
      const response = await getExamPackageById(parseInt(id!));
      if (response.success && response.data) {
        setExam(response.data);
      } else {
        navigate("/exams");
      }
    } catch (error) {
      console.error("Error fetching exam:", error);
      navigate("/exams");
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} phút`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}p` : `${hours}h`;
  };

  const handleStartExam = () => {
    if (exam?.isActive !== false) {
      setShowConfirmDialog(true);
    }
  };

  const confirmStartExam = () => {
    setShowConfirmDialog(false);
    navigate(`/exams/${id}/take`);
  };

  const cancelStartExam = () => {
    setShowConfirmDialog(false);
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div>Đang tải...</div>
      </div>
    );
  }

  if (!exam) {
    return null;
  }

  return (
    <div className={styles.container}>
      {/* Main Content */}
      <div className={styles.mainContent}>
        <div className={styles.contentWrapper}>
          {/* Left Column - Main Content */}
          <div className={styles.leftColumn}>
            {/* Exam Info */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Thông tin đề thi</h2>
              <div className={styles.infoGrid}>
                <div className={styles.infoCard}>
                  <div className={styles.infoIcon}>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  </div>
                  <div className={styles.infoContent}>
                    <h3 className={styles.infoLabel}>Thời gian làm bài</h3>
                    <p className={styles.infoValue}>
                      {formatDuration(exam.duration)}
                    </p>
                  </div>
                </div>
                <div className={styles.infoCard}>
                  <div className={styles.infoIcon}>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M9 11l3 3L22 4" />
                      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7" />
                    </svg>
                  </div>
                  <div className={styles.infoContent}>
                    <h3 className={styles.infoLabel}>Số câu hỏi</h3>
                    <p className={styles.infoValue}>
                      {exam.totalQuestions} câu
                    </p>
                  </div>
                </div>
                <div className={styles.infoCard}>
                  <div className={styles.infoIcon}>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                  </div>
                  <div className={styles.infoContent}>
                    <h3 className={styles.infoLabel}>Loại đề thi</h3>
                    <p className={styles.infoValue}>Trắc nghiệm</p>
                  </div>
                </div>
                <div className={styles.infoCard}>
                  <div className={styles.infoIcon}>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M12 2L2 7l10 5 10-5-10-5z" />
                      <path d="M2 17l10 5 10-5" />
                      <path d="M2 12l10 5 10-5" />
                    </svg>
                  </div>
                  <div className={styles.infoContent}>
                    <h3 className={styles.infoLabel}>Độ khó</h3>
                    <p className={styles.infoValue}>Trung bình</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Instructions */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Hướng dẫn làm bài</h2>
              <ul className={styles.instructionsList}>
                <li className={styles.instructionItem}>
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
                  <span>
                    Đọc kỹ câu hỏi trước khi chọn đáp án
                  </span>
                </li>
                <li className={styles.instructionItem}>
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
                  <span>
                    Bạn có thể đánh dấu câu hỏi để xem lại sau
                  </span>
                </li>
                <li className={styles.instructionItem}>
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
                  <span>
                    Thời gian sẽ tự động kết thúc khi hết giờ
                  </span>
                </li>
                <li className={styles.instructionItem}>
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
                  <span>
                    Kiểm tra lại đáp án trước khi nộp bài
                  </span>
                </li>
              </ul>
            </section>
          </div>

          {/* Right Column - Sidebar */}
          <div className={styles.rightColumn}>
            <div className={styles.sidebar}>
              <div className={styles.sidebarHeader}>
                <h3 className={styles.sidebarTitle}>Bắt đầu làm bài</h3>
              </div>
              <div className={styles.sidebarInfo}>
                <div className={styles.sidebarInfoItem}>
                  <span className={styles.sidebarInfoLabel}>Thời gian:</span>
                  <span className={styles.sidebarInfoValue}>
                    {formatDuration(exam.duration)}
                  </span>
                </div>
                <div className={styles.sidebarInfoItem}>
                  <span className={styles.sidebarInfoLabel}>Số câu:</span>
                  <span className={styles.sidebarInfoValue}>
                    {exam.totalQuestions} câu
                  </span>
                </div>
                <div className={styles.sidebarInfoItem}>
                  <span className={styles.sidebarInfoLabel}>Trạng thái:</span>
                  <span className={styles.sidebarInfoValue}>
                    {exam.isActive !== false ? "Đang mở" : "Đã đóng"}
                  </span>
                </div>
              </div>
              {exam.isActive !== false ? (
                <button
                  className={styles.startButton}
                  onClick={handleStartExam}
                >
                  Bắt đầu làm bài
                </button>
              ) : (
                <button className={styles.startButtonDisabled} disabled>
                  Đề thi đã đóng
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className={styles.dialogOverlay} onClick={cancelStartExam}>
          <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.dialogTitle}>Xác nhận bắt đầu làm bài</h3>
            <p className={styles.dialogMessage}>
              Bạn có chắc chắn muốn bắt đầu làm bài thi này không? Thời gian sẽ bắt đầu đếm ngược ngay khi bạn bắt đầu.
            </p>
            <div className={styles.dialogActions}>
              <button
                className={styles.dialogCancel}
                onClick={cancelStartExam}
              >
                Hủy
              </button>
              <button
                className={styles.dialogConfirm}
                onClick={confirmStartExam}
              >
                Bắt đầu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamDetail;
