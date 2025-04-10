
import { useState, useEffect } from "react";
import { getActivityLogs, isAdminGroup } from "@/lib/adminAuth";
import { 
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";

interface ActivityLogProps {
  currentUser: {
    userId: string;
    username: string;
    group: string;
  } | null;
}

const ActivityLog = ({ currentUser }: ActivityLogProps) => {
  const [logs, setLogs] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"all" | "own">("own");
  const isAdmin = currentUser?.group === "admin";

  useEffect(() => {
    loadLogs();
  }, [activeTab, currentUser]);

  const loadLogs = () => {
    if (!currentUser) return;

    if (activeTab === "own" || !isAdmin) {
      // Get only current user's logs
      const userLogs = getActivityLogs(100, currentUser.userId);
      setLogs(userLogs);
    } else {
      // Get all logs (admin only)
      const allLogs = getActivityLogs(500);
      setLogs(allLogs);
    }
  };

  const formatDate = (timestamp: number) => {
    return format(new Date(timestamp), "PPpp");
  };

  if (!currentUser) return null;

  return (
    <div className="space-y-6">
      <div className="bg-black/40 border border-white/10 rounded-lg p-6 backdrop-blur-sm">
        <h2 className="text-lg font-semibold mb-4">Activity Logging</h2>
        <p className="text-gray-400">
          This page displays user activity logs. {isAdmin && "As an admin, you can view logs for all users."}
        </p>
      </div>

      {isAdmin && (
        <Tabs value={activeTab} onValueChange={setActiveTab as any} className="w-full">
          <TabsList className="bg-black/40 border border-white/10">
            <TabsTrigger value="own">My Activity</TabsTrigger>
            <TabsTrigger value="all">All Activity</TabsTrigger>
          </TabsList>
        </Tabs>
      )}

      <div className="bg-black/40 border border-white/10 rounded-lg p-6 backdrop-blur-sm">
        <Table>
          <TableCaption>
            {activeTab === "own" ? "Your recent activity" : "Recent activity for all users"}
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Time</TableHead>
              {activeTab === "all" && <TableHead>User</TableHead>}
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={activeTab === "all" ? 3 : 2} className="text-center">
                  No activity logs found
                </TableCell>
              </TableRow>
            ) : (
              logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-mono text-xs">
                    {formatDate(log.timestamp)}
                  </TableCell>
                  {activeTab === "all" && <TableCell>{log.username}</TableCell>}
                  <TableCell>{log.action}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="bg-black/40 border border-white/10 rounded-lg p-6 backdrop-blur-sm">
        <h3 className="text-md font-semibold mb-2">Session Information</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Username:</span>
            <span>{currentUser?.username}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Group:</span>
            <span>{currentUser?.group}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Session Timeout:</span>
            <span>{1600} seconds</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityLog;
