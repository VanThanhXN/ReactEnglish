import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getUser, isAuthenticated } from "../../../utils/storage";
import { logout } from "../../../services/authService";
import type { User } from "../../../types/api";
import styles from "./Header.module.css";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [menuOpenedFrom, setMenuOpenedFrom] = useState<
    "hamburger" | "user" | null
  >(null);
  const user: User | null = getUser();
  const authenticated = isAuthenticated();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(target) &&
        hamburgerRef.current &&
        !hamburgerRef.current.contains(target) &&
        userMenuRef.current &&
        !userMenuRef.current.contains(target)
      ) {
        setShowUserMenu(false);
        setMenuOpenedFrom(null);
      }
    };

    if (showUserMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showUserMenu]);

  const handleCloseMenu = () => {
    setShowUserMenu(false);
    setMenuOpenedFrom(null);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
    handleCloseMenu();
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.leftSection}>
          {authenticated && (
            <button
              ref={hamburgerRef}
              className={styles.hamburger}
              onClick={(e) => {
                e.stopPropagation();
                if (showUserMenu && menuOpenedFrom === "hamburger") {
                  setShowUserMenu(false);
                  setMenuOpenedFrom(null);
                } else {
                  setMenuOpenedFrom("hamburger");
                  setShowUserMenu(true);
                }
              }}
              aria-label="Menu"
              aria-expanded={showUserMenu && menuOpenedFrom === "hamburger"}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
          )}
          <Link to="/dashboard" className={styles.logo}>
            TT ENGLISH
          </Link>
          {authenticated && (
            <nav className={styles.nav}>
              <Link to="/dashboard" className={styles.navLink}>
                Trang chủ
              </Link>
              <Link to="/courses" className={styles.navLink}>
                Khóa học
              </Link>
              <Link to="/practice" className={styles.navLink}>
                Luyện tập
              </Link>
              <Link to="/progress" className={styles.navLink}>
                Tiến độ
              </Link>
              <Link to="/exams" className={styles.navLink}>
                Đề thi
              </Link>
              <Link to="/blog" className={styles.navLink}>
                Bài viết
              </Link>
              <Link to="/flatcar" className={styles.navLink}>
                Flashcard
              </Link>
            </nav>
          )}
        </div>

        <div className={styles.rightSection}>
          {authenticated ? (
            <div className={styles.userSection}>
              <div
                ref={userMenuRef}
                className={styles.userMenu}
                onClick={(e) => {
                  e.stopPropagation();
                  if (showUserMenu && menuOpenedFrom === "user") {
                    setShowUserMenu(false);
                    setMenuOpenedFrom(null);
                  } else {
                    setMenuOpenedFrom("user");
                    setShowUserMenu(true);
                  }
                }}
              >
                <div className={styles.userAvatar}>
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <span className={styles.userName}>
                  {user?.name || "Người dùng"}
                </span>
                <svg
                  className={`${styles.chevron} ${showUserMenu ? styles.chevronOpen : ""}`}
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>
            </div>
          ) : (
            <div className={styles.authButtons}>
              <Link to="/login" className={styles.loginBtn}>
                Đăng nhập
              </Link>
              <Link to="/register" className={styles.registerBtn}>
                Đăng ký
              </Link>
            </div>
          )}
        </div>

        {/* Dropdown menu - đặt ở level container để dễ điều chỉnh vị trí */}
        {authenticated && showUserMenu && (
          <div
            className={`${styles.dropdown} ${
              menuOpenedFrom === "hamburger"
                ? styles.dropdownLeft
                : styles.dropdownRight
            }`}
            ref={dropdownRef}
          >
            <div className={styles.dropdownItem}>
              <div className={styles.userInfo}>
                <div className={styles.userInfoName}>{user?.name}</div>
                <div className={styles.userInfoEmail}>{user?.email}</div>
              </div>
            </div>
            <div className={styles.dropdownDivider}></div>

            {/* Mobile Navigation Links - chỉ hiển thị khi mở từ hamburger hoặc trên mobile */}
            <div
              className={`${styles.mobileNav} ${menuOpenedFrom === "hamburger" ? styles.mobileNavVisible : ""}`}
            >
              <Link
                to="/dashboard"
                className={styles.dropdownItem}
                onClick={handleCloseMenu}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
                Trang chủ
              </Link>
              <Link
                to="/courses"
                className={styles.dropdownItem}
                onClick={handleCloseMenu}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 1-3-3V7a3 3 0 0 0-3-3H2z"></path>
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 0 3 3h7V7a3 3 0 0 0-3-3z"></path>
                </svg>
                Khóa học
              </Link>
              <Link
                to="/practice"
                className={styles.dropdownItem}
                onClick={handleCloseMenu}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
                Luyện tập
              </Link>
              <Link
                to="/progress"
                className={styles.dropdownItem}
                onClick={handleCloseMenu}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                </svg>
                Tiến độ
              </Link>
              <Link
                to="/exams"
                className={styles.dropdownItem}
                onClick={handleCloseMenu}
              >
                <svg
                  width="16"
                  height="16"
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
                Đề thi
              </Link>
              <Link
                to="/blog"
                className={styles.dropdownItem}
                onClick={handleCloseMenu}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                </svg>
                Bài viết
              </Link>
              <Link
                to="/flatcar"
                className={styles.dropdownItem}
                onClick={handleCloseMenu}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="3" y1="9" x2="21" y2="9"></line>
                  <line x1="9" y1="21" x2="9" y2="9"></line>
                </svg>
                Flashcard
              </Link>
              <div className={styles.dropdownDivider}></div>
            </div>

            <Link
              to="/profile"
              className={styles.dropdownItem}
              onClick={handleCloseMenu}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              Hồ sơ
            </Link>
            <Link
              to="/settings"
              className={styles.dropdownItem}
              onClick={handleCloseMenu}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M12 1v6m0 6v6m9-9h-6m-6 0H3"></path>
              </svg>
              Cài đặt
            </Link>
            <div className={styles.dropdownDivider}></div>
            <button className={styles.dropdownItem} onClick={handleLogout}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              Đăng xuất
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
