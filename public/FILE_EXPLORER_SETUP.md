
# EnderHOST File Explorer Setup Guide

This guide will help you set up the file explorer functionality on your VPS, focusing only on what needs to be configured.

## Required VPS Setup Steps

1. **File Structure Setup**:
   ```bash
   # Create the API directory for the file explorer
   mkdir -p /var/www/enderhost/public/api/file-explorer
   ```

2. **File Permissions**:
   ```bash
   # Set proper permissions for the web server user
   sudo chown -R www-data:www-data /var/www/enderhost
   sudo find /var/www/enderhost -type d -exec chmod 755 {} \;
   sudo find /var/www/enderhost -type f -exec chmod 644 {} \;

   # Allow write permissions for specific directories
   sudo chmod -R 775 /var/www/enderhost/public/lovable-uploads
   sudo chmod -R 775 /var/www/enderhost/dist
   ```

3. **PHP Setup** (if using PHP):
   ```bash
   # Install PHP if not already installed
   sudo apt update
   sudo apt install php php-fpm
   ```

4. **Authentication Setup**: 
   Edit the `public/api/file-explorer/index.php` file to use your preferred authentication method. The current implementation provides a placeholder for checking admin sessions or using a token.

5. **Update Base Path**:
   In `public/api/file-explorer/index.php`, update the `$basePath` variable to match your actual project root:
   ```php
   $basePath = realpath('/var/www/enderhost'); // Change to your project path
   ```

## Testing the Implementation

After setting up everything:

1. Log in to your admin dashboard
2. Navigate to the File Explorer
3. Try basic operations: list files, upload a file, rename a file, delete a file

If you encounter issues, check your server logs:
```bash
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/php8.1-fpm.log  # Adjust version as needed
```

## Security Recommendations

1. Always access the file explorer through secure HTTPS
2. Implement proper authentication for the admin area
3. Restrict file operations to safe directories only
4. Consider implementing additional request validation
