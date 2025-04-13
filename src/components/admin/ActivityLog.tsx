
import { useState, useEffect } from "react";
import { History, Filter, X } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { getActivityLogs } from "@/lib/adminAuth";
import { useToast } from "@/components/ui/use-toast";

interface ActivityLogEntry {
  id: string;
  userId: string;
  username: string;
  action: string;
  timestamp: number;
  ipAddress?: string;
}

interface ActivityLogProps {
  currentUser: any;
}

const ActivityLog = ({ currentUser }: ActivityLogProps) => {
  const { toast } = useToast();
  const [logs, setLogs] = useState<ActivityLogEntry[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<ActivityLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    onlyCurrentUser: false,
    login: true,
    creation: true,
    password: true,
    navigation: true,
    other: true,
  });

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const activityLogs = await getActivityLogs();
      setLogs(activityLogs);
      applyFilters(activityLogs, searchTerm, filterOptions);
    } catch (error) {
      console.error("Error fetching activity logs:", error);
      toast({
        title: "Error",
        description: "Failed to load activity logs",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    
    // Set up periodic refresh (every 30 seconds)
    const refreshInterval = setInterval(() => {
      fetchLogs();
    }, 30000);
    
    return () => {
      clearInterval(refreshInterval);
    };
  }, []);
  
  useEffect(() => {
    applyFilters(logs, searchTerm, filterOptions);
  }, [searchTerm, filterOptions]);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const applyFilters = (
    logEntries: ActivityLogEntry[],
    search: string,
    filters: typeof filterOptions
  ) => {
    let filtered = [...logEntries];

    // Apply user filter
    if (filters.onlyCurrentUser && currentUser) {
      filtered = filtered.filter(
        (log) => log.userId === currentUser.userId
      );
    }

    // Apply action type filters
    filtered = filtered.filter((log) => {
      const action = log.action.toLowerCase();
      
      if (action.includes("log") && filters.login) return true;
      if (action.includes("creat") && filters.creation) return true;
      if (action.includes("password") && filters.password) return true;
      if (action.includes("switched") && filters.navigation) return true;
      if (action.includes("sidebar") && filters.navigation) return true;
      
      // If it doesn't match any specific category but "other" is enabled
      if (
        !action.includes("log") &&
        !action.includes("creat") &&
        !action.includes("password") &&
        !action.includes("switched") &&
        !action.includes("sidebar") &&
        filters.other
      ) {
        return true;
      }
      
      return false;
    });

    // Apply search
    if (search.trim() !== "") {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (log) =>
          log.action.toLowerCase().includes(searchLower) ||
          log.username.toLowerCase().includes(searchLower)
      );
    }

    setFilteredLogs(filtered);
  };

  const toggleFilterMenu = () => {
    setShowFilterMenu(!showFilterMenu);
  };
  
  const clearFilters = () => {
    setFilterOptions({
      onlyCurrentUser: false,
      login: true,
      creation: true,
      password: true,
      navigation: true,
      other: true,
    });
    setSearchTerm("");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="relative w-full md:w-1/2">
          <Input
            placeholder="Search activity logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-black/40 border-white/10 text-white pr-12"
          />
          <div className="absolute right-2 top-2 flex">
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 rounded-full ${showFilterMenu ? 'bg-minecraft-primary/20 text-minecraft-primary' : 'text-gray-400'}`}
              onClick={toggleFilterMenu}
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Button 
          variant="outline"
          size="sm"
          onClick={fetchLogs}
          className="text-xs"
        >
          <History className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      {showFilterMenu && (
        <div className="bg-black/60 border border-white/10 rounded-lg p-4 shadow-lg">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium">Filter Options</h3>
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 text-xs"
                onClick={clearFilters}
              >
                Reset
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                className="h-8 w-8 rounded-full text-gray-400 hover:text-white"
                onClick={() => setShowFilterMenu(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="filterCurrentUser"
                checked={filterOptions.onlyCurrentUser}
                onCheckedChange={(checked) =>
                  setFilterOptions({ ...filterOptions, onlyCurrentUser: !!checked })
                }
                className="data-[state=checked]:bg-minecraft-primary"
              />
              <label
                htmlFor="filterCurrentUser"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Only my activities
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="filterLogin"
                checked={filterOptions.login}
                onCheckedChange={(checked) =>
                  setFilterOptions({ ...filterOptions, login: !!checked })
                }
                className="data-[state=checked]:bg-minecraft-primary"
              />
              <label
                htmlFor="filterLogin"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Login/Logout
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="filterCreation"
                checked={filterOptions.creation}
                onCheckedChange={(checked) =>
                  setFilterOptions({ ...filterOptions, creation: !!checked })
                }
                className="data-[state=checked]:bg-minecraft-primary"
              />
              <label
                htmlFor="filterCreation"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                User Creation
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="filterPassword"
                checked={filterOptions.password}
                onCheckedChange={(checked) =>
                  setFilterOptions({ ...filterOptions, password: !!checked })
                }
                className="data-[state=checked]:bg-minecraft-primary"
              />
              <label
                htmlFor="filterPassword"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Password Changes
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="filterNavigation"
                checked={filterOptions.navigation}
                onCheckedChange={(checked) =>
                  setFilterOptions({ ...filterOptions, navigation: !!checked })
                }
                className="data-[state=checked]:bg-minecraft-primary"
              />
              <label
                htmlFor="filterNavigation"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Navigation
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="filterOther"
                checked={filterOptions.other}
                onCheckedChange={(checked) =>
                  setFilterOptions({ ...filterOptions, other: !!checked })
                }
                className="data-[state=checked]:bg-minecraft-primary"
              />
              <label
                htmlFor="filterOther"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Other Activities
              </label>
            </div>
          </div>
        </div>
      )}
      
      <div className="border border-white/10 rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-black/40">
              <TableHead className="text-white/70">User</TableHead>
              <TableHead className="text-white/70">Action</TableHead>
              <TableHead className="text-white/70">Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center">
                  <div className="flex justify-center items-center h-full">
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredLogs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center text-gray-500">
                  No activity logs found
                </TableCell>
              </TableRow>
            ) : (
              filteredLogs.map((log) => (
                <TableRow key={log.id} className="bg-black/20">
                  <TableCell>
                    <div className="font-medium">{log.username}</div>
                    <div className="text-xs text-gray-500">ID: {log.userId.slice(0, 8)}...</div>
                  </TableCell>
                  <TableCell>{log.action}</TableCell>
                  <TableCell className="text-sm">{formatDate(log.timestamp)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ActivityLog;
