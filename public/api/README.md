
# EnderHOST API Setup

This directory contains the backend API files for EnderHOST admin dashboard and redeem code system.

## Directory Structure

```
/public/api/
  ├── admin/              # Admin authentication API endpoints
  ├── redeem/             # Redeem code API endpoints
  └── data/               # (Auto-created) Data storage directory
```

## Requirements

- PHP 7.4 or higher
- Write permissions for the web server user on the `/public/data/` directory

## Installation

1. Ensure your web server can write to the `/public/data/` directory:

```bash
# Run on your server
mkdir -p /path/to/your/site/public/data
chmod 755 /path/to/your/site/public/data
chown www-data:www-data /path/to/your/site/public/data  # Use the appropriate web server user
```

2. The system will automatically create the necessary data files on first use.

## Security Considerations

- The `/public/data/` directory contains sensitive information. Consider adding additional protection:

```
# Add to .htaccess in the /public/data/ directory
<FilesMatch "\.(json)$">
  Order Deny,Allow
  Deny from all
</FilesMatch>
```

- For production environments, consider implementing proper database storage instead of JSON files.
