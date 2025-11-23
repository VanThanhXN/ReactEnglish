import React from "react";
import styles from "./Pagination.module.css";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
  showInfo?: boolean;
  totalItems?: number;
  itemsPerPage?: number;
  startIndex?: number;
  endIndex?: number;
  hideWhenSinglePage?: boolean;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  disabled = false,
  showInfo = false,
  totalItems,
  itemsPerPage,
  startIndex,
  endIndex,
  hideWhenSinglePage = true,
}) => {
  const handlePageClick = (page: number) => {
    if (!disabled && page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevious = () => {
    if (!disabled && currentPage > 1) {
      handlePageClick(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (!disabled && currentPage < totalPages) {
      handlePageClick(currentPage + 1);
    }
  };

  // Chỉ hiển thị khi có nhiều hơn giới hạn items hoặc có nhiều hơn 1 trang
  const shouldShow = hideWhenSinglePage 
    ? totalPages > 1 && (totalItems === undefined || itemsPerPage === undefined || totalItems > itemsPerPage)
    : totalPages > 1;

  if (!shouldShow) {
    return null;
  }

  return (
    <div className={styles.pagination}>
      {showInfo && totalItems !== undefined && (
        <div className={styles.paginationInfo}>
          Hiển thị {startIndex !== undefined ? startIndex + 1 : 1} - {endIndex !== undefined ? Math.min(endIndex, totalItems) : totalItems} trong tổng số {totalItems} mục
        </div>
      )}

      <div className={styles.paginationControls}>
        <button
          className={styles.paginationButton}
          onClick={handlePrevious}
          disabled={currentPage === 1 || disabled}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
          Trước
        </button>

        <div className={styles.paginationNumbers}>
          {totalPages <= 7 ? (
            Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`${styles.paginationNumber} ${
                  currentPage === page ? styles.active : ""
                }`}
                onClick={() => handlePageClick(page)}
                disabled={disabled}
              >
                {page}
              </button>
            ))
          ) : (
            <>
              <button
                className={`${styles.paginationNumber} ${
                  currentPage === 1 ? styles.active : ""
                }`}
                onClick={() => handlePageClick(1)}
                disabled={disabled}
              >
                1
              </button>
              {currentPage > 3 && (
                <span className={styles.paginationDots}>...</span>
              )}
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(
                  (page) =>
                    page > 1 &&
                    page < totalPages &&
                    Math.abs(page - currentPage) <= 1
                )
                .map((page) => (
                  <button
                    key={page}
                    className={`${styles.paginationNumber} ${
                      currentPage === page ? styles.active : ""
                    }`}
                    onClick={() => handlePageClick(page)}
                    disabled={disabled}
                  >
                    {page}
                  </button>
                ))}
              {currentPage < totalPages - 2 && (
                <span className={styles.paginationDots}>...</span>
              )}
              <button
                className={`${styles.paginationNumber} ${
                  currentPage === totalPages ? styles.active : ""
                }`}
                onClick={() => handlePageClick(totalPages)}
                disabled={disabled}
              >
                {totalPages}
              </button>
            </>
          )}
        </div>

        <button
          className={styles.paginationButton}
          onClick={handleNext}
          disabled={currentPage === totalPages || disabled}
        >
          Sau
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Pagination;
