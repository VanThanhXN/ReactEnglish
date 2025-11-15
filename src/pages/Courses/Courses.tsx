import React, { useState, useEffect, useMemo } from "react";
import { getCourses, type Course } from "../../services/courseService";
import CourseCard from "../../components/common/CourseCard/CourseCard";
import styles from "./Courses.module.css";

const Courses: React.FC = () => {
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    fetchCourses();
  }, []);

  const categories = useMemo(() => {
    const cats = new Set<string>();
    allCourses.forEach((course) => {
      if (course.category) {
        cats.add(course.category);
      }
    });
    return ["all", ...Array.from(cats).sort()];
  }, [allCourses]);

  const filteredCourses = useMemo(() => {
    return allCourses.filter((course) => {
      const matchesSearch =
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || course.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [allCourses, searchQuery, selectedCategory]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await getCourses();
      if (response.success) {
        setAllCourses(response.data);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroBackground}>
          <div className={styles.heroGradient}></div>
          <img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1920&h=1080&fit=crop&q=80"
            alt="Courses"
            className={styles.heroImage}
          />
        </div>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Khóa Học Tiếng Anh</h1>
          <p className={styles.heroSubtitle}>
            Khám phá hàng trăm khóa học chất lượng, phù hợp với mọi trình độ và
            mục tiêu học tập của bạn
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
            placeholder="Tìm kiếm khóa học..."
            value={searchQuery}
            onChange={handleSearch}
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
                onClick={() => handleCategoryChange(category)}
              >
                {category === "all" ? "Tất cả" : category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <section className={styles.coursesSection}>
        <div className={styles.coursesContainer}>
          {loading ? (
            <div className={styles.loading}>Đang tải...</div>
          ) : filteredCourses.length === 0 ? (
            <div className={styles.empty}>
              <p>Không tìm thấy khóa học nào.</p>
            </div>
          ) : (
            <>
              <div className={styles.resultsInfo}>
                <h2 className={styles.resultsTitle}>
                  Tìm thấy {filteredCourses.length} khóa học
                </h2>
              </div>
              <div className={styles.coursesGrid}>
                {filteredCourses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Courses;

