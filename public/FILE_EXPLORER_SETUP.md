
# EnderHOST File Explorer Setup Guide

This document explains how to properly set up the file explorer functionality when deploying the EnderHOST website on your VPS.

## Overview

The file explorer component in the admin dashboard needs a backend API to work with your server's actual file system. This guide will help you set up that API.

## Prerequisites

- VPS with Ubuntu/Debian
- PHP 8.3 or Node.js (v18 or newer)
- Nginx or Apache web server
- Proper file system permissions

## Setup Instructions

### 1. Choose Your Backend Implementation

You have two main options for implementing the file explorer backend:

#### Option A: PHP Backend (Simpler)

1. **Create the API directory:**

```bash
mkdir -p /var/www/enderhost/public/api/file-explorer
```

2. **Create the main API file:**

Create a file at `/var/www/enderhost/public/api/file-explorer/index.php`:

```php
<?php
// Set headers to allow API requests
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE, PUT');
header('Access-Control-Allow-Headers: Content-Type');

// Security: Only allow access to admin users (implement your auth check)
require_once('../auth.php');
if (!isAdminUser()) {
    http_response_code(403);
    echo json_encode(['error' => 'Access denied']);
    exit;
}

// Get the requested action
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
                'lastModified' => filemtime($filePath) * 1000, // Convert to milliseconds for JS
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
    if (!is_dir($dir)) {
        return false;
    }
    
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
    // Example: check session, JWT token, etc.
    // For now, we'll assume the user is authenticated
    return true;
}
?>
```

3. **Create authentication helper:**

Create a file at `/var/www/enderhost/public/api/auth.php`:

```php
<?php
// Start session if not already started
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Check if user is authenticated and has admin privileges
function isAdminUser() {
    // If session exists and user is admin
    if (isset($_SESSION['isLoggedIn']) && 
        isset($_SESSION['userId']) && 
        isset($_SESSION['userGroup']) && 
        $_SESSION['isLoggedIn'] === true && 
        $_SESSION['userGroup'] === 'admin') {
        return true;
    }
    
    // Alternatively, check via JWT token in Authorization header
    $headers = getallheaders();
    if (isset($headers['Authorization'])) {
        $token = str_replace('Bearer ', '', $headers['Authorization']);
        // Verify JWT token (requires a JWT library)
        // return verifyAdminToken($token);
    }
    
    return false;
}
?>
```

#### Option B: Node.js Backend (More Flexible)

1. **Create a file explorer API folder:**

```bash
mkdir -p /var/www/enderhost/server/api
```

2. **Create a file explorer API file:**

Create a file at `/var/www/enderhost/server/api/file-explorer.js`:

```javascript
const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const multer = require('multer');
const { exec } = require('child_process');
const cors = require('cors');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Base path for file operations - set this to your project root
const BASE_PATH = path.resolve('/var/www/enderhost');

// Middleware to verify admin access
const verifyAdmin = (req, res, next) => {
    // Implement your authentication logic here
    // Example: check session, JWT token, etc.
    if (req.session?.user?.group === 'admin') {
        next();
    } else {
        res.status(403).json({ error: 'Access denied' });
    }
};

// Middleware to sanitize and validate path
const validatePath = (req, res, next) => {
    try {
        const requestPath = req.query.path || '/';
        const fullPath = path.resolve(path.join(BASE_PATH, requestPath));
        
        // Security check to prevent directory traversal
        if (!fullPath.startsWith(BASE_PATH)) {
            return res.status(403).json({ error: 'Access denied - path outside base directory' });
        }
        
        req.fullPath = fullPath;
        req.relativePath = requestPath;
        next();
    } catch (error) {
        res.status(400).json({ error: 'Invalid path' });
    }
};

// List files and directories
router.get('/list', verifyAdmin, validatePath, async (req, res) => {
    try {
        const entries = await fs.readdir(req.fullPath, { withFileTypes: true });
        
        const files = await Promise.all(entries.map(async (entry) => {
            const filePath = path.join(req.fullPath, entry.name);
            const stats = await fs.stat(filePath);
            const relativePath = path.join(req.relativePath, entry.name).replace(/\\/g, '/');
            
            return {
                name: entry.name,
                path: relativePath,
                type: entry.isDirectory() ? 'directory' : 'file',
                size: entry.isFile() ? stats.size : null,
                lastModified: stats.mtimeMs,
                extension: entry.isFile() ? path.extname(entry.name).slice(1) : null
            };
        }));
        
        res.json(files);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Rename file or directory
router.post('/rename', verifyAdmin, validatePath, async (req, res) => {
    try {
        const { newName } = req.body;
        if (!newName) {
            return res.status(400).json({ error: 'New name is required' });
        }
        
        const newPath = path.join(path.dirname(req.fullPath), newName);
        await fs.rename(req.fullPath, newPath);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete file or directory
router.delete('/delete', verifyAdmin, validatePath, async (req, res) => {
    try {
        const stats = await fs.stat(req.fullPath);
        
        if (stats.isDirectory()) {
            // Recursive delete
            await fs.rm(req.fullPath, { recursive: true, force: true });
        } else {
            await fs.unlink(req.fullPath);
        }
        
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Upload file
router.post('/upload', verifyAdmin, validatePath, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        
        const { originalname, path: tempPath } = req.file;
        const targetPath = path.join(req.fullPath, originalname);
        
        await fs.rename(tempPath, targetPath);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Run build command
router.post('/build', verifyAdmin, (req, res) => {
    exec('cd ' + BASE_PATH + ' && npm run build', (error, stdout, stderr) => {
        if (error) {
            return res.status(500).json({ 
                error: 'Build failed', 
                output: stderr 
            });
        }
        
        res.json({ 
            success: true, 
            output: stdout 
        });
    });
});

module.exports = router;

// Example usage in main Express app:
/*
const express = require('express');
const app = express();
const fileExplorerRouter = require('./api/file-explorer');

app.use(express.json());
app.use(cors());
app.use('/api/file-explorer', fileExplorerRouter);

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
*/
```

3. **Create a main server file:**

Create a file at `/var/www/enderhost/server/index.js`:

```javascript
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const fileExplorerRouter = require('./api/file-explorer');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(session({
    secret: 'your-secure-session-secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === 'production' }
}));

// Routes
app.use('/api/file-explorer', fileExplorerRouter);

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
```

4. **Install required packages:**

```bash
cd /var/www/enderhost/server
npm init -y
npm install express cors multer express-session
```

### 2. Update Frontend to Use Real API

Update the `FileExplorer.tsx` component to connect to your backend API instead of using mock data:

1. Open `src/components/admin/FileExplorer.tsx`
2. Replace the mock data functions with real API calls:

```typescript
// Example fetch function to replace mock data
const fetchFiles = async () => {
  setIsLoading(true);
  try {
    const response = await fetch(`/api/file-explorer/list?path=${encodeURIComponent(currentPath)}`);
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
```

3. Update all other file operations (upload, delete, rename, build) to use the real API endpoints

### 3. Configure Web Server

#### For PHP Backend:

Add this to your Nginx configuration:

```nginx
location ~ ^/api/file-explorer/.*\.php$ {
    include snippets/fastcgi-php.conf;
    fastcgi_pass unix:/var/run/php/php8.3-fpm.sock;
    fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
    include fastcgi_params;
    
    # Security headers
    add_header X-Content-Type-Options "nosniff";
    add_header X-Frame-Options "DENY";
}
```

#### For Node.js Backend:

Add this to your Nginx configuration:

```nginx
location /api/file-explorer {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
}
```

### 4. Set Up File Permissions

1. **Set proper permissions for the web server user:**

```bash
# For PHP/Nginx
sudo chown -R www-data:www-data /var/www/enderhost
sudo find /var/www/enderhost -type d -exec chmod 755 {} \;
sudo find /var/www/enderhost -type f -exec chmod 644 {} \;

# Allow write permissions for specific directories
sudo chmod -R 775 /var/www/enderhost/public/lovable-uploads
sudo chmod -R 775 /var/www/enderhost/dist
```

2. **Create a log directory:**

```bash
sudo mkdir -p /var/www/enderhost/logs
sudo chown www-data:www-data /var/www/enderhost/logs
sudo chmod 755 /var/www/enderhost/logs
```

### 5. Set Up Process Manager (for Node.js backend)

If you're using the Node.js backend, set up PM2 to keep it running:

```bash
# Install PM2
sudo npm install -g pm2

# Start the server
cd /var/www/enderhost/server
pm2 start index.js --name "enderhost-file-api"

# Make PM2 start on boot
pm2 startup
pm2 save
```

## Security Considerations

1. **Always authenticate users**: Only allow admin users to access the file explorer API
2. **Validate and sanitize paths**: Prevent directory traversal attacks
3. **Restrict access to sensitive files**: Limit which directories can be accessed
4. **Use HTTPS**: Encrypt all traffic between the client and server
5. **Implement rate limiting**: Prevent abuse of the API

## Troubleshooting

### Common Issues:

1. **Permission Denied**: Check file permissions for the web server user
2. **404 Not Found**: Verify API paths and Nginx configuration
3. **500 Internal Server Error**: Check server logs for PHP errors
4. **Build Command Fails**: Ensure Node.js is installed and npm is in PATH

### Check Logs:

```bash
# Nginx logs
sudo tail -f /var/log/nginx/error.log

# PHP logs
sudo tail -f /var/log/php8.3-fpm.log

# Node.js logs
pm2 logs enderhost-file-api
```

## Final Steps

1. **Test thoroughly**: Verify all file operations work properly
2. **Monitor performance**: Watch for any slow operations
3. **Set up regular backups**: Keep your files safe

For any issues, refer to the full documentation or contact support.
