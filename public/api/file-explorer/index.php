
<?php
// Set headers to allow API requests
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Admin-Token');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Error reporting for debugging
ini_set('display_errors', 0);
error_reporting(E_ALL);
$logFile = __DIR__ . '/file_explorer_errors.log';

function logError($message) {
    global $logFile;
    $timestamp = date('Y-m-d H:i:s');
    $logMessage = "[$timestamp] $message\n";
    file_put_contents($logFile, $logMessage, FILE_APPEND);
}

// Security: Check for admin authentication
function isAdminUser() {
    // Check for admin token in header
    if (isset($_SERVER['HTTP_X_ADMIN_TOKEN'])) {
        $token = $_SERVER['HTTP_X_ADMIN_TOKEN'];
        
        // In a real implementation, verify this token against your database
        // For now, we'll use a simple check
        if (!empty($token)) {
            return true;
        }
    }
    
    // Check for session-based authentication
    session_start();
    if (isset($_SESSION['user_group']) && $_SESSION['user_group'] === 'admin') {
        return true;
    }
    
    return false;
}

// Check for admin access
if (!isAdminUser()) {
    http_response_code(403);
    echo json_encode(['success' => false, 'error' => 'Access denied']);
    exit;
}

// Get the requested action and path
$action = $_GET['action'] ?? '';
$path = $_GET['path'] ?? '/';

// Sanitize path to prevent directory traversal
// IMPORTANT: Change this to your actual project root
$basePath = realpath($_SERVER['DOCUMENT_ROOT'] . '/..');
$requestedPath = realpath($basePath . $path);

// Security check to ensure we're within the base directory
if (!$requestedPath || strpos($requestedPath, $basePath) !== 0) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid path']);
    exit;
}

try {
    // Handle different actions
    switch ($action) {
        case 'list':
            // List files and directories
            $files = [];
            $items = scandir($requestedPath);
            
            if ($items === false) {
                throw new Exception("Failed to scan directory: $requestedPath");
            }
            
            foreach ($items as $item) {
                if ($item === '.' || $item === '..') continue;
                
                $itemPath = $requestedPath . DIRECTORY_SEPARATOR . $item;
                $relativePath = str_replace($basePath, '', $itemPath);
                $relativePath = str_replace('\\', '/', $relativePath); // Normalize path separators
                
                // Get file info
                $isDir = is_dir($itemPath);
                $size = $isDir ? null : filesize($itemPath);
                $lastModified = filemtime($itemPath) * 1000;
                $extension = $isDir ? null : pathinfo($item, PATHINFO_EXTENSION);
                
                $files[] = [
                    'name' => $item,
                    'path' => $relativePath,
                    'type' => $isDir ? 'directory' : 'file',
                    'size' => $size,
                    'lastModified' => $lastModified,
                    'extension' => $extension
                ];
            }
            
            echo json_encode($files);
            break;
            
        case 'rename':
            // Rename a file or directory
            $newName = $_POST['newName'] ?? '';
            $oldPath = $requestedPath;
            $parentDir = dirname($requestedPath);
            $newPath = $parentDir . DIRECTORY_SEPARATOR . $newName;
            
            if (empty($newName)) {
                throw new Exception("New name cannot be empty");
            }
            
            if (!file_exists($oldPath)) {
                throw new Exception("Source file does not exist");
            }
            
            if (file_exists($newPath)) {
                throw new Exception("A file with that name already exists");
            }
            
            if (!rename($oldPath, $newPath)) {
                throw new Exception("Failed to rename file");
            }
            
            echo json_encode(['success' => true]);
            break;
            
        case 'delete':
            // Delete a file or directory
            if (!file_exists($requestedPath)) {
                throw new Exception("File does not exist");
            }
            
            if (is_dir($requestedPath)) {
                // Recursive delete for directories
                $success = deleteDirectory($requestedPath);
            } else {
                $success = unlink($requestedPath);
            }
            
            if (!$success) {
                throw new Exception("Failed to delete");
            }
            
            echo json_encode(['success' => true]);
            break;
            
        case 'upload':
            // Handle file uploads
            if (!isset($_FILES['file'])) {
                throw new Exception("No file uploaded");
            }
            
            $uploadedFile = $_FILES['file'];
            $targetPath = $requestedPath . DIRECTORY_SEPARATOR . basename($uploadedFile['name']);
            
            // Check if directory is writable
            if (!is_writable($requestedPath)) {
                throw new Exception("Directory is not writable: $requestedPath");
            }
            
            if (file_exists($targetPath)) {
                throw new Exception("A file with that name already exists");
            }
            
            if (!move_uploaded_file($uploadedFile['tmp_name'], $targetPath)) {
                throw new Exception("Failed to upload file: " . $uploadedFile['error']);
            }
            
            echo json_encode(['success' => true]);
            break;
            
        case 'build':
            // Run build script - adjust the build command to match your actual project setup
            $buildScript = "cd $basePath && npm run build 2>&1";
            $output = [];
            $returnVar = 0;
            
            exec($buildScript, $output, $returnVar);
            
            if ($returnVar === 0) {
                echo json_encode(['success' => true, 'output' => $output]);
            } else {
                echo json_encode([
                    'success' => false, 
                    'error' => 'Build failed',
                    'output' => $output,
                    'code' => $returnVar
                ]);
            }
            break;
            
        default:
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Invalid action']);
    }
} catch (Exception $e) {
    logError($e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}

// Helper function for recursive directory deletion
function deleteDirectory($dir) {
    if (!is_dir($dir)) return false;
    
    $files = array_diff(scandir($dir), ['.', '..']);
    foreach ($files as $file) {
        $path = $dir . DIRECTORY_SEPARATOR . $file;
        is_dir($path) ? deleteDirectory($path) : unlink($path);
    }
    
    return rmdir($dir);
}
?>
