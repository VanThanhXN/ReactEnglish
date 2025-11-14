import React, { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../../services/authService";
import { isValidEmail } from "../../utils/validation";
import styles from "./ForgotPassword.module.css";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) setError("");
    if (success) setSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    // Validate email
    if (!isValidEmail(email)) {
      setError("Vui lòng nhập địa chỉ email hợp lệ");
      return;
    }

    setLoading(true);

    try {
      const response = await forgotPassword({ email });

      if (response.status === "success") {
        setSuccess(true);
        setEmail("");
      } else {
        setError(response.message || "Có lỗi xảy ra. Vui lòng thử lại.");
      }
    } catch (err: any) {
      setError(err.message || "Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
      <div className={styles.leftSection}>
        <h1 className={styles.leftTitle}>Quên mật khẩu?</h1>
        <p className={styles.leftDescription}>
          Đừng lo lắng! Chúng tôi sẽ gửi hướng dẫn đặt lại mật khẩu đến email
          của bạn.
        </p>

        <div className={styles.features}>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>✓</div>
            <div>Gửi email nhanh chóng</div>
          </div>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>✓</div>
            <div>Bảo mật an toàn</div>
          </div>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>✓</div>
            <div>Hướng dẫn chi tiết</div>
          </div>
        </div>
      </div>

      <div className={styles.rightSection}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>TT</div>
          <div className={styles.logoText}>TT English</div>
        </div>

        <h1 className={styles.title}>Quên mật khẩu</h1>
        <p className={styles.subtitle}>
          Nhập email của bạn để nhận link đặt lại mật khẩu
        </p>

        {success ? (
          <div className={styles.successCard}>
            <div className={styles.successIcon}>✓</div>
            <h2 className={styles.successTitle}>Email đã được gửi!</h2>
            <p className={styles.successMessage}>
              Vui lòng kiểm tra hộp thư email của bạn và làm theo hướng dẫn để
              đặt lại mật khẩu.
            </p>
            <div className={styles.testLink}>
              <p style={{ fontSize: "12px", color: "#666", marginBottom: "8px" }}>
                (Để test form reset password, click vào link bên dưới - Backend sẽ gửi email thật)
              </p>
              <Link to="/reset-password/test-token-123" className={styles.testResetLink}>
                Test Reset Password Form
              </Link>
            </div>
            <Link to="/login" className={styles.backToLogin}>
              Quay lại đăng nhập
            </Link>
          </div>
        ) : (
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
                value={email}
                onChange={handleChange}
                className={styles.input}
                placeholder="Nhập địa chỉ email của bạn"
                required
                disabled={loading}
              />
            </div>

            <button type="submit" className={styles.btn} disabled={loading}>
              {loading ? "Đang gửi..." : "Gửi email đặt lại mật khẩu"}
            </button>
          </form>
        )}

        <div className={styles.loginLink}>
          Nhớ mật khẩu?{" "}
          <Link to="/login" className={styles.link}>
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    </div>
    </div>
  );
};

export default ForgotPassword;

