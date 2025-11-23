import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getUser } from "../../../utils/storage";
import { getAllUsers, getAllExams } from "../../../services/adminService";
import AdminLayout from "../../../components/admin/Layout/Layout";
import type { User } from "../../../types/api";
import styles from "./Dashboard.module.css";

const AdminDashboard: React.FC = () => {
  const currentUser: User | null = getUser();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalExams: 0,
    totalCourses: 0,
    totalBlogs: 0,
  });
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([
    { name: "Tháng 1", value: 0 },
    { name: "Tháng 2", value: 0 },
    { name: "Tháng 3", value: 0 },
    { name: "Tháng 4", value: 0 },
    { name: "Tháng 5", value: 0 },
    { name: "Tháng 6", value: 0 },
  ]);

  useEffect(() => {
    // Lấy tất cả thống kê
    fetchDashboardStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Chỉ chạy 1 lần khi component mount

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      
      // Fetch users
      try {
        const usersResponse = await getAllUsers();
        if (usersResponse.status === "success" && usersResponse.data?.users) {
          setStats((prev) => ({ ...prev, totalUsers: usersResponse.data!.users.length }));
        }
      } catch (err) {
        console.error("Lỗi khi lấy số lượng users:", err);
      }

      // Fetch exams
      try {
        const examsResponse = await getAllExams();
        if (examsResponse.success || examsResponse.status === "success") {
          const exams = examsResponse.data?.exams || (Array.isArray(examsResponse.data) ? examsResponse.data : []);
          setStats((prev) => ({ ...prev, totalExams: exams.length }));
        }
      } catch (err) {
        console.error("Lỗi khi lấy số lượng exams:", err);
      }

      // Courses và Blogs tạm thời để 0, có thể thêm API sau
      setStats((prev) => ({ ...prev, totalCourses: 0, totalBlogs: 0 }));

      // Tạo dữ liệu biểu đồ (mock data - có thể thay bằng API thực tế)
      setChartData([
        { name: "Tháng 1", value: Math.floor(Math.random() * 50) + 10 },
        { name: "Tháng 2", value: Math.floor(Math.random() * 50) + 15 },
        { name: "Tháng 3", value: Math.floor(Math.random() * 50) + 20 },
        { name: "Tháng 4", value: Math.floor(Math.random() * 50) + 25 },
        { name: "Tháng 5", value: Math.floor(Math.random() * 50) + 30 },
        { name: "Tháng 6", value: Math.floor(Math.random() * 50) + 35 },
      ]);
    } catch (err) {
      console.error("Lỗi khi lấy thống kê:", err);
    } finally {
      setLoading(false);
    }
  };

  const maxChartValue = Math.max(...chartData.map(d => d.value), 1);

  return (
    <AdminLayout>
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Bảng điều khiển Admin</h1>
            <p className={styles.subtitle}>
              Chào mừng, {currentUser?.name || "Admin"}!
            </p>
          </div>
        </div>

        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIconWrapper}>
              <div className={styles.statIcon}>
                <svg
                  width="24"
                  height="24"
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
            </div>
            <div className={styles.statContent}>
              <div className={styles.statValue}>
                {loading ? "..." : stats.totalUsers}
              </div>
              <div className={styles.statLabel}>Tổng người dùng</div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIconWrapper}>
              <div className={styles.statIcon}>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 1-3-3V7a3 3 0 0 0-3-3H2z"></path>
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 0 3 3h7V7a3 3 0 0 0-3-3z"></path>
                </svg>
              </div>
            </div>
            <div className={styles.statContent}>
              <div className={styles.statValue}>{stats.totalCourses}</div>
              <div className={styles.statLabel}>Khóa học</div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIconWrapper}>
              <div className={styles.statIcon}>
                <svg
                  width="24"
                  height="24"
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
            </div>
            <div className={styles.statContent}>
              <div className={styles.statValue}>{stats.totalExams}</div>
              <div className={styles.statLabel}>Đề thi</div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIconWrapper}>
              <div className={styles.statIcon}>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                </svg>
              </div>
            </div>
            <div className={styles.statContent}>
              <div className={styles.statValue}>{stats.totalBlogs}</div>
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

          <Link to="/admin/courses" className={styles.actionCard}>
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
          </Link>

          <Link to="/admin/exams" className={styles.actionCard}>
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
          </Link>

          <Link to="/admin/blog" className={styles.actionCard}>
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
          </Link>
        </div>

        {/* Chart Section */}
        <div className={styles.chartSection}>
          <h2 className={styles.chartTitle}>Thống kê người dùng đăng ký (6 tháng gần nhất)</h2>
          <div className={styles.chartContainer}>
            <div className={styles.chart}>
              {chartData.map((item, index) => {
                const height = (item.value / maxChartValue) * 100;
                return (
                  <div key={index} className={styles.chartBarContainer}>
                    <div className={styles.chartBarWrapper}>
                      <div
                        className={styles.chartBar}
                        style={{ height: `${height}%` }}
                        title={`${item.name}: ${item.value} người dùng`}
                      >
                        <span className={styles.chartBarValue}>{item.value}</span>
                      </div>
                    </div>
                    <div className={styles.chartBarLabel}>{item.name}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
