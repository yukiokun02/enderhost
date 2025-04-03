
# PHPMailer for EnderHOST

This directory contains the PHPMailer library used for sending emails from the EnderHOST application.

## Installation

1. Download PHPMailer from https://github.com/PHPMailer/PHPMailer/releases
2. Extract the files to this directory (`public/api/lib/PHPMailer`)
3. The directory structure should be:
   - `lib/PHPMailer/src/Exception.php`
   - `lib/PHPMailer/src/PHPMailer.php`
   - `lib/PHPMailer/src/SMTP.php`

## Verifying Installation

After installing PHPMailer, you should verify that the correct files are present:

```bash
ls -la lib/PHPMailer/src/
```

You should see at least the following files:
- Exception.php
- PHPMailer.php
- SMTP.php

## Configuration

Configure your SMTP settings in the `config.php` file at the root of the public directory:

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

## Testing Email Functionality

To test if PHPMailer is working correctly:

1. Access `http://your-domain.com/api/test-smtp.php` in your browser
2. The test script will check if:
   - All PHPMailer files are present
   - SMTP settings are correctly configured
   - A test email can be successfully sent

## Troubleshooting

If emails are not being sent properly:

1. Check the error logs at `/logs/enderhost_errors.log`
2. Verify your SMTP credentials in `config.php`
3. Ensure the PHPMailer library is correctly installed
4. Make sure your SMTP provider (Brevo) has not blocked your account
5. Check if your server's IP is blacklisted by the SMTP provider
6. Verify that required PHP extensions are enabled: openssl, curl, mbstring
7. Check if your hosting provider blocks outgoing SMTP connections

## Security Notes

- Keep your SMTP credentials secure
- Do not expose the `logs` directory to the public
- Regularly update the PHPMailer library to the latest version
- Use HTTPS for your entire site to protect sensitive data

## Upgrading PHPMailer

When a new version of PHPMailer is released:

1. Download the latest release from GitHub
2. Backup your current PHPMailer directory
3. Replace the existing files with the new ones
4. Test the email functionality to ensure everything works correctly

## Email Content Overview

The order notification emails include:
- Order details (ID, server name, plan, pricing)
- Customer information (name, email, phone, Discord username)
- Server login credentials (username/email and password)
- Order date and time

This information helps administrators set up the server with the correct configuration and access details.
