import React from "react";
import styles from "./Pagination.module.css";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const handlePageClick = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
      }
  };

  return (
    <div className={styles.pagination}>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
      <button
          key={page}
          className={`${styles.pageButton} ${currentPage === page ? styles.active : ""}`}
          onClick={() => handlePageClick(page)}
        >
          {page}
      </button>
      ))}
      {currentPage < totalPages && (
            <button
          className={`${styles.pageButton} ${styles.nextButton}`}
          onClick={() => handlePageClick(currentPage + 1)}
            >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
      >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
      </button>
      )}
    </div>
  );
};

export default Pagination;
