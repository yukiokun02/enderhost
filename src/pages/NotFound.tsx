
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
    <div className="min-h-screen flex items-center justify-center"> {/* Removed bg-gray-100 */}
      <div className="text-center p-4 rounded-lg bg-black/20 backdrop-blur-sm"> {/* Optional: add a subtle card for content */}
        <h1 className="text-4xl md:text-5xl font-bold mb-4 font-minecraft text-white">404</h1>
        <p className="text-lg md:text-xl text-gray-300 mb-6 font-minecraft">Oops! Page not found.</p>
        <a 
          href="/" 
          className="text-minecraft-secondary hover:text-minecraft-accent underline font-minecraft text-lg transition-colors duration-200"
        >
          Back to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
