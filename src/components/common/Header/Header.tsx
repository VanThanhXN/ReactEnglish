import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getUser, isAuthenticated, clearAuth } from "../../../utils/storage";
import { logout } from "../../../services/authService";
import type { User } from "../../../types/api";
import styles from "./Header.module.css";

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);
  const user: User | null = getUser();
  const authenticated = isAuthenticated();

  // Đóng menu khi route thay đổi
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await logout();
      clearAuth();
      setUserMenuOpen(false);
      setMobileMenuOpen(false);
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      clearAuth();
      navigate("/login");
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    // Blur button khi đóng menu để loại bỏ focus state
    if (mobileMenuOpen && mobileMenuButtonRef.current) {
      setTimeout(() => {
        mobileMenuButtonRef.current?.blur();
      }, 100);
    }
  };

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  const closeMenus = () => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
    // Blur button khi đóng menu
    if (mobileMenuButtonRef.current) {
      setTimeout(() => {
        mobileMenuButtonRef.current?.blur();
      }, 100);
    }
  };

  const isActive = (path: string) => {
    if (path === "/dashboard") {
      return location.pathname === "/dashboard" || location.pathname === "/";
    }
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  const navLinks = [
    { path: "/dashboard", label: "Trang chủ" },
    { path: "/courses", label: "Khóa học" },
    { path: "/exams", label: "Đề thi" },
    { path: "/flashcards", label: "Flashcard" },
    { path: "/progress", label: "Tiến độ" },
    { path: "/blog", label: "Bài viết" },
  ];

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Mobile Menu Button - Hiển thị trước logo trên mobile */}
        <button
          ref={mobileMenuButtonRef}
          className={styles.mobileMenuButton}
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
          aria-expanded={mobileMenuOpen}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            {mobileMenuOpen ? (
              <path d="M18 6L6 18M6 6l12 12" />
            ) : (
              <path d="M3 12h18M3 6h18M3 18h18" />
            )}
          </svg>
        </button>

        {/* Logo */}
        <Link to="/dashboard" className={styles.logo}>
          TT ENGLISH
        </Link>

        {/* Desktop Navigation */}
        <nav className={styles.nav}>
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`${styles.navLink} ${isActive(link.path) ? styles.active : ""}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Section */}
        <div className={styles.rightSection}>
          {/* Auth Buttons (Desktop) - Chỉ hiển thị Login */}
          {!authenticated && (
            <div className={styles.authButtons}>
              <Link to="/login" className={styles.loginBtn}>
                Đăng nhập
              </Link>
            </div>
          )}

          {/* User Menu (Desktop) */}
          {authenticated && user && (
            <div className={styles.userSection}>
              <button
                className={styles.userButton}
                onClick={toggleUserMenu}
                aria-label="User menu"
              >
                <div className={styles.userAvatar}>
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <span className={styles.userName}>{user.name || "User"}</span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className={`${styles.chevronIcon} ${userMenuOpen ? styles.rotated : ""}`}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {userMenuOpen && (
                <>
                  <div className={styles.overlay} onClick={closeMenus} />
                  <div className={styles.userDropdown}>
                    <Link
                      to="/profile"
                      className={styles.dropdownItem}
                      onClick={closeMenus}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                      <span>Hồ sơ</span>
                    </Link>
                    <Link
                      to="/settings"
                      className={styles.dropdownItem}
                      onClick={closeMenus}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <circle cx="12" cy="12" r="3" />
                        <path d="M12 1v6m0 6v6M5.64 5.64l4.24 4.24m8.48 0l-4.24-4.24M1 12h6m6 0h6" />
                      </svg>
                      <span>Cài đặt</span>
                    </Link>
                    <div className={styles.dropdownDivider} />
                    <button
                      className={styles.dropdownItem}
                      onClick={handleLogout}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                      </svg>
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Mobile Avatar - Chỉ hiển thị hình ảnh */}
          {authenticated && user && (
            <div className={styles.mobileAvatarOnly}>
              <div className={styles.userAvatar}>
                {user.name?.charAt(0).toUpperCase() || "U"}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <>
          <div className={styles.mobileOverlay} onClick={closeMenus} />
          <div className={styles.mobileNav}>
            {/* Navigation Links */}
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`${styles.mobileNavLink} ${isActive(link.path) ? styles.active : ""}`}
                onClick={closeMenus}
              >
                {link.label}
              </Link>
            ))}

            {/* Auth Buttons (Mobile) - Chỉ hiển thị Login */}
            {!authenticated && (
              <div className={styles.mobileAuthButtons}>
                <Link
                  to="/login"
                  className={styles.mobileLoginBtn}
                  onClick={closeMenus}
                >
                  Đăng nhập
                </Link>
              </div>
            )}

            {/* User Actions (Mobile) - Chỉ hiển thị actions, không có avatar/name */}
            {authenticated && user && (
              <div className={styles.mobileUserActions}>
                <Link
                  to="/profile"
                  className={styles.mobileUserAction}
                  onClick={closeMenus}
                >
                  Hồ sơ
                </Link>
                <Link
                  to="/settings"
                  className={styles.mobileUserAction}
                  onClick={closeMenus}
                >
                  Cài đặt
                </Link>
                <button
                  className={styles.mobileUserAction}
                  onClick={handleLogout}
                >
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </header>
  );
};

export default Header;
