import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../../services/authService";
import { clearAuth } from "../../utils/storage";
import styles from "./Login.module.css";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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

      if (response.status === "success" && response.data?.user) {
        const user = response.data.user;
        
        // Nếu là admin, không cho login ở đây, redirect về admin login
        if (user.role === "admin") {
          clearAuth();
          setError("Tài khoản admin không thể đăng nhập ở đây. Vui lòng đăng nhập tại trang admin.");
          return;
        }
        
        // Nếu là user, redirect đến user dashboard
        navigate("/dashboard");
      } else {
        setError(response.message || "Đăng nhập thất bại. Vui lòng thử lại.");
      }
    } catch (err: any) {
      setError(err.message || "Đăng nhập thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleGmailLogin = () => {
    // TODO: Implement Gmail OAuth login
    alert("Tính năng đăng nhập với Gmail đang được phát triển");
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <div className={styles.leftSection}>
          <h1 className={styles.leftTitle}>Học tiếng Anh hiệu quả cùng TT</h1>
          <p className={styles.leftDescription}>
            Tham gia cộng đồng hơn 1 triệu người học tiếng Anh với phương pháp
            hiện đại và hiệu quả.
          </p>

          <div className={styles.features}>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>✓</div>
              <div>Học mọi lúc, mọi nơi</div>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>✓</div>
              <div>Phương pháp học cá nhân hóa</div>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>✓</div>
              <div>Giáo viên bản ngữ chất lượng</div>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>✓</div>
              <div>Tiến bộ nhanh chỉ sau 3 tháng</div>
            </div>
          </div>
        </div>

        <div className={styles.rightSection}>
          <div className={styles.logo}>
            <div className={styles.logoIcon}>TT</div>
            <div className={styles.logoText}>TT English</div>
          </div>

          <h1 className={styles.title}>Đăng nhập tài khoản</h1>
          <p className={styles.subtitle}>Chào mừng bạn quay trở lại!</p>

          <form onSubmit={handleSubmit} className={styles.form}>
            {error && <div className={styles.errorMessage}>{error}</div>}

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
                placeholder="Nhập địa chỉ email của bạn"
                required
                disabled={loading}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password" className={styles.label}>
                Mật khẩu
              </label>
              <div className={styles.passwordContainer}>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="Nhập mật khẩu của bạn"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  className={styles.togglePassword}
                  onClick={togglePasswordVisibility}
                  disabled={loading}
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      width="20"
                      height="20"
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      width="20"
                      height="20"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className={styles.forgotPasswordLink}>
              <Link to="/forgot-password" className={styles.forgotLink}>
                Quên mật khẩu?
              </Link>
            </div>

            <button type="submit" className={styles.btn} disabled={loading}>
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
          </form>

          <div className={styles.divider}>
            <span>Hoặc đăng nhập với</span>
          </div>

          <button
            type="button"
            className={styles.gmailBtn}
            onClick={handleGmailLogin}
            disabled={loading}
          >
            <svg
              className={styles.gmailIcon}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path
                fill="#EA4335"
                d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115Z"
              />
              <path
                fill="#34A853"
                d="M16.04 18.013c-1.09.703-2.474 1.078-4.04 1.078a7.077 7.077 0 0 1-6.723-4.823l-4.04 3.067A11.965 11.965 0 0 0 12 24c2.933 0 5.735-1.043 7.834-3l-3.793-2.987Z"
              />
              <path
                fill="#4A90E2"
                d="M19.834 21c2.195-2.048 3.62-5.096 3.62-9 0-.71-.109-1.473-.272-2.182H12v4.637h6.436c-.317 1.559-1.17 2.766-2.395 3.558L19.834 21Z"
              />
              <path
                fill="#FBBC05"
                d="M5.277 14.268A7.12 7.12 0 0 1 4.909 12c0-.782.125-1.533.357-2.235L1.24 6.65A11.934 11.934 0 0 0 0 12c0 1.92.445 3.73 1.237 5.335l4.04-3.067Z"
              />
            </svg>
            Đăng nhập với Gmail
          </button>

          <div className={styles.signupLink}>
            Chưa có tài khoản?{" "}
            <Link to="/register" className={styles.link}>
              Đăng ký ngay
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
