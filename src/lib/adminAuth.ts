
import { toast } from "@/components/ui/use-toast";

export interface AdminUser {
  id: string;
  username: string;
  password: string;
  group: 'admin' | 'member';
  createdBy?: string;
  createdAt: number;
}

interface AdminSession {
  isLoggedIn: boolean;
  userId: string;
  username: string;
  group: 'admin' | 'member';
  timestamp: number;
  lastActivity: number;
}

interface ActivityLogEntry {
  id: string;
  userId: string;
  username: string;
  action: string;
  timestamp: number;
  ipAddress?: string;
}

const ADMIN_SESSION_KEY = 'adminSession';
const SESSION_TIMEOUT = 1600; // 1600 seconds = ~26.6 minutes
const API_BASE_URL = '/api';

// Check if admin session is valid
export function checkAdminSession(): boolean {
  try {
    const sessionData = localStorage.getItem(ADMIN_SESSION_KEY);
    if (!sessionData) return false;
    
    const session: AdminSession = JSON.parse(sessionData);
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    
    // Check if session has expired due to inactivity
    if (currentTime - session.lastActivity > SESSION_TIMEOUT) {
      localStorage.removeItem(ADMIN_SESSION_KEY);
      return false;
    }
    
    // Update last activity time
    updateLastActivity();
    
    return session.isLoggedIn;
  } catch (error) {
    console.error("Error checking admin session:", error);
    return false;
  }
}

// Update last activity timestamp
export function updateLastActivity(): void {
  try {
    const sessionData = localStorage.getItem(ADMIN_SESSION_KEY);
    if (!sessionData) return;
    
    const session: AdminSession = JSON.parse(sessionData);
    session.lastActivity = Math.floor(Date.now() / 1000); // Current time in seconds
    
    localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
  } catch (error) {
    console.error("Error updating last activity:", error);
  }
}

// Initialize default admin user if none exists
export function initializeAdminUsers(): void {
  try {
    // Make a request to the server to ensure default user exists
    fetch(`${API_BASE_URL}/admin/init-users.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .then(response => response.json())
    .then(data => {
      if (!data.success) {
        console.error("Error initializing admin users:", data.message);
      }
    })
    .catch(error => {
      console.error("Error initializing admin users:", error);
    });
  } catch (error) {
    console.error("Error initializing admin users:", error);
  }
}

// Log user activity
export function logUserActivity(action: string): void {
  try {
    const session = getCurrentAdmin();
    if (!session) return;
    
    fetch(`${API_BASE_URL}/admin/log-activity.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: session.userId,
        username: session.username,
        action: action,
        timestamp: Date.now(),
      })
    })
    .catch(error => {
      console.error("Error logging activity:", error);
    });
  } catch (error) {
    console.error("Error logging user activity:", error);
  }
}

// Get activity logs
export function getActivityLogs(limit?: number, userId?: string): Promise<ActivityLogEntry[]> {
  return new Promise((resolve) => {
    try {
      const queryParams = new URLSearchParams();
      if (limit) queryParams.append('limit', limit.toString());
      if (userId) queryParams.append('userId', userId);
      
      fetch(`${API_BASE_URL}/admin/get-logs.php?${queryParams.toString()}`)
        .then(response => response.json())
        .then(data => {
          resolve(data.logs || []);
        })
        .catch(error => {
          console.error("Error getting activity logs:", error);
          resolve([]);
        });
    } catch (error) {
      console.error("Error getting activity logs:", error);
      resolve([]);
    }
  });
}

// Login admin user
export async function loginAdmin(username: string, password: string): Promise<{success: boolean; message?: string}> {
  try {
    initializeAdminUsers(); // Ensure we have at least a default admin
    
    const response = await fetch(`${API_BASE_URL}/admin/login.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });
    
    const data = await response.json();
    
    if (data.success) {
      // Create admin session with activity tracking
      const session: AdminSession = {
        isLoggedIn: true,
        userId: data.user.id,
        username: data.user.username,
        group: data.user.group,
        timestamp: Date.now(),
        lastActivity: Math.floor(Date.now() / 1000) // Current time in seconds
      };
      
      localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
      
      // Log this activity
      logUserActivity("Logged in");
      
      return { success: true };
    } else {
      return { 
        success: false, 
        message: data.message || "Invalid username or password"
      };
    }
  } catch (error) {
    console.error("Login error:", error);
    return { 
      success: false, 
      message: "An error occurred during login"
    };
  }
}

// Logout admin user
export function logoutAdmin(): void {
  localStorage.removeItem(ADMIN_SESSION_KEY);
}

// Get current admin user details
export function getCurrentAdmin(): AdminSession | null {
  try {
    const sessionData = localStorage.getItem(ADMIN_SESSION_KEY);
    if (!sessionData) return null;
    
    const session: AdminSession = JSON.parse(sessionData);
    
    // Check if session is still valid
    if (!checkAdminSession()) {
      return null;
    }
    
    return session;
  } catch (error) {
    console.error("Error getting current admin:", error);
    return null;
  }
}

// Get user group of current admin
export function getCurrentAdminGroup(): 'admin' | 'member' | null {
  const admin = getCurrentAdmin();
  return admin ? admin.group : null;
}

// Check if current admin is in the admin group
export function isAdminGroup(): boolean {
  return getCurrentAdminGroup() === 'admin';
}

// Create a new admin user (only admin group can do this)
export async function createAdminUser(
  username: string, 
  password: string, 
  group: 'admin' | 'member'
): Promise<{success: boolean; message: string}> {
  try {
    if (!isAdminGroup()) {
      return {
        success: false,
        message: "Only admin group users can create new users"
      };
    }
    
    const currentAdmin = getCurrentAdmin();
    if (!currentAdmin) {
      return {
        success: false,
        message: "Not authenticated"
      };
    }
    
    const response = await fetch(`${API_BASE_URL}/admin/create-user.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
        group,
        createdBy: currentAdmin.username,
      }),
    });
    
    const data = await response.json();
    
    if (data.success) {
      // Log this activity
      logUserActivity(`Created new user: ${username}`);
      
      return {
        success: true,
        message: "User created successfully"
      };
    } else {
      return {
        success: false,
        message: data.message || "Failed to create user"
      };
    }
  } catch (error) {
    console.error("Error creating admin user:", error);
    return {
      success: false,
      message: "An error occurred while creating user"
    };
  }
}

// Change password (own password or any user if admin)
export async function changePassword(
  userId: string, 
  newPassword: string
): Promise<{success: boolean; message: string}> {
  try {
    const currentAdmin = getCurrentAdmin();
    if (!currentAdmin) {
      return {
        success: false,
        message: "Not authenticated"
      };
    }
    
    // Check if user can change this password
    const isOwnPassword = userId === currentAdmin.userId;
    const isAdminChangingOthers = currentAdmin.group === 'admin';
    
    if (!isOwnPassword && !isAdminChangingOthers) {
      return {
        success: false,
        message: "You can only change your own password"
      };
    }
    
    const response = await fetch(`${API_BASE_URL}/admin/change-password.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        newPassword,
        currentUserId: currentAdmin.userId,
        isAdmin: isAdminChangingOthers
      }),
    });
    
    const data = await response.json();
    
    if (data.success) {
      // Log this activity
      logUserActivity(isOwnPassword ? "Changed own password" : `Changed password for user: ${data.username}`);
      
      return {
        success: true,
        message: "Password changed successfully"
      };
    } else {
      return {
        success: false,
        message: data.message || "Failed to change password"
      };
    }
  } catch (error) {
    console.error("Error changing password:", error);
    return {
      success: false,
      message: "An error occurred while changing password"
    };
  }
}

// Get all admin users (only admin group can do this)
export async function getAllAdminUsers(): Promise<AdminUser[] | null> {
  try {
    if (!isAdminGroup()) {
      toast({
        title: "Access denied",
        description: "Only admin group users can view all users",
        variant: "destructive"
      });
      return null;
    }
    
    const response = await fetch(`${API_BASE_URL}/admin/get-users.php`);
    const data = await response.json();
    
    if (data.success) {
      return data.users;
    } else {
      toast({
        title: "Error",
        description: data.message || "Failed to get users",
        variant: "destructive"
      });
      return null;
    }
  } catch (error) {
    console.error("Error getting admin users:", error);
    toast({
      title: "Error",
      description: "Failed to get users",
      variant: "destructive"
    });
    return null;
  }
}

// Helper function to generate a unique ID
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}
