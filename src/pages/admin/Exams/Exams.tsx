import React, { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getUser, isAuthenticated } from "../../../utils/storage";
import {
  createExam,
  getAllExams,
  type CreateExamData,
  type Exam,
} from "../../../services/adminService";
import AdminLayout from "../../../components/admin/Layout/Layout";
import type { User } from "../../../types/api";
import styles from "./Exams.module.css";

const AdminExams: React.FC = () => {
  const navigate = useNavigate();
  const currentUser: User | null = getUser();
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  const [createSuccess, setCreateSuccess] = useState("");
  const [formData, setFormData] = useState<CreateExamData>({
    title: "",
    description: "",
    duration: 120,
    totalMarks: 100,
  });
  const lastFetchTime = useRef<number>(0);

  useEffect(() => {
    // Kiểm tra authentication và role
    if (!isAuthenticated()) {
      navigate("/admin/login");
      return;
    }

    if (currentUser?.role !== "admin") {
      navigate("/dashboard");
      return;
    }

    // Lấy danh sách exams - chỉ load 1 lần khi component mount (khi refresh trình duyệt)
    fetchExams(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Chỉ chạy 1 lần khi component mount

  const fetchExams = async (retryCount = 0) => {
    try {
      // Debounce: Tránh spam request (tối thiểu 2 giây giữa các request)
      const now = Date.now();
      const timeSinceLastFetch = now - lastFetchTime.current;
      if (timeSinceLastFetch < 2000 && retryCount === 0) {
        console.log("⏳ Đợi một chút trước khi gửi request tiếp theo...");
        return;
      }
      lastFetchTime.current = now;

      setLoading(true);
      setError("");

      // Debug: Kiểm tra token trước khi gọi API
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Không tìm thấy token. Vui lòng đăng nhập lại.");
        setLoading(false);
        return;
      }

      const response = await getAllExams();

      // Debug: Log response để kiểm tra
      if (process.env.NODE_ENV === "development") {
        console.log("📦 Response từ fetchExams:", response);
        console.log("📦 Response type:", typeof response);
        console.log("📦 Response.data:", response.data);
        console.log("📦 Response.data?.exams:", response.data?.exams);
      }

      // Xử lý response - có thể là object có cấu trúc với data.exams hoặc data là mảng
      if (
        (response.success || response.status === "success") &&
        response.data?.exams &&
        Array.isArray(response.data.exams)
      ) {
        // API trả về object có cấu trúc với data.exams là mảng
        setExams(response.data.exams);
      } else if (response.data && Array.isArray(response.data)) {
        // API trả về object với data là mảng trực tiếp
        setExams(response.data);
      } else if (response.data && typeof response.data === "object" && !Array.isArray(response.data)) {
        // API có thể trả về data là object, kiểm tra các trường hợp khác
        if (response.data.exams && Array.isArray(response.data.exams)) {
          setExams(response.data.exams);
        } else {
          setError(response.message || "Không tìm thấy danh sách đề thi trong response");
        }
      } else {
        setError(response.message || "Không thể lấy danh sách đề thi. Format response không đúng.");
      }
    } catch (err: any) {
      console.error("❌ Lỗi khi lấy danh sách đề thi:", err);
      
      // Xử lý lỗi 429: Too Many Requests
      if (err.response?.status === 429) {
        const retryAfter = err.response.headers?.["retry-after"] || 5;
        const message = `Quá nhiều yêu cầu. Vui lòng đợi ${retryAfter} giây trước khi thử lại.`;
        setError(message);
        
        // Tự động retry sau một khoảng thời gian (tối đa 3 lần)
        if (retryCount < 3) {
          setTimeout(() => {
            fetchExams(retryCount + 1);
          }, retryAfter * 1000);
          return;
        }
      } else if (err.response?.status === 401) {
        setError("Token không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại.");
      } else if (err.response?.status === 403) {
        setError(
          "Bạn không có quyền truy cập. Chỉ admin mới có thể xem danh sách đề thi."
        );
      } else {
        setError(err.message || "Có lỗi xảy ra khi lấy danh sách đề thi");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateExam = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setCreateError("");
    setCreateSuccess("");

    // Validation
    if (formData.duration <= 0) {
      setCreateError("Thời gian làm bài phải lớn hơn 0.");
      setCreating(false);
      return;
    }

    if (formData.totalMarks <= 0) {
      setCreateError("Tổng điểm phải lớn hơn 0.");
      setCreating(false);
      return;
    }

    try {
      const response = await createExam(formData);
      
      if (response.success && response.data) {
        setCreateSuccess("Tạo đề thi thành công!");
        // Reset form
        setFormData({
          title: "",
          description: "",
          duration: 120,
          totalMarks: 100,
        });
        // Refresh danh sách đề thi
        fetchExams(0);
        // Đóng modal sau 2 giây
        setTimeout(() => {
          setShowCreateModal(false);
          setCreateSuccess("");
        }, 2000);
      } else {
        setCreateError(response.message || "Không thể tạo đề thi");
      }
    } catch (err: any) {
      console.error("❌ Lỗi khi tạo đề thi:", err);
      setCreateError(err.message || "Có lỗi xảy ra khi tạo đề thi");
    } finally {
      setCreating(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev: CreateExamData) => ({
      ...prev,
      [name]: name === "duration" || name === "totalMarks" ? Number(value) : value,
    }));
    if (createError) setCreateError("");
    if (createSuccess) setCreateSuccess("");
  };

  if (!currentUser || currentUser.role !== "admin") {
    return null;
  }

  return (
    <AdminLayout>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Quản lý đề thi</h1>
          <div className={styles.headerButtons}>
            <button
              onClick={() => setShowCreateModal(true)}
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
              Tạo đề thi mới
            </button>
            <button
              onClick={() => fetchExams(0)}
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
          <div className={styles.tableWrapper}>
            {exams.length === 0 ? (
              <div className={styles.empty}>
                <p>Chưa có đề thi nào. Hãy tạo đề thi mới bằng nút "Tạo đề thi mới" ở trên.</p>
              </div>
            ) : (
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Tiêu đề</th>
                    <th>Mô tả</th>
                    <th>Thời gian (phút)</th>
                    <th>Tổng điểm</th>
                    <th>Số câu hỏi</th>
                    <th>Trạng thái</th>
                    <th>Ngày tạo</th>
                    <th>ID</th>
                  </tr>
                </thead>
                <tbody>
                  {exams.map((exam, index) => (
                    <tr key={exam.id}>
                      <td>{index + 1}</td>
                      <td className={styles.titleCell}>{exam.title}</td>
                      <td className={styles.descriptionCell}>
                        {exam.description || "-"}
                      </td>
                      <td>{exam.duration}</td>
                      <td>{exam.totalMarks}</td>
                      <td>{exam.totalQuestions || 0}</td>
                      <td>
                        <span
                          className={`${styles.status} ${
                            exam.isActive
                              ? styles.statusActive
                              : styles.statusInactive
                          }`}
                        >
                          {exam.isActive ? "Hoạt động" : "Không hoạt động"}
                        </span>
                      </td>
                      <td className={styles.dateCell}>
                        {exam.createdAt
                          ? new Date(exam.createdAt).toLocaleDateString("vi-VN")
                          : "-"}
                      </td>
                      <td className={styles.idCell}>
                        <Link
                          to={`/admin/exams/${exam.id}`}
                          className={styles.viewLink}
                        >
                          Xem chi tiết
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {!loading && exams.length > 0 && (
          <div className={styles.footer}>
            <p>Tổng số đề thi: {exams.length}</p>
          </div>
        )}

        {/* Modal tạo đề thi mới */}
        {showCreateModal && (
          <div
            className={styles.modalOverlay}
            onClick={() => {
              setShowCreateModal(false);
              setCreateError("");
              setCreateSuccess("");
              setFormData({
                title: "",
                description: "",
                duration: 120,
                totalMarks: 100,
              });
            }}
          >
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h2>Tạo đề thi mới</h2>
                <button
                  className={styles.modalClose}
                  onClick={() => {
                    setShowCreateModal(false);
                    setCreateError("");
                    setCreateSuccess("");
                    setFormData({
                      title: "",
                      description: "",
                      duration: 120,
                      totalMarks: 100,
                    });
                  }}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>

              {createError && (
                <div className={styles.modalError}>{createError}</div>
              )}
              {createSuccess && (
                <div className={styles.modalSuccess}>{createSuccess}</div>
              )}

              <form onSubmit={handleCreateExam} className={styles.modalForm}>
                <div className={styles.formGroup}>
                  <label htmlFor="title">Tiêu đề *</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    placeholder="Nhập tiêu đề đề thi"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="description">Mô tả *</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    placeholder="Nhập mô tả đề thi"
                    rows={4}
                  />
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="duration">Thời gian (phút) *</label>
                    <input
                      type="number"
                      id="duration"
                      name="duration"
                      value={formData.duration}
                      onChange={handleInputChange}
                      required
                      min="1"
                      placeholder="120"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="totalMarks">Tổng điểm *</label>
                    <input
                      type="number"
                      id="totalMarks"
                      name="totalMarks"
                      value={formData.totalMarks}
                      onChange={handleInputChange}
                      required
                      min="1"
                      placeholder="100"
                    />
                  </div>
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
                        title: "",
                        description: "",
                        duration: 120,
                        totalMarks: 100,
                      });
                    }}
                    disabled={creating}
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className={styles.submitButton}
                    disabled={creating}
                  >
                    {creating ? "Đang tạo..." : "Tạo đề thi"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminExams;

