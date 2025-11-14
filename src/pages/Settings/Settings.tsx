import React, { useState } from "react";
import { updatePassword } from "../../services/authService";
import { checkPasswordStrength } from "../../utils/passwordStrength";
import { isValidPassword, doPasswordsMatch } from "../../utils/validation";
import styles from "./Settings.module.css";

const Settings: React.FC = () => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    passwordConfirm: "",
  });
  const [errors, setErrors] = useState({
    currentPassword: "",
    newPassword: "",
    passwordConfirm: "",
  });
  const [passwordStrength, setPasswordStrength] = useState(
    checkPasswordStrength("")
  );
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

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

    // Clear success message
    if (successMessage) {
      setSuccessMessage("");
    }

    // Update password strength
    if (name === "newPassword") {
      setPasswordStrength(checkPasswordStrength(value));
      // Re-check password match
      if (formData.passwordConfirm) {
        validatePasswordMatch(value, formData.passwordConfirm);
      }
    }

    // Re-check password match khi passwordConfirm thay đổi
    if (name === "passwordConfirm") {
      validatePasswordMatch(formData.newPassword, value);
    }
  };

  const validatePasswordMatch = (
    password: string,
    passwordConfirm: string
  ) => {
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
      currentPassword: "",
      newPassword: "",
      passwordConfirm: "",
    };

    let isValid = true;

    if (!formData.currentPassword) {
      newErrors.currentPassword = "Vui lòng nhập mật khẩu hiện tại";
      isValid = false;
    }

    if (!isValidPassword(formData.newPassword)) {
      newErrors.newPassword = "Mật khẩu phải có ít nhất 8 ký tự";
      isValid = false;
    }

    if (!doPasswordsMatch(formData.newPassword, formData.passwordConfirm)) {
      newErrors.passwordConfirm = "Mật khẩu xác nhận không khớp";
      isValid = false;
    }

    if (formData.currentPassword === formData.newPassword) {
      newErrors.newPassword = "Mật khẩu mới phải khác mật khẩu hiện tại";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccessMessage("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await updatePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
        passwordConfirm: formData.passwordConfirm,
      });

      if (response.status === "success") {
        setSuccessMessage(
          response.message || "Đổi mật khẩu thành công!"
        );
        // Reset form
        setFormData({
          currentPassword: "",
          newPassword: "",
          passwordConfirm: "",
        });
        setPasswordStrength(checkPasswordStrength(""));
      }
    } catch (err: any) {
      setErrors((prev) => ({
        ...prev,
        currentPassword: err.message || "Đổi mật khẩu thất bại. Vui lòng thử lại.",
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Cài đặt</h1>
          <p className={styles.subtitle}>Quản lý thông tin tài khoản của bạn</p>
        </div>

        <div className={styles.content}>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Đổi mật khẩu</h2>
            <p className={styles.sectionDescription}>
              Để đảm bảo bảo mật, vui lòng sử dụng mật khẩu mạnh và không chia sẻ với người khác.
            </p>

            <form onSubmit={handleSubmit} className={styles.form}>
              {successMessage && (
                <div className={styles.successMessage}>{successMessage}</div>
              )}

              {/* Current Password */}
              <div className={styles.formGroup}>
                <label htmlFor="currentPassword" className={styles.label}>
                  Mật khẩu hiện tại
                </label>
                <div className={styles.inputWrapper}>
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    id="currentPassword"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    className={`${styles.input} ${
                      errors.currentPassword ? styles.inputError : ""
                    }`}
                    placeholder="Nhập mật khẩu hiện tại"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className={styles.togglePassword}
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    tabIndex={-1}
                  >
                    {showCurrentPassword ? (
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
                {errors.currentPassword && (
                  <span className={styles.error}>{errors.currentPassword}</span>
                )}
              </div>

              {/* New Password */}
              <div className={styles.formGroup}>
                <label htmlFor="newPassword" className={styles.label}>
                  Mật khẩu mới
                </label>
                <div className={styles.inputWrapper}>
                  <input
                    type={showNewPassword ? "text" : "password"}
                    id="newPassword"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className={`${styles.input} ${
                      errors.newPassword ? styles.inputError : ""
                    }`}
                    placeholder="Nhập mật khẩu mới"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className={styles.togglePassword}
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    tabIndex={-1}
                  >
                    {showNewPassword ? (
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
                {errors.newPassword && (
                  <span className={styles.error}>{errors.newPassword}</span>
                )}
                {formData.newPassword && (
                  <div className={styles.passwordStrength}>
                    <div className={styles.strengthLabel}>
                      Độ mạnh mật khẩu:
                    </div>
                    <div className={styles.strengthBar}>
                      <div
                        className={`${styles.strengthFill} ${
                          passwordStrength.strength === "very-strong"
                            ? styles.veryStrong
                            : styles[passwordStrength.strength]
                        }`}
                        style={{
                          width: `${passwordStrength.score}%`,
                          backgroundColor: passwordStrength.color,
                        }}
                      ></div>
                    </div>
                    <div
                      className={`${styles.strengthText} ${
                        passwordStrength.strength === "very-strong"
                          ? styles.veryStrong
                          : styles[passwordStrength.strength]
                      }`}
                      style={{ color: passwordStrength.color }}
                    >
                      {passwordStrength.text}
                    </div>
                  </div>
                )}
              </div>

              {/* Password Confirm */}
              <div className={styles.formGroup}>
                <label htmlFor="passwordConfirm" className={styles.label}>
                  Xác nhận mật khẩu mới
                </label>
                <div className={styles.inputWrapper}>
                  <input
                    type={showPasswordConfirm ? "text" : "password"}
                    id="passwordConfirm"
                    name="passwordConfirm"
                    value={formData.passwordConfirm}
                    onChange={handleChange}
                    className={`${styles.input} ${
                      errors.passwordConfirm ? styles.inputError : ""
                    }`}
                    placeholder="Nhập lại mật khẩu mới"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className={styles.togglePassword}
                    onClick={() =>
                      setShowPasswordConfirm(!showPasswordConfirm)
                    }
                    tabIndex={-1}
                  >
                    {showPasswordConfirm ? (
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
                {errors.passwordConfirm && (
                  <span className={styles.error}>
                    {errors.passwordConfirm}
                  </span>
                )}
              </div>

              <button
                type="submit"
                className={styles.submitButton}
                disabled={loading}
              >
                {loading ? "Đang xử lý..." : "Đổi mật khẩu"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;

