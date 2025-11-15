import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Home } from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import ForgotPassword from "../pages/ForgotPassword/ForgotPassword";
import ResetPassword from "../pages/ResetPassword/ResetPassword";
import ComingSoon from "../components/common/ComingSoon/ComingSoon";

// Admin Pages
import AdminLogin from "../pages/admin/Login/Login";
import AdminDashboard from "../pages/admin/Dashboard/Dashboard";
import AdminUsers from "../pages/admin/Users/Users";
import AdminUserDetail from "../pages/admin/Users/UserDetail";
import AdminCourses from "../pages/admin/Courses/Courses";
import AdminExams from "../pages/admin/Exams/Exams";
import AdminExamDetail from "../pages/admin/Exams/ExamDetail";
import AdminBlog from "../pages/admin/Blog/Blog";

// User Pages - Lazy load hoặc import trực tiếp
// Note: Các pages này có thể chưa tồn tại, sẽ cần tạo sau
const Exams = React.lazy(() => import("../pages/Exams/Exams"));
const ExamDetail = React.lazy(() => import("../pages/Exams/ExamDetail"));
const ExamTake = React.lazy(() => import("../pages/Exams/ExamTake"));
const ExamResult = React.lazy(() => import("../pages/Exams/ExamResult"));
const Flashcards = React.lazy(() => import("../pages/Flashcards/Flashcards"));
const FlashcardDetail = React.lazy(
  () => import("../pages/Flashcards/FlashcardDetail")
);
const FlashcardPractice = React.lazy(
  () => import("../pages/Flashcards/FlashcardPractice")
);
const Blog = React.lazy(() => import("../pages/Blog/Blog"));
const Courses = React.lazy(() => import("../pages/Courses/Courses"));
const CourseDetail = React.lazy(() => import("../pages/Courses/CourseDetail"));
const Profile = React.lazy(() => import("../pages/Profile/Profile"));
const Settings = React.lazy(() => import("../pages/Settings/Settings"));

const AppRouter: React.FC = () => {
  return (
    <React.Suspense
      fallback={
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
          }}
        >
          <div>Loading...</div>
        </div>
      }
    >
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* User Routes - Không cần authentication check, cho phép truy cập tự do */}
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:id" element={<CourseDetail />} />
        <Route path="/exams" element={<Exams />} />
        <Route path="/exams/:id" element={<ExamDetail />} />
        <Route path="/exams/:id/take" element={<ExamTake />} />
        <Route path="/exams/:id/result" element={<ExamResult />} />
        <Route path="/flatcar" element={<Flashcards />} />
        <Route path="/flatcar/:id" element={<FlashcardDetail />} />
        <Route path="/flatcar/:id/practice" element={<FlashcardPractice />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/progress" element={<ComingSoon />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/users/:id" element={<AdminUserDetail />} />
        <Route path="/admin/courses" element={<AdminCourses />} />
        <Route path="/admin/exams" element={<AdminExams />} />
        <Route path="/admin/exams/:id" element={<AdminExamDetail />} />
        <Route path="/admin/blog" element={<AdminBlog />} />

        {/* 404 - Catch all */}
        <Route path="*" element={<ComingSoon />} />
      </Routes>
    </React.Suspense>
  );
};

export default AppRouter;
