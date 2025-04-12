
# EnderHOST File Explorer Setup Guide

This is a step-by-step guide to set up the file explorer feature on your VPS.

## Quick Setup Instructions

1. **Set Proper File Permissions**:
   ```bash
   # Set owner to web server user
   sudo chown -R www-data:www-data /var/www/yourdomain
   
   # Set correct permissions for directories
   sudo find /var/www/yourdomain -type d -exec chmod 755 {} \;
   
   # Set correct permissions for files
   sudo find /var/www/yourdomain -type f -exec chmod 644 {} \;
   
   # Make specific upload directories writable
   sudo chmod -R 775 /var/www/yourdomain/public/lovable-uploads
   sudo chmod -R 775 /var/www/yourdomain/dist
   ```

2. **Configure PHP File Explorer Backend**:
   - The PHP file `/public/api/file-explorer/index.php` is already included in the project.
   - You need to ensure the file is executable and has the correct permissions:
   ```bash
   sudo chmod 755 /var/www/yourdomain/public/api/file-explorer/index.php
   ```
   
3. **Update Base Path in the PHP File**:
   - Open `/public/api/file-explorer/index.php`
   - Find the line with `$basePath = realpath($_SERVER['DOCUMENT_ROOT'] . '/..');`
   - If needed, adjust this path to point to your actual project root

4. **Set Up Authentication**:
   - The file explorer requires authentication to work.
   - The current implementation checks for:
     - An admin token in the HTTP header `X-Admin-Token`
     - OR a PHP session with `user_group` set to 'admin'
   - You should update the `isAdminUser()` function with your actual authentication logic.

5. **Create Log Directory**:
   ```bash
   sudo mkdir -p /var/www/yourdomain/public/api/file-explorer/logs
   sudo chown www-data:www-data /var/www/yourdomain/public/api/file-explorer/logs
   ```

6. **Testing the Implementation**:
   - Log in to your admin dashboard
   - Navigate to the File Explorer tab
   - Try basic operations: list files, upload a file, rename a file, delete a file

## Troubleshooting

If you're experiencing issues with the file explorer:

1. **Check Error Logs**:
   ```bash
   sudo tail -f /var/log/nginx/error.log
   sudo tail -f /var/log/php*.log
   sudo cat /var/www/yourdomain/public/api/file-explorer/file_explorer_errors.log
   ```

2. **Common Issues and Solutions**:
   - **Files not showing/changes not saved**: Check file permissions
   - **Access denied errors**: Check authentication configuration
   - **Upload failures**: Check directory permissions and PHP upload limits
   - **Build not working**: Ensure npm is installed and the build script path is correct

3. **Debugging Tips**:
   - Try direct access to the API to test: `/api/file-explorer/index.php?action=list&path=/`
   - Check if correct admin token is being sent from frontend
   - Temporarily increase PHP error reporting level in the file explorer script
