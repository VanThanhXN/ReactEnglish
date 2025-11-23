import React from "react";
import { Link } from "react-router-dom";
import type { ExamPackage } from "../../../services/examService";
import styles from "./ExamCard.module.css";

interface ExamCardProps {
  exam: ExamPackage & { image?: string };
}

const ExamCard: React.FC<ExamCardProps> = ({ exam }) => {
  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} phút`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}p` : `${hours}h`;
  };

  const isNew = () => {
    if (!exam.createdAt) return false;
    const created = new Date(exam.createdAt);
    const now = new Date();
    const diffDays = Math.floor(
      (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24)
    );
    return diffDays <= 7;
  };

  return (
    <Link to={`/exams/${exam.id}`} className={styles.card}>
      <div className={styles.content}>
        <div className={styles.badges}>
          {isNew() && <div className={styles.badgeNew}>Mới</div>}
          {exam.isActive !== false ? (
            <div className={styles.badgeActive}>Đang mở</div>
          ) : (
            <div className={styles.badgeInactive}>Đã đóng</div>
          )}
        </div>
        <h3 className={styles.title}>{exam.title}</h3>
        <p className={styles.description}>{exam.description}</p>

        <div className={styles.stats}>
          <div className={styles.statItem}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span>{formatDuration(exam.duration)}</span>
          </div>
          <div className={styles.statItem}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7" />
            </svg>
            <span>{exam.totalQuestions} câu</span>
          </div>
        </div>
      </div>

      <div className={styles.actionButton}>
        Chi tiết
      </div>
    </Link>
  );
};

export default ExamCard;

