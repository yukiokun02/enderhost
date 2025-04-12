
<?php
// Set headers to allow API requests
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE, PUT');
header('Access-Control-Allow-Headers: Content-Type');

// Security: Only allow access to admin users
// Implement your authentication check here
function isAdminUser() {
    // This is a placeholder - implement proper authentication check
    // For example, check for admin session or API key
    if (isset($_SERVER['HTTP_X_ADMIN_TOKEN']) && $_SERVER['HTTP_X_ADMIN_TOKEN'] === 'your-secure-token') {
        return true;
    }
    
    // Or check for session-based authentication
    session_start();
    if (isset($_SESSION['user_group']) && $_SESSION['user_group'] === 'admin') {
        return true;
    }
    
    return false;
}

// Check for admin access
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
?>
