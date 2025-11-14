import React, { useState, useEffect } from "react";
import AdminSidebar from "../Sidebar/Sidebar";
import styles from "./Layout.module.css";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Trên desktop, sidebar luôn mở; trên mobile, mặc định đóng
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    // Set initial state dựa trên kích thước màn hình hiện tại
    if (window.innerWidth > 768) {
      setSidebarOpen(true);
    } else {
      setSidebarOpen(false);
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    if (window.innerWidth <= 768) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className={styles.layout}>
      {sidebarOpen && window.innerWidth <= 768 && (
        <div className={styles.overlay} onClick={closeSidebar}></div>
      )}
      <div className={`${styles.sidebarWrapper} ${sidebarOpen ? styles.sidebarOpen : ""}`}>
        <AdminSidebar />
      </div>
      <div className={styles.mainContent}>
        <div className={styles.topBar}>
          <button className={styles.menuToggle} onClick={toggleSidebar} aria-label="Toggle menu">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>
        <div className={styles.content}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;

