import React from "react";
import { Link } from "react-router-dom";
import type { Course } from "../../../services/courseService";
import styles from "./CourseCard.module.css";

interface CourseCardProps {
  course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
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

  return (
    <Link to={`/courses/${course.id}`} className={styles.card}>
      <div className={styles.imageWrapper}>
        <img src={course.image} alt={course.title} className={styles.image} />
        <div className={styles.overlay}></div>
        {course.isNew && (
          <div className={styles.badgeNew}>Mới</div>
        )}
        {course.isPopular && (
          <div className={styles.badgePopular}>Phổ biến</div>
        )}
        {course.isFree && (
          <div className={styles.badgeFree}>Miễn phí</div>
        )}
        <div className={styles.hoverEffect}></div>
      </div>

      <div className={styles.content}>
        <div className={styles.meta}>
          <span
            className={styles.level}
            style={{ color: getLevelColor(course.level) }}
          >
            {getLevelLabel(course.level)}
          </span>
          <span className={styles.category}>{course.category}</span>
        </div>

        <h3 className={styles.title}>{course.title}</h3>
        <p className={styles.description}>{course.description}</p>

        <div className={styles.info}>
          <span className={styles.infoItem}>
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
            {course.duration}h
          </span>
          <span className={styles.infoItem}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            {course.lessons} bài
          </span>
        </div>

        <div className={styles.footer}>
          <div className={styles.instructor}>
            <span>{course.instructor}</span>
          </div>
          <div className={styles.price}>
            {course.originalPrice && (
              <span className={styles.originalPrice}>
                {formatPrice(course.originalPrice)}
              </span>
            )}
            <span className={styles.currentPrice}>
              {formatPrice(course.price)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;

