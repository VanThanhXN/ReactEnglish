import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getUser, isAuthenticated } from "../../../utils/storage";
import { getAllUsers } from "../../../services/adminService";
import AdminLayout from "../../../components/admin/Layout/Layout";
import type { User } from "../../../types/api";
import styles from "./Dashboard.module.css";

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const currentUser: User | null = getUser();
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);

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

    // Lấy số lượng users - chỉ load 1 lần khi component mount (khi refresh trình duyệt)
    fetchUsersCount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Chỉ chạy 1 lần khi component mount

  const fetchUsersCount = async () => {
    try {
      setLoading(true);
      const response = await getAllUsers();
      if (response.status === "success" && response.data?.users) {
        setTotalUsers(response.data.users.length);
      }
    } catch (err) {
      console.error("Lỗi khi lấy số lượng users:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser || currentUser.role !== "admin") {
    return null;
  }

  return (
    <AdminLayout>
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Bảng điều khiển Admin</h1>
            <p className={styles.subtitle}>
              Chào mừng, {currentUser.name || "Admin"}!
            </p>
          </div>
        </div>

        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <div className={styles.statContent}>
              <div className={styles.statValue}>
                {loading ? "..." : totalUsers}
              </div>
              <div className={styles.statLabel}>Tổng người dùng</div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 1-3-3V7a3 3 0 0 0-3-3H2z"></path>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 0 3 3h7V7a3 3 0 0 0-3-3z"></path>
              </svg>
            </div>
            <div className={styles.statContent}>
              <div className={styles.statValue}>0</div>
              <div className={styles.statLabel}>Khóa học</div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
              </svg>
            </div>
            <div className={styles.statContent}>
              <div className={styles.statValue}>0</div>
              <div className={styles.statLabel}>Đề thi</div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
              </svg>
            </div>
            <div className={styles.statContent}>
              <div className={styles.statValue}>0</div>
              <div className={styles.statLabel}>Bài viết</div>
            </div>
          </div>
        </div>

        <div className={styles.actionsGrid}>
          <Link to="/admin/users" className={styles.actionCard}>
            <div className={styles.actionIcon}>
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <h3 className={styles.actionTitle}>Quản lý người dùng</h3>
            <p className={styles.actionDescription}>
              Xem, thêm, sửa và xóa người dùng trong hệ thống
            </p>
          </Link>

          <div className={styles.actionCard}>
            <div className={styles.actionIcon}>
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 1-3-3V7a3 3 0 0 0-3-3H2z"></path>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 0 3 3h7V7a3 3 0 0 0-3-3z"></path>
              </svg>
            </div>
            <h3 className={styles.actionTitle}>Quản lý khóa học</h3>
            <p className={styles.actionDescription}>
              Tạo và quản lý các khóa học trên nền tảng
            </p>
          </div>

          <div className={styles.actionCard}>
            <div className={styles.actionIcon}>
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
              </svg>
            </div>
            <h3 className={styles.actionTitle}>Quản lý đề thi</h3>
            <p className={styles.actionDescription}>
              Tạo và quản lý các đề thi cho người dùng
            </p>
          </div>

          <div className={styles.actionCard}>
            <div className={styles.actionIcon}>
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
              </svg>
            </div>
            <h3 className={styles.actionTitle}>Quản lý bài viết</h3>
            <p className={styles.actionDescription}>
              Đăng và quản lý các bài viết trên blog
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
