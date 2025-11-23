import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated, getUser } from "../../../utils/storage";
import type { User } from "../../../types/api";

interface UserProtectedRouteProps {
  children: React.ReactElement;
}

/**
 * Component để bảo vệ các routes chỉ dành cho user (không phải admin)
 * - Nếu là admin: redirect về /admin/dashboard
 * - Nếu chưa đăng nhập: có thể cho phép truy cập (public routes) hoặc redirect về /login
 * - Nếu là user: cho phép truy cập
 */
const UserProtectedRoute: React.FC<UserProtectedRouteProps> = ({
  children,
}) => {
  const [isChecking, setIsChecking] = useState(true);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [redirectTo, setRedirectTo] = useState<string>("/login");

  useEffect(() => {
    const checkAuth = () => {
      if (isAuthenticated()) {
        const user: User | null = getUser();
        if (user && user.role === "admin") {
          // Là admin, không cho phép truy cập user routes
          setShouldRedirect(true);
          setRedirectTo("/admin/dashboard");
          setIsChecking(false);
          return;
        }
      }

      // Không phải admin, cho phép truy cập (có thể là user hoặc chưa đăng nhập)
      setShouldRedirect(false);
      setIsChecking(false);
    };

    checkAuth();
  }, []);

  if (isChecking) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <div>Đang kiểm tra quyền truy cập...</div>
      </div>
    );
  }

  if (shouldRedirect) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

export default UserProtectedRoute;

