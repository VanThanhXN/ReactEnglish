import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import UserLogin from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import ForgotPassword from "../pages/ForgotPassword/ForgotPassword";
import ResetPassword from "../pages/ResetPassword/ResetPassword";
import { Home } from "../pages/Home/Home";
import Settings from "../pages/Settings/Settings";
import Profile from "../pages/Profile/Profile";
import AdminLogin from "../pages/admin/Login/Login";
import AdminDashboard from "../pages/admin/Dashboard/Dashboard";
import AdminUsers from "../pages/admin/Users/Users";
import AdminCourses from "../pages/admin/Courses/Courses";
import AdminExams from "../pages/admin/Exams/Exams";
import AdminExamDetail from "../pages/admin/Exams/ExamDetail";
import AdminBlog from "../pages/admin/Blog/Blog";
import AdminUserDetail from "../pages/admin/Users/UserDetail";
import ComingSoon from "../components/common/ComingSoon/ComingSoon";

const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<UserLogin />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/dashboard" element={<Home />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/users" element={<AdminUsers />} />
      <Route path="/admin/users/:id" element={<AdminUserDetail />} />
      <Route path="/admin/courses" element={<AdminCourses />} />
      <Route path="/admin/exams" element={<AdminExams />} />
      <Route path="/admin/exams/:id" element={<AdminExamDetail />} />
      <Route path="/admin/blog" element={<AdminBlog />} />
      <Route
        path="/courses"
        element={<ComingSoon title="Khóa học" description="Trang khóa học đang được phát triển. Sẽ sớm có mặt!" />}
      />
      <Route
        path="/practice"
        element={<ComingSoon title="Luyện tập" description="Trang luyện tập đang được phát triển. Sẽ sớm có mặt!" />}
      />
      <Route
        path="/progress"
        element={<ComingSoon title="Tiến độ" description="Trang tiến độ đang được phát triển. Sẽ sớm có mặt!" />}
      />
      <Route
        path="/exams"
        element={<ComingSoon title="Đề thi" description="Trang đề thi đang được phát triển. Sẽ sớm có mặt!" />}
      />
      <Route
        path="/blog"
        element={<ComingSoon title="Bài viết" description="Trang bài viết đang được phát triển. Sẽ sớm có mặt!" />}
      />
      <Route
        path="/flatcar"
        element={<ComingSoon title="Flashcard" description="Trang flashcard đang được phát triển. Sẽ sớm có mặt!" />}
      />
      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRouter;
