import React from "react";
import { Link } from "react-router-dom";
import styles from "./FlashcardCard.module.css";

export interface Flashcard {
  id: number;
  title: string;
  description?: string;
  totalCards?: number;
  language?: string;
  category?: string;
  image?: string;
}

interface FlashcardCardProps {
  flashcard: Flashcard;
  onEdit?: (flashcard: Flashcard) => void;
  onDelete?: (id: number) => void;
}

const FlashcardCard: React.FC<FlashcardCardProps> = ({
  flashcard,
  onEdit,
  onDelete,
}) => {
  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onEdit?.(flashcard);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm("Bạn có chắc chắn muốn xóa flashcard này không?")) {
      onDelete?.(flashcard.id);
    }
  };

  return (
    <Link to={`/flashcards/${flashcard.id}`} className={styles.card}>
      {/* Edit and Delete Icons */}
      <div className={styles.actionIcons}>
        {onEdit && (
          <button
            className={styles.editIcon}
            onClick={handleEdit}
            title="Sửa"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
        )}
        {onDelete && (
          <button
            className={styles.deleteIcon}
            onClick={handleDelete}
            title="Xóa"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              <line x1="10" y1="11" x2="10" y2="17" />
              <line x1="14" y1="11" x2="14" y2="17" />
            </svg>
          </button>
        )}
      </div>
      {flashcard.image && (
        <div className={styles.imageWrapper}>
          <img
            src={flashcard.image}
            alt={flashcard.title}
            className={styles.image}
            loading="lazy"
          />
          <div className={styles.imageOverlay} />
        </div>
      )}
      <div className={styles.content}>
        <h3 className={styles.title}>{flashcard.title}</h3>

        {flashcard.description && (
          <p className={styles.description}>{flashcard.description}</p>
        )}

        <div className={styles.metrics}>
          {flashcard.totalCards !== undefined && (
            <div className={styles.metricItem}>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <line x1="3" y1="9" x2="21" y2="9" />
                <line x1="9" y1="21" x2="9" y2="9" />
              </svg>
              <span className={styles.metricText}>{flashcard.totalCards} thẻ</span>
            </div>
          )}
        </div>

        <div className={styles.testStructure}>
          {flashcard.language && (
            <span className={styles.language}>{flashcard.language}</span>
          )}
          {flashcard.category && (
            <span className={styles.category}>{flashcard.category}</span>
          )}
        </div>
      </div>
      <div className={styles.actionButton}>
        Chi tiết
      </div>
    </Link>
  );
};

export default FlashcardCard;

