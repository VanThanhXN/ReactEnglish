import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCardsByDeckId, getDeckById, FlashcardWord, FlashcardDeck } from "../../services/flashcardService";
import styles from "./FlashcardPractice.module.css";

const FlashcardPractice: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [deck, setDeck] = useState<FlashcardDeck | null>(null);
  const [words, setWords] = useState<FlashcardWord[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        
        // Fetch deck info
        const deckResponse = await getDeckById(Number(id));
        if (deckResponse.success && deckResponse.data) {
          setDeck(deckResponse.data);
        }

        // Fetch cards
        const cardsResponse = await getCardsByDeckId(Number(id));
        if (cardsResponse.success && cardsResponse.data) {
          setWords(cardsResponse.data);
        }
      } catch (err: any) {
        setError(err.message || "Có lỗi xảy ra");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return <div className={styles.loading}>Đang tải...</div>;
  }

  if (error || !deck || words.length === 0) {
    return (
      <div className={styles.error}>
        <p>{error || "Không có thẻ nào để luyện tập"}</p>
        <button onClick={() => navigate(`/flashcards/${id}`)}>
          Quay lại
        </button>
      </div>
    );
  }

  const currentWord = words[currentIndex];
  const progress = ((currentIndex + 1) / words.length) * 100;

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") handlePrevious();
    if (e.key === "ArrowRight") handleNext();
    if (e.key === " ") {
      e.preventDefault();
      setIsFlipped(!isFlipped);
    }
  };

  return (
    <div className={styles.container} tabIndex={0} onKeyDown={handleKeyPress}>
      {/* Header with dark blue background */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <button className={styles.backButton} onClick={() => navigate(`/flashcards/${id}`)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Quay lại
          </button>
          <h1 className={styles.title}>{deck.name}</h1>
          <div className={styles.progress}>
            <span className={styles.progressText}>
              {currentIndex + 1} / {words.length}
            </span>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Main content area with white background */}
      <div className={styles.main}>
        <div className={styles.cardWrapper}>
          <div
            className={`${styles.card} ${isFlipped ? styles.flipped : ""}`}
            onClick={() => setIsFlipped(!isFlipped)}
          >
            {/* Front side */}
            <div className={styles.cardFace}>
              <div className={styles.cardContent}>
                <div className={styles.cardLabel}>Từ vựng</div>
                <div className={styles.cardMainText}>{currentWord.front}</div>
                <div className={styles.flipHint}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 4v6h6M23 20v-6h-6"/>
                    <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/>
                  </svg>
                  Nhấp để lật thẻ
                </div>
              </div>
            </div>

            {/* Back side */}
            <div className={`${styles.cardFace} ${styles.cardBack}`}>
              <div className={styles.cardContent}>
                <div className={styles.cardLabel}>Định nghĩa</div>
                <div className={styles.cardMainText}>{currentWord.back}</div>
                {currentWord.example && (
                  <div className={styles.example}>
                    <strong>Ví dụ:</strong> {currentWord.example}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation buttons */}
        <div className={styles.navigation}>
          <button
            className={`${styles.navButton} ${styles.prevButton}`}
            onClick={handlePrevious}
            disabled={currentIndex === 0}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
            Trước
          </button>

          <div className={styles.cardCounter}>
            {currentIndex + 1} / {words.length}
          </div>

          <button
            className={`${styles.navButton} ${styles.nextButton}`}
            onClick={handleNext}
            disabled={currentIndex === words.length - 1}
          >
            Sau
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlashcardPractice;
