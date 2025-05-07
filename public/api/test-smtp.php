<?php
/**
 * EnderHOST SMTP Testing Utility
 * 
 * This script is used to test the SMTP configuration and ensure emails can be sent correctly.
 * Access this file directly in your browser to run the test: http://your-domain.com/api/test-smtp.php
 */

// Load configuration
require_once '../config.php';

// Check if we're in a web environment
$is_cli = (php_sapi_name() == 'cli');

// Set headers for web environment
if (!$is_cli) {
    header('Content-Type: text/html; charset=UTF-8');
}

// Set up error logging
function logError($message, $type = 'INFO') {
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

// Function to output messages appropriately
function output($message, $is_error = false) {
    global $is_cli;
    
    if ($is_cli) {
        echo ($is_error ? "ERROR: " : "") . $message . PHP_EOL;
    } else {
        echo "<p" . ($is_error ? " style='color:red'" : "") . ">" . htmlspecialchars($message) . "</p>";
    }
}

// Start output
if (!$is_cli) {
    echo "<!DOCTYPE html>
    <html>
    <head>
        <title>EnderHOST SMTP Test</title>
        <style>
            body { font-family: Arial, sans-serif; max-width: 800px; margin: 20px auto; padding: 20px; }
            .success { color: green; }
            .error { color: red; }
            .info { color: blue; }
            pre { background: #f5f5f5; padding: 10px; overflow: auto; }
            .container { border: 1px solid #ddd; padding: 20px; border-radius: 5px; }
            .header { background-color: #000; color: #fff; padding: 15px; margin-bottom: 20px; border-radius: 5px; }
            .header h1 { margin: 0; }
            .header h1 span { color: #00C853; }
            button { background-color: #00C853; border: none; color: white; padding: 10px 15px; 
                    text-align: center; text-decoration: none; display: inline-block; font-size: 16px; 
                    margin: 4px 2px; cursor: pointer; border-radius: 5px; }
        </style>
    </head>
    <body>
        <div class='header'>
            <h1>Ender<span>HOST</span> SMTP Configuration Test</h1>
        </div>
        <div class='container'>";
}

// Log that this test was run
logError("SMTP test script run at " . date('Y-m-d H:i:s'), "TEST");

output("Testing SMTP Configuration...", false);
output("SMTP Host: " . SMTP_HOST, false);
output("SMTP Port: " . SMTP_PORT, false);
output("SMTP User: " . SMTP_USER, false);
output("SMTP From: " . SMTP_FROM_EMAIL, false);

// Check if logs directory exists and is writable
$log_dir = dirname(ERROR_LOG_PATH);
if (!is_dir($log_dir)) {
    if (mkdir($log_dir, 0755, true)) {
        output("Created logs directory: " . $log_dir, false);
    } else {
        output("Failed to create logs directory: " . $log_dir, true);
    }
} else {
    output("Logs directory exists: " . $log_dir, false);
    
    if (is_writable($log_dir)) {
        output("Logs directory is writable.", false);
    } else {
        output("Logs directory is not writable! Please check permissions.", true);
    }
}

// Test writing to log file
try {
    logError("Test log entry from SMTP test script", "TEST");
    output("Successfully wrote to log file: " . ERROR_LOG_PATH, false);
} catch (Exception $e) {
    output("Failed to write to log file: " . $e->getMessage(), true);
}

// Check if PHPMailer is properly installed
$phpmailer_files = [
    __DIR__ . '/lib/PHPMailer/src/Exception.php',
    __DIR__ . '/lib/PHPMailer/src/PHPMailer.php',
    __DIR__ . '/lib/PHPMailer/src/SMTP.php'
];

$phpmailer_missing = false;
foreach ($phpmailer_files as $file) {
    if (!file_exists($file)) {
        $phpmailer_missing = true;
        output("PHPMailer file missing: $file", true);
    }
}

if ($phpmailer_missing) {
    output("PHPMailer is not properly installed. Please check the README.md file for installation instructions.", true);
    
    if (!$is_cli) {
        echo "<div class='error' style='background-color: #ffeeee; padding: 15px; border: 1px solid #ffcccc; margin-top: 20px;'>
            <h3>PHPMailer Not Found</h3>
            <p>Please follow these steps to install PHPMailer:</p>
            <ol>
                <li>Download PHPMailer from <a href='https://github.com/PHPMailer/PHPMailer/releases' target='_blank'>GitHub</a></li>
                <li>Extract the files to the <code>public/api/lib/PHPMailer</code> directory</li>
                <li>Make sure the directory structure is:</li>
                <ul>
                    <li><code>api/lib/PHPMailer/src/Exception.php</code></li>
                    <li><code>api/lib/PHPMailer/src/PHPMailer.php</code></li>
                    <li><code>api/lib/PHPMailer/src/SMTP.php</code></li>
                </ul>
                <li>Return to this page to run the test again</li>
            </ol>
        </div>";
    }
} else {
    output("PHPMailer files found successfully.", false);
    
    // Include PHPMailer
    require_once __DIR__ . '/lib/PHPMailer/src/Exception.php';
    require_once __DIR__ . '/lib/PHPMailer/src/PHPMailer.php';
    require_once __DIR__ . '/lib/PHPMailer/src/SMTP.php';
    
    use PHPMailer\PHPMailer\PHPMailer;
    use PHPMailer\PHPMailer\Exception;
    
    // Send test email
    output("<h3>Attempting to send test email using AWS SES...</h3>", false);

    try {
        $mail = new PHPMailer(true);
        
        // Server settings
        $mail->SMTPDebug = 3; // Enable verbose debug output
        $mail->isSMTP();
        $mail->Host = SMTP_HOST;
        $mail->SMTPAuth = true;
        $mail->Username = SMTP_USER;
        $mail->Password = SMTP_PASS;
        $mail->SMTPSecure = 'tls';
        $mail->Port = SMTP_PORT;
        
        // Recipients
        $mail->setFrom(SMTP_FROM_EMAIL, SMTP_FROM_NAME);
        $mail->addAddress(ADMIN_EMAIL);
        
        // Content
        $mail->isHTML(true);
        $mail->Subject = 'EnderHOST SMTP Test - ' . date('Y-m-d H:i:s');
        $mail->Body = '
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #000; color: #fff; padding: 20px; text-align: center;">
                <h1>EnderHOST SMTP Test</h1>
            </div>
            <div style="padding: 20px; border: 1px solid #ddd; border-top: none;">
                <h2>Testing SMTP Configuration</h2>
                <p>This is a test email to verify SMTP configuration is working correctly.</p>
                <p>If you received this email, your SMTP settings are correct!</p>
                <p><strong>Time sent:</strong> ' . date('Y-m-d H:i:s') . '</p>
                <p><strong>Server Info:</strong> ' . $_SERVER['SERVER_NAME'] . '</p>
            </div>
        </div>';
        $mail->AltBody = 'This is a test email to verify SMTP configuration is working correctly. Time: ' . date('Y-m-d H:i:s');
        
        // Capture debug output
        ob_start();
        $send_result = $mail->send();
        $smtp_output = ob_get_clean();
        
        output("<span class='success'>Test email sent successfully!</span>", false);
        output("<h4>Debug Output:</h4>", false);
        
        if (!$is_cli) {
            echo "<pre>";
        }
        echo htmlspecialchars($smtp_output);
        if (!$is_cli) {
            echo "</pre>";
        }
        
        // Log success
        logError("SMTP test email sent successfully to " . ADMIN_EMAIL, "SUCCESS");
        
    } catch (Exception $e) {
        output("<span class='error'>Error sending test email: " . $mail->ErrorInfo . "</span>", true);
        logError("SMTP test failed: " . $mail->ErrorInfo, "ERROR");
        
        // Show more debugging info
        if (!$is_cli) {
            echo "<div class='error' style='background-color: #ffeeee; padding: 15px; border: 1px solid #ffcccc; margin-top: 20px;'>
                <h3>Troubleshooting Steps</h3>
                <ol>
                    <li>Check that your SMTP credentials in config.php are correct</li>
                    <li>Verify that your SMTP provider (Brevo) hasn't blocked your account</li>
                    <li>Make sure port " . SMTP_PORT . " is not blocked by your server's firewall</li>
                    <li>Check if your server's IP is blacklisted by the SMTP provider</li>
                    <li>Try temporarily disabling any security software that might be blocking outbound connections</li>
                </ol>
            </div>";
        }
    }
}

// Server info for debugging
output("<h3>Server Information</h3>", false);
output("PHP Version: " . phpversion(), false);
output("Server Software: " . $_SERVER['SERVER_SOFTWARE'], false);
output("Server Name: " . $_SERVER['SERVER_NAME'], false);

// Check PHP mail function
if (function_exists('mail')) {
    output("PHP mail() function is available.", false);
} else {
    output("PHP mail() function is not available!", true);
}

// Test PHP's mail function as a fallback
if (!$phpmailer_missing && !$success) {
    output("<h3>Testing PHP's mail() function as a fallback</h3>", false);
    
    $to = ADMIN_EMAIL;
    $subject = "EnderHOST Mail Function Test - " . date('Y-m-d H:i:s');
    $message = "This is a test email sent using PHP's mail() function.\n\nTime: " . date('Y-m-d H:i:s');
    $headers = "From: " . SMTP_FROM_EMAIL . "\r\n" .
               "Reply-To: " . SMTP_FROM_EMAIL . "\r\n" .
               "X-Mailer: PHP/" . phpversion();
    
    if (mail($to, $subject, $message, $headers)) {
        output("<span class='success'>Mail sent successfully using PHP's mail() function!</span>", false);
        logError("Test email sent using PHP's mail() function to " . ADMIN_EMAIL, "SUCCESS");
    } else {
        output("<span class='error'>Failed to send mail using PHP's mail() function.</span>", true);
        logError("Failed to send test email using PHP's mail() function", "ERROR");
    }
}

// Check for common extensions required by PHPMailer
$required_extensions = ['openssl', 'curl', 'mbstring', 'fileinfo'];
output("<h3>PHP Extensions</h3>", false);
foreach ($required_extensions as $ext) {
    if (extension_loaded($ext)) {
        output("Extension $ext: <span class='success'>Loaded</span>", false);
    } else {
        output("Extension $ext: <span class='error'>Not loaded (Required by PHPMailer)</span>", true);
    }
}

// Add manual test button
if (!$is_cli) {
    echo "<div style='margin-top: 20px; text-align: center;'>
        <form method='post'>
            <input type='hidden' name='send_test' value='1'>
            <button type='submit'>Send Another Test Email</button>
        </form>
    </div>";
}

if (!$is_cli) {
    echo "</div></body></html>";
}
