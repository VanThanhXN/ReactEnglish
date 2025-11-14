import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUser, isAuthenticated } from "../../utils/storage";
import type { User } from "../../types/api";
import styles from "./Home.module.css";

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const user: User | null = getUser();

  useEffect(() => {
    // Kiểm tra authentication
    if (!isAuthenticated()) {
      navigate("/login", { replace: true });
      return;
    }

    // Nếu là admin, redirect về admin dashboard
    if (user?.role === "admin") {
      navigate("/admin/dashboard", { replace: true });
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!user) {
    return (
      <div className={styles.container}>
        <h1>Trang chủ</h1>
        <p>Không tìm thấy thông tin user. Vui lòng đăng nhập lại.</p>
      </div>
    );
  }

  // Nếu là admin, không hiển thị trang này (sẽ redirect)
  if (user.role === "admin") {
    return null;
  }

  return (
    <div className={styles.container}>
      <h1>Trang chủ</h1>
      <div>
        <h2>Chào mừng, {user.name || "User"}!</h2>
        <p>Email: {user.email}</p>
      </div>
    </div>
  );
};
