import React, { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getUser, isAuthenticated } from "../../../utils/storage";
import {
  getAllUsers,
  createUser,
  type CreateUserData,
} from "../../../services/adminService";
import AdminLayout from "../../../components/admin/Layout/Layout";
import type { User } from "../../../types/api";
import styles from "./Users.module.css";

const AdminUsers: React.FC = () => {
  const navigate = useNavigate();
  const currentUser: User | null = getUser();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  const [formData, setFormData] = useState<CreateUserData>({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
    role: "user",
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

    // Lấy danh sách users - chỉ load 1 lần khi component mount (khi refresh trình duyệt)
    fetchUsers(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Chỉ chạy 1 lần khi component mount

  const fetchUsers = async (retryCount = 0) => {
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

      const response = await getAllUsers();

      if (response.status === "success" && response.data?.users) {
        setUsers(response.data.users);
      } else {
        setError(response.message || "Không thể lấy danh sách users");
      }
    } catch (err: any) {
      console.error("❌ Lỗi khi lấy danh sách users:", err);

      // Xử lý lỗi 429: Too Many Requests
      if (err.response?.status === 429) {
        const retryAfter = err.response.headers?.["retry-after"] || 5;
        const message = `Quá nhiều yêu cầu. Vui lòng đợi ${retryAfter} giây trước khi thử lại.`;
        setError(message);

        // Tự động retry sau một khoảng thời gian (tối đa 3 lần)
        if (retryCount < 3) {
          setTimeout(() => {
            fetchUsers(retryCount + 1);
          }, retryAfter * 1000);
          return;
        }
      } else if (err.response?.status === 401) {
        setError("Token không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại.");
      } else if (err.response?.status === 403) {
        setError(
          "Bạn không có quyền truy cập. Chỉ admin mới có thể xem danh sách users."
        );
      } else {
        setError(err.message || "Có lỗi xảy ra khi lấy danh sách users");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setCreateError("");

    // Validation
    if (formData.password !== formData.passwordConfirm) {
      setCreateError("Mật khẩu xác nhận không khớp.");
      setCreating(false);
      return;
    }

    if (formData.password.length < 8) {
      setCreateError("Mật khẩu phải có ít nhất 8 ký tự.");
      setCreating(false);
      return;
    }

    try {
      const response = await createUser(formData);

      if (response.status === "success" && response.data?.user) {
        // Thêm user mới vào danh sách
        setUsers([...users, response.data.user]);
        // Reset form và đóng modal
        setFormData({
          name: "",
          email: "",
          password: "",
          passwordConfirm: "",
          role: "user",
        });
        setShowCreateModal(false);
        setCreateError("");
      } else {
        setCreateError(response.message || "Không thể tạo user");
      }
    } catch (err: any) {
      console.error("❌ Lỗi khi tạo user:", err);
      setCreateError(err.message || "Có lỗi xảy ra khi tạo user");
    } finally {
      setCreating(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev: CreateUserData) => ({
      ...prev,
      [name]: value,
    }));
    if (createError) setCreateError("");
  };

  if (!currentUser || currentUser.role !== "admin") {
    return null;
  }

  return (
    <AdminLayout>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Quản lý người dùng</h1>
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
              Tạo mới
            </button>
            <button
              onClick={() => fetchUsers(0)}
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
                  <th>Tên</th>
                  <th>Email</th>
                  <th>Vai trò</th>
                  <th>Trạng thái</th>
                  <th>ID</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={6} className={styles.empty}>
                      Không có người dùng nào
                    </td>
                  </tr>
                ) : (
                  users.map((user, index) => (
                    <tr key={user.id}>
                      <td>{index + 1}</td>
                      <td>
                        <div className={styles.userNameCell}>
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
                          <span>{user.name}</span>
                        </div>
                      </td>
                      <td>{user.email}</td>
                      <td>
                        <span
                          className={`${styles.role} ${user.role === "admin" ? styles.roleAdmin : styles.roleUser}`}
                        >
                          {user.role === "admin" ? "Admin" : "User"}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`${styles.status} ${user.isActive ? styles.statusActive : styles.statusInactive}`}
                        >
                          {user.isActive ? "Hoạt động" : "Không hoạt động"}
                        </span>
                      </td>
                      <td className={styles.idCell}>
                        <Link
                          to={`/admin/users/${user.id}`}
                          className={styles.viewLink}
                        >
                          Xem chi tiết
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {!loading && users.length > 0 && (
          <div className={styles.footer}>
            <p>Tổng số người dùng: {users.length}</p>
          </div>
        )}

        {/* Modal tạo user mới */}
        {showCreateModal && (
          <div
            className={styles.modalOverlay}
            onClick={() => setShowCreateModal(false)}
          >
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h2>Tạo người dùng mới</h2>
                <button
                  className={styles.modalClose}
                  onClick={() => {
                    setShowCreateModal(false);
                    setCreateError("");
                    setFormData({
                      name: "",
                      email: "",
                      password: "",
                      passwordConfirm: "",
                      role: "user",
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

              <form onSubmit={handleCreateUser} className={styles.modalForm}>
                <div className={styles.formGroup}>
                  <label htmlFor="name">Tên *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Nhập tên người dùng"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="example@email.com"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="password">Mật khẩu *</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    minLength={8}
                    placeholder="Tối thiểu 8 ký tự"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="passwordConfirm">Xác nhận mật khẩu *</label>
                  <input
                    type="password"
                    id="passwordConfirm"
                    name="passwordConfirm"
                    value={formData.passwordConfirm}
                    onChange={handleInputChange}
                    required
                    minLength={8}
                    placeholder="Nhập lại mật khẩu"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="role">Vai trò *</label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div className={styles.modalActions}>
                  <button
                    type="button"
                    className={styles.cancelButton}
                    onClick={() => {
                      setShowCreateModal(false);
                      setCreateError("");
                      setFormData({
                        name: "",
                        email: "",
                        password: "",
                        passwordConfirm: "",
                        role: "user",
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
                    {creating ? "Đang tạo..." : "Tạo mới"}
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

export default AdminUsers;
