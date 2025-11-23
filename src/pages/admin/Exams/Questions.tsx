import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { getUser, isAuthenticated } from "../../../utils/storage";
import {
  getQuestionsByExamId,
  getExamById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  type CreateQuestionData,
  type UpdateQuestionData,
  type Answer,
  type Question,
} from "../../../services/adminService";
import AdminLayout from "../../../components/admin/Layout/Layout";
import type { User } from "../../../types/api";
import styles from "./Questions.module.css";

const AdminQuestions: React.FC = () => {
  const navigate = useNavigate();
  const { examId } = useParams<{ examId: string }>();
  const currentUser: User | null = getUser();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [createError, setCreateError] = useState("");
  const [createSuccess, setCreateSuccess] = useState("");
  const [updateError, setUpdateError] = useState("");
  const [updateSuccess, setUpdateSuccess] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [deletingQuestionId, setDeletingQuestionId] = useState<string | number | null>(null);
  const [formData, setFormData] = useState<CreateQuestionData>({
    questionText: "",
    orderNumber: undefined,
    explanation: "",
    answers: [],
  });
  const [editData, setEditData] = useState<UpdateQuestionData>({
    questionText: "",
    orderNumber: undefined,
    explanation: "",
    answers: [],
  });
  const lastFetchTime = useRef<number>(0);

  useEffect(() => {
    if (examId) {
      fetchQuestions(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examId]);

  const fetchQuestions = async (retryCount = 0) => {
    if (!examId) return;

    try {
      const now = Date.now();
      const timeSinceLastFetch = now - lastFetchTime.current;
      if (timeSinceLastFetch < 2000 && retryCount === 0) {
        return;
      }
      lastFetchTime.current = now;

      setLoading(true);
      setError("");

      // Thử lấy từ endpoint questions trước
      try {
        const response = await getQuestionsByExamId(examId);

        if ((response.success || response.status === "success") && response.data?.questions) {
          setQuestions(response.data.questions);
          setLoading(false);
          return;
        } else if (response.data && Array.isArray(response.data)) {
          setQuestions(response.data as Question[]);
          setLoading(false);
          return;
        }
      } catch (questionsErr) {
        console.warn("Không thể lấy từ endpoint questions, thử từ exam detail:", questionsErr);
      }

      // Nếu không lấy được từ endpoint questions, thử lấy từ exam detail
      const examResponse = await getExamById(examId);
      
      if (examResponse.data?.questions && examResponse.data.questions.length > 0) {
        setQuestions(examResponse.data.questions);
      } else {
        setQuestions([]);
      }
    } catch (err: any) {
      console.error("❌ Lỗi khi lấy danh sách câu hỏi:", err);

      if (err.response?.status === 429) {
        const retryAfter = err.response.headers?.["retry-after"] || 5;
        setError(`Quá nhiều yêu cầu. Vui lòng đợi ${retryAfter} giây trước khi thử lại.`);
        if (retryCount < 3) {
          setTimeout(() => {
            fetchQuestions(retryCount + 1);
          }, retryAfter * 1000);
          return;
        }
      } else if (err.response?.status === 401) {
        setError("Token không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại.");
      } else if (err.response?.status === 403) {
        setError("Bạn không có quyền truy cập. Chỉ admin mới có thể xem danh sách câu hỏi.");
      } else {
        setError(err.message || "Có lỗi xảy ra khi lấy danh sách câu hỏi");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!examId) return;

    setCreating(true);
    setCreateError("");
    setCreateSuccess("");

    if (!formData.questionText.trim()) {
      setCreateError("Vui lòng nhập nội dung câu hỏi.");
      setCreating(false);
      return;
    }

    if (formData.answers && formData.answers.length > 0) {
      const hasCorrectAnswer = formData.answers.some((answer) => answer.isCorrect);
      if (!hasCorrectAnswer) {
        setCreateError("Vui lòng chọn ít nhất một đáp án đúng.");
        setCreating(false);
        return;
      }
    }

    try {
      const questionData: CreateQuestionData = {
        questionText: formData.questionText,
      };

      if (formData.orderNumber !== undefined) {
        questionData.orderNumber = formData.orderNumber;
      }

      if (formData.explanation?.trim()) {
        questionData.explanation = formData.explanation;
      }

      if (formData.answers && formData.answers.length > 0) {
        questionData.answers = formData.answers;
      }

      const response = await createQuestion(examId, questionData);

      if (response.success || (response as any).status === "success") {
        setCreateSuccess("Tạo câu hỏi thành công!");
        setFormData({
          questionText: "",
          orderNumber: undefined,
          explanation: "",
          answers: [],
        });
        fetchQuestions(0);
        setTimeout(() => {
          setShowCreateModal(false);
          setCreateSuccess("");
        }, 2000);
      } else {
        setCreateError((response as any).message || "Không thể tạo câu hỏi");
      }
    } catch (err: any) {
      console.error("❌ Lỗi khi tạo câu hỏi:", err);
      setCreateError(err.message || "Có lỗi xảy ra khi tạo câu hỏi");
    } finally {
      setCreating(false);
    }
  };

  const handleEditClick = (question: Question) => {
    setEditingQuestion(question);
    setEditData({
      questionText: question.questionText || "",
      orderNumber: question.orderNumber,
      explanation: question.explanation || "",
      answers: question.answers || [],
    });
    setShowEditModal(true);
  };

  const handleUpdateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingQuestion) return;

    setUpdating(true);
    setUpdateError("");
    setUpdateSuccess("");

    if (editData.questionText !== undefined && !editData.questionText.trim()) {
      setUpdateError("Vui lòng nhập nội dung câu hỏi.");
      setUpdating(false);
      return;
    }

    if (editData.answers && editData.answers.length > 0) {
      const hasCorrectAnswer = editData.answers.some((answer) => answer.isCorrect);
      if (!hasCorrectAnswer) {
        setUpdateError("Vui lòng chọn ít nhất một đáp án đúng.");
        setUpdating(false);
        return;
      }
    }

    try {
      const questionData: UpdateQuestionData = {};

      if (editData.questionText !== undefined) {
        questionData.questionText = editData.questionText;
      }

      if (editData.orderNumber !== undefined) {
        questionData.orderNumber = editData.orderNumber;
      }

      if (editData.explanation !== undefined) {
        questionData.explanation = editData.explanation;
      }

      if (editData.answers !== undefined) {
        questionData.answers = editData.answers;
      }

      const response = await updateQuestion(editingQuestion.id!, questionData);

      if (response.success || response.status === "success") {
        setUpdateSuccess("Cập nhật câu hỏi thành công!");
        fetchQuestions(0);
        setTimeout(() => {
          setShowEditModal(false);
          setUpdateSuccess("");
          setEditingQuestion(null);
        }, 2000);
      } else {
        setUpdateError(response.message || "Không thể cập nhật câu hỏi");
      }
    } catch (err: any) {
      console.error("❌ Lỗi khi cập nhật câu hỏi:", err);
      setUpdateError(err.message || "Có lỗi xảy ra khi cập nhật câu hỏi");
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteClick = (questionId: string | number) => {
    setDeletingQuestionId(questionId);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingQuestionId) return;

    setDeleting(true);
    setDeleteError("");

    try {
      const response = await deleteQuestion(deletingQuestionId);

      if (response.success || response.status === "success") {
        setQuestions(questions.filter((q) => q.id !== deletingQuestionId));
        setShowDeleteModal(false);
        setDeletingQuestionId(null);
        fetchQuestions(0);
      } else {
        setDeleteError(response.message || "Không thể xóa câu hỏi");
      }
    } catch (err: any) {
      console.error("❌ Lỗi khi xóa câu hỏi:", err);
      setDeleteError(err.message || "Có lỗi xảy ra khi xóa câu hỏi");
    } finally {
      setDeleting(false);
    }
  };

  const addAnswer = (isEdit: boolean = false) => {
    const answers = isEdit ? editData.answers : formData.answers;
    const newAnswer: Answer = {
      answerText: "",
      option: String.fromCharCode(65 + (answers?.length || 0)),
      isCorrect: false,
    };
    if (isEdit) {
      setEditData({
        ...editData,
        answers: [...(editData.answers || []), newAnswer],
      });
    } else {
      setFormData({
        ...formData,
        answers: [...(formData.answers || []), newAnswer],
      });
    }
  };

  const removeAnswer = (index: number, isEdit: boolean = false) => {
    if (isEdit) {
      const newAnswers = editData.answers?.filter((_, i) => i !== index) || [];
      const updatedAnswers = newAnswers.map((answer, i) => ({
        ...answer,
        option: String.fromCharCode(65 + i),
      }));
      setEditData({
        ...editData,
        answers: updatedAnswers,
      });
    } else {
      const newAnswers = formData.answers?.filter((_, i) => i !== index) || [];
      const updatedAnswers = newAnswers.map((answer, i) => ({
        ...answer,
        option: String.fromCharCode(65 + i),
      }));
      setFormData({
        ...formData,
        answers: updatedAnswers,
      });
    }
  };

  const updateAnswer = (index: number, field: keyof Answer, value: any, isEdit: boolean = false) => {
    if (isEdit) {
      const newAnswers = [...(editData.answers || [])];
      newAnswers[index] = { ...newAnswers[index], [field]: value };
      setEditData({
        ...editData,
        answers: newAnswers,
      });
    } else {
      const newAnswers = [...(formData.answers || [])];
      newAnswers[index] = { ...newAnswers[index], [field]: value };
      setFormData({
        ...formData,
        answers: newAnswers,
      });
    }
  };

  if (!currentUser || currentUser.role !== "admin") {
    return null;
  }

  return (
    <AdminLayout>
      <div className={styles.container}>
        <div className={styles.header}>
          <Link to={`/admin/exams/${examId}`} className={styles.backButton}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Quay lại
          </Link>
          <h1 className={styles.title}>Quản lý câu hỏi</h1>
          <div className={styles.headerButtons}>
            <button
              onClick={() => {
                setShowCreateModal(true);
                setFormData({
                  questionText: "",
                  orderNumber: questions.length + 1,
                  explanation: "",
                  answers: [],
                });
              }}
              className={styles.createButton}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Tạo câu hỏi mới
            </button>
            <button
              onClick={() => fetchQuestions(0)}
              className={styles.refreshButton}
              disabled={loading}
            >
              {loading ? "Đang tải..." : "Làm mới"}
            </button>
          </div>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        {loading ? (
          <div className={styles.loading}>Đang tải dữ liệu...</div>
        ) : (
          <div className={styles.questionsList}>
            {questions.length === 0 ? (
              <div className={styles.empty}>
                <p>Chưa có câu hỏi nào. Hãy tạo câu hỏi mới bằng nút "Tạo câu hỏi mới" ở trên.</p>
              </div>
            ) : (
              questions.map((question, index) => (
                <div key={question.id || index} className={styles.questionItem}>
                  <div className={styles.questionHeader}>
                    <div className={styles.questionHeaderLeft}>
                      <span className={styles.questionNumber}>Câu {index + 1}</span>
                      {question.orderNumber && (
                        <span className={styles.orderNumber}>Thứ tự: {question.orderNumber}</span>
                      )}
                      {question.points && (
                        <span className={styles.questionPoints}>{question.points} điểm</span>
                      )}
                      {question.marks && !question.points && (
                        <span className={styles.questionPoints}>{question.marks} điểm</span>
                      )}
                    </div>
                    <div className={styles.questionActions}>
                      <button
                        onClick={() => handleEditClick(question)}
                        className={styles.editButton}
                        title="Sửa câu hỏi"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDeleteClick(question.id!)}
                        className={styles.deleteButton}
                        title="Xóa câu hỏi"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                        Xóa
                      </button>
                    </div>
                  </div>
                  <p className={styles.questionText}>{question.questionText}</p>
                  {question.explanation && (
                    <div className={styles.questionExplanation}>
                      <strong>Giải thích:</strong>
                      <p>{question.explanation}</p>
                    </div>
                  )}
                  {question.answers && question.answers.length > 0 ? (
                    <div className={styles.questionAnswers}>
                      <strong>Đáp án ({question.answers.length}):</strong>
                      <ul>
                        {question.answers.map((answer, ansIndex) => (
                          <li key={ansIndex} className={answer.isCorrect ? styles.correctAnswer : styles.wrongAnswer}>
                            <span className={styles.answerOption}>{answer.option}.</span>
                            <span className={styles.answerText}>{answer.answerText}</span>
                            {answer.isCorrect && <span className={styles.correctBadge}>✓ Đúng</span>}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <div className={styles.noAnswers}>
                      <p>Chưa có đáp án nào cho câu hỏi này.</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Modal tạo câu hỏi */}
        {showCreateModal && (
          <div
            className={styles.modalOverlay}
            onClick={() => {
              setShowCreateModal(false);
              setCreateError("");
              setCreateSuccess("");
              setFormData({
                questionText: "",
                orderNumber: undefined,
                explanation: "",
                answers: [],
              });
            }}
          >
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h2>Tạo câu hỏi mới</h2>
                <button
                  className={styles.modalClose}
                  onClick={() => {
                    setShowCreateModal(false);
                    setCreateError("");
                    setCreateSuccess("");
                    setFormData({
                      questionText: "",
                      orderNumber: undefined,
                      explanation: "",
                      answers: [],
                    });
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>

              {createError && <div className={styles.modalError}>{createError}</div>}
              {createSuccess && <div className={styles.modalSuccess}>{createSuccess}</div>}

              <form onSubmit={handleCreateQuestion} className={styles.modalForm}>
                <div className={styles.formGroup}>
                  <label htmlFor="questionText">Nội dung câu hỏi *</label>
                  <textarea
                    id="questionText"
                    name="questionText"
                    value={formData.questionText}
                    onChange={(e) => setFormData({ ...formData, questionText: e.target.value })}
                    required
                    placeholder="Nhập nội dung câu hỏi"
                    rows={4}
                  />
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="orderNumber">Thứ tự</label>
                    <input
                      type="number"
                      id="orderNumber"
                      name="orderNumber"
                      value={formData.orderNumber || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          orderNumber: e.target.value === "" ? undefined : Number(e.target.value),
                        })
                      }
                      min="1"
                      placeholder="Tự động"
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="explanation">Giải thích</label>
                  <textarea
                    id="explanation"
                    name="explanation"
                    value={formData.explanation || ""}
                    onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                    placeholder="Nhập giải thích cho câu trả lời"
                    rows={3}
                  />
                </div>

                <div className={styles.answersSection}>
                  <div className={styles.answersHeader}>
                    <label>Các đáp án</label>
                    <button
                      type="button"
                      onClick={() => addAnswer(false)}
                      className={styles.addAnswerButton}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                      </svg>
                      Thêm đáp án
                    </button>
                  </div>

                  {formData.answers && formData.answers.length > 0 ? (
                    <div className={styles.answersList}>
                      {formData.answers.map((answer, index) => (
                        <div key={index} className={styles.answerItem}>
                          <div className={styles.answerHeader}>
                            <span className={styles.answerOption}>{answer.option}</span>
                            <button
                              type="button"
                              onClick={() => removeAnswer(index, false)}
                              className={styles.removeAnswerButton}
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                              </svg>
                            </button>
                          </div>
                          <input
                            type="text"
                            value={answer.answerText}
                            onChange={(e) => updateAnswer(index, "answerText", e.target.value, false)}
                            placeholder="Nhập nội dung đáp án"
                            className={styles.answerInput}
                          />
                          <label className={styles.isCorrectLabel}>
                            <input
                              type="checkbox"
                              checked={answer.isCorrect}
                              onChange={(e) => updateAnswer(index, "isCorrect", e.target.checked, false)}
                            />
                            <span>Đáp án đúng</span>
                          </label>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className={styles.noAnswers}>Chưa có đáp án nào. Nhấn "Thêm đáp án" để thêm.</p>
                  )}
                </div>

                <div className={styles.modalActions}>
                  <button
                    type="button"
                    className={styles.cancelButton}
                    onClick={() => {
                      setShowCreateModal(false);
                      setCreateError("");
                      setCreateSuccess("");
                      setFormData({
                        questionText: "",
                        orderNumber: undefined,
                        explanation: "",
                        answers: [],
                      });
                    }}
                    disabled={creating}
                  >
                    Hủy
                  </button>
                  <button type="submit" className={styles.submitButton} disabled={creating}>
                    {creating ? "Đang tạo..." : "Tạo câu hỏi"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal sửa câu hỏi */}
        {showEditModal && editingQuestion && (
          <div
            className={styles.modalOverlay}
            onClick={() => {
              setShowEditModal(false);
              setUpdateError("");
              setUpdateSuccess("");
              setEditingQuestion(null);
            }}
          >
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h2>Sửa câu hỏi</h2>
                <button
                  className={styles.modalClose}
                  onClick={() => {
                    setShowEditModal(false);
                    setUpdateError("");
                    setUpdateSuccess("");
                    setEditingQuestion(null);
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>

              {updateError && <div className={styles.modalError}>{updateError}</div>}
              {updateSuccess && <div className={styles.modalSuccess}>{updateSuccess}</div>}

              <form onSubmit={handleUpdateQuestion} className={styles.modalForm}>
                <div className={styles.formGroup}>
                  <label htmlFor="editQuestionText">Nội dung câu hỏi</label>
                  <textarea
                    id="editQuestionText"
                    name="questionText"
                    value={editData.questionText || ""}
                    onChange={(e) => setEditData({ ...editData, questionText: e.target.value })}
                    placeholder="Nhập nội dung câu hỏi"
                    rows={4}
                  />
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="editOrderNumber">Thứ tự</label>
                    <input
                      type="number"
                      id="editOrderNumber"
                      name="orderNumber"
                      value={editData.orderNumber || ""}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          orderNumber: e.target.value === "" ? undefined : Number(e.target.value),
                        })
                      }
                      min="1"
                      placeholder="Tự động"
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="editExplanation">Giải thích</label>
                  <textarea
                    id="editExplanation"
                    name="explanation"
                    value={editData.explanation || ""}
                    onChange={(e) => setEditData({ ...editData, explanation: e.target.value })}
                    placeholder="Nhập giải thích cho câu trả lời"
                    rows={3}
                  />
                </div>

                <div className={styles.answersSection}>
                  <div className={styles.answersHeader}>
                    <label>Các đáp án</label>
                    <button
                      type="button"
                      onClick={() => addAnswer(true)}
                      className={styles.addAnswerButton}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                      </svg>
                      Thêm đáp án
                    </button>
                  </div>

                  {editData.answers && editData.answers.length > 0 ? (
                    <div className={styles.answersList}>
                      {editData.answers.map((answer, index) => (
                        <div key={index} className={styles.answerItem}>
                          <div className={styles.answerHeader}>
                            <span className={styles.answerOption}>{answer.option}</span>
                            <button
                              type="button"
                              onClick={() => removeAnswer(index, true)}
                              className={styles.removeAnswerButton}
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                              </svg>
                            </button>
                          </div>
                          <input
                            type="text"
                            value={answer.answerText}
                            onChange={(e) => updateAnswer(index, "answerText", e.target.value, true)}
                            placeholder="Nhập nội dung đáp án"
                            className={styles.answerInput}
                          />
                          <label className={styles.isCorrectLabel}>
                            <input
                              type="checkbox"
                              checked={answer.isCorrect}
                              onChange={(e) => updateAnswer(index, "isCorrect", e.target.checked, true)}
                            />
                            <span>Đáp án đúng</span>
                          </label>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className={styles.noAnswers}>Chưa có đáp án nào. Nhấn "Thêm đáp án" để thêm.</p>
                  )}
                </div>

                <div className={styles.modalActions}>
                  <button
                    type="button"
                    className={styles.cancelButton}
                    onClick={() => {
                      setShowEditModal(false);
                      setUpdateError("");
                      setUpdateSuccess("");
                      setEditingQuestion(null);
                    }}
                    disabled={updating}
                  >
                    Hủy
                  </button>
                  <button type="submit" className={styles.submitButton} disabled={updating}>
                    {updating ? "Đang cập nhật..." : "Cập nhật"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal xác nhận xóa */}
        {showDeleteModal && deletingQuestionId && (
          <div
            className={styles.modalOverlay}
            onClick={() => {
              setShowDeleteModal(false);
              setDeletingQuestionId(null);
              setDeleteError("");
            }}
          >
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h2>Xác nhận xóa câu hỏi</h2>
                <button
                  className={styles.modalClose}
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeletingQuestionId(null);
                    setDeleteError("");
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
              {deleteError && <div className={styles.modalError}>{deleteError}</div>}
              <div className={styles.modalContent}>
                <p>
                  Bạn có chắc chắn muốn xóa câu hỏi{" "}
                  <strong>
                    {questions.find((q) => q.id === deletingQuestionId)?.questionText || "này"}
                  </strong>?
                </p>
                <p>Hành động này không thể hoàn tác.</p>
              </div>
              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeletingQuestionId(null);
                    setDeleteError("");
                  }}
                  disabled={deleting}
                >
                  Hủy
                </button>
                <button
                  type="button"
                  className={styles.deleteButton}
                  onClick={handleDeleteConfirm}
                  disabled={deleting}
                >
                  {deleting ? "Đang xóa..." : "Xóa"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminQuestions;

