
import { useState, useEffect } from "react";
import { 
  UserPlus, 
  Trash2, 
  Lock,
  AlertTriangle,
  Check,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { 
  getAllAdminUsers, 
  createAdminUser, 
  isAdminGroup,
  getCurrentAdmin
} from "@/lib/adminAuth";

const UserManagement = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<any[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    group: "member" as "admin" | "member",
  });
  
  useEffect(() => {
    loadUsers();
    setIsAdmin(isAdminGroup());
  }, []);
  
  const loadUsers = async () => {
    try {
      const adminUsers = await getAllAdminUsers();
      if (adminUsers) {
        setUsers(adminUsers);
      }
    } catch (error) {
      console.error("Error loading users:", error);
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive",
      });
    }
  };
  
  const handleAddUser = async () => {
    if (!newUser.username || !newUser.password) {
      toast({
        title: "Validation Error",
        description: "Username and password are required",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const result = await createAdminUser(
        newUser.username,
        newUser.password,
        newUser.group
      );
      
      if (result.success) {
        toast({
          title: "User Added",
          description: "New user has been created successfully",
        });
        setIsAddUserOpen(false);
        setNewUser({
          username: "",
          password: "",
          group: "member",
        });
        await loadUsers();
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error adding user:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="space-y-6">
      {!isAdmin && (
        <div className="bg-amber-900/20 border border-amber-500/30 text-amber-200 p-4 rounded-md flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />
          <p>Only admin group users can manage users.</p>
        </div>
      )}
      
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">User Accounts</h2>
        {isAdmin && (
          <Button 
            onClick={() => setIsAddUserOpen(true)}
            className="bg-minecraft-primary hover:bg-minecraft-primary/90"
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        )}
      </div>
      
      <div className="border border-white/10 rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-black/40">
              <TableHead>Username</TableHead>
              <TableHead>Group</TableHead>
              <TableHead>Created By</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-gray-400 py-8">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id} className="bg-black/20">
                  <TableCell className="font-medium">{user.username}</TableCell>
                  <TableCell>
                    <span className={`inline-block px-2 py-1 rounded text-xs ${
                      user.group === 'admin' 
                        ? 'bg-minecraft-primary/30 text-minecraft-primary' 
                        : 'bg-minecraft-secondary/30 text-minecraft-secondary'
                    }`}>
                      {user.group}
                    </span>
                  </TableCell>
                  <TableCell>{user.createdBy || "System"}</TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    {/* No actions for now (will be implemented in password change component) */}
                    <span className="text-gray-500 text-xs">
                      Manage via Password tab
                    </span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Add User Dialog */}
      <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
        <DialogContent className="bg-black/90 border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription className="text-gray-400">
              Create a new admin user account
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Username</label>
              <Input
                value={newUser.username}
                onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                className="bg-black/70 border-white/10"
                placeholder="Enter username"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <Input
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                className="bg-black/70 border-white/10"
                placeholder="Enter password"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">User Group</label>
              <Select
                value={newUser.group}
                onValueChange={(value: "admin" | "member") => 
                  setNewUser({ ...newUser, group: value })}
              >
                <SelectTrigger className="bg-black/70 border-white/10">
                  <SelectValue placeholder="Select user group" />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border-white/10 text-white">
                  <SelectItem value="admin">Admin Group</SelectItem>
                  <SelectItem value="member">Member Group</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-400">
                Admin group users can create new users and manage passwords
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button 
              onClick={handleAddUser}
              className="bg-minecraft-primary hover:bg-minecraft-primary/90"
              disabled={isSubmitting}
            >
              <Check className="mr-2 h-4 w-4" />
              {isSubmitting ? "Creating..." : "Create User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;
