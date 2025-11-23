import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getUser, isAuthenticated } from "../../../utils/storage";
import { getCourses, type Course } from "../../../services/courseService";
import AdminLayout from "../../../components/admin/Layout/Layout";
import Pagination from "../../../components/common/Pagination/Pagination";
import type { User } from "../../../types/api";
import styles from "./Courses.module.css";

const AdminCourses: React.FC = () => {
  const navigate = useNavigate();
  const currentUser: User | null = getUser();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [formError, setFormError] = useState("");
  const [formData, setFormData] = useState<Partial<Course>>({
    title: "",
    description: "",
    instructor: "",
    image: "",
    price: 0,
    originalPrice: undefined,
    level: "beginner",
    category: "",
    duration: 0,
    lessons: 0,
    isFree: false,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {

    fetchCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getCourses();
      
      if (response.success) {
        setCourses(response.data);
      } else {
        setError("Không thể lấy danh sách khóa học");
      }
    } catch (err: any) {
      console.error("Lỗi khi lấy danh sách courses:", err);
      setError(err.message || "Có lỗi xảy ra khi lấy danh sách khóa học");
    } finally {
      setLoading(false);
    }
  };

  // Tính toán phân trang
  const totalPages = Math.ceil(courses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCourses = courses.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  const formatPrice = (price: number) => {
    if (price === 0) return "Miễn phí";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const getLevelBadge = (level: string) => {
    const levelMap: Record<string, { label: string; class: string }> = {
      beginner: { label: "Cơ bản", class: styles.levelBeginner },
      intermediate: { label: "Trung bình", class: styles.levelIntermediate },
      advanced: { label: "Nâng cao", class: styles.levelAdvanced },
    };
    return levelMap[level] || { label: level, class: "" };
  };

  const handleCreateClick = () => {
      setFormData({
        title: "",
        description: "",
        instructor: "",
        image: "",
        price: 0,
        originalPrice: undefined,
        level: "beginner",
        category: "",
        duration: 0,
        lessons: 0,
        isFree: false,
      });
      setImagePreview(null);
      setImageFile(null);
      setFormError("");
      setShowCreateModal(true);
  };

  const handleEditClick = (course: Course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      description: course.description,
      instructor: course.instructor,
      image: course.image,
      price: course.price,
      originalPrice: course.originalPrice,
      level: course.level,
      category: course.category,
      duration: course.duration,
      lessons: course.lessons,
      isFree: course.isFree,
    });
    setImagePreview(course.image);
    setImageFile(null);
    setFormError("");
    setShowEditModal(true);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    if (type === "file" && name === "image") {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        setImageFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result as string);
          setFormData((prev) => ({
            ...prev,
            image: reader.result as string,
          }));
        };
        reader.readAsDataURL(file);
      }
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
          ? parseFloat(value) || 0
          : value,
    }));
    if (formError) setFormError("");
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setFormError("");

    if (!formData.title || !formData.description || !formData.instructor) {
      setFormError("Vui lòng điền đầy đủ thông tin bắt buộc");
      setCreating(false);
      return;
    }

    try {
      // Mock tạo course - trong thực tế sẽ gọi API
      const newCourse: Course = {
        id: Date.now().toString(),
        title: formData.title!,
        description: formData.description!,
        instructor: formData.instructor!,
        image: imagePreview || formData.image || "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&h=600&fit=crop&q=80",
        price: formData.price || 0,
        originalPrice: formData.originalPrice,
        level: formData.level || "beginner",
        category: formData.category || "",
        duration: formData.duration || 0,
        lessons: formData.lessons || 0,
        rating: 0,
        reviews: 0,
        isFree: formData.isFree || false,
      };

      setCourses([...courses, newCourse]);
      setShowCreateModal(false);
      setFormData({
        title: "",
        description: "",
        instructor: "",
        image: "",
        price: 0,
        originalPrice: undefined,
        level: "beginner",
        category: "",
        duration: 0,
        lessons: 0,
        isFree: false,
      });
    } catch (err: any) {
      setFormError(err.message || "Có lỗi xảy ra khi tạo khóa học");
    } finally {
      setCreating(false);
    }
  };

  const handleUpdateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse) return;

    setUpdating(true);
    setFormError("");

    try {
      // Mock cập nhật course - trong thực tế sẽ gọi API
      const updatedCourses = courses.map((course) =>
        course.id === editingCourse.id
          ? {
              ...course,
              ...formData,
            }
          : course
      );
            setCourses(updatedCourses);
      setShowEditModal(false);
      setEditingCourse(null);
      setImagePreview(null);
      setImageFile(null);
    } catch (err: any) {
      setFormError(err.message || "Có lỗi xảy ra khi cập nhật khóa học");
    } finally {
      setUpdating(false);
    }
  };

  if (!currentUser || currentUser.role !== "admin") {
    return null;
  }

  return (
    <AdminLayout>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Quản lý khóa học</h1>
          <div className={styles.headerButtons}>
            <button
              onClick={handleCreateClick}
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
              Tạo mới
            </button>
            <button
              onClick={fetchCourses}
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
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Hình ảnh</th>
                  <th>Tên khóa học</th>
                  <th>Giảng viên</th>
                  <th>Danh mục</th>
                  <th>Cấp độ</th>
                  <th>Giá</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {courses.length === 0 ? (
                  <tr>
                    <td colSpan={8} className={styles.empty}>
                      Không có khóa học nào
                    </td>
                  </tr>
                ) : (
                  currentCourses.map((course, index) => {
                    const levelInfo = getLevelBadge(course.level);
                    return (
                      <tr key={course.id}>
                        <td>{startIndex + index + 1}</td>
                        <td>
                          <img
                            src={course.image}
                            alt={course.title}
                            className={styles.courseImage}
                          />
                        </td>
                        <td>
                          <div className={styles.courseTitleCell}>
                            <strong>{course.title}</strong>
                            <span className={styles.courseMeta}>
                              {course.lessons} bài học • {course.duration}h
                            </span>
                          </div>
                        </td>
                        <td>{course.instructor}</td>
                        <td>
                          <span className={styles.category}>{course.category}</span>
                        </td>
                        <td>
                          <span className={`${styles.level} ${levelInfo.class}`}>
                            {levelInfo.label}
                          </span>
                        </td>
                        <td>
                          <div className={styles.priceCell}>
                            <span className={styles.price}>{formatPrice(course.price)}</span>
                            {course.originalPrice && course.originalPrice > course.price && (
                              <span className={styles.originalPrice}>
                                {formatPrice(course.originalPrice)}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className={styles.actionsCell}>
                          <div className={styles.actionButtons}>
                            <Link
                              to={`/admin/courses/${course.id}`}
                              className={styles.viewButton}
                            >
                              Xem
                            </Link>
                            <button
                              onClick={() => handleEditClick(course)}
                              className={styles.editButton}
                            >
                              Sửa
                            </button>
                            <button
                              onClick={() => {
                                if (
                                  window.confirm(
                                    `Bạn có chắc muốn xóa khóa học "${course.title}"?`
                                  )
                                ) {
                                  setCourses(courses.filter((c) => c.id !== course.id));
                                }
                              }}
                              className={styles.deleteButton}
                            >
                              Xóa
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {!loading && courses.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            disabled={loading}
            showInfo={true}
            totalItems={courses.length}
            itemsPerPage={itemsPerPage}
            startIndex={startIndex}
            endIndex={endIndex}
          />
        )}

        {/* Modal tạo khóa học */}
        {showCreateModal && (
          <div
            className={styles.modalOverlay}
            onClick={() => setShowCreateModal(false)}
          >
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h2>Tạo khóa học mới</h2>
                <button
                  className={styles.modalClose}
                  onClick={() => {
                    setShowCreateModal(false);
                    setFormError("");
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

              {formError && (
                <div className={styles.modalError}>{formError}</div>
              )}

              <form onSubmit={handleCreateCourse} className={styles.modalForm}>
                <div className={styles.formGroup}>
                  <label htmlFor="title">Tên khóa học *</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    placeholder="Nhập tên khóa học"
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
                    rows={3}
                    placeholder="Nhập mô tả khóa học"
                  />
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="instructor">Giảng viên *</label>
                    <input
                      type="text"
                      id="instructor"
                      name="instructor"
                      value={formData.instructor}
                      onChange={handleInputChange}
                      required
                      placeholder="Tên giảng viên"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="category">Danh mục *</label>
                    <input
                      type="text"
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                      placeholder="Danh mục"
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="level">Cấp độ *</label>
                    <select
                      id="level"
                      name="level"
                      value={formData.level}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="beginner">Cơ bản</option>
                      <option value="intermediate">Trung bình</option>
                      <option value="advanced">Nâng cao</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="image">Hình ảnh</label>
                    <input
                      type="file"
                      id="image"
                      name="image"
                      accept="image/*"
                      onChange={handleInputChange}
                    />
                    {imagePreview && (
                      <div className={styles.imagePreview}>
                        <img src={imagePreview} alt="Preview" />
                      </div>
                    )}
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="duration">Thời lượng (giờ) *</label>
                    <input
                      type="number"
                      id="duration"
                      name="duration"
                      value={formData.duration}
                      onChange={handleInputChange}
                      required
                      min="0"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="lessons">Số bài học *</label>
                    <input
                      type="number"
                      id="lessons"
                      name="lessons"
                      value={formData.lessons}
                      onChange={handleInputChange}
                      required
                      min="0"
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="price">Giá (VND) *</label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      min="0"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="originalPrice">Giá gốc (VND)</label>
                    <input
                      type="number"
                      id="originalPrice"
                      name="originalPrice"
                      value={formData.originalPrice || ""}
                      onChange={handleInputChange}
                      min="0"
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      name="isFree"
                      checked={formData.isFree}
                      onChange={handleInputChange}
                    />
                    <span>Khóa học miễn phí</span>
                  </label>
                </div>

                <div className={styles.modalActions}>
                  <button
                    type="button"
                    className={styles.cancelButton}
                    onClick={() => {
                      setShowCreateModal(false);
                      setFormError("");
                      setImagePreview(null);
                      setImageFile(null);
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
                    {creating ? "Đang tạo..." : "Tạo mới"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal sửa khóa học */}
        {showEditModal && editingCourse && (
          <div
            className={styles.modalOverlay}
            onClick={() => setShowEditModal(false)}
          >
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h2>Chỉnh sửa khóa học</h2>
                <button
                  className={styles.modalClose}
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingCourse(null);
                    setFormError("");
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

              {formError && (
                <div className={styles.modalError}>{formError}</div>
              )}

              <form onSubmit={handleUpdateCourse} className={styles.modalForm}>
                <div className={styles.formGroup}>
                  <label htmlFor="editTitle">Tên khóa học *</label>
                  <input
                    type="text"
                    id="editTitle"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    placeholder="Nhập tên khóa học"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="editDescription">Mô tả *</label>
                  <textarea
                    id="editDescription"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    placeholder="Nhập mô tả khóa học"
                  />
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="editInstructor">Giảng viên *</label>
                    <input
                      type="text"
                      id="editInstructor"
                      name="instructor"
                      value={formData.instructor}
                      onChange={handleInputChange}
                      required
                      placeholder="Tên giảng viên"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="editCategory">Danh mục *</label>
                    <input
                      type="text"
                      id="editCategory"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                      placeholder="Danh mục"
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="editLevel">Cấp độ *</label>
                    <select
                      id="editLevel"
                      name="level"
                      value={formData.level}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="beginner">Cơ bản</option>
                      <option value="intermediate">Trung bình</option>
                      <option value="advanced">Nâng cao</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="editImage">Hình ảnh</label>
                    <input
                      type="file"
                      id="editImage"
                      name="image"
                      accept="image/*"
                      onChange={handleInputChange}
                    />
                    {imagePreview && (
                      <div className={styles.imagePreview}>
                        <img src={imagePreview} alt="Preview" />
                      </div>
                    )}
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="editDuration">Thời lượng (giờ) *</label>
                    <input
                      type="number"
                      id="editDuration"
                      name="duration"
                      value={formData.duration}
                      onChange={handleInputChange}
                      required
                      min="0"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="editLessons">Số bài học *</label>
                    <input
                      type="number"
                      id="editLessons"
                      name="lessons"
                      value={formData.lessons}
                      onChange={handleInputChange}
                      required
                      min="0"
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="editPrice">Giá (VND) *</label>
                    <input
                      type="number"
                      id="editPrice"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      min="0"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="editOriginalPrice">Giá gốc (VND)</label>
                    <input
                      type="number"
                      id="editOriginalPrice"
                      name="originalPrice"
                      value={formData.originalPrice || ""}
                      onChange={handleInputChange}
                      min="0"
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      name="isFree"
                      checked={formData.isFree}
                      onChange={handleInputChange}
                    />
                    <span>Khóa học miễn phí</span>
                  </label>
                </div>

                <div className={styles.modalActions}>
                  <button
                    type="button"
                    className={styles.cancelButton}
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingCourse(null);
                      setFormError("");
                      setImagePreview(null);
                      setImageFile(null);
                    }}
                    disabled={updating}
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className={styles.submitButton}
                    disabled={updating}
                  >
                    {updating ? "Đang lưu..." : "Lưu thay đổi"}
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

export default AdminCourses;
