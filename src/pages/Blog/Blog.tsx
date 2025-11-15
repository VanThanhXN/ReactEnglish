import React, { useState, useMemo } from "react";
import BlogCard from "../../components/common/BlogCard/BlogCard";
import type { BlogPost } from "../../components/common/BlogCard/BlogCard";
import styles from "./Blog.module.css";

const Blog: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Mock data - sẽ thay thế bằng API call sau
  const [blogPosts] = useState<BlogPost[]>([
    {
      id: 1,
      title: "10 Mẹo Học Tiếng Anh Hiệu Quả",
      excerpt: "Khám phá những phương pháp học tiếng Anh hiệu quả nhất để nâng cao trình độ của bạn",
      category: "Học tập",
      author: "Nguyễn Văn A",
      date: "15/12/2024",
      image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&q=80",
    },
    {
      id: 2,
      title: "Làm Thế Nào Để Cải Thiện Phát Âm Tiếng Anh",
      excerpt: "Hướng dẫn chi tiết về cách phát âm chuẩn và tự nhiên như người bản xứ",
      category: "Phát âm",
      author: "Trần Thị B",
      date: "12/12/2024",
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80",
    },
    {
      id: 3,
      title: "Từ Vựng IELTS: 100 Từ Thường Gặp Nhất",
      excerpt: "Danh sách 100 từ vựng IELTS quan trọng nhất mà bạn cần biết để đạt điểm cao",
      category: "IELTS",
      author: "Lê Văn C",
      date: "10/12/2024",
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80",
    },
    {
      id: 4,
      title: "Ngữ Pháp Tiếng Anh: Thì Hiện Tại Hoàn Thành",
      excerpt: "Học cách sử dụng thì hiện tại hoàn thành một cách chính xác và tự nhiên",
      category: "Ngữ pháp",
      author: "Phạm Thị D",
      date: "8/12/2024",
      image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80",
    },
    {
      id: 5,
      title: "Chuẩn Bị Cho Kỳ Thi TOEIC: Lộ Trình 3 Tháng",
      excerpt: "Lộ trình học tập chi tiết trong 3 tháng để đạt điểm TOEIC mong muốn",
      category: "TOEIC",
      author: "Hoàng Văn E",
      date: "5/12/2024",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80",
    },
    {
      id: 6,
      title: "Giao Tiếp Tiếng Anh: Các Câu Thường Dùng",
      excerpt: "Tổng hợp các câu giao tiếp tiếng Anh thông dụng nhất trong cuộc sống hàng ngày",
      category: "Giao tiếp",
      author: "Nguyễn Thị F",
      date: "3/12/2024",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80",
    },
    {
      id: 7,
      title: "Từ Vựng Tiếng Anh Cơ Bản Cho Người Mới Bắt Đầu",
      excerpt: "Danh sách từ vựng cơ bản nhất để bạn bắt đầu hành trình học tiếng Anh",
      category: "Cơ bản",
      author: "Trần Văn G",
      date: "1/12/2024",
      image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&q=80",
    },
    {
      id: 8,
      title: "Cách Học Từ Vựng Hiệu Quả Với Flashcard",
      excerpt: "Phương pháp học từ vựng hiệu quả sử dụng flashcard để ghi nhớ lâu dài",
      category: "Học tập",
      author: "Lê Thị H",
      date: "28/11/2024",
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80",
    },
  ]);

  const categories = useMemo(() => {
    const cats = new Set<string>();
    blogPosts.forEach((post) => {
      if (post.category) {
        cats.add(post.category);
      }
    });
    return ["all", ...Array.from(cats).sort()];
  }, [blogPosts]);

  const filteredPosts = useMemo(() => {
    return blogPosts.filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || post.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [blogPosts, searchQuery, selectedCategory]);

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <div className={styles.hero}>
        <div className={styles.heroBackground} />
        <div className={styles.heroGradient} />
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Bài Viết</h1>
          <p className={styles.heroSubtitle}>
            Khám phá các bài viết hữu ích về học tiếng Anh, tips và phương pháp học hiệu quả
          </p>
        </div>
      </div>

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
            placeholder="Tìm kiếm bài viết..."
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

      {/* Results Info */}
      <div className={styles.resultsInfo}>
        <h2 className={styles.resultsTitle}>
          Tìm thấy {filteredPosts.length} bài viết
        </h2>
      </div>

      {/* Blog Grid */}
      <div className={styles.blogSection}>
        {filteredPosts.length > 0 ? (
          <div className={styles.blogGrid}>
            {filteredPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
            <p className={styles.emptyText}>Không tìm thấy bài viết nào</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;
