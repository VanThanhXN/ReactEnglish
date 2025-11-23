import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Home } from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import ForgotPassword from "../pages/ForgotPassword/ForgotPassword";
import ResetPassword from "../pages/ResetPassword/ResetPassword";
import ComingSoon from "../components/common/ComingSoon/ComingSoon";

// Protected Route Components
import AdminProtectedRoute from "../components/common/ProtectedRoute/AdminProtectedRoute";

// Admin Pages
import AdminLogin from "../pages/admin/Login/Login";
import AdminDashboard from "../pages/admin/Dashboard/Dashboard";
import AdminUsers from "../pages/admin/Users/Users";
import AdminUserDetail from "../pages/admin/Users/UserDetail";
import AdminCourses from "../pages/admin/Courses/Courses";
import AdminCourseDetail from "../pages/admin/Courses/CourseDetail";
import AdminExams from "../pages/admin/Exams/Exams";
import AdminExamDetail from "../pages/admin/Exams/ExamDetail";
import AdminQuestions from "../pages/admin/Exams/Questions";
import AdminBlog from "../pages/admin/Blog/Blog";

// User Pages - Lazy load
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
const Progress = React.lazy(() => import("../pages/Progress/Progress"));

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

        {/* User Routes - Public, ai cũng vào được */}
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:id" element={<CourseDetail />} />
        <Route path="/exams" element={<Exams />} />
        <Route path="/exams/:id" element={<ExamDetail />} />
        <Route path="/exams/:id/take" element={<ExamTake />} />
        <Route path="/exams/:id/result" element={<ExamResult />} />
        <Route path="/flashcards" element={<Flashcards />} />
        <Route path="/flashcards/:id" element={<FlashcardDetail />} />
        <Route path="/flashcards/:id/practice" element={<FlashcardPractice />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />

        {/* Admin Routes - Chỉ cho phép admin */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <AdminProtectedRoute>
              <AdminUsers />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/users/:id"
          element={
            <AdminProtectedRoute>
              <AdminUserDetail />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/courses"
          element={
            <AdminProtectedRoute>
              <AdminCourses />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/courses/:id"
          element={
            <AdminProtectedRoute>
              <AdminCourseDetail />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/exams"
          element={
            <AdminProtectedRoute>
              <AdminExams />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/exams/:id"
          element={
            <AdminProtectedRoute>
              <AdminExamDetail />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/exams/:examId/questions"
          element={
            <AdminProtectedRoute>
              <AdminQuestions />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/blog"
          element={
            <AdminProtectedRoute>
              <AdminBlog />
            </AdminProtectedRoute>
          }
        />

        {/* 404 - Catch all */}
        <Route path="*" element={<ComingSoon />} />
      </Routes>
    </React.Suspense>
  );
};

export default AppRouter;
