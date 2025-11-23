import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import FlashcardCard from "../../components/common/FlashcardCard/FlashcardCard";
import type { Flashcard } from "../../components/common/FlashcardCard/FlashcardCard";
import {
  getDecks,
  createDeck,
  updateDeck,
  deleteDeck,
  type FlashcardDeck,
} from "../../services/flashcardService";
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
    description: "",
  });
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Fetch decks từ API
  useEffect(() => {
    fetchDecks();
  }, []);

  const fetchDecks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getDecks();
      
      if (response.success && response.data && Array.isArray(response.data)) {
        const formattedFlashcards: Flashcard[] = response.data.map((deck, index) => ({
          id: deck.id,
          title: deck.name,
          description: deck.description,
          totalCards: deck.totalCards || 0,
          language: deck.language,
          category: deck.category,
          image: deck.image,
        }));

        setFlashcards(formattedFlashcards);
      }
    } catch (err: any) {
      console.error("Error fetching decks:", err);
      setError(err.message || "Không thể tải danh sách flashcard");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFlashcard = async () => {
    if (!newFlashcard.name.trim()) {
      alert("Vui lòng nhập tên flashcard");
      return;
    }

    try {
      setLoading(true);
      const response = await createDeck({
        name: newFlashcard.name,
        description: newFlashcard.description,
      });

      if (response.success) {
        setSuccessMessage("Tạo flashcard thành công!");
        setNewFlashcard({ name: "", description: "" });
        setShowCreateModal(false);
        // Refresh danh sách
        await fetchDecks();
      }
    } catch (err: any) {
      console.error("Error creating deck:", err);
      alert(err.message || "Không thể tạo flashcard");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelCreate = () => {
    setNewFlashcard({ name: "", description: "" });
    setEditingFlashcard(null);
    setShowCreateModal(false);
  };

  const handleEdit = (flashcard: Flashcard) => {
    setEditingFlashcard(flashcard);
    setNewFlashcard({
      name: flashcard.title,
      description: flashcard.description || "",
    });
    setShowCreateModal(true);
  };

  const handleDelete = (id: number) => {
    setDeletingId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deletingId) return;

    try {
      setLoading(true);
      await deleteDeck(deletingId);
      setSuccessMessage("Xóa flashcard thành công!");
      setShowDeleteModal(false);
      setDeletingId(null);
      // Refresh danh sách
      await fetchDecks();
    } catch (err: any) {
      console.error("Error deleting deck:", err);
      alert(err.message || "Không thể xóa flashcard");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateFlashcard = async () => {
    if (!newFlashcard.name.trim()) {
      alert("Vui lòng nhập tên flashcard");
      return;
    }

    if (editingFlashcard) {
      try {
        setLoading(true);
        const response = await updateDeck(editingFlashcard.id, {
          name: newFlashcard.name,
          description: newFlashcard.description,
        });

        if (response.success) {
          setSuccessMessage("Cập nhật flashcard thành công!");
          setEditingFlashcard(null);
          setNewFlashcard({ name: "", description: "" });
          setShowCreateModal(false);
          // Refresh danh sách
          await fetchDecks();
        }
      } catch (err: any) {
        console.error("Error updating deck:", err);
        alert(err.message || "Không thể cập nhật flashcard");
      } finally {
        setLoading(false);
      }
    } else {
      await handleCreateFlashcard();
    }
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
  }, [flashcards, searchQuery, selectedCategory]);

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
        {loading ? (
          <div className={styles.loadingState}>
            <p>Đang tải...</p>
          </div>
        ) : error ? (
          <div className={styles.errorState}>
            <p className={styles.errorText}>{error}</p>
            <button className={styles.retryButton} onClick={fetchDecks}>
              Thử lại
            </button>
          </div>
        ) : filteredFlashcards.length > 0 ? (
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

      {/* Success Modal */}
      {successMessage && (
        <div className={styles.successOverlay}>
          <div className={styles.successModal}>
            <div className={styles.successIcon}>
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h3 className={styles.successTitle}>Thành công!</h3>
            <p className={styles.successMessage}>{successMessage}</p>
            <button
              className={styles.successButton}
              onClick={() => setSuccessMessage(null)}
            >
              Đóng
            </button>
          </div>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className={styles.successOverlay}>
          <div className={styles.successModal}>
            <div className={styles.deleteIcon}>
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 6h18" />
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
              </svg>
            </div>
            <h3 className={styles.deleteTitle}>Xác nhận xóa</h3>
            <p className={styles.deleteMessage}>
              Bạn có chắc chắn muốn xóa bộ flashcard này không? Hành động này không thể hoàn tác.
            </p>
            <div className={styles.deleteActions}>
              <button
                className={styles.cancelButton}
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeletingId(null);
                }}
              >
                Hủy
              </button>
              <button className={styles.deleteButton} onClick={confirmDelete}>
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Flashcards;
