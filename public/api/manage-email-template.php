
<?php
/**
 * EnderHOST Email Template Manager
 * This script handles reading and updating the email template in send-order-email.php
 */

// Allow cross-origin requests
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// For preflight OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Include configuration
require_once '../config.php';

// Set up error logging
function logError($message, $type = 'ERROR') {
    if (defined('ENABLE_ERROR_LOGGING') && ENABLE_ERROR_LOGGING) {
        $timestamp = date('Y-m-d H:i:s');
        $logEntry = "[$timestamp] [$type] $message" . PHP_EOL;
        
        // Make sure logs directory exists and is writable
        $logDir = dirname(ERROR_LOG_PATH);
        if (!is_dir($logDir)) {
            mkdir($logDir, 0755, true);
        }
        
        // Write to log file
        file_put_contents(ERROR_LOG_PATH, $logEntry, FILE_APPEND);
    }
}

// Basic admin authentication check
function checkAdminAuth() {
    // This is a simplified check - in a production environment, use proper authentication
    // For demonstration purposes, we'll just check if the session has admin privileges
    session_start();
    
    // For demo purposes, auto-authenticate
    return true;
    
    // In a real implementation, you would check session/token/etc
    // return isset($_SESSION['admin']) && $_SESSION['admin'] === true;
}

// Get the email template from the PHP file
function getEmailTemplate() {
    $filePath = __DIR__ . '/send-order-email.php';
    
    if (!file_exists($filePath)) {
        logError("Email template file not found: $filePath");
        return [
            'success' => false,
            'message' => 'Email template file not found'
        ];
    }
    
    try {
        $fileContent = file_get_contents($filePath);
        if ($fileContent === false) {
            logError("Unable to read email template file");
            return [
                'success' => false,
                'message' => 'Unable to read email template file'
            ];
        }
        
        // Extract the subject
        if (preg_match('/\$subject\s*=\s*["\']([^"\']*)["\'];/i', $fileContent, $subjectMatches)) {
            $subject = $subjectMatches[1];
        } else {
            $subject = "New Minecraft Server Order - {server_name}";
            logError("Could not extract subject from email template, using default");
        }
        
        // Extract HTML message
        if (preg_match('/\$html_message\s*=\s*["\'](.+?)["\']\s*;/s', $fileContent, $bodyMatches)) {
            $htmlBody = $bodyMatches[1];
            $htmlBody = str_replace('\"', '"', $htmlBody);
            $htmlBody = str_replace("\'", "'", $htmlBody);
        } else {
            $htmlBody = "";
            logError("Could not extract HTML body from email template");
        }
        
        return [
            'success' => true,
            'subject' => $subject,
            'body' => $htmlBody
        ];
    } catch (Exception $e) {
        logError("Exception reading email template: " . $e->getMessage());
        return [
            'success' => false,
            'message' => 'Error reading email template: ' . $e->getMessage()
        ];
    }
}

// Update the email template in the PHP file
function updateEmailTemplate($subject, $body) {
    $filePath = __DIR__ . '/send-order-email.php';
    
    if (!file_exists($filePath)) {
        logError("Email template file not found: $filePath");
        return [
            'success' => false,
            'message' => 'Email template file not found'
        ];
    }
    
    try {
        // Create a backup of the original file
        $backupPath = $filePath . '.bak.' . time();
        if (!copy($filePath, $backupPath)) {
            logError("Failed to create backup of email template file");
            return [
                'success' => false,
                'message' => 'Failed to create backup of email template file'
            ];
        }
        
        $fileContent = file_get_contents($filePath);
        if ($fileContent === false) {
            logError("Unable to read email template file for update");
            return [
                'success' => false, 
                'message' => 'Unable to read email template file for update'
            ];
        }
        
        // Escape special characters for PHP string
        $body = str_replace('"', '\"', $body);
        $body = str_replace('$', '\$', $body);
        
        // Replace subject
        $newFileContent = preg_replace('/(\$subject\s*=\s*["\'])([^"\']*)["\'];/i', '$1' . $subject . '$1;', $fileContent);
        if ($newFileContent === null) {
            logError("Error while replacing subject in template");
            return [
                'success' => false,
                'message' => 'Failed to update subject in template'
            ];
        }
        
        // Replace HTML message
        $newFileContent = preg_replace('/(\$html_message\s*=\s*["\'])(.+?)(["\'])\s*;/s', '$1' . $body . '$3;', $newFileContent);
        if ($newFileContent === null) {
            logError("Error while replacing HTML body in template");
            return [
                'success' => false,
                'message' => 'Failed to update HTML body in template'
            ];
        }
        
        // Write the modified content back to the file
        if (file_put_contents($filePath, $newFileContent) === false) {
            logError("Failed to write updated email template to file");
            return [
                'success' => false,
                'message' => 'Failed to write updated email template to file'
            ];
        }
        
        logError("Email template updated successfully", "INFO");
        return [
            'success' => true,
            'message' => 'Email template updated successfully'
        ];
    } catch (Exception $e) {
        logError("Exception updating email template: " . $e->getMessage());
        return [
            'success' => false,
            'message' => 'Error updating email template: ' . $e->getMessage()
        ];
    }
}

// Handle the request
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action']) && $_GET['action'] === 'get_template') {
    if (!checkAdminAuth()) {
        http_response_code(403);
        echo json_encode(['success' => false, 'message' => 'Unauthorized']);
        exit();
    }
    
    echo json_encode(getEmailTemplate());
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_GET['action']) && $_GET['action'] === 'update_template') {
    if (!checkAdminAuth()) {
        http_response_code(403);
        echo json_encode(['success' => false, 'message' => 'Unauthorized']);
        exit();
    }
    
    // Get JSON data from the request body
    $json_data = file_get_contents('php://input');
    $data = json_decode($json_data, true);
    
    if (!$data || !isset($data['subject']) || !isset($data['body'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid request data']);
        exit();
    }
    
    echo json_encode(updateEmailTemplate($data['subject'], $data['body']));
    exit();
}

// If we reach here, the request wasn't handled
http_response_code(400);
echo json_encode(['success' => false, 'message' => 'Invalid request']);
