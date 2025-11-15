import React from "react";
import { useLocation } from "react-router-dom";
import AppRouter from "./router";
import Header from "./components/common/Header/Header";
import Footer from "./components/common/Footer/Footer";
import styles from "./App.module.css";

function App() {
  const location = useLocation();
  const isAuthPage =
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname === "/forgot-password" ||
    location.pathname.startsWith("/reset-password") ||
    location.pathname === "/admin/login";

  // Kiểm tra trang admin (trừ login) - layout được xử lý trong từng component
  const isAdminPage = location.pathname.startsWith("/admin");
  const isAdminLoginPage = location.pathname === "/admin/login";

  // Kiểm tra trang exam take - ẩn footer
  const isExamTakePage =
    location.pathname.includes("/exams/") &&
    location.pathname.includes("/take");

  return (
    <div className={styles.app}>
      {!isAuthPage && <Header />}
      <main className={styles.main}>
        <AppRouter />
      </main>
      {!isAuthPage && !isExamTakePage && <Footer />}
    </div>
  );
}

export default App;
