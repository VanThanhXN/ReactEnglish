import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated, getUser } from "../../../utils/storage";
import type { User } from "../../../types/api";

interface AdminProtectedRouteProps {
  children: React.ReactElement;
}

/**
 * Component để bảo vệ các routes chỉ dành cho admin
 * - Nếu chưa đăng nhập: redirect về /admin/login
 * - Nếu đã đăng nhập nhưng không phải admin: redirect về /admin/login và xóa auth
 * - Nếu là admin: cho phép truy cập
 */
const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({
  children,
}) => {
  const [isChecking, setIsChecking] = useState(true);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [redirectTo, setRedirectTo] = useState<string>("/admin/login");

  useEffect(() => {
    const checkAuth = () => {
      if (!isAuthenticated()) {
        // Chưa đăng nhập
        setShouldRedirect(true);
        setRedirectTo("/admin/login");
        setIsChecking(false);
        return;
      }

      const user: User | null = getUser();
      if (!user || user.role !== "admin") {
        // Đã đăng nhập nhưng không phải admin
        // Không xóa auth ở đây vì có thể user đang ở trang user
        setShouldRedirect(true);
        setRedirectTo("/admin/login");
        setIsChecking(false);
        return;
      }

      // Là admin, cho phép truy cập
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

export default AdminProtectedRoute;

