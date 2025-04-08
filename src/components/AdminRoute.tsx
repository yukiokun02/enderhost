
import { Navigate } from "react-router-dom";
import PageTransition from "./PageTransition";

interface AdminRouteProps {
  children: React.ReactNode;
}

export default function AdminRoute({ children }: AdminRouteProps) {
  // Check if user is authenticated from sessionStorage
  const isAuthenticated = sessionStorage.getItem("admin_authenticated") === "true";

  if (!isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <PageTransition>
      {children}
    </PageTransition>
  );
}
