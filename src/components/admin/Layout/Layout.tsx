import React, { useState, useEffect } from "react";
import AdminSidebar from "../Sidebar/Sidebar";
import styles from "./Layout.module.css";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  // Khởi tạo sidebarOpen dựa trên kích thước màn hình ban đầu
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth > 768;
    }
    return false;
  });

  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth <= 768;
    }
    return false;
  });

  // Chỉ detect mobile/desktop khi resize, không tự động đóng/mở sidebar
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
    };

    // Kiểm tra ngay khi component mount
    handleResize();

    // Lắng nghe sự kiện resize
    window.addEventListener("resize", handleResize);
    
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className={styles.layout}>
      {sidebarOpen && isMobile && (
        <div className={styles.overlay} onClick={closeSidebar}></div>
      )}
      <div className={`${styles.sidebarWrapper} ${sidebarOpen ? styles.sidebarOpen : ""}`}>
        <AdminSidebar onNavigate={closeSidebar} onToggle={toggleSidebar} />
      </div>
      <div className={`${styles.mainContent} ${!sidebarOpen ? styles.sidebarClosed : ""}`}>
        <div className={styles.topBar}>
          <button className={styles.menuToggle} onClick={toggleSidebar} aria-label="Toggle sidebar">
            {sidebarOpen ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            )}
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

