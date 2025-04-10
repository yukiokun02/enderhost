
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { checkAdminSession } from "@/lib/adminAuth";

// This component is now simplified to just check admin session and redirect if needed
const AdminToolbar = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    checkAdminStatus();
  }, [location.pathname]);

  const checkAdminStatus = () => {
    try {
      const isLoggedIn = checkAdminSession();
      setIsAdmin(isLoggedIn);
    } catch (error) {
      setIsAdmin(false);
      console.error("Error checking admin status:", error);
    }
  };

  // No UI rendered - the toolbar is removed in favor of dashboard integration
  return null;
};

export default AdminToolbar;
