import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../../services/authService";
import {
  getUser,
  isAuthenticated,
  clearAuth,
  getToken,
} from "../../../utils/storage";
import type { User } from "../../../types/api";
import styles from "./Login.module.css";

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Kiểm tra nếu đã đăng nhập và là admin thì redirect đến dashboard ngay
  useEffect(() => {
    const checkAuth = () => {
      if (isAuthenticated()) {
        const user: User | null = getUser();
        if (user?.role === "admin") {
          // Đã đăng nhập và là admin, redirect ngay đến dashboard
          navigate("/admin/dashboard", { replace: true });
          return;
        } else if (user && user.role !== "admin") {
          // Nếu đã đăng nhập nhưng không phải admin, xóa auth
          clearAuth();
        }
      }
      setCheckingAuth(false);
    };

    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Chỉ chạy khi component mount

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError("");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await login(formData);

      // Function login() đã tự động lưu token và user vào localStorage
      // Kiểm tra response có thành công không
      if (response.status === "success" && response.data?.user) {
        const user = response.data.user;

        // CHỈ redirect nếu role là admin
        if (user.role === "admin") {
          // Token đã được lưu trong function login() rồi
          // Kiểm tra token đã được lưu chưa (debug)
          const savedToken = getToken();
          if (process.env.NODE_ENV === "development") {
            console.log(
              "✅ Admin login thành công! Token đã được lưu:",
              savedToken ? "Có" : "Không"
            );
          }

          // Redirect đến admin dashboard
          navigate("/admin/dashboard", { replace: true });
          return; // Dừng ở đây, không chạy code phía dưới
        } else {
          // Không phải admin, xóa token và hiển thị lỗi
          clearAuth();
          setError(
            "Bạn không có quyền truy cập trang admin. Vui lòng đăng nhập bằng tài khoản admin."
          );
        }
      } else {
        // Đăng nhập thất bại - xóa auth nếu có
        clearAuth();
        setError(response.message || "Đăng nhập thất bại. Vui lòng thử lại.");
      }
    } catch (err: any) {
      // Xử lý lỗi từ API - xóa auth nếu có
      clearAuth();
      setError(err.message || "Đăng nhập thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  // Nếu đang kiểm tra auth, không hiển thị form
  if (checkingAuth) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.container}>
          <div className={styles.loginCard}>
            <div className={styles.header}>
              <p className={styles.subtitle}>Đang kiểm tra...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <div className={styles.loginCard}>
          <div className={styles.header}>
            <h1 className={styles.title}>Đăng nhập Admin</h1>
            <p className={styles.subtitle}>Đăng nhập vào hệ thống quản trị</p>
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={styles.input}
                placeholder="admin@example.com"
                required
                autoComplete="email"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password" className={styles.label}>
                Mật khẩu
              </label>
              <div className={styles.passwordInputWrapper}>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="Nhập mật khẩu"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={togglePasswordVisibility}
                  aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                >
                  {showPassword ? (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  ) : (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
