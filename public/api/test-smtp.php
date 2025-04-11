
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
        
        // Also log to error_log for server debugging
        error_log("EnderHOST SMTP Test: $type - $message");
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
            body { font-family: Arial, sans-serif; max-width: 800px; margin: 20px auto; padding: 20px; background-color: #f5f5f5; }
            .success { color: green; font-weight: bold; }
            .error { color: red; font-weight: bold; }
            .info { color: blue; }
            pre { background: #f0f0f0; padding: 10px; overflow: auto; border: 1px solid #ddd; border-radius: 4px; }
            .container { border: 1px solid #ddd; padding: 20px; border-radius: 5px; background-color: white; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .header { background-color: #000; color: #fff; padding: 15px; margin-bottom: 20px; border-radius: 5px; }
            .header h1 { margin: 0; }
            .header h1 span { color: #00C853; }
            button { background-color: #00C853; border: none; color: white; padding: 10px 20px; 
                   text-align: center; text-decoration: none; display: inline-block; font-size: 16px; 
                   margin: 4px 2px; cursor: pointer; border-radius: 5px; }
            .panel { border: 1px solid #ddd; margin: 15px 0; padding: 15px; border-radius: 5px; }
            .panel h3 { margin-top: 0; border-bottom: 1px solid #eee; padding-bottom: 10px; }
            table { width: 100%; border-collapse: collapse; }
            table th { text-align: left; background-color: #f5f5f5; }
            table th, table td { padding: 8px; border-bottom: 1px solid #ddd; }
            .nav-tabs { display: flex; margin-bottom: 20px; }
            .nav-tab { padding: 10px 20px; cursor: pointer; background-color: #f0f0f0; margin-right: 5px; border-radius: 5px 5px 0 0; }
            .nav-tab.active { background-color: #fff; border: 1px solid #ddd; border-bottom: none; }
            .tab-content { display: none; }
            .tab-content.active { display: block; }
        </style>
        <script>
            function switchTab(evt, tabName) {
                // Hide all tab contents
                var tabcontents = document.getElementsByClassName('tab-content');
                for (var i = 0; i < tabcontents.length; i++) {
                    tabcontents[i].style.display = 'none';
                }
                
                // Remove active class from all tabs
                var tabs = document.getElementsByClassName('nav-tab');
                for (var i = 0; i < tabs.length; i++) {
                    tabs[i].className = tabs[i].className.replace(' active', '');
                }
                
                // Show the current tab and add active class
                document.getElementById(tabName).style.display = 'block';
                evt.currentTarget.className += ' active';
            }
        </script>
    </head>
    <body>
        <div class='header'>
            <h1>Ender<span>HOST</span> SMTP Configuration Test</h1>
        </div>
        <div class='container'>";
}

// Log that this test was run
logError("SMTP test script run at " . date('Y-m-d H:i:s'), "TEST");

// Configure whether to run test automatically
$run_test = isset($_GET['test']) || isset($_POST['send_test']);
$test_email = isset($_POST['test_email']) ? $_POST['test_email'] : ADMIN_EMAIL;

// Output SMTP configuration
output("<h2>SMTP Configuration</h2>", false);
output("<table>
    <tr><th>Setting</th><th>Value</th></tr>
    <tr><td>SMTP Host</td><td>" . SMTP_HOST . "</td></tr>
    <tr><td>SMTP Port</td><td>" . SMTP_PORT . "</td></tr>
    <tr><td>SMTP User</td><td>" . SMTP_USER . "</td></tr>
    <tr><td>SMTP From</td><td>" . SMTP_FROM_EMAIL . "</td></tr>
    <tr><td>SMTP From Name</td><td>" . SMTP_FROM_NAME . "</td></tr>
    <tr><td>Admin Email (recipient)</td><td>" . ADMIN_EMAIL . "</td></tr>
</table>", false);

// Check if logs directory exists and is writable
$log_dir = dirname(ERROR_LOG_PATH);
output("<h2>Logging Configuration</h2>", false);

if (!is_dir($log_dir)) {
    if (mkdir($log_dir, 0755, true)) {
        output("<span class='success'>✓ Created logs directory: " . htmlspecialchars($log_dir) . "</span>", false);
    } else {
        output("<span class='error'>✗ Failed to create logs directory: " . htmlspecialchars($log_dir) . "</span>", true);
    }
} else {
    output("<span class='success'>✓ Logs directory exists: " . htmlspecialchars($log_dir) . "</span>", false);
    
    if (is_writable($log_dir)) {
        output("<span class='success'>✓ Logs directory is writable</span>", false);
    } else {
        output("<span class='error'>✗ Logs directory is not writable! Please check permissions</span>", true);
    }
}

// Test writing to log file
try {
    logError("Test log entry from SMTP test script", "TEST");
    output("<span class='success'>✓ Successfully wrote to log file: " . htmlspecialchars(ERROR_LOG_PATH) . "</span>", false);
} catch (Exception $e) {
    output("<span class='error'>✗ Failed to write to log file: " . htmlspecialchars($e->getMessage()) . "</span>", true);
}

// Check for PHPMailer Installation
$phpmailer_files = [
    __DIR__ . '/lib/PHPMailer/src/Exception.php',
    __DIR__ . '/lib/PHPMailer/src/PHPMailer.php',
    __DIR__ . '/lib/PHPMailer/src/SMTP.php'
];

output("<h2>PHPMailer Installation</h2>", false);

$phpmailer_missing = false;
foreach ($phpmailer_files as $file) {
    if (!file_exists($file)) {
        $phpmailer_missing = true;
        output("<span class='error'>✗ PHPMailer file missing: " . htmlspecialchars($file) . "</span>", true);
    } else {
        output("<span class='success'>✓ Found PHPMailer file: " . htmlspecialchars(basename($file)) . "</span>", false);
    }
}

if ($phpmailer_missing) {
    output("<div class='error' style='background-color: #ffeeee; padding: 15px; border: 1px solid #ffcccc; margin-top: 20px;'>
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
        
        <p>Quick Installation Guide (for SSH access):</p>
        <pre>
cd public/api
mkdir -p lib
cd lib
git clone https://github.com/PHPMailer/PHPMailer.git
cd PHPMailer
git checkout v6.8.0  # or the latest stable version
        </pre>
    </div>", false);
} else {
    output("<span class='success'>✓ All PHPMailer files found successfully</span>", false);
    
    // Include PHPMailer
    require_once __DIR__ . '/lib/PHPMailer/src/Exception.php';
    require_once __DIR__ . '/lib/PHPMailer/src/PHPMailer.php';
    require_once __DIR__ . '/lib/PHPMailer/src/SMTP.php';
    
    use PHPMailer\PHPMailer\PHPMailer;
    use PHPMailer\PHPMailer\Exception;
    use PHPMailer\PHPMailer\SMTP;
    
    // Check PHP extensions
    $required_extensions = ['openssl', 'curl', 'mbstring', 'fileinfo'];
    output("<h2>PHP Extensions</h2>", false);
    $all_extensions_loaded = true;
    
    output("<table><tr><th>Extension</th><th>Status</th><th>Required By</th></tr>", false);
    foreach ($required_extensions as $ext) {
        if (extension_loaded($ext)) {
            output("<tr><td>{$ext}</td><td><span class='success'>✓ Loaded</span></td><td>PHPMailer</td></tr>", false);
        } else {
            output("<tr><td>{$ext}</td><td><span class='error'>✗ Not loaded</span></td><td>PHPMailer - Required!</td></tr>", true);
            $all_extensions_loaded = false;
        }
    }
    output("</table>", false);
    
    if (!$all_extensions_loaded) {
        output("<div class='error' style='background-color: #ffeeee; padding: 15px; border: 1px solid #ffcccc; margin-top: 20px;'>
            <h3>Missing Required PHP Extensions</h3>
            <p>One or more required PHP extensions are missing. Please contact your web hosting provider to enable these extensions.</p>
        </div>", true);
    }
    
    // Server info for debugging
    output("<h2>Server Information</h2>", false);
    output("<table>
        <tr><th>PHP Version</th><td>" . phpversion() . "</td></tr>
        <tr><th>Server Software</th><td>" . $_SERVER['SERVER_SOFTWARE'] . "</td></tr>
        <tr><th>Server Name</th><td>" . $_SERVER['SERVER_NAME'] . "</td></tr>
        <tr><th>PHP mail() Function</th><td>" . (function_exists('mail') ? "<span class='success'>✓ Available</span>" : "<span class='error'>✗ Not available</span>") . "</td></tr>
    </table>", false);
    
    // Send test email
    if ($run_test && !$phpmailer_missing && $all_extensions_loaded) {
        output("<h2>Email Test Results</h2>", false);
        output("<div class='panel'>", false);
        output("<h3>Attempting to send test email...</h3>", false);
        
        try {
            $mail = new PHPMailer(true);
            
            // Capture debug output
            ob_start();
            
            // Server settings
            $mail->SMTPDebug = 3; // Enable verbose debug output
            $mail->Debugoutput = function($str, $level) { 
                echo "$str<br>";
                logError("PHPMailer Debug: $str", "MAIL_DEBUG"); 
            };
            
            $mail->isSMTP();
            $mail->Host = SMTP_HOST;
            $mail->SMTPAuth = true;
            $mail->Username = SMTP_USER;
            $mail->Password = SMTP_PASS;
            $mail->SMTPSecure = 'tls';
            $mail->Port = SMTP_PORT;
            $mail->Timeout = 30; // Set timeout to 30 seconds
            
            // Recipients
            $mail->setFrom(SMTP_FROM_EMAIL, SMTP_FROM_NAME);
            $mail->addAddress($test_email);
            
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
            
            // Send the message
            if ($mail->send()) {
                output("<span class='success'>✓ Test email sent successfully to {$test_email}!</span>", false);
                logError("SMTP test email sent successfully to " . $test_email, "SUCCESS");
            } else {
                output("<span class='error'>✗ Error sending test email: " . $mail->ErrorInfo . "</span>", true);
                logError("SMTP test failed: " . $mail->ErrorInfo, "ERROR");
            }
            
            // Get debug output
            $smtp_output = ob_get_clean();
            
            output("<h4>Debug Output:</h4>", false);
            output("<pre>{$smtp_output}</pre>", false);
            
        } catch (Exception $e) {
            output("<span class='error'>✗ Exception caught: " . $e->getMessage() . "</span>", true);
            logError("SMTP test exception: " . $e->getMessage(), "ERROR");
        }
        
        output("</div>", false);
    }
    
    // Test PHP's mail function as a fallback
    if ($run_test && function_exists('mail')) {
        output("<h2>PHP mail() Function Test</h2>", false);
        output("<div class='panel'>", false);
        
        try {
            $to = $test_email;
            $subject = "EnderHOST PHP mail() Test - " . date('Y-m-d H:i:s');
            $message = "This is a test email sent using PHP's mail() function.\n\nTime: " . date('Y-m-d H:i:s');
            $headers = "From: " . SMTP_FROM_EMAIL . "\r\n" .
                       "Reply-To: " . SMTP_FROM_EMAIL . "\r\n" .
                       "X-Mailer: PHP/" . phpversion();
            
            if (mail($to, $subject, $message, $headers)) {
                output("<span class='success'>✓ Mail sent successfully using PHP's mail() function!</span>", false);
                logError("Test email sent using PHP's mail() function to " . $test_email, "SUCCESS");
            } else {
                output("<span class='error'>✗ Failed to send mail using PHP's mail() function.</span>", true);
                logError("Failed to send test email using PHP's mail() function", "ERROR");
            }
        } catch (Exception $e) {
            output("<span class='error'>✗ Exception in mail() function: " . $e->getMessage() . "</span>", true);
            logError("PHP mail() exception: " . $e->getMessage(), "ERROR");
        }
        
        output("</div>", false);
    }
}

// Add test forms
if (!$is_cli && !$phpmailer_missing) {
    echo "<div class='nav-tabs'>
        <div class='nav-tab active' onclick=\"switchTab(event, 'tab-smtp')\">SMTP Test</div>
        <div class='nav-tab' onclick=\"switchTab(event, 'tab-troubleshoot')\">Troubleshooting</div>
        <div class='nav-tab' onclick=\"switchTab(event, 'tab-logs')\">View Logs</div>
    </div>";
    
    echo "<div id='tab-smtp' class='tab-content active'>
        <div class='panel'>
            <h3>Send Test Email</h3>
            <form method='post'>
                <div style='margin-bottom: 15px;'>
                    <label for='test_email' style='display: block; margin-bottom: 5px;'>Email Address:</label>
                    <input type='email' id='test_email' name='test_email' value='" . htmlspecialchars(ADMIN_EMAIL) . "' style='width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;' required>
                </div>
                <input type='hidden' name='send_test' value='1'>
                <button type='submit'>Send Test Email</button>
            </form>
        </div>
    </div>";
    
    echo "<div id='tab-troubleshoot' class='tab-content' style='display:none;'>
        <div class='panel'>
            <h3>Troubleshooting Steps</h3>
            <ol>
                <li>Verify your SMTP credentials in the config.php file are correct</li>
                <li>Check if your SMTP provider (Brevo) allows connections from your server's IP</li>
                <li>Make sure your host allows outbound connections on port " . SMTP_PORT . "</li>
                <li>Try disabling any firewalls or security software temporarily</li>
                <li>If using a VPS, check if SMTP ports are not blocked</li>
            </ol>
            
            <h3>Common SMTP Issues</h3>
            <table>
                <tr>
                    <th>Error</th>
                    <th>Possible Solution</th>
                </tr>
                <tr>
                    <td>Connection timed out</td>
                    <td>Your server might be blocking outgoing connections on port " . SMTP_PORT . ". Contact your hosting provider.</td>
                </tr>
                <tr>
                    <td>Authentication failed</td>
                    <td>Double check your username and password in the config.php file.</td>
                </tr>
                <tr>
                    <td>Could not connect to SMTP host</td>
                    <td>Verify the SMTP host address and that your server can reach it.</td>
                </tr>
                <tr>
                    <td>SSL certificate problem</td>
                    <td>Your PHP installation might have outdated certificates or improper SSL configuration.</td>
                </tr>
            </table>
            
            <h3>Alternative Email Solutions</h3>
            <p>If you continue to have issues with SMTP, consider these alternatives:</p>
            <ul>
                <li>Try a different SMTP provider (SendGrid, MailGun, etc.)</li>
                <li>Use the PHP mail() function (less reliable but sometimes works)</li>
                <li>Consider using a transactional email API instead of SMTP</li>
            </ul>
        </div>
    </div>";
    
    echo "<div id='tab-logs' class='tab-content' style='display:none;'>
        <div class='panel'>
            <h3>Recent Log Entries</h3>";
    
    if (file_exists(ERROR_LOG_PATH)) {
        $log_content = file_get_contents(ERROR_LOG_PATH);
        $log_lines = array_slice(explode(PHP_EOL, $log_content), -50); // Get last 50 lines
        echo "<pre style='max-height: 400px; overflow-y: auto;'>";
        foreach ($log_lines as $line) {
            if (strpos($line, '[ERROR]') !== false) {
                echo "<span style='color:red'>" . htmlspecialchars($line) . "</span>\n";
            } elseif (strpos($line, '[SUCCESS]') !== false) {
                echo "<span style='color:green'>" . htmlspecialchars($line) . "</span>\n";
            } elseif (strpos($line, '[WARNING]') !== false) {
                echo "<span style='color:orange'>" . htmlspecialchars($line) . "</span>\n";
            } else {
                echo htmlspecialchars($line) . "\n";
            }
        }
        echo "</pre>";
    } else {
        echo "<p>No log file found at: " . htmlspecialchars(ERROR_LOG_PATH) . "</p>";
    }
    
    echo "</div>
    </div>";
}

if (!$is_cli) {
    echo "</div></body></html>";
}
