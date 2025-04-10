
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { checkAdminSession, getCurrentAdmin } from "@/lib/adminAuth";

interface AdminContextType {
  isAdmin: boolean;
  isEditMode: boolean;
  toggleEditMode: () => void;
  editedContent: Record<string, string>;
  updateContent: (id: string, content: string) => void;
  saveChanges: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
}

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedContent, setEditedContent] = useState<Record<string, string>>({});

  useEffect(() => {
    const checkIfAdmin = () => {
      const isLoggedIn = checkAdminSession();
      if (isLoggedIn) {
        const admin = getCurrentAdmin();
        setIsAdmin(admin?.group === 'admin');
      } else {
        setIsAdmin(false);
        setIsEditMode(false);
      }
    };
    
    checkIfAdmin();
    
    // Check admin status periodically
    const interval = setInterval(checkIfAdmin, 30000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Load saved content from localStorage
  useEffect(() => {
    try {
      const savedContent = localStorage.getItem('enderhost-edited-content');
      if (savedContent) {
        setEditedContent(JSON.parse(savedContent));
      }
    } catch (error) {
      console.error("Error loading edited content:", error);
    }
  }, []);

  const toggleEditMode = () => {
    setIsEditMode(prev => !prev);
  };

  const updateContent = (id: string, content: string) => {
    setEditedContent(prev => ({
      ...prev,
      [id]: content
    }));
  };
  
  const saveChanges = () => {
    try {
      localStorage.setItem('enderhost-edited-content', JSON.stringify(editedContent));
      alert("All changes saved successfully!");
    } catch (error) {
      console.error("Error saving content:", error);
      alert("Error saving changes. Please try again.");
    }
  };

  return (
    <AdminContext.Provider 
      value={{ 
        isAdmin, 
        isEditMode, 
        toggleEditMode,
        editedContent,
        updateContent,
        saveChanges
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}
