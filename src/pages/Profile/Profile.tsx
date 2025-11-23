import React, { useState, useEffect } from "react";
import { getUser } from "../../utils/storage";
import { updateProfile } from "../../services/authService";
import { isValidEmail, isValidName } from "../../utils/validation";
import type { User } from "../../types/api";
import styles from "./Profile.module.css";

const Profile: React.FC = () => {
  const user: User | null = getUser();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    photo: "",
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    photo: "",
  });
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        photo: user.photo || "",
      });
      if (user.photo) {
        setPhotoPreview(user.photo);
      }
    }
  }, [user]);

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
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({
          ...prev,
          photo: "Vui lòng chọn file ảnh hợp lệ",
        }));
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          photo: "Kích thước ảnh không được vượt quá 5MB",
        }));
        return;
      }

      setPhotoFile(file);
      setErrors((prev) => ({
        ...prev,
        photo: "",
      }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Clear success message
      if (successMessage) {
        setSuccessMessage("");
      }
    }
  };

  const validateForm = (): boolean => {
    const newErrors = {
      name: "",
      email: "",
      photo: "",
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

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccessMessage("");

    if (!validateForm()) {
      return;
    }

    // Kiểm tra xem có thay đổi gì không
    if (
      user &&
      formData.name === user.name &&
      formData.email === user.email &&
      !photoFile
    ) {
      setSuccessMessage("Không có thay đổi nào để cập nhật");
      setIsEditing(false);
      return;
    }

    setLoading(true);

    try {
      const response = await updateProfile({
        name: formData.name,
        email: formData.email,
        photo: photoFile || undefined,
      });

      if (response.status === "success") {
        setSuccessMessage(
          response.message || "Cập nhật hồ sơ thành công!"
        );
        setPhotoFile(null);
        setIsEditing(false);
      }
    } catch (err: any) {
      setErrors((prev) => ({
        ...prev,
        email: err.message || "Cập nhật hồ sơ thất bại. Vui lòng thử lại.",
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        photo: user.photo || "",
      });
      if (user.photo) {
        setPhotoPreview(user.photo);
      } else {
        setPhotoPreview(null);
      }
    }
    setPhotoFile(null);
    setErrors({
      name: "",
      email: "",
      photo: "",
    });
    setSuccessMessage("");
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.container}>
          <div className={styles.errorMessage}>
            Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Hồ sơ</h1>
          <p className={styles.subtitle}>
            Quản lý thông tin cá nhân của bạn
          </p>
        </div>

        <div className={styles.content}>
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Thông tin cá nhân</h2>
              {!isEditing && (
                <button
                  className={styles.editButton}
                  onClick={() => setIsEditing(true)}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                  Chỉnh sửa
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              {successMessage && (
                <div className={styles.successMessage}>{successMessage}</div>
              )}

              {/* Photo */}
              <div className={styles.formGroup}>
                <label className={styles.label}>Ảnh đại diện</label>
                <div className={styles.photoSection}>
                  <div className={styles.photoPreview}>
                    {photoPreview ? (
                      <img
                        src={photoPreview}
                        alt="Avatar"
                        className={styles.photoImage}
                      />
                    ) : (
                      <div className={styles.photoPlaceholder}>
                        <svg
                          width="48"
                          height="48"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                          <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                      </div>
                    )}
                  </div>
                  {isEditing && (
                    <div className={styles.photoUpload}>
                      <input
                        type="file"
                        id="photo"
                        name="photo"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className={styles.fileInput}
                        disabled={loading}
                      />
                      <label htmlFor="photo" className={styles.fileLabel}>
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                          <polyline points="17 8 12 3 7 8"></polyline>
                          <line x1="12" y1="3" x2="12" y2="15"></line>
                        </svg>
                        {photoFile ? "Đổi ảnh" : "Chọn ảnh"}
                      </label>
                      {photoFile && (
                        <span className={styles.fileName}>{photoFile.name}</span>
                      )}
                    </div>
                  )}
                </div>
                {errors.photo && (
                  <span className={styles.error}>{errors.photo}</span>
                )}
              </div>

              {/* Name */}
              <div className={styles.formGroup}>
                <label htmlFor="name" className={styles.label}>
                  Họ và tên
                </label>
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`${styles.input} ${
                        errors.name ? styles.inputError : ""
                      }`}
                      placeholder="Nhập họ và tên"
                      disabled={loading}
                    />
                    {errors.name && (
                      <span className={styles.error}>{errors.name}</span>
                    )}
                  </>
                ) : (
                  <div className={styles.value}>{user.name || "Chưa có"}</div>
                )}
              </div>

              {/* Email */}
              <div className={styles.formGroup}>
                <label htmlFor="email" className={styles.label}>
                  Email
                </label>
                {isEditing ? (
                  <>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`${styles.input} ${
                        errors.email ? styles.inputError : ""
                      }`}
                      placeholder="Nhập email"
                      disabled={loading}
                    />
                    {errors.email && (
                      <span className={styles.error}>{errors.email}</span>
                    )}
                  </>
                ) : (
                  <div className={styles.value}>{user.email || "Chưa có"}</div>
                )}
              </div>

              {/* Role - Read only */}
              <div className={styles.formGroup}>
                <label className={styles.label}>Vai trò</label>
                <div className={styles.value}>
                  {user.role === "user" ? "Người dùng" : user.role}
                </div>
              </div>

              {/* ID - Read only */}
              <div className={styles.formGroup}>
                <label className={styles.label}>ID</label>
                <div className={styles.value}>{user.id}</div>
              </div>

              {isEditing && (
                <div className={styles.buttonGroup}>
                  <button
                    type="button"
                    className={styles.cancelButton}
                    onClick={handleCancel}
                    disabled={loading}
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className={styles.submitButton}
                    disabled={loading}
                  >
                    {loading ? "Đang lưu..." : "Lưu thay đổi"}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

