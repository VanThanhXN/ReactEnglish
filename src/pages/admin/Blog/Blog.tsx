import React, { useState } from "react";
import AdminLayout from "../../../components/admin/Layout/Layout";
import Pagination from "../../../components/common/Pagination/Pagination";
import styles from "./Blog.module.css";

export interface BlogPost {
  id: number | string;
  title: string;
  excerpt?: string;
  content?: string;
  image?: string;
  category?: string;
  author?: string;
  date?: string;
  createdAt?: string;
  updatedAt?: string;
  isPublished?: boolean;
}

const AdminBlog: React.FC = () => {

  // Mock data
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([
    {
      id: 1,
      title: "10 Mẹo Học Tiếng Anh Hiệu Quả",
      excerpt: "Khám phá những phương pháp học tiếng Anh hiệu quả nhất để nâng cao trình độ của bạn",
      content: "Nội dung đầy đủ của bài viết về 10 mẹo học tiếng Anh hiệu quả...",
      category: "Học tập",
      author: "Nguyễn Văn A",
      date: "15/12/2024",
      createdAt: "2024-12-15T10:00:00Z",
      updatedAt: "2024-12-15T10:00:00Z",
      image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&q=80",
      isPublished: true,
    },
    {
      id: 2,
      title: "Làm Thế Nào Để Cải Thiện Phát Âm Tiếng Anh",
      excerpt: "Hướng dẫn chi tiết về cách phát âm chuẩn và tự nhiên như người bản xứ",
      content: "Nội dung đầy đủ của bài viết về cách cải thiện phát âm...",
      category: "Phát âm",
      author: "Trần Thị B",
      date: "12/12/2024",
      createdAt: "2024-12-12T14:30:00Z",
      updatedAt: "2024-12-12T14:30:00Z",
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80",
      isPublished: true,
    },
    {
      id: 3,
      title: "Từ Vựng IELTS: 100 Từ Thường Gặp Nhất",
      excerpt: "Danh sách 100 từ vựng IELTS quan trọng nhất mà bạn cần biết để đạt điểm cao",
      content: "Nội dung đầy đủ về 100 từ vựng IELTS...",
      category: "IELTS",
      author: "Lê Văn C",
      date: "10/12/2024",
      createdAt: "2024-12-10T09:15:00Z",
      updatedAt: "2024-12-10T09:15:00Z",
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80",
      isPublished: true,
    },
    {
      id: 4,
      title: "Grammar Basics: Present Simple vs Present Continuous",
      excerpt: "Phân biệt và sử dụng đúng thì hiện tại đơn và hiện tại tiếp diễn trong tiếng Anh",
      content: "Nội dung về ngữ pháp cơ bản...",
      category: "Ngữ pháp",
      author: "Phạm Thị D",
      date: "08/12/2024",
      createdAt: "2024-12-08T16:45:00Z",
      updatedAt: "2024-12-08T16:45:00Z",
      image: "https://images.unsplash.com/photo-1454177697940-c43d9f9a7307?w=800&q=80",
      isPublished: true,
    },
    {
      id: 5,
      title: "Cách Viết Essay IELTS Task 2 Đạt Điểm Cao",
      excerpt: "Hướng dẫn từng bước để viết bài essay IELTS Task 2 một cách hiệu quả",
      content: "Nội dung hướng dẫn viết essay...",
      category: "IELTS",
      author: "Hoàng Văn E",
      date: "05/12/2024",
      createdAt: "2024-12-05T11:20:00Z",
      updatedAt: "2024-12-05T11:20:00Z",
      image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80",
      isPublished: false,
    },
    {
      id: 6,
      title: "Listening Skills: Tips and Tricks",
      excerpt: "Cải thiện kỹ năng nghe tiếng Anh với những mẹo và thủ thuật hữu ích",
      content: "Nội dung về kỹ năng nghe...",
      category: "Kỹ năng",
      author: "Nguyễn Thị F",
      date: "03/12/2024",
      createdAt: "2024-12-03T13:10:00Z",
      updatedAt: "2024-12-03T13:10:00Z",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80",
      isPublished: true,
    },
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [deletingPostId, setDeletingPostId] = useState<number | string | null>(null);
  const [formData, setFormData] = useState<Omit<BlogPost, "id" | "createdAt" | "updatedAt">>({
    title: "",
    excerpt: "",
    content: "",
    category: "",
    author: "",
    date: "",
    image: "",
    isPublished: false,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingPost, setViewingPost] = useState<BlogPost | null>(null);

  const itemsPerPage = 8;

  const handleViewClick = (post: BlogPost) => {
    setViewingPost(post);
    setShowViewModal(true);
  };

  // Pagination
  const totalPages = Math.ceil(blogPosts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPosts = blogPosts.slice(startIndex, endIndex);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setFormData({ ...formData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    const newPost: BlogPost = {
      id: Date.now(),
      ...formData,
      image: imagePreview || formData.image || "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      date: formData.date || new Date().toLocaleDateString("vi-VN"),
    };
    setBlogPosts([newPost, ...blogPosts]);
    setShowCreateModal(false);
    setFormData({
      title: "",
      excerpt: "",
      content: "",
      category: "",
      author: "",
      date: "",
      image: "",
      isPublished: false,
    });
    setImagePreview(null);
    setImageFile(null);
  };

  const handleEditClick = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      excerpt: post.excerpt || "",
      content: post.content || "",
      category: post.category || "",
      author: post.author || "",
      date: post.date || "",
      image: post.image || "",
      isPublished: post.isPublished || false,
    });
    setImagePreview(post.image || null);
    setImageFile(null);
    setShowEditModal(true);
  };

  const handleUpdatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost) return;

    const updatedPosts = blogPosts.map((post) =>
      post.id === editingPost.id
        ? {
            ...post,
            ...formData,
            image: imagePreview || formData.image || post.image,
            updatedAt: new Date().toISOString(),
          }
        : post
    );
    setBlogPosts(updatedPosts);
    setShowEditModal(false);
    setEditingPost(null);
    setImagePreview(null);
    setImageFile(null);
  };

  const handleDeleteClick = (postId: number | string) => {
    setDeletingPostId(postId);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (!deletingPostId) return;
    setBlogPosts(blogPosts.filter((post) => post.id !== deletingPostId));
    setShowDeleteModal(false);
    setDeletingPostId(null);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    try {
      return new Date(dateString).toLocaleDateString("vi-VN");
    } catch {
      return dateString;
    }
  };

  return (
    <AdminLayout>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Quản lý bài viết</h1>
          <div className={styles.headerButtons}>
            <button
              onClick={() => {
                setShowCreateModal(true);
                setFormData({
                  title: "",
                  excerpt: "",
                  content: "",
                  category: "",
                  author: "",
                  date: "",
                  image: "",
                  isPublished: false,
                });
                setImagePreview(null);
                setImageFile(null);
              }}
              className={styles.createButton}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Tạo bài viết mới
            </button>
          </div>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Tiêu đề</th>
                <th>Danh mục</th>
                <th>Tác giả</th>
                <th>Ngày đăng</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {currentPosts.length === 0 ? (
                <tr>
                  <td colSpan={7} className={styles.empty}>
                    Chưa có bài viết nào. Hãy tạo bài viết mới.
                  </td>
                </tr>
              ) : (
                currentPosts.map((post) => (
                  <tr key={post.id}>
                    <td>{post.id}</td>
                    <td>
                      <div className={styles.titleCell}>
                        {post.image && (
                          <img src={post.image} alt={post.title} className={styles.thumbnail} />
                        )}
                        <span>{post.title}</span>
                      </div>
                    </td>
                    <td>{post.category || "-"}</td>
                    <td>{post.author || "-"}</td>
                    <td>{formatDate(post.date || post.createdAt)}</td>
                    <td>
                      <span
                        className={`${styles.status} ${
                          post.isPublished ? styles.statusPublished : styles.statusDraft
                        }`}
                      >
                        {post.isPublished ? "Đã xuất bản" : "Bản nháp"}
                      </span>
                    </td>
                    <td className={styles.actionsCell}>
                      <div className={styles.actionButtons}>
                        <button
                          onClick={() => handleViewClick(post)}
                          className={styles.viewLink}
                        >
                          Xem
                        </button>
                        <button
                          onClick={() => handleEditClick(post)}
                          className={styles.editButton}
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => handleDeleteClick(post.id)}
                          className={styles.deleteButton}
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {blogPosts.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => {
              setCurrentPage(page);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            showInfo={true}
            totalItems={blogPosts.length}
            itemsPerPage={itemsPerPage}
            startIndex={startIndex}
            endIndex={endIndex}
          />
        )}

        {/* Modal tạo bài viết */}
        {showCreateModal && (
          <div
            className={styles.modalOverlay}
            onClick={() => {
              setShowCreateModal(false);
              setFormData({
                title: "",
                excerpt: "",
                content: "",
                category: "",
                author: "",
                date: "",
                image: "",
                isPublished: false,
              });
            }}
          >
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h2>Tạo bài viết mới</h2>
                <button
                  className={styles.modalClose}
                  onClick={() => {
                    setShowCreateModal(false);
                    setFormData({
                      title: "",
                      excerpt: "",
                      content: "",
                      category: "",
                      author: "",
                      date: "",
                      image: "",
                      isPublished: false,
                    });
                    setImagePreview(null);
                    setImageFile(null);
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>

              <form onSubmit={handleCreatePost} className={styles.modalForm}>
                <div className={styles.formGroup}>
                  <label htmlFor="title">Tiêu đề *</label>
                  <input
                    type="text"
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    placeholder="Nhập tiêu đề bài viết"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="excerpt">Mô tả ngắn</label>
                  <textarea
                    id="excerpt"
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    placeholder="Nhập mô tả ngắn"
                    rows={3}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="content">Nội dung</label>
                  <textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Nhập nội dung bài viết"
                    rows={6}
                  />
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="category">Danh mục</label>
                    <input
                      type="text"
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      placeholder="VD: Học tập, IELTS..."
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="author">Tác giả</label>
                    <input
                      type="text"
                      id="author"
                      value={formData.author}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                      placeholder="Tên tác giả"
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="date">Ngày đăng</label>
                    <input
                      type="date"
                      id="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="isPublished">Trạng thái</label>
                    <select
                      id="isPublished"
                      value={formData.isPublished ? "true" : "false"}
                      onChange={(e) =>
                        setFormData({ ...formData, isPublished: e.target.value === "true" })
                      }
                    >
                      <option value="false">Bản nháp</option>
                      <option value="true">Đã xuất bản</option>
                    </select>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="image">Ảnh đại diện</label>
                  <input
                    type="file"
                    id="image"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  {imagePreview && (
                    <div className={styles.imagePreview}>
                      <img src={imagePreview} alt="Preview" />
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview(null);
                          setImageFile(null);
                          setFormData({ ...formData, image: "" });
                        }}
                        className={styles.removeImageButton}
                      >
                        Xóa ảnh
                      </button>
                    </div>
                  )}
                </div>

                <div className={styles.modalActions}>
                  <button
                    type="button"
                    className={styles.cancelButton}
                    onClick={() => {
                      setShowCreateModal(false);
                      setFormData({
                        title: "",
                        excerpt: "",
                        content: "",
                        category: "",
                        author: "",
                        date: "",
                        image: "",
                        isPublished: false,
                      });
                      setImagePreview(null);
                      setImageFile(null);
                    }}
                  >
                    Hủy
                  </button>
                  <button type="submit" className={styles.submitButton}>
                    Tạo bài viết
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal sửa bài viết */}
        {showEditModal && editingPost && (
          <div
            className={styles.modalOverlay}
            onClick={() => {
              setShowEditModal(false);
              setEditingPost(null);
            }}
          >
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h2>Sửa bài viết</h2>
                <button
                  className={styles.modalClose}
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingPost(null);
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>

              <form onSubmit={handleUpdatePost} className={styles.modalForm}>
                <div className={styles.formGroup}>
                  <label htmlFor="editTitle">Tiêu đề *</label>
                  <input
                    type="text"
                    id="editTitle"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    placeholder="Nhập tiêu đề bài viết"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="editExcerpt">Mô tả ngắn</label>
                  <textarea
                    id="editExcerpt"
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    placeholder="Nhập mô tả ngắn"
                    rows={3}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="editContent">Nội dung</label>
                  <textarea
                    id="editContent"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Nhập nội dung bài viết"
                    rows={6}
                  />
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="editCategory">Danh mục</label>
                    <input
                      type="text"
                      id="editCategory"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      placeholder="VD: Học tập, IELTS..."
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="editAuthor">Tác giả</label>
                    <input
                      type="text"
                      id="editAuthor"
                      value={formData.author}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                      placeholder="Tên tác giả"
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="editDate">Ngày đăng</label>
                    <input
                      type="date"
                      id="editDate"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="editIsPublished">Trạng thái</label>
                    <select
                      id="editIsPublished"
                      value={formData.isPublished ? "true" : "false"}
                      onChange={(e) =>
                        setFormData({ ...formData, isPublished: e.target.value === "true" })
                      }
                    >
                      <option value="false">Bản nháp</option>
                      <option value="true">Đã xuất bản</option>
                    </select>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="editImage">Ảnh đại diện</label>
                  <input
                    type="file"
                    id="editImage"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  {imagePreview && (
                    <div className={styles.imagePreview}>
                      <img src={imagePreview} alt="Preview" />
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview(null);
                          setImageFile(null);
                          setFormData({ ...formData, image: "" });
                        }}
                        className={styles.removeImageButton}
                      >
                        Xóa ảnh
                      </button>
                    </div>
                  )}
                </div>

                <div className={styles.modalActions}>
                  <button
                    type="button"
                    className={styles.cancelButton}
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingPost(null);
                    }}
                  >
                    Hủy
                  </button>
                  <button type="submit" className={styles.submitButton}>
                    Cập nhật
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal xác nhận xóa */}
        {showDeleteModal && deletingPostId && (
          <div
            className={styles.modalOverlay}
            onClick={() => {
              setShowDeleteModal(false);
              setDeletingPostId(null);
            }}
          >
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h2>Xác nhận xóa bài viết</h2>
                <button
                  className={styles.modalClose}
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeletingPostId(null);
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
              <div className={styles.modalContent}>
                <p>
                  Bạn có chắc chắn muốn xóa bài viết{" "}
                  <strong>
                    {blogPosts.find((p) => p.id === deletingPostId)?.title || "này"}
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
                    setDeletingPostId(null);
                  }}
                >
                  Hủy
                </button>
                <button
                  type="button"
                  className={styles.deleteButton}
                  onClick={handleDeleteConfirm}
                >
                  Xóa
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal xem bài viết */}
        {showViewModal && viewingPost && (
          <div
            className={styles.modalOverlay}
            onClick={() => {
              setShowViewModal(false);
              setViewingPost(null);
            }}
          >
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h2>{viewingPost.title}</h2>
                <button
                  className={styles.modalClose}
                  onClick={() => {
                    setShowViewModal(false);
                    setViewingPost(null);
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
              <div className={styles.modalContent}>
                {viewingPost.image && (
                  <img src={viewingPost.image} alt={viewingPost.title} className={styles.viewImage} />
                )}
                <div className={styles.viewMeta}>
                  {viewingPost.category && (
                    <span className={styles.viewCategory}>{viewingPost.category}</span>
                  )}
                  {viewingPost.author && (
                    <span className={styles.viewAuthor}>Tác giả: {viewingPost.author}</span>
                  )}
                  {viewingPost.date && (
                    <span className={styles.viewDate}>{viewingPost.date}</span>
                  )}
                </div>
                {viewingPost.excerpt && (
                  <p className={styles.viewExcerpt}>{viewingPost.excerpt}</p>
                )}
                {viewingPost.content && (
                  <div className={styles.viewContent}>{viewingPost.content}</div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminBlog;
