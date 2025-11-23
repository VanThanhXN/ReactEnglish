import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getUser, isAuthenticated } from "../../utils/storage";
import { getExamPackages, type ExamPackage } from "../../services/examService";
import type { User } from "../../types/api";
import styles from "./Home.module.css";

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const user: User | null = getUser();
  const [featuredExams, setFeaturedExams] = useState<ExamPackage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Chỉ fetch exams nếu đã đăng nhập
    if (isAuthenticated() && user) {
      fetchFeaturedExams();
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchFeaturedExams = async () => {
    try {
      setLoading(true);
      const response = await getExamPackages();
      if (response.success && response.data) {
        setFeaturedExams(response.data.slice(0, 3));
      }
    } catch (error) {
      console.error("Error fetching exams:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroBackground}>
          <div className={styles.heroGradient}></div>
          <img
            src="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1920&h=1080&fit=crop&q=80"
            alt="Learning"
            className={styles.heroImage}
          />
          <div className={styles.heroPattern}></div>
        </div>
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>
            <span className={styles.badgeDot}></span>
            <span>Chào mừng đến với TT English</span>
          </div>
          <h1 className={styles.heroTitle}>
            {user?.name ? (
              <>
                Xin chào, <span className={styles.heroName}>{user.name}</span>!
                👋
              </>
            ) : (
              <>
                Học tiếng Anh <span className={styles.heroName}>hiệu quả</span>{" "}
                mỗi ngày
              </>
            )}
          </h1>
          <p className={styles.heroSubtitle}>
            Khám phá hàng trăm đề thi chất lượng, học từ vựng với flashcard
            thông minh và nâng cao kỹ năng của bạn với phương pháp học tập hiện
            đại
          </p>
          <div className={styles.heroActions}>
            <Link to="/exams" className={styles.primaryButton}>
              <span>Bắt đầu học ngay</span>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>
            <Link to="/flashcards" className={styles.secondaryButton}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <line x1="9" y1="3" x2="9" y2="21" />
                <line x1="3" y1="9" x2="21" y2="9" />
              </svg>
              <span>Học Flashcard</span>
            </Link>
          </div>
          <div className={styles.heroStats}>
            <div className={styles.heroStatItem}>
              <div className={styles.heroStatNumber}>50+</div>
              <div className={styles.heroStatLabel}>Đề thi</div>
            </div>
            <div className={styles.heroStatDivider}></div>
            <div className={styles.heroStatItem}>
              <div className={styles.heroStatNumber}>200+</div>
              <div className={styles.heroStatLabel}>Flashcard</div>
            </div>
            <div className={styles.heroStatDivider}></div>
            <div className={styles.heroStatItem}>
              <div className={styles.heroStatNumber}>1000+</div>
              <div className={styles.heroStatLabel}>Học viên</div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={styles.stats}>
        <div className={styles.sectionIntro}>
          <h2 className={styles.sectionTitle}>Tại sao chọn chúng tôi?</h2>
          <p className={styles.sectionSubtitle}>
            Nền tảng học tập toàn diện với công nghệ hiện đại
          </p>
        </div>
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIconWrapper}>
              <div className={styles.statIcon}>
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                </svg>
              </div>
              <div className={styles.statIconGlow}></div>
            </div>
            <div className={styles.statContent}>
              <h3 className={styles.statNumber}>50+</h3>
              <p className={styles.statLabel}>Đề thi</p>
              <p className={styles.statDescription}>
                Đề thi đa dạng từ cơ bản đến nâng cao, phù hợp với mọi trình độ
                và mục tiêu học tập
              </p>
            </div>
            <div className={styles.statCardDecoration}></div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIconWrapper}>
              <div className={styles.statIcon}>
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <line x1="9" y1="3" x2="9" y2="21" />
                  <line x1="3" y1="9" x2="21" y2="9" />
                </svg>
              </div>
              <div className={styles.statIconGlow}></div>
            </div>
            <div className={styles.statContent}>
              <h3 className={styles.statNumber}>200+</h3>
              <p className={styles.statLabel}>Flashcard</p>
              <p className={styles.statDescription}>
                Học từ vựng hiệu quả với phương pháp flashcard khoa học, ghi nhớ
                lâu dài
              </p>
            </div>
            <div className={styles.statCardDecoration}></div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIconWrapper}>
              <div className={styles.statIcon}>
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
              </div>
              <div className={styles.statIconGlow}></div>
            </div>
            <div className={styles.statContent}>
              <h3 className={styles.statNumber}>30+</h3>
              <p className={styles.statLabel}>Bài viết</p>
              <p className={styles.statDescription}>
                Tips và tricks học tập hữu ích từ các chuyên gia hàng đầu
              </p>
            </div>
            <div className={styles.statCardDecoration}></div>
          </div>
        </div>
      </section>

      {/* Featured Exams Section */}
      {!loading && featuredExams.length > 0 && (
        <section className={styles.featuredSection}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionHeaderContent}>
              <div className={styles.sectionBadge}>
                <span>Nổi bật</span>
              </div>
              <h2 className={styles.sectionTitle}>Đề thi nổi bật</h2>
              <p className={styles.sectionSubtitle}>
                Khám phá các đề thi được yêu thích nhất và được đánh giá cao
              </p>
            </div>
            <Link to="/exams" className={styles.viewAllLink}>
              <span>Xem tất cả</span>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>
          </div>
          <div className={styles.featuredGrid}>
            {featuredExams.map((exam, index) => {
              const examImages = [
                "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&h=600&fit=crop&q=80",
                "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=600&fit=crop&q=80",
                "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=600&fit=crop&q=80",
              ];
              return (
                <Link
                  key={exam.id}
                  to={`/exams/${exam.id}`}
                  className={styles.featuredCard}
                >
                  <div className={styles.featuredCardImage}>
                    <img
                      src={examImages[index % examImages.length]}
                      alt={exam.title}
                    />
                    <div className={styles.featuredCardOverlay}></div>
                    <div className={styles.featuredCardBadge}>Đề thi mới</div>
                    <div className={styles.featuredCardHoverEffect}></div>
                  </div>
                  <div className={styles.featuredCardContent}>
                    <h3 className={styles.featuredCardTitle}>{exam.title}</h3>
                    {exam.description && (
                      <p className={styles.featuredCardDescription}>
                        {exam.description}
                      </p>
                    )}
                    <div className={styles.featuredCardMeta}>
                      <span className={styles.metaItem}>
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
                        {exam.duration} phút
                      </span>
                      <span className={styles.metaItem}>
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
                          <line x1="16" y1="13" x2="8" y2="13" />
                          <line x1="16" y1="17" x2="8" y2="17" />
                        </svg>
                        {exam.totalQuestions} câu
                      </span>
                    </div>
                    <div className={styles.featuredCardAction}>
                      <span>Xem chi tiết</span>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className={styles.featuresSection}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionHeaderContent}>
            <div className={styles.sectionBadge}>
              <span>Tính năng</span>
            </div>
            <h2 className={styles.sectionTitle}>Khám phá các tính năng</h2>
            <p className={styles.sectionSubtitle}>
              Nền tảng học tập toàn diện với công nghệ hiện đại
            </p>
          </div>
        </div>
        <div className={styles.featuresGrid}>
          <Link to="/exams" className={styles.featureCard}>
            <div className={styles.featureImage}>
              <img
                src="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&h=500&fit=crop&q=80"
                alt="Đề thi"
              />
              <div className={styles.featureOverlay}></div>
              <div className={styles.featureGradient}></div>
            </div>
            <div className={styles.featureContent}>
              <div className={styles.featureIconWrapper}>
                <div className={styles.featureIcon}>
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </div>
              </div>
              <h3 className={styles.featureTitle}>Đề thi</h3>
              <p className={styles.featureDescription}>
                Luyện tập với hàng trăm đề thi chất lượng, đánh giá năng lực của
                bạn một cách chính xác
              </p>
              <div className={styles.featureLink}>
                <span>Khám phá ngay</span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </div>
            </div>
          </Link>

          <Link to="/flashcards" className={styles.featureCard}>
            <div className={styles.featureImage}>
              <img
                src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=500&fit=crop&q=80"
                alt="Flashcard"
              />
              <div className={styles.featureOverlay}></div>
              <div className={styles.featureGradient}></div>
            </div>
            <div className={styles.featureContent}>
              <div className={styles.featureIconWrapper}>
                <div className={styles.featureIcon}>
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <line x1="9" y1="3" x2="9" y2="21" />
                  </svg>
                </div>
              </div>
              <h3 className={styles.featureTitle}>Flashcard</h3>
              <p className={styles.featureDescription}>
                Học từ vựng hiệu quả với phương pháp flashcard, ghi nhớ lâu dài
                và tăng vốn từ vựng
              </p>
              <div className={styles.featureLink}>
                <span>Khám phá ngay</span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </div>
            </div>
          </Link>

          <Link to="/blog" className={styles.featureCard}>
            <div className={styles.featureImage}>
              <img
                src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=500&fit=crop&q=80"
                alt="Bài viết"
              />
              <div className={styles.featureOverlay}></div>
              <div className={styles.featureGradient}></div>
            </div>
            <div className={styles.featureContent}>
              <div className={styles.featureIconWrapper}>
                <div className={styles.featureIcon}>
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                  </svg>
                </div>
              </div>
              <h3 className={styles.featureTitle}>Bài viết</h3>
              <p className={styles.featureDescription}>
                Đọc các bài viết hữu ích về học tập, tips và tricks để cải thiện
                kỹ năng của bạn
              </p>
              <div className={styles.featureLink}>
                <span>Khám phá ngay</span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Benefits Section */}
      <section className={styles.benefitsSection}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionHeaderContent}>
            <div className={styles.sectionBadge}>
              <span>Lợi ích</span>
            </div>
            <h2 className={styles.sectionTitle}>
              Lợi ích khi học cùng chúng tôi
            </h2>
            <p className={styles.sectionSubtitle}>
              Những lý do khiến hàng nghìn học viên tin tưởng và lựa chọn chúng
              tôi
            </p>
          </div>
        </div>
        <div className={styles.benefitsGrid}>
          <div className={styles.benefitCard}>
            <div className={styles.benefitIcon}>
              <svg
                width="32"
                height="32"
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
            <h3 className={styles.benefitTitle}>Học mọi lúc mọi nơi</h3>
            <p className={styles.benefitDescription}>
              Truy cập nền tảng học tập mọi lúc, mọi nơi trên mọi thiết bị. Học
              tập linh hoạt theo thời gian của bạn
            </p>
          </div>
          <div className={styles.benefitCard}>
            <div className={styles.benefitIcon}>
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <h3 className={styles.benefitTitle}>Đánh giá chính xác</h3>
            <p className={styles.benefitDescription}>
              Hệ thống đánh giá thông minh giúp bạn theo dõi tiến độ học tập và
              cải thiện điểm yếu một cách hiệu quả
            </p>
          </div>
          <div className={styles.benefitCard}>
            <div className={styles.benefitIcon}>
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <h3 className={styles.benefitTitle}>Cộng đồng học tập</h3>
            <p className={styles.benefitDescription}>
              Tham gia cộng đồng học viên đông đảo, chia sẻ kinh nghiệm và học
              hỏi lẫn nhau
            </p>
          </div>
          <div className={styles.benefitCard}>
            <div className={styles.benefitIcon}>
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h3 className={styles.benefitTitle}>Nội dung chất lượng</h3>
            <p className={styles.benefitDescription}>
              Đội ngũ chuyên gia biên soạn nội dung học tập chất lượng cao, cập
              nhật thường xuyên
            </p>
          </div>
          <div className={styles.benefitCard}>
            <div className={styles.benefitIcon}>
              <svg
                width="32"
                height="32"
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
            <h3 className={styles.benefitTitle}>Phương pháp khoa học</h3>
            <p className={styles.benefitDescription}>
              Áp dụng các phương pháp học tập khoa học đã được chứng minh hiệu
              quả trên thế giới
            </p>
          </div>
          <div className={styles.benefitCard}>
            <div className={styles.benefitIcon}>
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
              </svg>
            </div>
            <h3 className={styles.benefitTitle}>Hỗ trợ 24/7</h3>
            <p className={styles.benefitDescription}>
              Đội ngũ hỗ trợ luôn sẵn sàng giúp đỡ bạn mọi lúc, giải đáp mọi
              thắc mắc nhanh chóng
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className={styles.testimonialsSection}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionHeaderContent}>
            <div className={styles.sectionBadge}>
              <span>Đánh giá</span>
            </div>
            <h2 className={styles.sectionTitle}>
              Học viên nói gì về chúng tôi
            </h2>
            <p className={styles.sectionSubtitle}>
              Những phản hồi chân thật từ cộng đồng học viên
            </p>
          </div>
        </div>
        <div className={styles.testimonialsGrid}>
          <div className={styles.testimonialCard}>
            <div className={styles.testimonialContent}>
              <div className={styles.testimonialQuote}>
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
                  <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
                </svg>
              </div>
              <p className={styles.testimonialText}>
                "Nền tảng này thực sự giúp tôi cải thiện kỹ năng tiếng Anh một
                cách đáng kể. Các đề thi đa dạng và flashcard rất hữu ích!"
              </p>
            </div>
            <div className={styles.testimonialAuthor}>
              <div className={styles.testimonialAvatar}>
                <span>NV</span>
              </div>
              <div className={styles.testimonialInfo}>
                <div className={styles.testimonialName}>Nguyễn Văn</div>
                <div className={styles.testimonialRole}>Học viên</div>
              </div>
            </div>
          </div>
          <div className={styles.testimonialCard}>
            <div className={styles.testimonialContent}>
              <div className={styles.testimonialQuote}>
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
                  <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
                </svg>
              </div>
              <p className={styles.testimonialText}>
                "Tôi rất thích cách học với flashcard, nó giúp tôi ghi nhớ từ
                vựng lâu hơn. Giao diện cũng rất đẹp và dễ sử dụng."
              </p>
            </div>
            <div className={styles.testimonialAuthor}>
              <div className={styles.testimonialAvatar}>
                <span>LT</span>
              </div>
              <div className={styles.testimonialInfo}>
                <div className={styles.testimonialName}>Lê Thị</div>
                <div className={styles.testimonialRole}>Sinh viên</div>
              </div>
            </div>
          </div>
          <div className={styles.testimonialCard}>
            <div className={styles.testimonialContent}>
              <div className={styles.testimonialQuote}>
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
                  <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
                </svg>
              </div>
              <p className={styles.testimonialText}>
                "Đề thi rất sát với thực tế, giúp tôi chuẩn bị tốt cho các kỳ
                thi. Cảm ơn đội ngũ đã tạo ra nền tảng tuyệt vời này!"
              </p>
            </div>
            <div className={styles.testimonialAuthor}>
              <div className={styles.testimonialAvatar}>
                <span>PT</span>
              </div>
              <div className={styles.testimonialInfo}>
                <div className={styles.testimonialName}>Phạm Trung</div>
                <div className={styles.testimonialRole}>Học viên</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaBackground}>
          <div className={styles.ctaGradient}></div>
          <img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1920&h=600&fit=crop&q=80"
            alt="CTA"
            className={styles.ctaImage}
          />
        </div>
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>
            Sẵn sàng bắt đầu hành trình học tập?
          </h2>
          <p className={styles.ctaSubtitle}>
            Tham gia cùng hàng nghìn học viên đang cải thiện kỹ năng tiếng Anh
            mỗi ngày
          </p>
          <div className={styles.ctaActions}>
            <Link to="/exams" className={styles.ctaPrimaryButton}>
              <span>Bắt đầu ngay</span>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>
            {!isAuthenticated() && (
              <Link to="/login" className={styles.ctaSecondaryButton}>
                Đăng nhập
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
