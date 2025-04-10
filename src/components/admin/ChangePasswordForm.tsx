
import { useState, useEffect } from "react";
import { 
  Lock, 
  Check,
  X,
  AlertTriangle
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
import { useToast } from "@/components/ui/use-toast";
import { 
  getAllAdminUsers, 
  changePassword, 
  isAdminGroup,
  getCurrentAdmin
} from "@/lib/adminAuth";

const ChangePasswordForm = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<any[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  useEffect(() => {
    const admin = isAdminGroup();
    setIsAdmin(admin);
    setCurrentUser(getCurrentAdmin());
    
    // Load all users for admin, or just current user for members
    if (admin) {
      const adminUsers = getAllAdminUsers();
      if (adminUsers) {
        setUsers(adminUsers);
      }
    } else {
      const user = getCurrentAdmin();
      if (user) {
        setUsers([{
          id: user.userId,
          username: user.username,
          group: user.group
        }]);
      }
    }
  }, []);
  
  const handleOpenDialog = (user: any) => {
    setSelectedUser(user);
    setNewPassword("");
    setConfirmPassword("");
    setIsDialogOpen(true);
  };
  
  const handleChangePassword = () => {
    if (!newPassword || !confirmPassword) {
      toast({
        title: "Validation Error",
        description: "Both password fields are required",
        variant: "destructive",
      });
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Validation Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }
    
    const result = changePassword(selectedUser.id, newPassword);
    
    if (result.success) {
      toast({
        title: "Password Changed",
        description: "The password has been updated successfully",
      });
      setIsDialogOpen(false);
    } else {
      toast({
        title: "Error",
        description: result.message,
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Change Password</h2>
      </div>
      
      {isAdmin ? (
        <p className="text-gray-400">
          As an admin, you can change passwords for all users. Click on a user to change their password.
        </p>
      ) : (
        <p className="text-gray-400">
          You can change your own password below.
        </p>
      )}
      
      <div className="border border-white/10 rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-black/40">
              <TableHead>Username</TableHead>
              <TableHead>Group</TableHead>
              {isAdmin && <TableHead>Created By</TableHead>}
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={isAdmin ? 4 : 3} className="text-center text-gray-400 py-8">
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
                  {isAdmin && (
                    <TableCell>{user.createdBy || "System"}</TableCell>
                  )}
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenDialog(user)}
                    >
                      <Lock className="mr-2 h-3 w-3" />
                      Change Password
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Change Password Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-black/90 border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription className="text-gray-400">
              {isAdmin && currentUser?.userId !== selectedUser?.id
                ? `Change password for user: ${selectedUser?.username}`
                : "Change your password"}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">New Password</label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="bg-black/70 border-white/10"
                placeholder="Enter new password"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Confirm Password</label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-black/70 border-white/10"
                placeholder="Confirm new password"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button 
              onClick={handleChangePassword}
              className="bg-minecraft-primary hover:bg-minecraft-primary/90"
            >
              <Check className="mr-2 h-4 w-4" />
              Update Password
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChangePasswordForm;
