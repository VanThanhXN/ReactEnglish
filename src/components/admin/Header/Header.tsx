import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { getUser, isAuthenticated } from "../../../utils/storage";
import { logout } from "../../../services/authService";
import type { User } from "../../../types/api";
import styles from "./Header.module.css";

const AdminHeader: React.FC = () => {
  const navigate = useNavigate();
  const user: User | null = getUser();
  const authenticated = isAuthenticated();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.leftSection}>
          <Link to="/admin/dashboard" className={styles.logo}>
            TT ENGLISH - Admin
          </Link>
        </div>

        <div className={styles.rightSection}>
          {authenticated && user ? (
            <div className={styles.userSection}>
              <div className={styles.userInfo}>
                <div className={styles.userAvatar}>
                  {user.name?.charAt(0).toUpperCase() || "A"}
                </div>
                <div className={styles.userDetails}>
                  <div className={styles.userName}>{user.name || "Admin"}</div>
                  <div className={styles.userRole}>Administrator</div>
                </div>
              </div>
              <button onClick={handleLogout} className={styles.logoutButton}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                <span>Đăng xuất</span>
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;

