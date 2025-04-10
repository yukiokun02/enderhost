
# EnderHOST Deployment Guide

This document explains how to deploy the EnderHOST website on your VPS.

## Prerequisites

- VPS with Ubuntu/Debian
- PHP 8.3 with required extensions
- MySQL/MariaDB
- Nginx
- Node.js (v18 or newer) and npm
- Git

## Deployment Steps

### 1. Initial Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install essential tools
sudo apt install git curl unzip -y

# Install Node.js v18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installations
node -v
npm -v
```

### 2. Install Required Software

```bash
# Install Nginx and MySQL
sudo apt install nginx mysql-server -y

# For PHP 8.3
sudo add-apt-repository ppa:ondrej/php -y
sudo apt update
sudo apt install php8.3 php8.3-fpm php8.3-mysql php8.3-mbstring php8.3-xml php8.3-curl php8.3-gd php8.3-zip -y
```

### 3. Clone the Repository

```bash
# Create web directory if not exists
sudo mkdir -p /var/www

# Clone the repository
cd /var/www
sudo git clone https://github.com/yourusername/enderhost.git
# OR upload your files using SFTP

# Set proper permissions
sudo chown -R www-data:www-data /var/www/enderhost
sudo chmod -R 755 /var/www/enderhost
```

### 4. Build the Frontend

```bash
# Navigate to project directory
cd /var/www/enderhost

# Install dependencies
npm install

# Build the project
npm run build

# The built files will be in the dist directory
```

### 5. Setup Database

```bash
# Login to MySQL
sudo mysql

# Create database and user (inside MySQL prompt)
CREATE DATABASE enderhost;
CREATE USER 'enderuser'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON enderhost.* TO 'enderuser'@'localhost';
FLUSH PRIVILEGES;
EXIT;

# Import database schema
sudo mysql enderhost < /var/www/enderhost/public/sql/database_setup.sql
```

### 6. Configure PHP Files

```bash
# Edit the config.php file
sudo nano /var/www/enderhost/public/config.php
```

Update the following settings in config.php:
- DB_HOST, DB_NAME, DB_USER, DB_PASS: Your database credentials
- SITE_URL: Your actual domain
- Email configuration (SMTP settings)
- QR payment details

### 7. Configure Nginx

Create an Nginx configuration file:

```bash
sudo nano /etc/nginx/sites-available/enderhost
```

Add this configuration:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;  # Replace with your domain
    root /var/www/enderhost/dist;  # Point to the built files
    index index.html index.php;

    # Handle React Router paths
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Serve static files
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # PHP API endpoint handling
    location ~ ^/api/.*\.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/var/run/php/php8.3-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }

    # Deny access to hidden files
    location ~ /\. {
        deny all;
    }
}
```

Enable the site and restart Nginx:

```bash
sudo ln -s /etc/nginx/sites-available/enderhost /etc/nginx/sites-enabled/
sudo nginx -t  # Test configuration
sudo systemctl restart nginx
```

### 8. Set Up SSL with Let's Encrypt

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get and install SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Verify auto-renewal is set up
sudo systemctl status certbot.timer
```

### 9. Create Required Directories

```bash
# Create logs directory for PHP errors
sudo mkdir -p /var/www/enderhost/logs
sudo chown www-data:www-data /var/www/enderhost/logs
```

## Maintenance and Updates

### Updating the Website

```bash
cd /var/www/enderhost
sudo git pull  # If deployed from git
# OR upload new files via SFTP

# Rebuild if needed
npm install
npm run build

# Reset permissions
sudo chown -R www-data:www-data /var/www/enderhost
```

### Database Backup

```bash
# Create a backup
sudo mysqldump -u enderuser -p enderhost > backup_$(date +%Y%m%d).sql
```

## Troubleshooting

- Check Nginx logs: `sudo tail -f /var/log/nginx/error.log`
- Check PHP logs: `sudo tail -f /var/log/php8.3-fpm.log`
- Check application logs: `sudo tail -f /var/www/enderhost/logs/enderhost_errors.log`
- Ensure database credentials are correct in config.php
- Verify PHP-FPM is running: `sudo systemctl status php8.3-fpm`
- Check file permissions: `ls -la /var/www/enderhost`

## System Requirements

- **CPU**: At least 2 cores recommended
- **RAM**: Minimum 2GB, 4GB recommended
- **Disk**: At least 20GB SSD storage
- **Bandwidth**: Depends on expected traffic, minimum 1TB/month recommended
