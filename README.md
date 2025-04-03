
# EnderHOST - Minecraft Server Hosting Platform

## System Requirements

- PHP 7.4+ with cURL and mail functions enabled
- MySQL or MariaDB database
- Web server (Apache or Nginx)

## Installation and Setup

### 1. Database Setup

1. Create a MySQL database for EnderHOST
2. Import the SQL schema from `public/sql/database_setup.sql`
3. Update database credentials in `public/config.php`

### 2. Email System Setup

EnderHOST uses PHPMailer for sending emails. To set up:

1. Download PHPMailer from https://github.com/PHPMailer/PHPMailer/releases
2. Create the directory structure: `public/api/lib/PHPMailer`
3. Extract files to the `public/api/lib/PHPMailer` directory
4. The directory structure should be:
   - `public/api/lib/PHPMailer/src/Exception.php`
   - `public/api/lib/PHPMailer/src/PHPMailer.php`
   - `public/api/lib/PHPMailer/src/SMTP.php`

5. Configure SMTP settings in `public/config.php`:
   ```php
   // Email Configuration
   define('ADMIN_EMAIL', 'your-admin-email@example.com');
   define('USE_SMTP', true); // Set to true to use SMTP

   // SMTP Configuration
   define('SMTP_HOST', 'smtp-relay.brevo.com'); // Or your SMTP server
   define('SMTP_PORT', 587);
   define('SMTP_USER', 'your-smtp-username');
   define('SMTP_PASS', 'your-smtp-password');
   define('SMTP_FROM_EMAIL', 'noreply@enderhost.in');
   define('SMTP_FROM_NAME', 'EnderHOST');
   ```

6. Create the logs directory and ensure it's writable:
   ```bash
   mkdir -p public/logs
   chmod 755 public/logs
   ```

7. To test the email system, visit `http://your-domain.com/api/test-smtp.php`

### 3. Discord Webhook Setup (Optional)

To receive notifications on Discord when new orders are placed:

1. In your Discord server, go to Server Settings > Integrations > Webhooks
2. Create a new webhook, copy the URL
3. Update `public/config.php` with your webhook URL:
   ```php
   define('DISCORD_WEBHOOK_URL', 'your-discord-webhook-url');
   ```

### 4. QR Payment Setup

1. Update the UPI ID in `public/config.php`:
   ```php
   define('QR_UPI_ID', 'your-upi-id');
   ```

2. Make sure the QR code image is properly set:
   ```php
   define('QR_IMAGE_PATH', '/lovable-uploads/your-qr-code-image.png');
   ```

### 5. Error Logging

EnderHOST has a built-in error logging system that helps troubleshoot issues:

1. Logs are stored in `public/logs/enderhost_errors.log`
2. Make sure the logs directory is writable by the web server:
   ```bash
   chown www-data:www-data public/logs  # For Apache on Ubuntu/Debian
   chmod 755 public/logs
   touch public/logs/enderhost_errors.log
   chmod 644 public/logs/enderhost_errors.log
   chown www-data:www-data public/logs/enderhost_errors.log
   ```
3. To disable error logging, set `ENABLE_ERROR_LOGGING` to false in `public/config.php`
4. Check logs regularly to identify and fix issues

## Troubleshooting Email Issues

If you're experiencing issues with the email system:

1. **Check if PHPMailer is installed correctly:**
   - Verify that the PHPMailer files are in the correct location: `public/api/lib/PHPMailer/src/`
   - Make sure all required files are present: `Exception.php`, `PHPMailer.php`, and `SMTP.php`

2. **Run the SMTP test utility:**
   - Access `http://your-domain.com/api/test-smtp.php` in your browser
   - This will provide detailed diagnostic information about your SMTP configuration

3. **Check the error logs:**
   - Review logs at `public/logs/enderhost_errors.log`
   - Look for specific error messages related to email sending

4. **Verify SMTP credentials and settings:**
   - Ensure your SMTP host, port, username, and password are correct
   - Try a different port if necessary (common ports are 25, 465, 587)
   - Check if your SMTP provider (e.g., Brevo) requires any special configuration

5. **Verify PHP extensions:**
   - Make sure PHP has the required extensions enabled: `openssl`, `curl`, `mbstring`
   - These can be enabled in your `php.ini` file

6. **Check for IP or firewall restrictions:**
   - Some SMTP providers restrict which IP addresses can send emails
   - Verify your server's IP is not blacklisted
   - Check if your hosting provider blocks outgoing SMTP connections

7. **Test with PHP's built-in mail function:**
   - If SMTP isn't working, try setting `USE_SMTP` to `false` in `config.php`
   - This will use PHP's `mail()` function instead

## Security Notes

1. The `public/logs` directory is protected with .htaccess to prevent direct access
2. Regularly update the PHPMailer library to the latest version
3. Never expose your database or SMTP credentials
4. Consider using HTTPS for your entire site to protect sensitive data

## Folder Structure

- `public/` - Root web directory
  - `api/` - API endpoints for the application
    - `lib/` - Libraries including PHPMailer
    - `send-order-email.php` - Email notification system
    - `test-smtp.php` - SMTP testing utility
  - `logs/` - Error and access logs
  - `config.php` - Central configuration file
  - `payment-success.php` - Payment success page

## Support

For support or customization inquiries, contact:
- Discord: [EnderHOST Discord Server](https://discord.gg/bsGPB9VpUY)
- Email: mail.enderhost@gmail.com
