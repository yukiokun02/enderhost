
<?php
/**
 * EnderHOST Configuration File
 * This file contains central configuration settings for the application
 */

// Database Configuration
define('DB_HOST', 'localhost');
define('DB_NAME', 'enderdb');
define('DB_USER', 'enderadmin');       // Database username
define('DB_PASS', 'STRONGhold12@');    // Database password

// Site Configuration
define('SITE_URL', 'http://enderhost.in'); // Your actual domain

// Email Configuration
define('ADMIN_EMAIL', 'mail.enderhost@gmail.com');
define('USE_SMTP', true); // Using SMTP for email delivery

// SMTP Configuration 
define('SMTP_HOST', 'smtp-relay.brevo.com');
define('SMTP_PORT', 587);
define('SMTP_USER', '87821c001@smtp-brevo.com');
define('SMTP_PASS', 'G5yfcVOZT84BaAMI');
define('SMTP_FROM_EMAIL', 'no-reply@enderhost.in');
define('SMTP_FROM_NAME', 'EnderHOST');

// Discord Configuration
define('DISCORD_WEBHOOK_URL', ''); // Add your Discord webhook URL if you want to receive notifications

// QR Payment Configuration
define('QR_UPI_ID', 'mail.enderhost@okhdfcbank');
define('QR_IMAGE_PATH', '/lovable-uploads/50fc961d-b5d5-493d-ab69-e4be0c7f1c90.png');

// Error Logging Configuration
define('ERROR_LOG_PATH', __DIR__ . '/logs/enderhost_errors.log');
define('ENABLE_ERROR_LOGGING', true);

// Email Duplication Prevention
define('EMAIL_DUPLICATE_PREVENTION', true); // Enable duplicate email prevention

// Character Encoding - Added to prevent character encoding issues
define('APP_CHARSET', 'UTF-8');

// Ensure log directory exists
$logDir = __DIR__ . '/logs';
if (!is_dir($logDir)) {
    mkdir($logDir, 0755, true);
}
?>
