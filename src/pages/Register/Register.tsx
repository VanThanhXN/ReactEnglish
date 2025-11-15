import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../../services/authService";
import { checkPasswordStrength } from "../../utils/passwordStrength";
import {
  isValidEmail,
  isValidName,
  isValidPassword,
  doPasswordsMatch,
} from "../../utils/validation";
import styles from "./Register.module.css";

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });
  const [passwordStrength, setPasswordStrength] = useState(
    checkPasswordStrength("")
  );
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

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
      name: "",
      email: "",
      password: "",
      passwordConfirm: "",
    };

    let isValid = true;

    if (!isValidName(formData.name)) {
      newErrors.name = "Vui lòng nhập họ và tên hợp lệ (ít nhất 2 ký tự)";
      isValid = false;
    }

    if (!isValidEmail(formData.email)) {
      newErrors.email = "Vui lòng nhập địa chỉ email hợp lệ";
      isValid = false;
    }

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

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await register(formData);

      if (response.status === "success") {
        navigate("/dashboard");
      } else {
        setErrors((prev) => ({
          ...prev,
          email: response.message || "Đăng ký thất bại. Vui lòng thử lại.",
        }));
      }
    } catch (err: any) {
      setErrors((prev) => ({
        ...prev,
        email: err.message || "Đăng ký thất bại. Vui lòng thử lại.",
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleGmailRegister = () => {
    alert("Tính năng đăng ký với Gmail đang được phát triển");
  };

  const passwordsMatch =
    formData.passwordConfirm &&
    doPasswordsMatch(formData.password, formData.passwordConfirm);

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <div className={styles.leftSection}>
          <h1 className={styles.leftTitle}>Bắt đầu hành trình học tiếng Anh</h1>
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

          <h1 className={styles.title}>Tạo tài khoản mới</h1>
          <p className={styles.subtitle}>
            Tham gia cộng đồng học tiếng Anh lớn nhất Việt Nam
          </p>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="name" className={styles.label}>
                Họ và tên
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={styles.input}
                placeholder="Nhập họ và tên của bạn"
                required
                disabled={loading}
              />
              {errors.name && (
                <div className={styles.errorMessage}>{errors.name}</div>
              )}
            </div>

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
              {errors.email && (
                <div className={styles.errorMessage}>{errors.email}</div>
              )}
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
                  placeholder="Tạo mật khẩu của bạn"
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
                Xác nhận mật khẩu
              </label>
              <div className={styles.passwordContainer}>
                <input
                  type={showPasswordConfirm ? "text" : "password"}
                  id="passwordConfirm"
                  name="passwordConfirm"
                  value={formData.passwordConfirm}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="Nhập lại mật khẩu của bạn"
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
              {loading ? "Đang đăng ký..." : "Đăng ký tài khoản"}
            </button>

            <div className={styles.divider}>
              <span>Hoặc đăng ký với</span>
            </div>

            <button
              type="button"
              className={styles.gmailBtn}
              onClick={handleGmailRegister}
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
              Đăng ký với Gmail
            </button>

            <div className={styles.loginLink}>
              Đã có tài khoản?{" "}
              <Link to="/login" className={styles.link}>
                Đăng nhập ngay
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
