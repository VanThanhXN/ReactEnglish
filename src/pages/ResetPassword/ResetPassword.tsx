import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { resetPassword } from "../../services/authService";
import { checkPasswordStrength } from "../../utils/passwordStrength";
import { isValidPassword, doPasswordsMatch } from "../../utils/validation";
import styles from "./ResetPassword.module.css";

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();
  const [formData, setFormData] = useState({
    password: "",
    passwordConfirm: "",
  });
  const [errors, setErrors] = useState({
    password: "",
    passwordConfirm: "",
  });
  const [passwordStrength, setPasswordStrength] = useState(
    checkPasswordStrength("")
  );
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate("/forgot-password");
    }
  }, [token, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error khi user nhập
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    // Update password strength
    if (name === "password") {
      setPasswordStrength(checkPasswordStrength(value));
      // Re-check password match
      if (formData.passwordConfirm) {
        validatePasswordMatch(value, formData.passwordConfirm);
      }
    }

    // Re-check password match khi passwordConfirm thay đổi
    if (name === "passwordConfirm") {
      validatePasswordMatch(formData.password, value);
    }
  };

  const validatePasswordMatch = (password: string, passwordConfirm: string) => {
    if (passwordConfirm && !doPasswordsMatch(password, passwordConfirm)) {
      setErrors((prev) => ({
        ...prev,
        passwordConfirm: "Mật khẩu xác nhận không khớp",
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        passwordConfirm: "",
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors = {
      password: "",
      passwordConfirm: "",
    };

    let isValid = true;

    if (!isValidPassword(formData.password)) {
      newErrors.password = "Mật khẩu phải có ít nhất 8 ký tự";
      isValid = false;
    }

    if (!doPasswordsMatch(formData.password, formData.passwordConfirm)) {
      newErrors.passwordConfirm = "Mật khẩu xác nhận không khớp";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!token) {
      setErrors((prev) => ({
        ...prev,
        password: "Token không hợp lệ",
      }));
      return;
    }

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await resetPassword(token, formData);

      if (response.status === "success") {
        setSuccess(true);
        // Redirect to login sau 2 giây
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setErrors((prev) => ({
          ...prev,
          password:
            response.message || "Đặt lại mật khẩu thất bại. Vui lòng thử lại.",
        }));
      }
    } catch (err: any) {
      setErrors((prev) => ({
        ...prev,
        password: err.message || "Đặt lại mật khẩu thất bại. Vui lòng thử lại.",
      }));
    } finally {
      setLoading(false);
    }
  };

  const passwordsMatch =
    formData.passwordConfirm &&
    doPasswordsMatch(formData.password, formData.passwordConfirm);

  if (!token) {
    return null;
  }

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <div className={styles.leftSection}>
          <h1 className={styles.leftTitle}>Đặt lại mật khẩu mới</h1>
          <p className={styles.leftDescription}>
            Vui lòng nhập mật khẩu mới cho tài khoản của bạn. Mật khẩu phải có
            ít nhất 8 ký tự.
          </p>

          <div className={styles.features}>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>✓</div>
              <div>Mật khẩu mạnh và an toàn</div>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>✓</div>
              <div>Xác nhận mật khẩu chính xác</div>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>✓</div>
              <div>Bảo mật tài khoản của bạn</div>
            </div>
          </div>
        </div>

        <div className={styles.rightSection}>
          <div className={styles.logo}>
            <div className={styles.logoIcon}>TT</div>
            <div className={styles.logoText}>TT English</div>
          </div>

          <h1 className={styles.title}>Đặt lại mật khẩu</h1>
          <p className={styles.subtitle}>
            Nhập mật khẩu mới cho tài khoản của bạn
          </p>

          {success ? (
            <div className={styles.successCard}>
              <div className={styles.successIcon}>✓</div>
              <h2 className={styles.successTitle}>
                Đặt lại mật khẩu thành công!
              </h2>
              <p className={styles.successMessage}>
                Mật khẩu của bạn đã được đặt lại thành công. Đang chuyển hướng
                đến trang đăng nhập...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="password" className={styles.label}>
                  Mật khẩu mới
                </label>
                <div className={styles.passwordContainer}>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={styles.input}
                    placeholder="Nhập mật khẩu mới"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className={styles.togglePassword}
                    onClick={() => setShowPassword(!showPassword)}
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
                <div className={styles.passwordStrength}>
                  <div>
                    Độ mạnh mật khẩu:{" "}
                    <span style={{ color: passwordStrength.color }}>
                      {passwordStrength.text}
                    </span>
                  </div>
                  <div className={styles.strengthBar}>
                    <div
                      className={styles.strengthFill}
                      style={{
                        width: `${passwordStrength.score}%`,
                        backgroundColor: passwordStrength.color,
                      }}
                    />
                  </div>
                </div>
                {errors.password && (
                  <div className={styles.errorMessage}>{errors.password}</div>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="passwordConfirm" className={styles.label}>
                  Xác nhận mật khẩu mới
                </label>
                <div className={styles.passwordContainer}>
                  <input
                    type={showPasswordConfirm ? "text" : "password"}
                    id="passwordConfirm"
                    name="passwordConfirm"
                    value={formData.passwordConfirm}
                    onChange={handleChange}
                    className={styles.input}
                    placeholder="Nhập lại mật khẩu mới"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className={styles.togglePassword}
                    onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                    disabled={loading}
                  >
                    {showPasswordConfirm ? (
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
                {errors.passwordConfirm && (
                  <div className={styles.errorMessage}>
                    {errors.passwordConfirm}
                  </div>
                )}
                {passwordsMatch && !errors.passwordConfirm && (
                  <div className={styles.successMessage}>Mật khẩu khớp</div>
                )}
              </div>

              <button type="submit" className={styles.btn} disabled={loading}>
                {loading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
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

export default ResetPassword;
