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
const ADMIN_USERS_KEY = 'adminUsers';
const ACTIVITY_LOG_KEY = 'activityLog';
const EMAIL_TEMPLATES_KEY = 'emailTemplates';
const SESSION_TIMEOUT = 1600; // 1600 seconds = ~26.6 minutes

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
    const existingUsers = localStorage.getItem(ADMIN_USERS_KEY);
    if (!existingUsers || JSON.parse(existingUsers).length === 0) {
      const defaultAdmin: AdminUser = {
        id: generateId(),
        username: 'admin',
        password: 'admin123',
        group: 'admin',
        createdAt: Date.now()
      };
      
      localStorage.setItem(ADMIN_USERS_KEY, JSON.stringify([defaultAdmin]));
    }
    
    // Initialize default email templates if none exist
    initializeEmailTemplates();
  } catch (error) {
    console.error("Error initializing admin users:", error);
  }
}

// Initialize default email templates
function initializeEmailTemplates(): void {
  try {
    const existingTemplates = localStorage.getItem(EMAIL_TEMPLATES_KEY);
    if (!existingTemplates) {
      // Load templates that match the structure in send-order-email.php
      const defaultTemplates = {
        orderConfirmation: {
          id: 'orderConfirmation',
          name: 'Order Confirmation',
          subject: 'New Minecraft Server Order - {{server_name}}',
          body: `<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #000; color: #fff; padding: 15px; text-align: center; }
        .header h1 { margin: 0; color: #fff; }
        .header h1 span { color: #00C853; }
        .content { padding: 20px; border: 1px solid #ddd; border-top: none; }
        .order-details { background-color: #f9f9f9; padding: 15px; margin-bottom: 20px; }
        .footer { font-size: 12px; text-align: center; margin-top: 30px; color: #777; }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background-color: #f2f2f2; }
        .credentials { background-color: #f5f5f5; border-left: 4px solid #00C853; padding: 10px; margin: 15px 0; }
        .discount { background-color: #e8f5e9; border-left: 4px solid #00C853; padding: 5px 10px; margin: 5px 0; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1>Ender<span>HOST</span> - New Order</h1>
        </div>
        <div class='content'>
            <h2>New Minecraft Server Order Received</h2>
            <p>A new server order has been placed. The customer has been directed to the payment page.</p>
            
            <div class='order-details'>
                <h3>Order Details:</h3>
                <table>
                    <tr>
                        <th>Order ID:</th>
                        <td>{{order_id}}</td>
                    </tr>
                    <tr>
                        <th>Server Name:</th>
                        <td>{{server_name}}</td>
                    </tr>
                    <tr>
                        <th>Plan:</th>
                        <td>{{plan}}</td>
                    </tr>
                    <tr>
                        <th>Billing Cycle:</th>
                        <td>{{billing_cycle_text}}</td>
                    </tr>
                    <tr>
                        <th>Base Price:</th>
                        <td>₹{{base_plan_price}}</td>
                    </tr>
                    <tr>
                        <th>Total Price:</th>
                        <td>₹{{total_price}}</td>
                    </tr>
                    <tr>
                        <th>Order Date:</th>
                        <td>{{order_date}}</td>
                    </tr>
                </table>
            </div>
            
            <h3>Customer Information:</h3>
            <table>
                <tr>
                    <th>Name:</th>
                    <td>{{customer_name}}</td>
                </tr>
                <tr>
                    <th>Email:</th>
                    <td>{{customer_email}}</td>
                </tr>
                <tr>
                    <th>Phone:</th>
                    <td>{{customer_phone}}</td>
                </tr>
                <tr>
                    <th>Discord Username:</th>
                    <td>{{discord_username}}</td>
                </tr>
            </table>
            
            <div class='credentials'>
                <h3>Server Login Credentials:</h3>
                <p><strong>Username:</strong> {{customer_email}}</p>
                <p><strong>Password:</strong> {{customer_password}}</p>
                <p><em>Note: These credentials will be used for the customer's server control panel access.</em></p>
            </div>
            
            <p style='margin-top: 30px;'>
                <b>Note:</b> This is just a notification that the customer has reached the payment page. 
                Await payment confirmation from Discord before setting up the server.
            </p>
        </div>
        <div class='footer'>
            <p>This is an automated message from the EnderHOST ordering system.</p>
            <p>&copy; 2025 EnderHOST. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`,
        },
        welcome: {
          id: 'welcome',
          name: 'Welcome Email',
          subject: 'Welcome to EnderHOST!',
          body: '<h1>Welcome to EnderHOST!</h1><p>Thank you for choosing our services.</p>',
        },
        passwordReset: {
          id: 'passwordReset',
          name: 'Password Reset',
          subject: 'EnderHOST Password Reset',
          body: '<h1>Password Reset</h1><p>Click the link below to reset your password.</p>',
        }
      };
      
      localStorage.setItem(EMAIL_TEMPLATES_KEY, JSON.stringify(defaultTemplates));
    }
  } catch (error) {
    console.error("Error initializing email templates:", error);
  }
}

// Log user activity
export function logUserActivity(action: string): void {
  try {
    const session = getCurrentAdmin();
    if (!session) return;
    
    const activityLogs: ActivityLogEntry[] = JSON.parse(localStorage.getItem(ACTIVITY_LOG_KEY) || '[]');
    
    const newEntry: ActivityLogEntry = {
      id: generateId(),
      userId: session.userId,
      username: session.username,
      action: action,
      timestamp: Date.now(),
    };
    
    // Add to beginning to keep newest first
    activityLogs.unshift(newEntry);
    
    // Keep only the last 1000 entries to avoid localStorage overflow
    const trimmedLogs = activityLogs.slice(0, 1000);
    localStorage.setItem(ACTIVITY_LOG_KEY, JSON.stringify(trimmedLogs));
  } catch (error) {
    console.error("Error logging user activity:", error);
  }
}

// Get activity logs
export function getActivityLogs(limit?: number, userId?: string): ActivityLogEntry[] {
  try {
    const activityLogs: ActivityLogEntry[] = JSON.parse(localStorage.getItem(ACTIVITY_LOG_KEY) || '[]');
    
    let filteredLogs = activityLogs;
    if (userId) {
      filteredLogs = activityLogs.filter(log => log.userId === userId);
    }
    
    if (limit && limit > 0) {
      return filteredLogs.slice(0, limit);
    }
    
    return filteredLogs;
  } catch (error) {
    console.error("Error getting activity logs:", error);
    return [];
  }
}

// Get email templates
export function getEmailTemplates() {
  try {
    // Initialize templates if they don't exist
    initializeEmailTemplates();
    
    const templates = localStorage.getItem(EMAIL_TEMPLATES_KEY);
    return templates ? JSON.parse(templates) : {};
  } catch (error) {
    console.error("Error getting email templates:", error);
    return {};
  }
}

// Update email template and sync with PHP email template
export function updateEmailTemplate(templateId: string, data: any): boolean {
  try {
    const templates = getEmailTemplates();
    if (!templates[templateId]) return false;
    
    templates[templateId] = {
      ...templates[templateId],
      ...data
    };
    
    localStorage.setItem(EMAIL_TEMPLATES_KEY, JSON.stringify(templates));
    
    // Log this activity
    return true;
  } catch (error) {
    console.error("Error updating email template:", error);
    return false;
  }
}

// Login admin user
export async function loginAdmin(username: string, password: string): Promise<{success: boolean; message?: string}> {
  try {
    initializeAdminUsers(); // Ensure we have at least a default admin
    
    const adminUsers: AdminUser[] = JSON.parse(localStorage.getItem(ADMIN_USERS_KEY) || '[]');
    
    const foundUser = adminUsers.find(
      (user) => user.username === username && user.password === password
    );

    if (foundUser) {
      // Create admin session with activity tracking
      const session: AdminSession = {
        isLoggedIn: true,
        userId: foundUser.id,
        username: foundUser.username,
        group: foundUser.group,
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
        message: "Invalid username or password"
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
export function createAdminUser(
  username: string, 
  password: string, 
  group: 'admin' | 'member'
): {success: boolean; message: string} {
  try {
    if (!isAdminGroup()) {
      return {
        success: false,
        message: "Only admin group users can create new users"
      };
    }
    
    const adminUsers: AdminUser[] = JSON.parse(localStorage.getItem(ADMIN_USERS_KEY) || '[]');
    
    // Check if username already exists
    if (adminUsers.some(user => user.username === username)) {
      return {
        success: false,
        message: "Username already exists"
      };
    }
    
    const currentAdmin = getCurrentAdmin();
    
    const newUser: AdminUser = {
      id: generateId(),
      username,
      password,
      group,
      createdBy: currentAdmin?.username,
      createdAt: Date.now()
    };
    
    adminUsers.push(newUser);
    localStorage.setItem(ADMIN_USERS_KEY, JSON.stringify(adminUsers));
    
    // Log this activity
    logUserActivity(`Created new user: ${username}`);
    
    return {
      success: true,
      message: "User created successfully"
    };
  } catch (error) {
    console.error("Error creating admin user:", error);
    return {
      success: false,
      message: "An error occurred while creating user"
    };
  }
}

// Change password (own password or any user if admin)
export function changePassword(
  userId: string, 
  newPassword: string
): {success: boolean; message: string} {
  try {
    const currentAdmin = getCurrentAdmin();
    if (!currentAdmin) {
      return {
        success: false,
        message: "Not authenticated"
      };
    }
    
    const adminUsers: AdminUser[] = JSON.parse(localStorage.getItem(ADMIN_USERS_KEY) || '[]');
    
    // Find the user to update
    const userIndex = adminUsers.findIndex(user => user.id === userId);
    
    if (userIndex === -1) {
      return {
        success: false,
        message: "User not found"
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
    
    // Update the password
    adminUsers[userIndex].password = newPassword;
    localStorage.setItem(ADMIN_USERS_KEY, JSON.stringify(adminUsers));
    
    // Log this activity
    const targetUsername = adminUsers[userIndex].username;
    logUserActivity(isOwnPassword ? "Changed own password" : `Changed password for user: ${targetUsername}`);
    
    return {
      success: true,
      message: "Password changed successfully"
    };
  } catch (error) {
    console.error("Error changing password:", error);
    return {
      success: false,
      message: "An error occurred while changing password"
    };
  }
}

// Get all admin users (only admin group can do this)
export function getAllAdminUsers(): AdminUser[] | null {
  try {
    if (!isAdminGroup()) {
      toast({
        title: "Access denied",
        description: "Only admin group users can view all users",
        variant: "destructive"
      });
      return null;
    }
    
    const adminUsers: AdminUser[] = JSON.parse(localStorage.getItem(ADMIN_USERS_KEY) || '[]');
    
    // Return users without password for security
    return adminUsers.map(user => ({
      ...user,
      password: '********' // Mask passwords
    }));
  } catch (error) {
    console.error("Error getting admin users:", error);
    return null;
  }
}

// Helper function to generate a unique ID
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}
