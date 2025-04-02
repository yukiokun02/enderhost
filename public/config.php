
<?php
/**
 * EnderHOST Configuration File
 * This file contains central configuration settings for the application
 */

// Database Configuration
define('DB_HOST', 'localhost');
define('DB_NAME', 'enderhost');
define('DB_USER', 'enderuser');       // Change this to your database username
define('DB_PASS', 'your_secure_password'); // Change this to your secure password

// Site Configuration
define('SITE_URL', 'http://yourdomain.com'); // Change this to your actual domain

// Email Configuration
define('ADMIN_EMAIL', 'mail.enderhost@gmail.com');
define('USE_SMTP', false); // Set to true to use SMTP instead of PHP mail()

// SMTP Configuration (only used if USE_SMTP is true)
define('SMTP_HOST', 'smtp.example.com');
define('SMTP_PORT', 587);
define('SMTP_USER', 'your_username');
define('SMTP_PASS', 'your_password');
define('SMTP_FROM_EMAIL', 'noreply@enderhost.in');
define('SMTP_FROM_NAME', 'EnderHOST');

// Discord Configuration
define('DISCORD_WEBHOOK_URL', ''); // Add your Discord webhook URL if you want to receive notifications

// QR Payment Configuration
define('QR_UPI_ID', 'mail.enderhost@okhdfcbank');
define('QR_IMAGE_PATH', '/lovable-uploads/50fc961d-b5d5-493d-ab69-e4be0c7f1c90.png');
?>
