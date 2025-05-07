
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
define('SMTP_HOST', 'email-smtp.ap-south-1.amazonaws.com');
define('SMTP_PORT', 587);
define('SMTP_USER', 'AKIAZ7OS72ZGTC3I2GQV');
define('SMTP_PASS', 'BCRfClIfmpjrla18owNHYgk43eYTJBgWWjkMrUQuzL4O');
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
?>
