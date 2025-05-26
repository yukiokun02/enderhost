
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4 font-minecraft">404</h1>
        <p className="text-lg text-gray-600 mb-4 font-minecraft">Page not found</p>
        <a href="/" className="text-blue-500 hover:text-blue-700 underline font-minecraft">
          Back Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
