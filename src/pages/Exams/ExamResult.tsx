import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { getUser, isAuthenticated } from "../../utils/storage";
import type { ExamPackageDetail, Question, Answer } from "../../services/examService";
import type { User } from "../../types/api";
import styles from "./ExamResult.module.css";

interface ExamResults {
  examId?: number;
  selectedAnswers: { [questionId: number]: number };
  totalQuestions: number;
  answeredQuestions: number;
  timeRemaining: number;
}

const ExamResult: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user: User | null = getUser();
  const results = location.state?.results as ExamResults | undefined;
  const exam = location.state?.exam as ExamPackageDetail | undefined;
  const [showAnswers, setShowAnswers] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login", { replace: true });
      return;
    }

    if (user?.role === "admin") {
      navigate("/admin/dashboard", { replace: true });
      return;
    }

    if (!results || !exam) {
      navigate("/exams", { replace: true });
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!results || !exam) {
    return null;
  }

  // Tính điểm số
  let correctAnswers = 0;
  exam.questions.forEach((question: Question) => {
    const selectedAnswerId = results.selectedAnswers[question.id];
    if (selectedAnswerId) {
      const selectedAnswer = question.answers.find((a: Answer) => a.id === selectedAnswerId);
      if (selectedAnswer?.isCorrect) {
        correctAnswers++;
      }
    }
  });

  const score = Math.round((correctAnswers / exam.totalQuestions) * 100);
  const timeSpent = exam.duration * 60 - results.timeRemaining;
  const minutesSpent = Math.floor(timeSpent / 60);
  const secondsSpent = timeSpent % 60;

  const getSelectedAnswer = (question: Question) => {
    const selectedAnswerId = results.selectedAnswers[question.id];
    return question.answers.find((a: Answer) => a.id === selectedAnswerId);
  };

  const getCorrectAnswer = (question: Question) => {
    return question.answers.find((a: Answer) => a.isCorrect);
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Kết quả bài thi</h1>
        <h2 className={styles.examTitle}>{exam.title}</h2>

        <div className={styles.scoreSection}>
          <div className={styles.scoreCircle}>
            <div className={styles.scoreValue}>{score}</div>
            <div className={styles.scoreLabel}>Điểm</div>
          </div>
          <div className={styles.scoreDetails}>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Số câu đúng:</span>
              <span className={styles.detailValue}>{correctAnswers}/{exam.totalQuestions}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Số câu sai:</span>
              <span className={styles.detailValue}>{exam.totalQuestions - correctAnswers}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Thời gian làm bài:</span>
              <span className={styles.detailValue}>
                {minutesSpent} phút {secondsSpent} giây
              </span>
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <button
            className={styles.viewAnswersButton}
            onClick={() => setShowAnswers(!showAnswers)}
          >
            {showAnswers ? "Ẩn đáp án" : "Xem đáp án"}
          </button>
          <Link to="/exams" className={styles.backButton}>
            Quay lại danh sách
          </Link>
          <Link to={`/exams/${exam.id}`} className={styles.retryButton}>
            Làm lại
          </Link>
        </div>

        {showAnswers && (
          <div className={styles.answersSection}>
            <h3 className={styles.answersTitle}>Chi tiết đáp án</h3>
            <div className={styles.questionsList}>
              {exam.questions.map((question: Question, index: number) => {
                const selectedAnswer = getSelectedAnswer(question);
                const correctAnswer = getCorrectAnswer(question);
                const isCorrect = selectedAnswer?.isCorrect || false;

                return (
                  <div
                    key={question.id}
                    className={`${styles.questionItem} ${isCorrect ? styles.correct : styles.incorrect}`}
                  >
                    <div className={styles.questionHeader}>
                      <span className={styles.questionNumber}>Câu {index + 1}:</span>
                      <span className={styles.questionStatus}>
                        {isCorrect ? "✓ Đúng" : "✗ Sai"}
                      </span>
                    </div>
                    <p className={styles.questionText}>{question.questionText}</p>
                    <div className={styles.answersList}>
                      {question.answers.map((answer: Answer) => {
                        const isSelected = selectedAnswer?.id === answer.id;
                        const isCorrectAnswer = answer.isCorrect;

                        return (
                          <div
                            key={answer.id}
                            className={`${styles.answerItem} ${
                              isSelected ? styles.selected : ""
                            } ${isCorrectAnswer ? styles.correctAnswer : ""}`}
                          >
                            <span className={styles.answerOption}>{answer.option}.</span>
                            <span className={styles.answerText}>{answer.answerText}</span>
                            {isCorrectAnswer && (
                              <span className={styles.correctBadge}>Đáp án đúng</span>
                            )}
                            {isSelected && !isCorrectAnswer && (
                              <span className={styles.wrongBadge}>Bạn chọn</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamResult;

