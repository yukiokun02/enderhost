
# PHPMailer for EnderHOST

This directory contains the PHPMailer library used for sending emails from the EnderHOST application.

## Installation

1. Download PHPMailer from https://github.com/PHPMailer/PHPMailer/releases
2. Extract the files to this directory
3. The directory structure should be:
   - `lib/PHPMailer/src/Exception.php`
   - `lib/PHPMailer/src/PHPMailer.php`
   - `lib/PHPMailer/src/SMTP.php`

## Configuration

Configure your SMTP settings in the `config.php` file at the root of the public directory.

## Troubleshooting

If emails are not being sent properly:

1. Check the error logs at `/logs/enderhost_errors.log`
2. Verify your SMTP credentials in `config.php`
3. Ensure the PHPMailer library is correctly installed
4. Make sure your SMTP provider (Brevo) has not blocked your account
5. Check if your server's IP is blacklisted by the SMTP provider

## Security Notes

- Keep your SMTP credentials secure
- Do not expose the `logs` directory to the public
- Regularly update the PHPMailer library to the latest version
