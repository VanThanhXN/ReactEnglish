import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getExamPackageById, type ExamPackageDetail, type Question, type Answer } from "../../services/examService";
import styles from "./ExamTake.module.css";

const ExamTake: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [exam, setExam] = useState<ExamPackageDetail | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [questionId: number]: number }>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set());
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const selectedAnswersRef = useRef<{ [questionId: number]: number }>({});
  const examRef = useRef<ExamPackageDetail | null>(null);

  useEffect(() => {
    if (id) {
      fetchExam(parseInt(id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (exam && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            // Tự động nộp bài khi hết thời gian (không cần dialog)
            if (timerRef.current) {
              clearInterval(timerRef.current);
            }
            const currentExam = examRef.current;
            const currentAnswers = selectedAnswersRef.current;
            if (currentExam && id) {
              const results = {
                examId: currentExam.id,
                selectedAnswers: currentAnswers,
                totalQuestions: currentExam.totalQuestions,
                answeredQuestions: Object.keys(currentAnswers).length,
                timeRemaining: 0,
              };
              navigate(`/exams/${id}/result`, { state: { results, exam: currentExam } });
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exam, timeRemaining, id, navigate]);

  const fetchExam = async (examId: number) => {
    try {
      setLoading(true);
      const response = await getExamPackageById(examId);
      if (response.success && response.data) {
        setExam(response.data);
        examRef.current = response.data;
        setTimeRemaining(response.data.duration * 60);
      }
    } catch (error) {
      console.error("Error fetching exam:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionId: number, answerId: number) => {
    setSelectedAnswers((prev) => {
      const newAnswers = {
        ...prev,
        [questionId]: answerId,
      };
      selectedAnswersRef.current = newAnswers;
      return newAnswers;
    });
  };

  const handleFlagQuestion = (questionId: number) => {
    setFlaggedQuestions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const handleQuestionClick = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  const handleClearSelection = () => {
    setSelectedAnswers((prev) => {
      const newAnswers = { ...prev };
      delete newAnswers[currentQuestion.id];
      return newAnswers;
    });
  };

  const handleSubmitExam = () => {
    setShowSubmitDialog(true);
  };

  const confirmSubmitExam = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    const results = {
      examId: exam?.id,
      selectedAnswers,
      totalQuestions: exam?.totalQuestions || 0,
      answeredQuestions: Object.keys(selectedAnswers).length,
      timeRemaining,
    };

    setShowSubmitDialog(false);
    navigate(`/exams/${id}/result`, { state: { results, exam } });
  };

  const cancelSubmitExam = () => {
    setShowSubmitDialog(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (loading || !exam) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Đang tải đề thi...</div>
      </div>
    );
  }

  const currentQuestion = exam.questions[currentQuestionIndex];
  const totalQuestions = exam.questions.length;

  return (
    <div className={styles.container}>
      <div className={styles.examSection}>
        <div className={styles.questionContent}>
          <p className={styles.questionText}>
            <span className={styles.questionLabel}>Câu {currentQuestionIndex + 1}:</span> {currentQuestion.questionText}
          </p>
        </div>

        <div className={styles.answersSection}>
          {currentQuestion.answers.map((answer: Answer) => (
            <label
              key={answer.id}
              className={`${styles.answerOption} ${
                selectedAnswers[currentQuestion.id] === answer.id ? styles.selected : ""
              }`}
            >
              <input
                type="radio"
                name={`question-${currentQuestion.id}`}
                value={answer.id}
                checked={selectedAnswers[currentQuestion.id] === answer.id}
                onChange={() => handleAnswerSelect(currentQuestion.id, answer.id)}
              />
              <span className={styles.optionLabel}>{answer.option}.</span>
              <span className={styles.answerText}>{answer.answerText}</span>
            </label>
          ))}
        </div>

        <div className={styles.navigation}>
          <button
            className={styles.navButton}
            onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentQuestionIndex === 0}
          >
            Câu trước
          </button>
          <button
            className={styles.clearButton}
            onClick={handleClearSelection}
            disabled={!selectedAnswers[currentQuestion.id]}
          >
            Xóa lựa chọn
          </button>
          <button
            className={styles.navButton}
            onClick={() => setCurrentQuestionIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
            disabled={currentQuestionIndex === totalQuestions - 1}
          >
            Câu sau
          </button>
        </div>
      </div>

      <div className={styles.sidebar}>
        <div className={styles.header}>
          <div className={styles.titleRow}>
            <h2 className={styles.examTitle}>{exam.title}</h2>
            <button
              className={`${styles.flagButton} ${flaggedQuestions.has(currentQuestion.id) ? styles.flagged : ""}`}
              onClick={() => handleFlagQuestion(currentQuestion.id)}
              title="Đánh dấu câu hỏi"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                <line x1="4" y1="22" x2="4" y2="15" />
              </svg>
            </button>
          </div>
          <div className={styles.timer}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span className={styles.timeText}>{formatTime(timeRemaining)}</span>
          </div>
          <button onClick={handleSubmitExam} className={styles.submitButton}>
            Nộp bài
          </button>
        </div>

        <div className={styles.questionList}>
          <h3 className={styles.listTitle}>Danh sách câu hỏi</h3>
          <div className={styles.questionsGrid}>
            {exam.questions.map((question: Question, index: number) => (
              <button
                key={question.id}
                className={`${styles.questionItem} ${
                  currentQuestionIndex === index ? styles.active : ""
                } ${selectedAnswers[question.id] ? styles.answered : ""} ${
                  flaggedQuestions.has(question.id) ? styles.flagged : ""
                }`}
                onClick={() => handleQuestionClick(index)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Submit Confirmation Dialog */}
      {showSubmitDialog && (
        <div className={styles.dialogOverlay} onClick={cancelSubmitExam}>
          <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.dialogTitle}>Xác nhận nộp bài</h3>
            <p className={styles.dialogMessage}>
              Bạn có chắc chắn muốn nộp bài thi này không? Sau khi nộp bài, bạn sẽ không thể thay đổi đáp án nữa.
            </p>
            <div className={styles.dialogInfo}>
              <div className={styles.dialogInfoItem}>
                <span className={styles.dialogInfoLabel}>Đã làm:</span>
                <span className={styles.dialogInfoValue}>
                  {Object.keys(selectedAnswers).length}/{exam.totalQuestions} câu
                </span>
              </div>
              <div className={styles.dialogInfoItem}>
                <span className={styles.dialogInfoLabel}>Thời gian còn lại:</span>
                <span className={styles.dialogInfoValue}>{formatTime(timeRemaining)}</span>
              </div>
            </div>
            <div className={styles.dialogActions}>
              <button
                className={styles.dialogCancel}
                onClick={cancelSubmitExam}
              >
                Hủy
              </button>
              <button
                className={styles.dialogConfirm}
                onClick={confirmSubmitExam}
              >
                Nộp bài
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamTake;

