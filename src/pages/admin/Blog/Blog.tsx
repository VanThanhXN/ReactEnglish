import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUser, isAuthenticated } from "../../../utils/storage";
import AdminLayout from "../../../components/admin/Layout/Layout";
import type { User } from "../../../types/api";
import styles from "./Blog.module.css";

const AdminBlog: React.FC = () => {
  const navigate = useNavigate();
  const currentUser: User | null = getUser();

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
  }, [navigate, currentUser]);

  if (!currentUser || currentUser.role !== "admin") {
    return null;
  }

  return (
    <AdminLayout>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Quản lý bài viết</h1>
        </div>
        <div className={styles.content}>
          <p className={styles.message}>Trang quản lý bài viết đang được phát triển.</p>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminBlog;



