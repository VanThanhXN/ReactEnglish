import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getUser, isAuthenticated } from "../../utils/storage";
import type { User } from "../../types/api";
import styles from "./FlashcardDetail.module.css";

interface Word {
  id: number;
  word: string;
  meaning: string;
  wordType?: string;
  pronunciation?: string;
  example?: string;
  note?: string;
}

const FlashcardDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user: User | null = getUser();
  const [words, setWords] = useState<Word[]>([
    {
      id: 1,
      word: "Hello",
      meaning: "Xin chào",
      wordType: "Danh từ",
      pronunciation: "/həˈloʊ/",
      example: "Hello, how are you?",
      note: "Từ chào hỏi phổ biến",
    },
  ]);

  const handlePractice = () => {
    if (id) {
      navigate(`/flashcards/${id}/practice`);
    }
  };

  if (!isAuthenticated() || user?.role === "admin") {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Flashcard: Từ vựng tiếng Anh cơ bản</h1>
        <button onClick={handlePractice} className={styles.practiceButton} disabled={words.length === 0}>
          Bắt đầu luyện tập
        </button>
      </div>

      <div className={styles.wordsList}>
        {words.length > 0 ? (
          words.map((word) => (
            <div key={word.id} className={styles.wordItem}>
              <div className={styles.wordHeader}>
                <h3 className={styles.wordText}>{word.word}</h3>
                {word.wordType && (
                  <span className={styles.wordType}>
                    <span className={styles.typeLabel}>Loại từ:</span>
                    <span className={styles.typeText}>{word.wordType}</span>
                  </span>
                )}
              </div>
              <div className={styles.wordContent}>
                <div className={styles.meaning}>
                  <span className={styles.meaningLabel}>Định nghĩa:</span>
                  <span className={styles.meaningText}>{word.meaning}</span>
                </div>
                {word.pronunciation && (
                  <div className={styles.pronunciation}>
                    <span className={styles.pronunciationLabel}>Phiên âm:</span>
                    <span className={styles.pronunciationText}>{word.pronunciation}</span>
                  </div>
                )}
                {word.example && (
                  <div className={styles.example}>
                    <span className={styles.exampleLabel}>Ví dụ:</span>
                    <span className={styles.exampleText}>{word.example}</span>
                  </div>
                )}
                {word.note && (
                  <div className={styles.note}>
                    <span className={styles.noteLabel}>Ghi chú:</span>
                    <span className={styles.noteText}>{word.note}</span>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className={styles.emptyWords}>
            <p>Chưa có từ vựng nào. Hãy thêm từ mới để bắt đầu học!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlashcardDetail;

