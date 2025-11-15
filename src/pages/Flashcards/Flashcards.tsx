import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import FlashcardCard from "../../components/common/FlashcardCard/FlashcardCard";
import type { Flashcard } from "../../components/common/FlashcardCard/FlashcardCard";
import styles from "./Flashcards.module.css";

const Flashcards: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingFlashcard, setEditingFlashcard] = useState<Flashcard | null>(
    null
  );
  const [newFlashcard, setNewFlashcard] = useState({
    name: "",
    language: "",
    description: "",
  });

  // Mock data - sẽ thay thế bằng API call sau
  const [flashcards, setFlashcards] = useState<Flashcard[]>([
    {
      id: 1,
      title: "Từ vựng tiếng Anh cơ bản",
      description: "500 từ vựng tiếng Anh thông dụng nhất",
      totalCards: 500,
      language: "English",
      category: "Từ vựng",
      image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&q=80",
    },
    {
      id: 2,
      title: "Ngữ pháp tiếng Anh",
      description: "Các cấu trúc ngữ pháp quan trọng",
      totalCards: 200,
      language: "English",
      category: "Ngữ pháp",
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80",
    },
    {
      id: 3,
      title: "Từ vựng TOEIC",
      description: "Từ vựng thường gặp trong kỳ thi TOEIC",
      totalCards: 1000,
      language: "English",
      category: "TOEIC",
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80",
    },
    {
      id: 4,
      title: "Từ vựng IELTS",
      description: "Từ vựng nâng cao cho kỳ thi IELTS",
      totalCards: 800,
      language: "English",
      category: "IELTS",
      image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80",
    },
    {
      id: 5,
      title: "Tiếng Anh Giao Tiếp",
      description: "Các cụm từ và câu giao tiếp thông dụng",
      totalCards: 300,
      language: "English",
      category: "Giao tiếp",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80",
    },
    {
      id: 6,
      title: "Tiếng Anh Cơ Bản",
      description: "Từ vựng và ngữ pháp cơ bản cho người mới bắt đầu",
      totalCards: 400,
      language: "English",
      category: "Cơ bản",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80",
    },
  ]);

  const handleCreateFlashcard = () => {
    if (!newFlashcard.name.trim()) {
      alert("Vui lòng nhập tên flashcard");
      return;
    }

    const flashcardImages = [
      "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&q=80",
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80",
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80",
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80",
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80",
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80",
    ];

    const newId = Math.max(...flashcards.map((f) => f.id), 0) + 1;
    const newCard: Flashcard = {
      id: newId,
      title: newFlashcard.name,
      description: newFlashcard.description,
      language: newFlashcard.language || "English",
      totalCards: 0,
      category: "Tùy chỉnh",
      image: flashcardImages[newId % flashcardImages.length],
    };

    setFlashcards([...flashcards, newCard]);
    setNewFlashcard({ name: "", language: "", description: "" });
    setShowCreateModal(false);
  };

  const handleCancelCreate = () => {
    setNewFlashcard({ name: "", language: "", description: "" });
    setEditingFlashcard(null);
    setShowCreateModal(false);
  };

  const handleEdit = (flashcard: Flashcard) => {
    setEditingFlashcard(flashcard);
    setNewFlashcard({
      name: flashcard.title,
      language: flashcard.language || "",
      description: flashcard.description || "",
    });
    setShowCreateModal(true);
  };

  const handleDelete = (id: number) => {
    setFlashcards(flashcards.filter((f) => f.id !== id));
  };

  const handleUpdateFlashcard = () => {
    if (!newFlashcard.name.trim()) {
      alert("Vui lòng nhập tên flashcard");
      return;
    }

    if (editingFlashcard) {
      setFlashcards(
        flashcards.map((f) =>
          f.id === editingFlashcard.id
            ? {
                ...f,
                title: newFlashcard.name,
                description: newFlashcard.description,
                language: newFlashcard.language || "English",
              }
            : f
        )
      );
      setEditingFlashcard(null);
    } else {
      handleCreateFlashcard();
      return;
    }

    setNewFlashcard({ name: "", language: "", description: "" });
    setShowCreateModal(false);
  };

  const categories = useMemo(() => {
    const cats = new Set<string>();
    flashcards.forEach((flashcard) => {
      if (flashcard.category) {
        cats.add(flashcard.category);
      }
    });
    return ["all", ...Array.from(cats).sort()];
  }, [flashcards]);

  const filteredFlashcards = useMemo(() => {
    return flashcards.filter((flashcard) => {
      const matchesSearch =
        flashcard.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        flashcard.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "all" || flashcard.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <div className={styles.hero}>
        <div className={styles.heroBackground} />
        <div className={styles.heroGradient} />
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Flashcards</h1>
          <p className={styles.heroSubtitle}>
            Học từ vựng hiệu quả với phương pháp flashcard
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
            placeholder="Tìm kiếm flashcard..."
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
          Tìm thấy {filteredFlashcards.length} bộ flashcard
        </h2>
        <button
          className={styles.createButton}
          onClick={() => setShowCreateModal(true)}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Tạo Flashcard
        </button>
      </div>

      {/* Flashcards Grid */}
      <div className={styles.flashcardsSection}>
        {filteredFlashcards.length > 0 ? (
          <div className={styles.flashcardsGrid}>
            {filteredFlashcards.map((flashcard) => (
              <FlashcardCard
                key={flashcard.id}
                flashcard={flashcard}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
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
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <line x1="3" y1="9" x2="21" y2="9" />
              <line x1="9" y1="21" x2="9" y2="9" />
            </svg>
            <p className={styles.emptyText}>Không tìm thấy flashcard nào</p>
          </div>
        )}
      </div>

      {/* Create Flashcard Modal */}
      {showCreateModal && (
        <div className={styles.modalOverlay} onClick={handleCancelCreate}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                {editingFlashcard ? "Sửa Flashcard" : "Tạo Flashcard Mới"}
              </h3>
              <button
                className={styles.modalClose}
                onClick={handleCancelCreate}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Tên Flashcard <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  className={styles.formInput}
                  placeholder="Nhập tên flashcard..."
                  value={newFlashcard.name}
                  onChange={(e) =>
                    setNewFlashcard({ ...newFlashcard, name: e.target.value })
                  }
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Ngôn ngữ</label>
                <select
                  className={styles.formInput}
                  value={newFlashcard.language}
                  onChange={(e) =>
                    setNewFlashcard({
                      ...newFlashcard,
                      language: e.target.value,
                    })
                  }
                >
                  <option value="">Chọn ngôn ngữ</option>
                  <option value="English">English</option>
                  <option value="Vietnamese">Vietnamese</option>
                  <option value="French">French</option>
                  <option value="Spanish">Spanish</option>
                  <option value="German">German</option>
                  <option value="Japanese">Japanese</option>
                  <option value="Korean">Korean</option>
                  <option value="Chinese">Chinese</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Mô tả</label>
                <textarea
                  className={styles.formTextarea}
                  placeholder="Nhập mô tả cho flashcard..."
                  rows={4}
                  value={newFlashcard.description}
                  onChange={(e) =>
                    setNewFlashcard({
                      ...newFlashcard,
                      description: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button
                className={styles.modalCancel}
                onClick={handleCancelCreate}
              >
                Hủy
              </button>
              <button
                className={styles.modalSubmit}
                onClick={handleUpdateFlashcard}
              >
                {editingFlashcard ? "Cập nhật" : "Tạo Flashcard"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Flashcards;
