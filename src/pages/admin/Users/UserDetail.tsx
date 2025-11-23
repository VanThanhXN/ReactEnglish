import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { getUser, isAuthenticated } from "../../../utils/storage";
import { getUserById, updateUser, type UpdateUserData } from "../../../services/adminService";
import AdminLayout from "../../../components/admin/Layout/Layout";
import type { User } from "../../../types/api";
import styles from "./UserDetail.module.css";

const AdminUserDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const currentUser: User | null = getUser();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState("");
  const [editData, setEditData] = useState<UpdateUserData>({
    name: "",
    email: "",
    role: "user",
  });
  const loadedIdRef = useRef<string | null>(null);

  useEffect(() => {
    // Lấy thông tin user - chỉ load khi id thay đổi hoặc chưa load id này
    if (id && id !== loadedIdRef.current) {
      loadedIdRef.current = id;
      fetchUser(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]); // Chỉ chạy khi id thay đổi

  const fetchUser = async (userId: string) => {
    try {
      setLoading(true);
      setError("");
      const response = await getUserById(userId);

      if (response.status === "success" && response.data?.user) {
        setUser(response.data.user);
      } else {
        setError(response.message || "Không thể lấy thông tin user");
      }
    } catch (err: any) {
      console.error("❌ Lỗi khi lấy thông tin user:", err);
      
      if (err.response?.status === 404) {
        setError("Không tìm thấy user với ID này.");
      } else if (err.response?.status === 401) {
        setError("Token không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại.");
      } else if (err.response?.status === 403) {
        setError("Bạn không có quyền truy cập. Chỉ admin mới có thể xem thông tin user.");
      } else if (err.response?.status === 429) {
        setError(err.message || "Quá nhiều yêu cầu. Vui lòng thử lại sau.");
      } else {
        setError(err.message || "Có lỗi xảy ra khi lấy thông tin user");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    if (user) {
      setEditData({
        name: user.name || "",
        email: user.email || "",
        role: (user.role === "admin" || user.role === "user" ? user.role : "user") as "user" | "admin",
      });
      setIsEditing(true);
      setUpdateError("");
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setUpdateError("");
    setEditData({
      name: "",
      email: "",
      role: "user",
    });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setUpdating(true);
    setUpdateError("");

    try {
      const response = await updateUser(id, editData);

      if (response.status === "success" && response.data?.user) {
        setUser(response.data.user);
        setIsEditing(false);
        setUpdateError("");
      } else {
        setUpdateError(response.message || "Không thể cập nhật user");
      }
    } catch (err: any) {
      console.error("❌ Lỗi khi cập nhật user:", err);
      
      if (err.response?.status === 404) {
        setUpdateError("Không tìm thấy user với ID này.");
      } else if (err.response?.status === 401) {
        setUpdateError("Token không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại.");
      } else if (err.response?.status === 403) {
        setUpdateError("Bạn không có quyền cập nhật user này.");
      } else if (err.response?.status === 429) {
        setUpdateError(err.message || "Quá nhiều yêu cầu. Vui lòng thử lại sau.");
      } else {
        setUpdateError(err.message || "Có lỗi xảy ra khi cập nhật user");
      }
    } finally {
      setUpdating(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditData((prev: UpdateUserData) => ({
      ...prev,
      [name]: value,
    }));
    if (updateError) setUpdateError("");
  };

  if (!currentUser || currentUser.role !== "admin") {
    return null;
  }

  return (
    <AdminLayout>
      <div className={styles.container}>
        <div className={styles.header}>
          <Link to="/admin/users" className={styles.backButton}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Quay lại
          </Link>
          <h1 className={styles.title}>Chi tiết người dùng</h1>
          {!isEditing && user && (
            <button onClick={handleEdit} className={styles.editButton}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
              Chỉnh sửa
            </button>
          )}
        </div>

        {error && <div className={styles.error}>{error}</div>}

        {loading ? (
          <div className={styles.loading}>Đang tải thông tin...</div>
        ) : user ? (
          <div className={styles.userCard}>
            {!isEditing ? (
              <>
                <div className={styles.userHeader}>
                  {user.photo ? (
                    <img
                      src={user.photo}
                      alt={user.name}
                      className={styles.userAvatar}
                    />
                  ) : (
                    <div className={styles.userAvatarPlaceholder}>
                      {user.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                  )}
                  <div className={styles.userInfo}>
                    <h2 className={styles.userName}>{user.name}</h2>
                    <p className={styles.userEmail}>{user.email}</p>
                  </div>
                </div>

                <div className={styles.userDetails}>
                  <div className={styles.detailRow}>
                    <span className={styles.label}>ID:</span>
                    <span className={styles.value}>{user.id}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.label}>Tên:</span>
                    <span className={styles.value}>{user.name}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.label}>Email:</span>
                    <span className={styles.value}>{user.email}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.label}>Vai trò:</span>
                    <span className={`${styles.role} ${user.role === "admin" ? styles.roleAdmin : styles.roleUser}`}>
                      {user.role === "admin" ? "Admin" : "User"}
                    </span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.label}>Trạng thái:</span>
                    <span className={`${styles.status} ${user.isActive ? styles.statusActive : styles.statusInactive}`}>
                      {user.isActive ? "Hoạt động" : "Không hoạt động"}
                    </span>
                  </div>
                  {user.passwordChangedAt && (
                    <div className={styles.detailRow}>
                      <span className={styles.label}>Đổi mật khẩu lần cuối:</span>
                      <span className={styles.value}>
                        {new Date(user.passwordChangedAt).toLocaleString("vi-VN")}
                      </span>
                    </div>
                  )}
                  {user.photo && (
                    <div className={styles.detailRow}>
                      <span className={styles.label}>Ảnh đại diện:</span>
                      <img src={user.photo} alt={user.name} className={styles.photoPreview} />
                    </div>
                  )}
                </div>
              </>
            ) : (
              <form onSubmit={handleUpdate} className={styles.editForm}>
                {updateError && <div className={styles.error}>{updateError}</div>}

                <div className={styles.formGroup}>
                  <label htmlFor="editName">Tên *</label>
                  <input
                    type="text"
                    id="editName"
                    name="name"
                    value={editData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Nhập tên người dùng"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="editEmail">Email *</label>
                  <input
                    type="email"
                    id="editEmail"
                    name="email"
                    value={editData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="example@email.com"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="editRole">Vai trò *</label>
                  <select
                    id="editRole"
                    name="role"
                    value={editData.role}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div className={styles.editActions}>
                  <button
                    type="button"
                    className={styles.cancelButton}
                    onClick={handleCancelEdit}
                    disabled={updating}
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className={styles.saveButton}
                    disabled={updating}
                  >
                    {updating ? "Đang lưu..." : "Lưu thay đổi"}
                  </button>
                </div>
              </form>
            )}
          </div>
        ) : null}
      </div>
    </AdminLayout>
  );
};

export default AdminUserDetail;

