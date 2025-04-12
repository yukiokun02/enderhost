
import React, { useState, useEffect, useRef } from "react";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { isAdminGroup, logUserActivity } from "@/lib/adminAuth";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  FileText, 
  FileImage, 
  FileArchive, 
  FileAudio, 
  FileVideo, 
  Folder, 
  FolderOpen, 
  ArrowLeft, 
  UploadCloud, 
  Download, 
  Trash2, 
  RefreshCw, 
  Edit2, 
  Save,
  File,
  FileCog,
  AlertCircle
} from "lucide-react";
import {
  Alert,
  AlertTitle,
  AlertDescription,
} from "@/components/ui/alert";

interface FileItem {
  name: string;
  path: string;
  type: "file" | "directory";
  size?: number;
  lastModified?: number;
  extension?: string;
}

const FileExplorer = () => {
  const [currentPath, setCurrentPath] = useState("/");
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newFileName, setNewFileName] = useState("");
  const [isBuildRunning, setIsBuildRunning] = useState(false);
  const [showSetupInfo, setShowSetupInfo] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Check if user is admin group
    if (!isAdminGroup()) {
      toast({
        title: "Access denied",
        description: "Only admin group users can access the file explorer",
        variant: "destructive"
      });
      return;
    }
    
    fetchFiles();
    
    // Show setup info after a short delay
    const timer = setTimeout(() => {
      setShowSetupInfo(true);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [currentPath]);

  const fetchFiles = async () => {
    setIsLoading(true);
    try {
      // This would be an API call to your backend in production
      // Example: const response = await fetch('/api/files?path=' + encodeURIComponent(currentPath));
      
      // For demo purposes, we're using more comprehensive mock data
      setTimeout(() => {
        let mockFiles: FileItem[] = [];
        
        if (currentPath === "/") {
          mockFiles = [
            { name: "src", path: "/src", type: "directory" },
            { name: "public", path: "/public", type: "directory" },
            { name: "node_modules", path: "/node_modules", type: "directory" },
            { name: "index.html", path: "/index.html", type: "file", extension: "html", size: 2048, lastModified: Date.now() - 86400000 },
            { name: "package.json", path: "/package.json", type: "file", extension: "json", size: 1024, lastModified: Date.now() - 172800000 },
            { name: "tsconfig.json", path: "/tsconfig.json", type: "file", extension: "json", size: 512, lastModified: Date.now() - 259200000 },
            { name: "vite.config.ts", path: "/vite.config.ts", type: "file", extension: "ts", size: 768, lastModified: Date.now() - 345600000 },
            { name: "tailwind.config.ts", path: "/tailwind.config.ts", type: "file", extension: "ts", size: 890, lastModified: Date.now() - 432000000 },
            { name: ".gitignore", path: "/.gitignore", type: "file", extension: "", size: 374, lastModified: Date.now() - 518400000 },
          ];
        } else if (currentPath === "/src") {
          mockFiles = [
            { name: "components", path: "/src/components", type: "directory" },
            { name: "pages", path: "/src/pages", type: "directory" },
            { name: "hooks", path: "/src/hooks", type: "directory" },
            { name: "lib", path: "/src/lib", type: "directory" },
            { name: "App.tsx", path: "/src/App.tsx", type: "file", extension: "tsx", size: 3072, lastModified: Date.now() - 259200000 },
            { name: "main.tsx", path: "/src/main.tsx", type: "file", extension: "tsx", size: 1024, lastModified: Date.now() - 604800000 },
            { name: "index.css", path: "/src/index.css", type: "file", extension: "css", size: 4096, lastModified: Date.now() - 691200000 },
            { name: "vite-env.d.ts", path: "/src/vite-env.d.ts", type: "file", extension: "ts", size: 128, lastModified: Date.now() - 777600000 },
          ];
        } else if (currentPath === "/src/pages") {
          mockFiles = [
            { name: "Index.tsx", path: "/src/pages/Index.tsx", type: "file", extension: "tsx", size: 8192, lastModified: Date.now() - 864000000 },
            { name: "AdminDashboard.tsx", path: "/src/pages/AdminDashboard.tsx", type: "file", extension: "tsx", size: 12288, lastModified: Date.now() - 950400000 },
            { name: "AdminLogin.tsx", path: "/src/pages/AdminLogin.tsx", type: "file", extension: "tsx", size: 6144, lastModified: Date.now() - 1036800000 },
            { name: "NotFound.tsx", path: "/src/pages/NotFound.tsx", type: "file", extension: "tsx", size: 2048, lastModified: Date.now() - 1123200000 },
            { name: "PurchaseForm.tsx", path: "/src/pages/PurchaseForm.tsx", type: "file", extension: "tsx", size: 10240, lastModified: Date.now() - 1209600000 },
            { name: "PrivacyPolicy.tsx", path: "/src/pages/PrivacyPolicy.tsx", type: "file", extension: "tsx", size: 15360, lastModified: Date.now() - 1296000000 },
            { name: "TermsOfService.tsx", path: "/src/pages/TermsOfService.tsx", type: "file", extension: "tsx", size: 20480, lastModified: Date.now() - 1382400000 },
          ];
        } else if (currentPath === "/src/components") {
          mockFiles = [
            { name: "ui", path: "/src/components/ui", type: "directory" },
            { name: "admin", path: "/src/components/admin", type: "directory" },
            { name: "Navigation.tsx", path: "/src/components/Navigation.tsx", type: "file", extension: "tsx", size: 7168, lastModified: Date.now() - 1468800000 },
            { name: "Hero.tsx", path: "/src/components/Hero.tsx", type: "file", extension: "tsx", size: 5120, lastModified: Date.now() - 1555200000 },
            { name: "Features.tsx", path: "/src/components/Features.tsx", type: "file", extension: "tsx", size: 9216, lastModified: Date.now() - 1641600000 },
            { name: "Pricing.tsx", path: "/src/components/Pricing.tsx", type: "file", extension: "tsx", size: 12288, lastModified: Date.now() - 1728000000 },
            { name: "Footer.tsx", path: "/src/components/Footer.tsx", type: "file", extension: "tsx", size: 4096, lastModified: Date.now() - 1814400000 },
          ];
        } else if (currentPath === "/public") {
          mockFiles = [
            { name: "api", path: "/public/api", type: "directory" },
            { name: "lovable-uploads", path: "/public/lovable-uploads", type: "directory" },
            { name: "sql", path: "/public/sql", type: "directory" },
            { name: "favicon.ico", path: "/public/favicon.ico", type: "file", extension: "ico", size: 4096, lastModified: Date.now() - 1900800000 },
            { name: "og-image.png", path: "/public/og-image.png", type: "file", extension: "png", size: 153600, lastModified: Date.now() - 1987200000 },
            { name: "config.php", path: "/public/config.php", type: "file", extension: "php", size: 1024, lastModified: Date.now() - 2073600000 },
            { name: "placeholder.svg", path: "/public/placeholder.svg", type: "file", extension: "svg", size: 512, lastModified: Date.now() - 2160000000 },
          ];
        } else if (currentPath === "/public/lovable-uploads") {
          mockFiles = [
            { name: "50fc961d-b5d5-493d-ab69-e4be0c7f1c90.png", path: "/public/lovable-uploads/50fc961d-b5d5-493d-ab69-e4be0c7f1c90.png", type: "file", extension: "png", size: 153600, lastModified: Date.now() - 2246400000 },
            { name: "45df2984-1b34-4b54-9443-638b349c655b.png", path: "/public/lovable-uploads/45df2984-1b34-4b54-9443-638b349c655b.png", type: "file", extension: "png", size: 122880, lastModified: Date.now() - 2332800000 },
            { name: "32ae7d2d-65eb-4b47-9c06-c61d76c82313.png", path: "/public/lovable-uploads/32ae7d2d-65eb-4b47-9c06-c61d76c82313.png", type: "file", extension: "png", size: 204800, lastModified: Date.now() - 2419200000 },
            { name: "42f68d43-0471-44a4-a49f-19b186484ba1.png", path: "/public/lovable-uploads/42f68d43-0471-44a4-a49f-19b186484ba1.png", type: "file", extension: "png", size: 179200, lastModified: Date.now() - 2505600000 },
            { name: "44889fa3-d6ca-425a-a292-3b162ddf7f6b.png", path: "/public/lovable-uploads/44889fa3-d6ca-425a-a292-3b162ddf7f6b.png", type: "file", extension: "png", size: 163840, lastModified: Date.now() - 2592000000 },
          ];
        } else if (currentPath === "/node_modules") {
          mockFiles = [
            { name: "react", path: "/node_modules/react", type: "directory" },
            { name: "react-dom", path: "/node_modules/react-dom", type: "directory" },
            { name: "tailwindcss", path: "/node_modules/tailwindcss", type: "directory" },
            { name: "vite", path: "/node_modules/vite", type: "directory" },
            { name: "typescript", path: "/node_modules/typescript", type: "directory" },
            { name: ".package-lock.json", path: "/node_modules/.package-lock.json", type: "file", extension: "json", size: 10485760, lastModified: Date.now() - 2678400000 },
          ];
        } else {
          // For all other directories, generate generic files
          mockFiles = [
            { name: "index.ts", path: `${currentPath}/index.ts`, type: "file", extension: "ts", size: 1024, lastModified: Date.now() - 2764800000 },
            { name: "types.ts", path: `${currentPath}/types.ts`, type: "file", extension: "ts", size: 512, lastModified: Date.now() - 2851200000 },
            { name: "utils.ts", path: `${currentPath}/utils.ts`, type: "file", extension: "ts", size: 768, lastModified: Date.now() - 2937600000 },
            { name: "constants.ts", path: `${currentPath}/constants.ts`, type: "file", extension: "ts", size: 256, lastModified: Date.now() - 3024000000 },
          ];
        }
        
        setFiles(mockFiles);
        setIsLoading(false);
        
        logUserActivity(`Browsed files at path: ${currentPath}`);
      }, 800); // Simulate network delay
    } catch (error) {
      console.error("Error fetching files:", error);
      toast({
        title: "Error",
        description: "Failed to fetch files",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  const navigateUp = () => {
    if (currentPath === "/") return;
    
    const parts = currentPath.split("/").filter(Boolean);
    parts.pop();
    const newPath = parts.length === 0 ? "/" : "/" + parts.join("/");
    setCurrentPath(newPath);
  };

  const navigateToDirectory = (path: string) => {
    setCurrentPath(path);
  };

  const handleFileClick = (file: FileItem) => {
    if (file.type === "directory") {
      navigateToDirectory(file.path);
    } else {
      setSelectedFile(file);
    }
  };

  const handleUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    setIsUploading(true);
    try {
      // In a real implementation, this would be an API call to upload the file
      setTimeout(() => {
        toast({
          title: "File uploaded",
          description: `Successfully uploaded ${files[0].name}`,
        });
        
        logUserActivity(`Uploaded file: ${files[0].name} to ${currentPath}`);
        
        // Refresh file list
        fetchFiles();
        setIsUploading(false);
        // Reset file input
        if (fileInputRef.current) fileInputRef.current.value = "";
      }, 1500); // Simulate network delay
    } catch (error) {
      console.error("Error uploading file:", error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading the file",
        variant: "destructive"
      });
      setIsUploading(false);
    }
  };

  const handleDownload = (file: FileItem) => {
    // In a real implementation, this would create a download link to the file
    toast({
      title: "Download started",
      description: `Downloading ${file.name}`,
    });
    
    logUserActivity(`Downloaded file: ${file.name}`);
  };

  const handleDelete = async (file: FileItem) => {
    try {
      // In a real implementation, this would be an API call to delete the file
      setTimeout(() => {
        toast({
          title: "File deleted",
          description: `Successfully deleted ${file.name}`,
        });
        
        logUserActivity(`Deleted file: ${file.name} from ${currentPath}`);
        
        // Refresh file list
        fetchFiles();
        setSelectedFile(null);
      }, 800); // Simulate network delay
    } catch (error) {
      console.error("Error deleting file:", error);
      toast({
        title: "Delete failed",
        description: "There was an error deleting the file",
        variant: "destructive"
      });
    }
  };

  const handleRename = (file: FileItem) => {
    setSelectedFile(file);
    setNewFileName(file.name);
    setIsRenaming(true);
  };

  const confirmRename = async () => {
    if (!selectedFile || !newFileName.trim()) return;
    
    try {
      // In a real implementation, this would be an API call to rename the file
      setTimeout(() => {
        toast({
          title: "File renamed",
          description: `Successfully renamed to ${newFileName}`,
        });
        
        logUserActivity(`Renamed file: ${selectedFile.name} to ${newFileName}`);
        
        // Refresh file list
        fetchFiles();
        setIsRenaming(false);
        setSelectedFile(null);
      }, 800); // Simulate network delay
    } catch (error) {
      console.error("Error renaming file:", error);
      toast({
        title: "Rename failed",
        description: "There was an error renaming the file",
        variant: "destructive"
      });
      setIsRenaming(false);
    }
  };

  const runBuild = async () => {
    setIsBuildRunning(true);
    try {
      // In a real implementation, this would trigger a server build
      setTimeout(() => {
        toast({
          title: "Build completed",
          description: "The website has been updated with your changes",
        });
        
        logUserActivity("Ran build to update website");
        
        setIsBuildRunning(false);
      }, 3000); // Simulate build process
    } catch (error) {
      console.error("Error during build:", error);
      toast({
        title: "Build failed",
        description: "There was an error updating the website",
        variant: "destructive"
      });
      setIsBuildRunning(false);
    }
  };

  const getFileIcon = (file: FileItem) => {
    if (file.type === "directory") {
      return <Folder className="h-5 w-5 text-amber-400" />;
    }
    
    const extension = file.extension?.toLowerCase();
    switch (extension) {
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
      case "svg":
      case "webp":
        return <FileImage className="h-5 w-5 text-sky-400" />;
      case "mp3":
      case "wav":
      case "ogg":
        return <FileAudio className="h-5 w-5 text-purple-400" />;
      case "mp4":
      case "webm":
      case "avi":
        return <FileVideo className="h-5 w-5 text-red-400" />;
      case "zip":
      case "rar":
      case "7z":
      case "tar":
      case "gz":
        return <FileArchive className="h-5 w-5 text-orange-400" />;
      case "txt":
      case "md":
      case "json":
      case "html":
      case "css":
      case "js":
      case "ts":
      case "tsx":
      case "jsx":
        return <FileText className="h-5 w-5 text-indigo-400" />;
      case "php":
      case "py":
      case "rb":
      case "java":
      case "cs":
      case "go":
        return <FileCog className="h-5 w-5 text-green-400" />;
      default:
        return <File className="h-5 w-5 text-gray-400" />;
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (bytes === undefined) return "N/A";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (timestamp?: number) => {
    if (!timestamp) return "N/A";
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  if (!isAdminGroup()) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <FileCog className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium">Access Denied</h3>
          <p className="text-gray-500">You don't have permission to access the File Explorer.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-black/40 border border-white/10 rounded-lg p-6 backdrop-blur-sm">
        <h2 className="text-lg font-semibold mb-2">File Explorer</h2>
        <p className="text-gray-400">
          Manage your website files. Upload, download, rename, or delete files as needed.
          Changes will be applied after you run a build.
        </p>
      </div>
      
      {showSetupInfo && (
        <Alert variant="warning" className="bg-yellow-900/20 border-yellow-600/50 text-yellow-200">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Important Setup Information</AlertTitle>
          <AlertDescription>
            <p className="mb-2">This is currently a demonstration using mock data. For a VPS deployment, you'll need:</p>
            <ol className="list-decimal pl-5 space-y-1">
              <li>A PHP or Node.js backend API to handle file operations</li>
              <li>Proper file permissions for the web server user</li>
              <li>Security measures to prevent unauthorized access</li>
              <li>A process manager like PM2 to run the build command</li>
            </ol>
            <p className="mt-2">
              When deployed to your VPS, modify this component to use your actual API endpoints 
              instead of the mock data shown here.
            </p>
          </AlertDescription>
        </Alert>
      )}
      
      <div className="bg-black/40 border border-white/10 rounded-lg backdrop-blur-sm overflow-hidden">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={navigateUp}
              disabled={currentPath === "/"}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="bg-black/60 rounded px-3 py-1.5 flex-1">
              <span className="text-sm font-mono">{currentPath}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchFiles}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleUpload}
              disabled={isUploading}
            >
              <UploadCloud className="h-4 w-4 mr-2" />
              Upload
            </Button>
            
            <Button 
              variant="default" 
              size="sm" 
              onClick={runBuild}
              disabled={isBuildRunning}
            >
              <Save className="h-4 w-4 mr-2" />
              {isBuildRunning ? "Building..." : "Build & Update Site"}
            </Button>
            
            <input 
              type="file" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              onChange={handleFileUpload}
            />
          </div>
        </div>
        
        {isLoading ? (
          <div className="p-20 flex justify-center">
            <RefreshCw className="h-8 w-8 animate-spin text-minecraft-secondary" />
          </div>
        ) : files.length === 0 ? (
          <div className="p-20 text-center">
            <FolderOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium">Empty Directory</h3>
            <p className="text-gray-500">This directory is empty.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Last Modified</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {files.map((file) => (
                  <TableRow 
                    key={file.path}
                    onClick={() => handleFileClick(file)}
                    className="cursor-pointer"
                  >
                    <TableCell className="font-medium flex items-center gap-2">
                      {getFileIcon(file)}
                      <span>{file.name}</span>
                    </TableCell>
                    <TableCell>
                      {file.type === "directory" ? "--" : formatFileSize(file.size)}
                    </TableCell>
                    <TableCell>{formatDate(file.lastModified)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {file.type !== "directory" && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownload(file);
                            }}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
                        
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRename(file);
                          }}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-black border-white/10">
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete {file.name}</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this {file.type}? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDelete(file)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
      
      {/* Rename Dialog */}
      <Dialog open={isRenaming} onOpenChange={setIsRenaming}>
        <DialogContent className="bg-black border-white/10">
          <DialogHeader>
            <DialogTitle>Rename {selectedFile?.name}</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <Label htmlFor="newFileName" className="mb-2 block">New name</Label>
            <Input
              id="newFileName"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              className="bg-black border-white/20"
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRenaming(false)}>
              Cancel
            </Button>
            <Button onClick={confirmRename}>
              Rename
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FileExplorer;
