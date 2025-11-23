import React, { useState, useEffect, useMemo } from "react";
import { getExamPackages, type ExamPackage } from "../../services/examService";
import ExamCard from "../../components/common/ExamCard/ExamCard";
import styles from "./Exams.module.css";

const Exams: React.FC = () => {
  const [allExams, setAllExams] = useState<ExamPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    fetchExams();
  }, []);

  const categories = useMemo(() => {
    const cats = new Set<string>();
    allExams.forEach((exam) => {
      if (exam.category) {
        cats.add(exam.category);
      }
    });
    return ["all", ...Array.from(cats).sort()];
  }, [allExams]);

  const filteredExams = useMemo(() => {
    return allExams.filter((exam) => {
      const matchesSearch =
        exam.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exam.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || exam.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [allExams, searchQuery, selectedCategory]);

  const fetchExams = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getExamPackages();
      
      if (response.success && response.data && Array.isArray(response.data)) {
        setAllExams(response.data);
      } else {
        setError(response.message || "Không thể tải danh sách đề thi");
      }
    } catch (error: any) {
      console.error("Error fetching exams:", error);
      setError(error.message || "Có lỗi xảy ra khi tải danh sách đề thi. Vui lòng thử lại sau.");
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
            src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&h=1080&fit=crop&q=80"
            alt="Exams"
            className={styles.heroImage}
          />
        </div>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Đề Thi Tiếng Anh</h1>
          <p className={styles.heroSubtitle}>
            Luyện tập với hàng trăm đề thi chất lượng, giúp bạn chuẩn bị tốt nhất
            cho các kỳ thi quan trọng
          </p>
        </div>
      </section>

      {/* Search and Filters */}
      <div className={styles.filtersSection}>
        <div className={styles.searchWrapper}>
          <svg
            className={styles.searchIcon}
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Tìm kiếm đề thi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className={styles.filterGroup}>
          <span className={styles.filterLabel}>Danh mục:</span>
          <div className={styles.filterButtons}>
            {categories.map((category) => (
              <button
                key={category}
                className={`${styles.filterButton} ${
                  selectedCategory === category ? styles.active : ""
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category === "all" ? "Tất cả" : category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className={styles.error} style={{ 
          padding: "16px", 
          margin: "20px", 
          backgroundColor: "#fee", 
          color: "#c33", 
          borderRadius: "8px",
          border: "1px solid #fcc"
        }}>
          {error}
        </div>
      )}

      {/* Results Info */}
      {!loading && !error && (
        <div className={styles.resultsInfo}>
          <h2 className={styles.resultsTitle}>
            Tìm thấy {filteredExams.length} đề thi
          </h2>
        </div>
      )}

      {/* Exams Grid */}
      <section className={styles.examsSection}>
        <div className={styles.examsContainer}>
          {loading ? (
            <div className={styles.loading}>Đang tải...</div>
          ) : filteredExams.length === 0 ? (
            <div className={styles.empty}>
              <p>Không tìm thấy đề thi nào.</p>
            </div>
          ) : (
            <div className={styles.examsGrid}>
              {filteredExams.map((exam) => (
                <ExamCard key={exam.id} exam={exam} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Exams;
