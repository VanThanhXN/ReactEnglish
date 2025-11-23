import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getDecks, FlashcardDeck } from "../../services/flashcardService";
import styles from "./Progress.module.css";

interface ProgressStats {
  totalDecks: number;
  totalCards: number;
  studiedToday: number;
  studyStreak: number;
}

const Progress: React.FC = () => {
  const [decks, setDecks] = useState<FlashcardDeck[]>([]);
  const [stats, setStats] = useState<ProgressStats>({
    totalDecks: 0,
    totalCards: 0,
    studiedToday: 0,
    studyStreak: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        setLoading(true);
        const response = await getDecks();
        
        if (response.success && response.data) {
          setDecks(response.data);
          
          // Calculate stats
          const totalCards = response.data.reduce((sum, deck) => sum + (deck.totalCards || 0), 0);
          setStats({
            totalDecks: response.data.length,
            totalCards: totalCards,
            studiedToday: Math.floor(Math.random() * 50) + 10, // Mock data
            studyStreak: Math.floor(Math.random() * 30) + 1,   // Mock data
          });
        }
      } catch (err) {
        console.error("Error fetching progress:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  if (loading) {
    return <div className={styles.loading}>Đang tải...</div>;
  }

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroBackground}>
          <div className={styles.heroGradient}></div>
          <img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1920&h=1080&fit=crop&q=80"
            alt="Progress"
            className={styles.heroImage}
          />
        </div>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Tiến Độ Học Tập</h1>
          <p className={styles.heroSubtitle}>
            Theo dõi quá trình học tập và cải thiện kỹ năng tiếng Anh của bạn
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className={styles.main}>
        {/* Stats Grid */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <line x1="3" y1="9" x2="21" y2="9" />
                <line x1="9" y1="21" x2="9" y2="9" />
              </svg>
            </div>
            <div className={styles.statContent}>
              <div className={styles.statValue}>{stats.totalDecks}</div>
              <div className={styles.statLabel}>Bộ thẻ</div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={`${styles.statIcon} ${styles.blue}`}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <div className={styles.statContent}>
              <div className={styles.statValue}>{stats.totalCards}</div>
              <div className={styles.statLabel}>Tổng thẻ</div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={`${styles.statIcon} ${styles.green}`}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
            <div className={styles.statContent}>
              <div className={styles.statValue}>{stats.studiedToday}</div>
              <div className={styles.statLabel}>Học hôm nay</div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={`${styles.statIcon} ${styles.orange}`}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            </div>
            <div className={styles.statContent}>
              <div className={styles.statValue}>{stats.studyStreak}</div>
              <div className={styles.statLabel}>Ngày liên tiếp</div>
            </div>
          </div>
        </div>

        {/* Decks Progress */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Tiến độ theo bộ thẻ</h2>
          <div className={styles.decksList}>
            {decks.map((deck) => {
              const progress = Math.floor(Math.random() * 100); // Mock progress
              const mastered = Math.floor((deck.totalCards || 0) * (progress / 100));
              
              return (
                <Link
                  key={deck.id}
                  to={`/flashcards/${deck.id}`}
                  className={styles.deckItem}
                >
                  <div className={styles.deckInfo}>
                    <h3 className={styles.deckName}>{deck.name}</h3>
                    <p className={styles.deckStats}>
                      {mastered} / {deck.totalCards || 0} thẻ đã thuộc
                    </p>
                  </div>
                  <div className={styles.progressWrapper}>
                    <div className={styles.progressBar}>
                      <div
                        className={styles.progressFill}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <span className={styles.progressPercent}>{progress}%</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Study Calendar (Mock) */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Lịch sử học tập</h2>
          <div className={styles.calendar}>
            <p className={styles.comingSoon}>Sắp ra mắt...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Progress;
