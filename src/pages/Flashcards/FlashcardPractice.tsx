import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUser, isAuthenticated } from "../../utils/storage";
import type { User } from "../../types/api";
import styles from "./FlashcardPractice.module.css";

const FlashcardPractice: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user: User | null = getUser();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const words = [
    {
      id: 1,
      word: "Hello",
      meaning: "Xin chào",
      wordType: "Danh từ",
      pronunciation: "/həˈloʊ/",
      example: "Hello, how are you?",
      note: "Từ chào hỏi phổ biến",
    },
  ];

  if (!isAuthenticated() || user?.role === "admin") {
    return null;
  }

  const currentWord = words[currentIndex];
  const progress = ((currentIndex + 1) / words.length) * 100;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${progress}%` }}></div>
        </div>
        <p className={styles.progressText}>
          {currentIndex + 1} / {words.length}
        </p>
      </div>

      <div className={styles.cardContainer}>
        <div
          className={`${styles.card} ${isFlipped ? styles.flipped : ""}`}
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <div className={styles.cardFront}>
            <div className={styles.cardContent}>
              {currentWord.wordType && (
                <span className={styles.typeBadge}>{currentWord.wordType}</span>
              )}
              <h2 className={styles.wordText}>{currentWord.word}</h2>
              {currentWord.pronunciation && (
                <p className={styles.pronunciation}>{currentWord.pronunciation}</p>
              )}
              <p className={styles.flipHint}>Nhấp để xem nghĩa</p>
            </div>
          </div>
          <div className={styles.cardBack}>
            <div className={styles.cardContent}>
              <div className={styles.meaning}>
                <span className={styles.meaningLabel}>Định nghĩa:</span>
                <span className={styles.meaningText}>{currentWord.meaning}</span>
              </div>
              {currentWord.example && (
                <div className={styles.example}>
                  <span className={styles.exampleLabel}>Ví dụ:</span>
                  <span className={styles.exampleText}>{currentWord.example}</span>
                </div>
              )}
              {currentWord.note && (
                <div className={styles.note}>
                  <span className={styles.noteLabel}>Ghi chú:</span>
                  <span className={styles.noteText}>{currentWord.note}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.controls}>
        <button
          className={styles.navButton}
          onClick={() => {
            setCurrentIndex((prev) => Math.max(0, prev - 1));
            setIsFlipped(false);
          }}
          disabled={currentIndex === 0}
        >
          Câu trước
        </button>
        <button
          className={styles.navButton}
          onClick={() => {
            setCurrentIndex((prev) => Math.min(words.length - 1, prev + 1));
            setIsFlipped(false);
          }}
          disabled={currentIndex === words.length - 1}
        >
          Câu sau
        </button>
      </div>
    </div>
  );
};

export default FlashcardPractice;

