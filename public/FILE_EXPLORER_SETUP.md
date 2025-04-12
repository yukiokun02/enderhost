
# EnderHOST File Explorer Setup Guide

This guide provides the essential steps needed to make the file explorer component work on your VPS.

## Prerequisites

- VPS with Ubuntu/Debian
- PHP 8.x or Node.js (v18+)
- Nginx or Apache web server

## Setup Instructions

Follow these steps to enable the file explorer functionality:

### 1. Choose Your Backend Implementation

#### Option A: PHP Backend (Simpler)

1. Create the API directory:
```bash
mkdir -p /var/www/enderhost/public/api/file-explorer
```

2. Create the main API file `/var/www/enderhost/public/api/file-explorer/index.php`:
```php
<?php
// Set headers to allow API requests
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE, PUT');
header('Access-Control-Allow-Headers: Content-Type');

// Security: Only allow access to admin users
// Implement your authentication check here
if (!isAdminUser()) {
    http_response_code(403);
    echo json_encode(['error' => 'Access denied']);
    exit;
}

// Get the requested action and path
$action = $_GET['action'] ?? '';
$path = $_GET['path'] ?? '/';

// Sanitize path to prevent directory traversal
$basePath = realpath('/var/www/enderhost'); // Set this to your project root
$requestedPath = realpath($basePath . $path);

// Security check to ensure we're within the base directory
if (!$requestedPath || strpos($requestedPath, $basePath) !== 0) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid path']);
    exit;
}

// Handle different actions
switch ($action) {
    case 'list':
        // List files and directories
        $files = [];
        foreach (scandir($requestedPath) as $file) {
            if ($file === '.' || $file === '..') continue;
            
            $filePath = $requestedPath . '/' . $file;
            $relativePath = str_replace($basePath, '', $filePath);
            
            $files[] = [
                'name' => $file,
                'path' => $relativePath,
                'type' => is_dir($filePath) ? 'directory' : 'file',
                'size' => is_file($filePath) ? filesize($filePath) : null,
                'lastModified' => filemtime($filePath) * 1000,
                'extension' => is_file($filePath) ? pathinfo($file, PATHINFO_EXTENSION) : null
            ];
        }
        echo json_encode($files);
        break;
        
    case 'rename':
        // Rename a file or directory
        $newName = $_POST['newName'] ?? '';
        $oldPath = $requestedPath;
        $newPath = dirname($requestedPath) . '/' . $newName;
        
        if (rename($oldPath, $newPath)) {
            echo json_encode(['success' => true]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to rename file']);
        }
        break;
        
    case 'delete':
        // Delete a file or directory
        if (is_dir($requestedPath)) {
            // Recursive delete for directories
            $success = deleteDirectory($requestedPath);
        } else {
            $success = unlink($requestedPath);
        }
        
        if ($success) {
            echo json_encode(['success' => true]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to delete']);
        }
        break;
        
    case 'upload':
        // Handle file uploads
        if (!isset($_FILES['file'])) {
            http_response_code(400);
            echo json_encode(['error' => 'No file uploaded']);
            break;
        }
        
        $uploadedFile = $_FILES['file'];
        $targetPath = $requestedPath . '/' . basename($uploadedFile['name']);
        
        if (move_uploaded_file($uploadedFile['tmp_name'], $targetPath)) {
            echo json_encode(['success' => true]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to upload file']);
        }
        break;
        
    case 'build':
        // Run build script
        $output = [];
        $returnVar = 0;
        exec('cd ' . $basePath . ' && npm run build 2>&1', $output, $returnVar);
        
        if ($returnVar === 0) {
            echo json_encode(['success' => true, 'output' => $output]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Build failed', 'output' => $output]);
        }
        break;
        
    default:
        http_response_code(400);
        echo json_encode(['error' => 'Invalid action']);
}

// Helper function for recursive directory deletion
function deleteDirectory($dir) {
    if (!is_dir($dir)) return false;
    
    $files = array_diff(scandir($dir), ['.', '..']);
    foreach ($files as $file) {
        $path = $dir . '/' . $file;
        is_dir($path) ? deleteDirectory($path) : unlink($path);
    }
    
    return rmdir($dir);
}

// Helper function for authentication (implement this)
function isAdminUser() {
    // Implement your auth logic here
    // For now, we'll return true (REPLACE THIS WITH ACTUAL AUTH CHECK)
    return true;
}
?>
```

### 2. Update the File Explorer Component

Open `src/components/admin/FileExplorer.tsx` and replace the mock data functions with real API calls:

```typescript
// Example of how to update the fetchFiles function
const fetchFiles = async () => {
  setIsLoading(true);
  try {
    const response = await fetch(`/api/file-explorer/index.php?action=list&path=${encodeURIComponent(currentPath)}`);
    if (!response.ok) {
      throw new Error('Failed to fetch files');
    }
    const data = await response.json();
    setFiles(data);
    setIsLoading(false);
    
    logUserActivity(`Browsed files at path: ${currentPath}`);
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

// Similarly update handleUpload, handleDelete, handleRename, and runBuild functions
```

### 3. Configure Web Server

Add this to your Nginx configuration:

```nginx
# For PHP Backend
location ~ ^/api/file-explorer/.*\.php$ {
  include snippets/fastcgi-php.conf;
  fastcgi_pass unix:/var/run/php/php8.1-fpm.sock; # Update version as needed
  fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
  include fastcgi_params;
}
```

### 4. Set File Permissions

```bash
# Set proper permissions for the web server user
sudo chown -R www-data:www-data /var/www/enderhost
sudo find /var/www/enderhost -type d -exec chmod 755 {} \;
sudo find /var/www/enderhost -type f -exec chmod 644 {} \;

# Allow write permissions for specific directories
sudo chmod -R 775 /var/www/enderhost/public/lovable-uploads
sudo chmod -R 775 /var/www/enderhost/dist
```

### 5. Security Considerations

1. Implement proper authentication to protect your file explorer
2. Keep your file explorer behind admin authentication
3. Consider limiting access to specific directories only
4. Use HTTPS to encrypt all traffic

### 6. Testing Your Implementation

1. Log in to your admin dashboard
2. Navigate to the File Explorer
3. Try basic operations: list files, upload a file, rename a file, delete a file
4. Check server logs if you encounter issues:
```bash
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/php8.1-fpm.log
```

For any issues, check your server logs and verify API endpoints are correctly configured.
