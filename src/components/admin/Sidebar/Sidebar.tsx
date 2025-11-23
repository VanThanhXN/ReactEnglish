import React, { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getUser } from "../../../utils/storage";
import { logout } from "../../../services/authService";
import type { User } from "../../../types/api";
import styles from "./Sidebar.module.css";

interface AdminSidebarProps {
  onNavigate?: () => void;
  onToggle?: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ onNavigate, onToggle }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const user: User | null = getUser();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const menuItems = [
    {
      path: "/admin/dashboard",
      label: "Bảng điều khiển",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7"></rect>
          <rect x="14" y="3" width="7" height="7"></rect>
          <rect x="14" y="14" width="7" height="7"></rect>
          <rect x="3" y="14" width="7" height="7"></rect>
        </svg>
      ),
    },
    {
      path: "/admin/users",
      label: "Quản lý người dùng",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      ),
    },
    {
      path: "/admin/courses",
      label: "Quản lý khóa học",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 1-3-3V7a3 3 0 0 0-3-3H2z"></path>
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 0 3 3h7V7a3 3 0 0 0-3-3z"></path>
        </svg>
      ),
    },
    {
      path: "/admin/exams",
      label: "Quản lý đề thi",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
        </svg>
      ),
    },
    {
      path: "/admin/blog",
      label: "Quản lý bài viết",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
        </svg>
      ),
    },
  ];

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <div className={styles.logo}>
          <span className={styles.logoText}>TT ENGLISH</span>
          <span className={styles.logoSubtext}>Admin</span>
        </div>
      </div>

      <div className={styles.userSection}>
        <div className={styles.userAvatar}>
          {user?.name?.charAt(0).toUpperCase() || "A"}
        </div>
        <div className={styles.userInfo}>
          <div className={styles.userName}>{user?.name || "Admin"}</div>
          <div className={styles.userRole}>Administrator</div>
        </div>
      </div>

      <nav className={styles.nav}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`${styles.navItem} ${isActive ? styles.navItemActive : ""}`}
              onClick={() => {
                // Đóng sidebar khi click vào menu item trên mobile
                if (window.innerWidth <= 768 && onNavigate) {
                  onNavigate();
                }
              }}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              <span className={styles.navLabel}>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className={styles.footer}>
        <button onClick={handleLogout} className={styles.logoutButton}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          <span>Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;

