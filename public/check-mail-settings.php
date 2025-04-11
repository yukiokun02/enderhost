
<?php
/**
 * EnderHOST Email Configuration Check
 * A simple script to verify your email settings and server configuration.
 * Access this file directly in your browser.
 */

header('Content-Type: text/html; charset=UTF-8');
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EnderHOST Email Settings Check</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 20px auto; padding: 20px; background-color: #f5f5f5; }
        .container { background-color: white; padding: 20px; border-radius: 5px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        h1 { color: #333; }
        h2 { margin-top: 20px; color: #444; }
        .success { color: green; font-weight: bold; }
        .warning { color: orange; font-weight: bold; }
        .error { color: red; font-weight: bold; }
        pre { background: #f0f0f0; padding: 10px; overflow: auto; white-space: pre-wrap; }
        .btn { background: #4CAF50; color: white; padding: 10px 15px; text-decoration: none; display: inline-block; margin-top: 15px; border-radius: 4px; }
        .block { margin: 15px 0; padding: 15px; background: #f9f9f9; border-left: 4px solid #ddd; }
    </style>
</head>
<body>
    <div class="container">
        <h1>EnderHOST Email Configuration Checker</h1>
        <p>This tool checks your server's email capabilities and settings.</p>

        <?php
        // Include configuration
        require_once 'config.php';
        
        echo "<h2>PHP Info</h2>";
        echo "<div class='block'>";
        echo "<p>PHP Version: <strong>" . phpversion() . "</strong></p>";
        echo "<p>Server: <strong>" . $_SERVER['SERVER_SOFTWARE'] . "</strong></p>";
        
        // Check if mail() function exists
        if (function_exists('mail')) {
            echo "<p class='success'>✓ PHP mail() function is available</p>";
        } else {
            echo "<p class='error'>✗ PHP mail() function is NOT available</p>";
        }
        
        // Check if logs directory is writable
        $log_dir = dirname(ERROR_LOG_PATH);
        if (is_dir($log_dir)) {
            if (is_writable($log_dir)) {
                echo "<p class='success'>✓ Logs directory exists and is writable</p>";
            } else {
                echo "<p class='error'>✗ Logs directory exists but is NOT writable</p>";
            }
        } else {
            echo "<p class='warning'>! Logs directory does not exist</p>";
            // Try to create it
            if (mkdir($log_dir, 0755, true)) {
                echo "<p class='success'>✓ Created logs directory</p>";
            } else {
                echo "<p class='error'>✗ Failed to create logs directory</p>";
            }
        }
        echo "</div>";
        
        // Check SMTP configuration
        echo "<h2>SMTP Configuration</h2>";
        echo "<div class='block'>";
        if (defined('USE_SMTP') && USE_SMTP === true) {
            echo "<p>SMTP is <strong>enabled</strong> in your configuration.</p>";
            echo "<table style='width:100%; border-collapse: collapse;'>";
            echo "<tr><td style='width:150px; padding:5px;'>SMTP Host:</td><td><strong>" . SMTP_HOST . "</strong></td></tr>";
            echo "<tr><td style='padding:5px;'>SMTP Port:</td><td><strong>" . SMTP_PORT . "</strong></td></tr>";
            echo "<tr><td style='padding:5px;'>SMTP User:</td><td><strong>" . SMTP_USER . "</strong></td></tr>";
            echo "<tr><td style='padding:5px;'>From Email:</td><td><strong>" . SMTP_FROM_EMAIL . "</strong></td></tr>";
            echo "<tr><td style='padding:5px;'>From Name:</td><td><strong>" . SMTP_FROM_NAME . "</strong></td></tr>";
            echo "</table>";
            
            // Check if we can connect to the SMTP server (simple check)
            $errno = 0;
            $errstr = '';
            $timeout = 5;
            echo "<p>Testing connection to SMTP server...</p>";
            $socket = @fsockopen(SMTP_HOST, SMTP_PORT, $errno, $errstr, $timeout);
            if ($socket) {
                echo "<p class='success'>✓ Successfully connected to SMTP server on port " . SMTP_PORT . "</p>";
                fclose($socket);
            } else {
                echo "<p class='error'>✗ Could not connect to SMTP server: $errstr (error $errno)</p>";
                echo "<p>This could indicate a network connectivity issue or port blocking.</p>";
            }
        } else {
            echo "<p class='warning'>! SMTP is <strong>disabled</strong> in your configuration. Using PHP mail() function instead.</p>";
        }
        echo "</div>";
        
        // Check for PHPMailer
        echo "<h2>PHPMailer Installation</h2>";
        echo "<div class='block'>";
        $phpmailer_files = [
            __DIR__ . '/api/lib/PHPMailer/src/Exception.php',
            __DIR__ . '/api/lib/PHPMailer/src/PHPMailer.php',
            __DIR__ . '/api/lib/PHPMailer/src/SMTP.php'
        ];
        
        $all_files_found = true;
        foreach ($phpmailer_files as $file) {
            if (file_exists($file)) {
                echo "<p class='success'>✓ Found: " . basename($file) . "</p>";
            } else {
                echo "<p class='error'>✗ Missing: " . basename($file) . "</p>";
                $all_files_found = false;
            }
        }
        
        if (!$all_files_found) {
            echo "<p>PHPMailer is not installed correctly. Follow these steps:</p>";
            echo "<ol>";
            echo "<li>Create directory: <code>api/lib/PHPMailer</code></li>";
            echo "<li>Download PHPMailer from <a href='https://github.com/PHPMailer/PHPMailer/releases' target='_blank'>GitHub</a></li>";
            echo "<li>Extract the files to the PHPMailer directory</li>";
            echo "</ol>";
        } else {
            echo "<p class='success'>✓ PHPMailer is correctly installed</p>";
        }
        echo "</div>";
        
        // Check for required PHP extensions
        echo "<h2>PHP Extensions</h2>";
        echo "<div class='block'>";
        $required_extensions = ['openssl', 'curl', 'mbstring', 'fileinfo'];
        $all_exts_found = true;
        
        foreach ($required_extensions as $ext) {
            if (extension_loaded($ext)) {
                echo "<p class='success'>✓ {$ext} extension is loaded</p>";
            } else {
                echo "<p class='error'>✗ {$ext} extension is NOT loaded</p>";
                $all_exts_found = false;
            }
        }
        
        if (!$all_exts_found) {
            echo "<p>Some required PHP extensions are missing. Contact your hosting provider to enable them.</p>";
        }
        echo "</div>";
        
        ?>

        <h2>Next Steps</h2>
        <div class='block'>
            <p>To test your email setup more thoroughly:</p>
            <p>1. Visit the <a href="api/test-smtp.php" class="btn">Email Test Tool</a> to send a test email</p>
            <p>2. Check your server's mail logs for any errors</p>
            <p>3. Verify with your hosting provider that they allow outbound SMTP connections</p>
        </div>
        
        <h2>Common Email Issues</h2>
        <div class='block'>
            <h3>SMTP Connection Issues</h3>
            <ul>
                <li><strong>Connection timeout</strong> - Your server may be blocking outgoing connections</li>
                <li><strong>Authentication failure</strong> - Check your SMTP username and password</li>
                <li><strong>Relay access denied</strong> - Your server IP may not be authorized with the SMTP provider</li>
            </ul>
            
            <h3>Email Delivery Issues</h3>
            <ul>
                <li><strong>Emails in spam</strong> - Need to set up SPF, DKIM, and DMARC records</li>
                <li><strong>Emails not arriving</strong> - Check spam folders and verify recipient address</li>
            </ul>
            
            <p>For Brevo specifically:</p>
            <ul>
                <li>Make sure your account is active and verified</li>
                <li>Check your sending limits and ensure you haven't hit them</li>
                <li>Verify your server's IP address is whitelisted with Brevo</li>
            </ul>
        </div>
    </div>
</body>
</html>
