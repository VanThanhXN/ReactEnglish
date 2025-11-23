import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  getDeckById, 
  createFlashcard, 
  createFlashcardsBulk, 
  getCardsByDeckId,
  updateFlashcard,
  deleteFlashcard,
  FlashcardDeck, 
  FlashcardWord 
} from "../../services/flashcardService";
import ConfirmModal from "../../components/common/ConfirmModal/ConfirmModal";
import SuccessModal from "../../components/common/SuccessModal/SuccessModal";
import styles from "./FlashcardDetail.module.css";

const FlashcardDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [deck, setDeck] = useState<FlashcardDeck | null>(null);
  const [words, setWords] = useState<FlashcardWord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newCard, setNewCard] = useState({
    front: "",
    back: "",
    example: "",
  });
  const [bulkCards, setBulkCards] = useState([
    { front: "", back: "", example: "" },
  ]);
  const [editingCard, setEditingCard] = useState<FlashcardWord | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchDeckAndCards = async () => {
      if (!id) return;
      try {
        setLoading(true);
        
        // 1. Lấy thông tin Deck
        const deckResponse = await getDeckById(Number(id));
        if (deckResponse.success && deckResponse.data) {
          setDeck(deckResponse.data);
        } else {
          setError(deckResponse.message || "Không thể tải thông tin deck");
          return;
        }

        // 2. Lấy danh sách Cards
        const cardsResponse = await getCardsByDeckId(Number(id));
        if (cardsResponse.success && cardsResponse.data) {
          setWords(cardsResponse.data);
        } else {
          if (deckResponse.data?.words) {
            setWords(deckResponse.data.words);
          } else {
             setWords([]);
          }
        }

      } catch (err: any) {
        setError(err.message ||"Có lỗi xảy ra");
      } finally {
        setLoading(false);
      }
    };

    fetchDeckAndCards();
  }, [id]);

  const handlePractice = () => {
    if (id) {
      navigate(`/flashcards/${id}/practice`);
    }
  };

  const handleAddCard = async () => {
    if (!id || !newCard.front || !newCard.back) {
      return;
    }

    try {
      await createFlashcard(Number(id), {
        front: newCard.front,
        back: newCard.back,
        example: newCard.example,
      });
      
      setNewCard({ front: "", back: "", example: "" });
      setShowAddModal(false);
      
      const cardsResponse = await getCardsByDeckId(Number(id));
      if (cardsResponse.success && cardsResponse.data) {
        setWords(cardsResponse.data);
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleBulkAdd = async () => {
    if (!id) return;

    const cardsToAdd = bulkCards.filter(card => card.front && card.back);

    if (cardsToAdd.length === 0) {
      return;
    }

    try {
      setLoading(true);
      await createFlashcardsBulk(Number(id), cardsToAdd);
      
      setBulkCards([{ front: "", back: "", example: "" }]);
      setShowBulkModal(false);
      
      const cardsResponse = await getCardsByDeckId(Number(id));
      if (cardsResponse.success && cardsResponse.data) {
        setWords(cardsResponse.data);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addBulkRow = () => {
    setBulkCards([...bulkCards, { front: "", back: "", example: "" }]);
  };

  const removeBulkRow = (index: number) => {
    if (bulkCards.length > 1) {
      setBulkCards(bulkCards.filter((_, i) => i !== index));
    }
  };

  const updateBulkCard = (index: number, field: string, value: string) => {
    const newCards = [...bulkCards];
    newCards[index] = { ...newCards[index], [field]: value };
    setBulkCards(newCards);
  };

  const handleEditCard = (card: FlashcardWord) => {
    setEditingCard(card);
    setShowEditModal(true);
  };

  const handleUpdateCard = async () => {
    if (!id || !editingCard || !editingCard.front || !editingCard.back) {
      return;
    }

    try {
      await updateFlashcard(editingCard.id, {
        front: editingCard.front,
        back: editingCard.back,
        example: editingCard.example,
      });

      setShowEditModal(false);
      setEditingCard(null);
      
      const cardsResponse = await getCardsByDeckId(Number(id));
      if (cardsResponse.success && cardsResponse.data) {
        setWords(cardsResponse.data);
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleDeleteCard = (cardId: number) => {
    setDeletingId(cardId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!id || !deletingId) return;

    try {
      console.log("🗑️ Đang xóa card:", deletingId);
      const result = await deleteFlashcard(deletingId);
      console.log("✅ Xóa thành công:", result);
      
      setShowDeleteModal(false);
      setDeletingId(null);
      setSuccessMessage("Xóa thẻ thành công!");
      
      const cardsResponse = await getCardsByDeckId(Number(id));
      if (cardsResponse.success && cardsResponse.data) {
        setWords(cardsResponse.data);
      }
      console.log("📋 Đã refresh danh sách");
    } catch (err: any) {
      console.error("❌ Lỗi khi xóa:", err);
      console.error("❌ Error message:", err.message);
      console.error("❌ Error response:", err.response);
    }
  };

  if (loading) return <div className={styles.loading}>Đang tải...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!deck) return <div className={styles.notFound}>Không tìm thấy deck</div>;

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <div className={styles.hero}>
        <div className={styles.heroBackground} />
        <div className={styles.headerContent}>
          <h1 className={styles.title}>{deck.name}</h1>
          <p className={styles.description}>{deck.description}</p>
          <div className={styles.heroActions}>
            <button 
              onClick={handlePractice} 
              className={styles.practiceButton} 
              disabled={words.length === 0}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              Bắt đầu luyện tập
            </button>
            <button 
              onClick={() => setShowAddModal(true)} 
              className={styles.addButton}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Thêm thẻ
            </button>
            <button 
              onClick={() => setShowBulkModal(true)} 
              className={styles.bulkButton}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="12" y1="18" x2="12" y2="12"></line>
                <line x1="9" y1="15" x2="15" y2="15"></line>
              </svg>
              Thêm hàng loạt
            </button>
          </div>
        </div>
      </div>

      {/* Add Card Modal */}
      {showAddModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>Thêm thẻ mới</h3>
              <button 
                className={styles.closeButton}
                onClick={() => setShowAddModal(false)}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.formGroup}>
                <label>Từ vựng (Front)</label>
                <input
                  type="text"
                  value={newCard.front}
                  onChange={(e) => setNewCard({ ...newCard, front: e.target.value })}
                  placeholder="Ví dụ: Apple"
                />
              </div>
              <div className={styles.formGroup}>
                <label>Định nghĩa (Back)</label>
                <input
                  type="text"
                  value={newCard.back}
                  onChange={(e) => setNewCard({ ...newCard, back: e.target.value })}
                  placeholder="Ví dụ: Quả táo"
                />
              </div>
              <div className={styles.formGroup}>
                <label>Ví dụ (Example)</label>
                <textarea
                  value={newCard.example}
                  onChange={(e) => setNewCard({ ...newCard, example: e.target.value })}
                  placeholder="Ví dụ: I eat an apple every day."
                  rows={3}
                />
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button 
                className={styles.cancelButton}
                onClick={() => setShowAddModal(false)}
              >
                Hủy
              </button>
              <button 
                className={styles.submitButton}
                onClick={handleAddCard}
              >
                Thêm thẻ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Add Modal */}
      {showBulkModal && (
        <div className={styles.modalOverlay}>
          <div className={`${styles.modal} ${styles.bulkModal}`}>
            <div className={styles.modalHeader}>
              <h3>Thêm thẻ hàng loạt</h3>
              <button 
                className={styles.closeButton}
                onClick={() => {
                  setShowBulkModal(false);
                  setBulkCards([{ front: "", back: "", example: "" }]);
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.excelTable}>
                <div className={styles.tableHeader}>
                  <div className={styles.tableCell}>STT</div>
                  <div className={styles.tableCell}>Từ vựng</div>
                  <div className={styles.tableCell}>Định nghĩa</div>
                  <div className={styles.tableCell}>Ví dụ</div>
                  <div className={styles.tableCell}>Xóa</div>
                </div>
                <div className={styles.tableBody}>
                  {bulkCards.map((card, index) => (
                    <div key={index} className={styles.tableRow}>
                      <div className={styles.tableCell}>{index + 1}</div>
                      <div className={styles.tableCell}>
                        <input
                          type="text"
                          value={card.front}
                          onChange={(e) => updateBulkCard(index, "front", e.target.value)}
                          placeholder="Apple"
                        />
                      </div>
                      <div className={styles.tableCell}>
                        <input
                          type="text"
                          value={card.back}
                          onChange={(e) => updateBulkCard(index, "back", e.target.value)}
                          placeholder="Quả táo"
                        />
                      </div>
                      <div className={styles.tableCell}>
                        <input
                          type="text"
                          value={card.example}
                          onChange={(e) => updateBulkCard(index, "example", e.target.value)}
                          placeholder="I eat an apple"
                        />
                      </div>
                      <div className={styles.tableCell}>
                        <button
                          className={styles.removeRowButton}
                          onClick={() => removeBulkRow(index)}
                          disabled={bulkCards.length === 1}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <button className={styles.addRowButton} onClick={addBulkRow}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  Thêm hàng mới
                </button>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button 
                className={styles.cancelButton}
                onClick={() => {
                  setShowBulkModal(false);
                  setBulkCards([{ front: "", back: "", example: "" }]);
                }}
              >
                Hủy
              </button>
              <button 
                className={styles.submitButton}
                onClick={handleBulkAdd}
              >
                Thêm {bulkCards.filter(c => c.front && c.back).length} thẻ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Card Modal */}
      {showEditModal && editingCard && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>Sửa thẻ</h3>
              <button 
                className={styles.closeButton}
                onClick={() => {
                  setShowEditModal(false);
                  setEditingCard(null);
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.formGroup}>
                <label>Từ vựng (Front)</label>
                <input
                  type="text"
                  value={editingCard.front}
                  onChange={(e) => setEditingCard({ ...editingCard, front: e.target.value })}
                  placeholder="Ví dụ: Apple"
                />
              </div>
              <div className={styles.formGroup}>
                <label>Định nghĩa (Back)</label>
                <input
                  type="text"
                  value={editingCard.back}
                  onChange={(e) => setEditingCard({ ...editingCard, back: e.target.value })}
                  placeholder="Ví dụ: Quả táo"
                />
              </div>
              <div className={styles.formGroup}>
                <label>Ví dụ (Example)</label>
                <textarea
                  value={editingCard.example || ""}
                  onChange={(e) => setEditingCard({ ...editingCard, example: e.target.value })}
                  placeholder="Ví dụ: I eat an apple every day."
                  rows={3}
                />
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button 
                className={styles.cancelButton}
                onClick={() => {
                  setShowEditModal(false);
                  setEditingCard(null);
                }}
              >
                Hủy
              </button>
              <button 
                className={styles.submitButton}
                onClick={handleUpdateCard}
              >
                Cập nhật
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Words Grid */}
      <div className={styles.wordsList}>
        {words.length > 0 ? (
          words.map((word) => (
            <div key={word.id} className={styles.wordItem}>
              <div className={styles.wordHeader}>
                <h3 className={styles.wordText}>{word.front}</h3>
                <div className={styles.cardActions}>
                  <button 
                    className={styles.editButton}
                    onClick={() => handleEditCard(word)}
                    title="Sửa thẻ"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </button>
                  <button 
                    className={styles.deleteButton}
                    onClick={() => handleDeleteCard(word.id)}
                    title="Xóa thẻ"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      <line x1="10" y1="11" x2="10" y2="17" />
                      <line x1="14" y1="11" x2="14" y2="17" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className={styles.wordContent}>
                {/* Meaning */}
                <div className={`${styles.infoRow} ${styles.meaning}`}>
                  <div className={styles.iconWrapper}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                    </svg>
                  </div>
                  <div className={styles.infoContent}>
                    <span className={styles.label}>Định nghĩa</span>
                    <p className={styles.text}>{word.back}</p>
                  </div>
                </div>

                {/* Example */}
                {word.example && (
                  <div className={`${styles.infoRow} ${styles.example}`}>
                    <div className={styles.iconWrapper}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                      </svg>
                    </div>
                    <div className={styles.infoContent}>
                      <span className={styles.label}>Ví dụ</span>
                      <p className={styles.text}>{word.example}</p>
                    </div>
                  </div>
                )}

                {/* Note */}
                {word.note && (
                  <div className={`${styles.infoRow} ${styles.note}`}>
                    <div className={styles.iconWrapper}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </div>
                    <div className={styles.infoContent}>
                      <span className={styles.label}>Ghi chú</span>
                      <p className={styles.text}>{word.note}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className={styles.emptyWords}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" color="#cbd5e1" style={{ marginBottom: 16 }}>
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <line x1="3" y1="9" x2="21" y2="9" />
              <line x1="9" y1="21" x2="9" y2="9" />
            </svg>
            <p>Chưa có từ vựng nào trong bộ này.</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        title="Xác nhận xóa"
        message="Bạn có chắc chắn muốn xóa thẻ này không? Hành động này không thể hoàn tác."
        confirmText="Xóa"
        cancelText="Hủy"
        variant="danger"
        onConfirm={confirmDelete}
        onCancel={() => {
          setShowDeleteModal(false);
          setDeletingId(null);
        }}
      />

      {/* Success Modal */}
      <SuccessModal
        isOpen={!!successMessage}
        message={successMessage || ""}
        onClose={() => setSuccessMessage(null)}
        autoClose={true}
        autoCloseDelay={2000}
      />
    </div>
  );
};

export default FlashcardDetail;
