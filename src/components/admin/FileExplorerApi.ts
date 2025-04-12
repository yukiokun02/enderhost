
import { toast } from "@/components/ui/use-toast";
import { logUserActivity } from "@/lib/adminAuth";

export interface FileItem {
  name: string;
  path: string;
  type: "file" | "directory";
  size?: number;
  lastModified?: number;
  extension?: string;
}

export const fetchFiles = async (currentPath: string): Promise<FileItem[]> => {
  try {
    const response = await fetch(`/api/file-explorer/index.php?action=list&path=${encodeURIComponent(currentPath)}`, {
      headers: {
        'X-Admin-Token': localStorage.getItem('adminToken') || '',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });
    
    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Failed to fetch files: ${response.status} - ${errorData}`);
    }
    
    const data = await response.json();
    logUserActivity(`Browsed files at path: ${currentPath}`);
    return data;
  } catch (error) {
    console.error("Error fetching files:", error);
    toast({
      title: "Error",
      description: "Failed to fetch files. Check console for details.",
      variant: "destructive"
    });
    return [];
  }
};

export const uploadFile = async (currentPath: string, file: File): Promise<boolean> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`/api/file-explorer/index.php?action=upload&path=${encodeURIComponent(currentPath)}`, {
      method: 'POST',
      headers: {
        'X-Admin-Token': localStorage.getItem('adminToken') || ''
      },
      body: formData
    });
    
    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Failed to upload file: ${response.status} - ${errorData}`);
    }
    
    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error || 'Unknown upload error');
    }
    
    logUserActivity(`Uploaded file: ${file.name} to ${currentPath}`);
    return true;
  } catch (error) {
    console.error("Error uploading file:", error);
    toast({
      title: "Upload failed",
      description: error instanceof Error ? error.message : "There was an error uploading the file",
      variant: "destructive"
    });
    return false;
  }
};

export const deleteFile = async (file: FileItem): Promise<boolean> => {
  try {
    const response = await fetch(`/api/file-explorer/index.php?action=delete&path=${encodeURIComponent(file.path)}`, {
      method: 'DELETE',
      headers: {
        'X-Admin-Token': localStorage.getItem('adminToken') || ''
      }
    });
    
    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Failed to delete file: ${response.status} - ${errorData}`);
    }
    
    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error || 'Unknown delete error');
    }
    
    logUserActivity(`Deleted file: ${file.name} from ${file.path.substring(0, file.path.lastIndexOf('/') || 0)}`);
    return true;
  } catch (error) {
    console.error("Error deleting file:", error);
    toast({
      title: "Delete failed",
      description: error instanceof Error ? error.message : "There was an error deleting the file",
      variant: "destructive"
    });
    return false;
  }
};

export const renameFile = async (file: FileItem, newName: string): Promise<boolean> => {
  try {
    const formData = new FormData();
    formData.append('newName', newName);
    
    const response = await fetch(`/api/file-explorer/index.php?action=rename&path=${encodeURIComponent(file.path)}`, {
      method: 'POST',
      headers: {
        'X-Admin-Token': localStorage.getItem('adminToken') || ''
      },
      body: formData
    });
    
    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Failed to rename file: ${response.status} - ${errorData}`);
    }
    
    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error || 'Unknown rename error');
    }
    
    logUserActivity(`Renamed file: ${file.name} to ${newName}`);
    return true;
  } catch (error) {
    console.error("Error renaming file:", error);
    toast({
      title: "Rename failed",
      description: error instanceof Error ? error.message : "There was an error renaming the file",
      variant: "destructive"
    });
    return false;
  }
};

export const runBuild = async (): Promise<boolean> => {
  try {
    const response = await fetch(`/api/file-explorer/index.php?action=build`, {
      method: 'POST',
      headers: {
        'X-Admin-Token': localStorage.getItem('adminToken') || ''
      }
    });
    
    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Failed to run build: ${response.status} - ${errorData}`);
    }
    
    const data = await response.json();
    logUserActivity("Ran build to update website");
    
    // Check for build errors in output
    if (data.output && Array.isArray(data.output)) {
      const hasErrors = data.output.some((line: string) => line.toLowerCase().includes('error'));
      if (hasErrors) {
        toast({
          title: "Build completed with errors",
          description: "There were some issues during the build process",
          variant: "destructive" // Changed from "warning" to "destructive" to match available variant types
        });
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error("Error during build:", error);
    toast({
      title: "Build failed",
      description: error instanceof Error ? error.message : "There was an error updating the website",
      variant: "destructive"
    });
    return false;
  }
};
