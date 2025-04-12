
<?php
/**
 * EnderHOST Order Processing Script
 * This script handles order form submissions, saves to database, and sends email notifications
 */

// Allow cross-origin requests - adjust these based on your production requirements
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// For preflight OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Load configuration
require_once '../config.php';

// Set up error display for debugging in development environments
if (defined('DEBUG_MODE') && DEBUG_MODE) {
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);
}

// Set up error logging
function logError($message, $type = 'ERROR') {
    if (defined('ENABLE_ERROR_LOGGING') && ENABLE_ERROR_LOGGING) {
        $timestamp = date('Y-m-d H:i:s');
        $logEntry = "[$timestamp] [$type] $message" . PHP_EOL;
        
        // Make sure logs directory exists and is writable
        $logDir = dirname(ERROR_LOG_PATH);
        if (!is_dir($logDir)) {
            mkdir($logDir, 0755, true);
        }
        
        // Write to log file
        file_put_contents(ERROR_LOG_PATH, $logEntry, FILE_APPEND);
    }
}

// Function to sanitize input
function sanitize_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

// Debug info about the request
logError("Request method: " . $_SERVER['REQUEST_METHOD'], "DEBUG");
logError("Request content type: " . (isset($_SERVER["CONTENT_TYPE"]) ? $_SERVER["CONTENT_TYPE"] : "Not set"), "DEBUG");

// Check PHP version and extensions
logError("PHP Version: " . phpversion(), "INFO");
logError("Loaded Extensions: " . implode(", ", get_loaded_extensions()), "DEBUG");

// Database connectivity check
try {
    $test_conn = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . APP_CHARSET, DB_USER, DB_PASS);
    $test_conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    logError("Database connection test successful", "INFO");
} catch(PDOException $e) {
    logError("Database connectivity test failed: " . $e->getMessage(), "CRITICAL");
}

// Ensure Content-Type is application/json and request method is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    logError("Method not allowed: " . $_SERVER['REQUEST_METHOD']);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

// Get JSON data from the request body
$json_data = file_get_contents('php://input');
if (!$json_data) {
    logError("No input data received", "ERROR");
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'No input data provided']);
    exit();
}

logError("Received data: " . $json_data, "DEBUG");

$data = json_decode($json_data, true);

// Check if data was provided and properly decoded
if (!$data) {
    $json_error = json_last_error_msg();
    http_response_code(400);
    logError("Invalid JSON data: " . $json_data . " - Error: " . $json_error);
    echo json_encode(['success' => false, 'message' => 'Invalid JSON data: ' . $json_error]);
    exit();
}

// Extract and sanitize data
$customer_name = isset($data['name']) ? sanitize_input($data['name']) : 'Unknown';
$customer_email = isset($data['email']) ? sanitize_input($data['email']) : 'Unknown';
$customer_password = isset($data['password']) ? sanitize_input($data['password']) : 'Not provided';
$customer_phone = isset($data['phone']) ? sanitize_input($data['phone']) : 'Not provided';
$discord_username = isset($data['discordUsername']) ? sanitize_input($data['discordUsername']) : 'Not provided';
$server_name = isset($data['serverName']) ? sanitize_input($data['serverName']) : 'Unknown';
$plan = isset($data['plan']) ? sanitize_input($data['plan']) : 'Unknown';
$billing_cycle = isset($data['billingCycle']) ? (int)$data['billingCycle'] : 3;
$additional_backups = isset($data['additionalBackups']) ? (int)$data['additionalBackups'] : 0;
$additional_ports = isset($data['additionalPorts']) ? (int)$data['additionalPorts'] : 0;
$total_price = isset($data['totalPrice']) ? (float)$data['totalPrice'] : 0;

logError("Extracted information - Server: $server_name, Email: $customer_email, Plan: $plan", "DEBUG");

// Extract discount data if available
$discount_code = null;
$discount_amount = null;
$discount_type = null;
$discount_applied = false;

if (isset($data['discountApplied']) && !empty($data['discountApplied'])) {
    $discount_applied = true;
    
    // Handle when discountApplied is an associative array
    if (is_array($data['discountApplied'])) {
        $discount_code = isset($data['discountApplied']['code']) ? sanitize_input($data['discountApplied']['code']) : null;
        $discount_amount = isset($data['discountApplied']['amount']) ? sanitize_input($data['discountApplied']['amount']) : null;
        $discount_type = isset($data['discountApplied']['type']) ? sanitize_input($data['discountApplied']['type']) : 'percent';
    } 
    // Handle when discountApplied is a string (just the code)
    else {
        $discount_code = sanitize_input($data['discountApplied']);
        $discount_amount = isset($data['discountAmount']) ? sanitize_input($data['discountAmount']) : "Unknown";
        $discount_type = isset($data['discountType']) ? sanitize_input($data['discountType']) : 'percent';
    }
    
    logError("Discount extracted: Code=$discount_code, Amount=$discount_amount, Type=$discount_type", "DEBUG");
}

// Generate order ID
$order_id = "EH-" . strtoupper(substr(md5(uniqid(rand(), true)), 0, 8)) . "-" . date("Ymd");

// Set current date/time for the order
$order_date = date('Y-m-d H:i:s');

// Connect to database
try {
    logError("Attempting database connection to " . DB_HOST, "DEBUG");
    
    $conn = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . APP_CHARSET, DB_USER, DB_PASS);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    logError("Database connection successful", "DEBUG");
    
    // Begin transaction
    $conn->beginTransaction();
    
    // Check if email already exists (prevent duplicate orders)
    if (defined('EMAIL_DUPLICATE_PREVENTION') && EMAIL_DUPLICATE_PREVENTION) {
        $stmt = $conn->prepare("SELECT COUNT(*) FROM customers WHERE email = ? AND order_date > DATE_SUB(NOW(), INTERVAL 1 HOUR)");
        $stmt->execute([$customer_email]);
        $existing_orders = (int)$stmt->fetchColumn();
        
        if ($existing_orders > 0) {
            // This is a duplicate submission from the same email within the hour
            logError("Duplicate order from email $customer_email detected", "WARNING");
            
            // Return success but indicate it's a duplicate
            echo json_encode([
                'success' => true,
                'message' => 'Order already processed',
                'order_id' => $order_id,
                'duplicate' => true
            ]);
            exit();
        }
    }
    
    // Check if this order has already been processed (prevent duplicates)
    $stmt = $conn->prepare("SELECT COUNT(*) FROM customers WHERE order_id = ?");
    $stmt->execute([$order_id]);
    $exists = (int)$stmt->fetchColumn();
    
    if ($exists > 0) {
        // This is a duplicate submission, generate a new but recognizable ID for logging
        $duplicate_id = $order_id . "-DUP-" . time();
        logError("Duplicate order submission detected. Original ID: $order_id, Tagged as: $duplicate_id", "WARNING");
        
        // Return success but indicate it's a duplicate
        echo json_encode([
            'success' => true,
            'message' => 'Order already processed',
            'order_id' => $order_id,
            'duplicate' => true
        ]);
        exit();
    }
    
    // Check if tables exist before trying to insert
    try {
        $tableCheck = $conn->query("SHOW TABLES LIKE 'customers'");
        if ($tableCheck->rowCount() === 0) {
            throw new Exception("Required database tables don't exist. Please run database_setup.sql first.");
        }
        logError("Database tables check: tables exist", "DEBUG");
    } catch (Exception $e) {
        logError("Database structure check failed: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Database not properly set up: ' . $e->getMessage()]);
        exit();
    }
    
    // Insert into customers table
    $stmt = $conn->prepare(
        "INSERT INTO customers (order_id, name, email, server_name, password, phone, order_date)
         VALUES (?, ?, ?, ?, ?, ?, ?)"
    );
    
    $stmt->execute([
        $order_id,
        $customer_name,
        $customer_email,
        $server_name,
        $customer_password,
        $customer_phone,
        $order_date
    ]);
    
    logError("Customer record inserted for order $order_id", "DEBUG");
    
    // Get the customer ID
    $customer_id = $conn->lastInsertId();
    
    // Insert into order_details table
    $stmt = $conn->prepare(
        "INSERT INTO order_details (customer_id, plan, plan_price, additional_backups, 
         additional_ports, total_price, payment_status, discord_username)
         VALUES (?, ?, ?, ?, ?, ?, 'pending', ?)"
    );
    
    // Determine the base plan price - the entered total might include discounts
    $base_plan_price = $total_price; // Default if not specified
    if (isset($data['basePlanPrice'])) {
        $base_plan_price = (float)$data['basePlanPrice'];
    }
    
    $stmt->execute([
        $customer_id,
        $plan,
        $base_plan_price,
        $additional_backups,
        $additional_ports,
        $total_price,
        $discord_username
    ]);
    
    logError("Order details inserted for customer $customer_id", "DEBUG");
    
    // Insert into server_configs table with appropriate plan specs
    $ram = 2; // Default RAM in GB
    $cpu = 100; // Default CPU percentage
    $storage = 10; // Default storage in GB
    $backups = 0; // Default included backups
    
    // Very basic plan mapping - in a real system, this would be in a database or config file
    switch ($plan) {
        case "getting-woods":
            $ram = 2; $cpu = 100; $storage = 10;
            break;
        case "getting-an-upgrade":
            $ram = 4; $cpu = 200; $storage = 15;
            break;
        case "stone-age":
            $ram = 6; $cpu = 250; $storage = 20;
            break;
        case "acquire-hardware":
            $ram = 8; $cpu = 300; $storage = 25;
            break;
        case "isnt-it-iron-pick":
            $ram = 10; $cpu = 350; $storage = 30;
            break;
        case "diamonds":
            $ram = 12; $cpu = 400; $storage = 35;
            break;
        case "ice-bucket-challenge":
            $ram = 16; $cpu = 450; $storage = 40;
            break;
        case "we-need-to-go-deeper":
            $ram = 20; $cpu = 450; $storage = 45; $backups = 1;
            break;
        case "hidden-in-the-depths":
            $ram = 24; $cpu = 500; $storage = 50; $backups = 1;
            break;
        case "the-end":
            $ram = 32; $cpu = 600; $storage = 80; $backups = 2;
            break;
        case "sky-is-the-limit":
            $ram = 64; $cpu = 800; $storage = 100; $backups = 2;
            break;
    }
    
    // Determine server type based on simple rules
    $server_type = 'vanilla'; // Default
    if (strpos($plan, 'iron') !== false || strpos($plan, 'diamond') !== false) {
        $server_type = 'modpack';
    } elseif (strpos($plan, 'deeper') !== false || strpos($plan, 'end') !== false) {
        $server_type = 'community';
    }
    
    $stmt = $conn->prepare(
        "INSERT INTO server_configs (customer_id, server_type, ram, cpu, storage, 
         backups_included, additional_backups, additional_ports, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'provisioning')"
    );
    
    $stmt->execute([
        $customer_id,
        $server_type,
        $ram,
        $cpu,
        $storage,
        $backups,
        $additional_backups,
        $additional_ports
    ]);
    
    logError("Server config inserted for customer $customer_id", "DEBUG");
    
    // Commit transaction
    $conn->commit();
    
    logError("Order saved to database successfully. Order ID: " . $order_id, "INFO");
} catch(PDOException $e) {
    // Roll back transaction if error occurs
    if (isset($conn)) {
        $conn->rollBack();
    }
    
    logError("Database error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
    exit();
}

// Now send the email notification with the order details
$billing_cycle_text = $billing_cycle == 1 ? '1 Month' : '3 Months';

// Calculate add-on prices
$backup_cost = $additional_backups * 19;
$port_cost = $additional_ports * 9;

// HTML email message using simple table design for admin use
$html_message = "
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
        th, td { padding: 8px; text-align: left; border: 1px solid #ddd; }
        th { background-color: #f2f2f2; width: 40%; }
    </style>
</head>
<body>
    <h2>EnderHOST - New Server Order</h2>
    <p>A new server order has been placed.</p>
    
    <h3>Order Details:</h3>
    <table>
        <tr>
            <th>Order ID</th>
            <td>{$order_id}</td>
        </tr>
        <tr>
            <th>Server Name</th>
            <td>{$server_name}</td>
        </tr>
        <tr>
            <th>Plan</th>
            <td>{$plan}</td>
        </tr>
        <tr>
            <th>Billing Cycle</th>
            <td>{$billing_cycle_text}</td>
        </tr>";

// Add base plan price with appropriate explanation based on billing cycle
if ($billing_cycle == 1) {
    $monthly_price = round($base_plan_price * 1.25);
    $html_message .= "
        <tr>
            <th>Base Price</th>
            <td>{$base_plan_price} x 1.25 (monthly rate) = {$monthly_price}</td>
        </tr>";
} else {
    $three_month_price = $base_plan_price * 3;
    $html_message .= "
        <tr>
            <th>Base Price</th>
            <td>{$base_plan_price} x 3 months = {$three_month_price}</td>
        </tr>";
}

// Add add-ons only if they exist
if ($additional_backups > 0) {
    $html_message .= "
        <tr>
            <th>Additional Backups ({$additional_backups})</th>
            <td>{$backup_cost}</td>
        </tr>";
}

if ($additional_ports > 0) {
    $html_message .= "
        <tr>
            <th>Additional Ports ({$additional_ports})</th>
            <td>{$port_cost}</td>
        </tr>";
}

// Add discount information if applied
if ($discount_applied && $discount_code) {
    $discount_display = $discount_type == 'percent' ? "{$discount_amount}%" : "{$discount_amount}";
    $html_message .= "
        <tr>
            <th>Discount Applied</th>
            <td>Code: {$discount_code} - {$discount_display} off</td>
        </tr>";
}

$html_message .= "
        <tr>
            <th>Total Price</th>
            <td>{$total_price}</td>
        </tr>
        <tr>
            <th>Order Date</th>
            <td>{$order_date}</td>
        </tr>
    </table>
    
    <h3>Customer Information:</h3>
    <table>
        <tr>
            <th>Name</th>
            <td>{$customer_name}</td>
        </tr>
        <tr>
            <th>Email</th>
            <td>{$customer_email}</td>
        </tr>
        <tr>
            <th>Phone</th>
            <td>{$customer_phone}</td>
        </tr>
        <tr>
            <th>Discord Username</th>
            <td>{$discord_username}</td>
        </tr>
    </table>
    
    <h3>Server Login Credentials:</h3>
    <table>
        <tr>
            <th>Username</th>
            <td>{$customer_email}</td>
        </tr>
        <tr>
            <th>Password</th>
            <td>{$customer_password}</td>
        </tr>
    </table>
    
    <p>
        <b>Note:</b> This is a new order notification. Payment is still pending.
    </p>
</body>
</html>
";

// Plain text alternative for email clients that don't support HTML
$text_message = "
NEW MINECRAFT SERVER ORDER

Order ID: {$order_id}
Server Name: {$server_name}
Plan: {$plan}
Billing Cycle: {$billing_cycle_text}
";

// Add billing details to plain text message
if ($billing_cycle == 1) {
    $text_message .= "Base Price: {$base_plan_price} x 1.25 (monthly rate) = " . round($base_plan_price * 1.25) . "\n";
} else {
    $text_message .= "Base Price: {$base_plan_price} x 3 months = " . ($base_plan_price * 3) . "\n";
}

if ($additional_backups > 0) {
    $text_message .= "Additional Backups ({$additional_backups}): {$backup_cost}\n";
}

if ($additional_ports > 0) {
    $text_message .= "Additional Ports ({$additional_ports}): {$port_cost}\n";
}

// Add discount info to plain text if applicable
if ($discount_applied && $discount_code) {
    $discount_display = $discount_type == 'percent' ? "{$discount_amount}%" : "{$discount_amount}";
    $text_message .= "Discount: Code {$discount_code} - {$discount_display} off\n";
}

$text_message .= "
Total Price: {$total_price}
Order Date: {$order_date}

CUSTOMER INFORMATION:
Name: {$customer_name}
Email: {$customer_email}
Phone: {$customer_phone}
Discord Username: {$discord_username}

SERVER LOGIN CREDENTIALS:
Username: {$customer_email}
Password: {$customer_password}

Note: This is a new order notification. Payment is still pending.
";

// Send email
$success = false;

// Add an identifier to prevent duplicate emails
$email_id = md5($order_id . $customer_email . time());
$email_subject = "New Minecraft Server Order - " . $server_name . " [Ref: " . substr($email_id, 0, 8) . "]";

// Flag to track if we've attempted native PHP mail as fallback
$tried_native_mail = false;

// First try PHPMailer if enabled
if (USE_SMTP) {
    // Check if PHPMailer is installed
    $phpmailer_files = [
        __DIR__ . '/lib/PHPMailer/src/Exception.php',
        __DIR__ . '/lib/PHPMailer/src/PHPMailer.php',
        __DIR__ . '/lib/PHPMailer/src/SMTP.php'
    ];
    
    $phpmailer_missing = false;
    foreach ($phpmailer_files as $file) {
        if (!file_exists($file)) {
            $phpmailer_missing = true;
            logError("PHPMailer file missing: $file");
        }
    }
    
    if ($phpmailer_missing) {
        logError("PHPMailer not properly installed. Attempting to fall back to mail()");
        // Fall back to PHP mail function
        $headers = "MIME-Version: 1.0\r\n";
        $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
        $headers .= "From: EnderHOST Notifications <" . SMTP_FROM_EMAIL . ">\r\n";
        $headers .= "Reply-To: {$customer_email}\r\n";
        $headers .= "Message-ID: <$email_id@enderhost.in>\r\n";
        $headers .= "X-Order-ID: $order_id\r\n";
        
        $success = mail(ADMIN_EMAIL, $email_subject, $html_message, $headers);
        $tried_native_mail = true;
        
        // Log the attempt
        if ($success) {
            logError("Order notification email sent to " . ADMIN_EMAIL . " for order {$order_id} using mail() fallback", "SUCCESS");
        } else {
            logError("Failed to send order notification email to " . ADMIN_EMAIL . " for order {$order_id} using mail() fallback");
        }
    } else {
        // Use PHPMailer
        require_once __DIR__ . '/lib/PHPMailer/src/Exception.php';
        require_once __DIR__ . '/lib/PHPMailer/src/PHPMailer.php';
        require_once __DIR__ . '/lib/PHPMailer/src/SMTP.php';
        
        try {
            // Server settings
            $mail = new PHPMailer\PHPMailer\PHPMailer(true);
            $mail->isSMTP();
            $mail->SMTPDebug = 2; // Enable verbose debug output
            $mail->Host = SMTP_HOST;
            $mail->SMTPAuth = true;
            $mail->Username = SMTP_USER;
            $mail->Password = SMTP_PASS;
            $mail->SMTPSecure = 'tls';
            $mail->Port = SMTP_PORT;
            $mail->CharSet = APP_CHARSET;
            
            // Recipients
            $mail->setFrom(SMTP_FROM_EMAIL, SMTP_FROM_NAME);
            $mail->addAddress(ADMIN_EMAIL);
            $mail->addReplyTo($customer_email, $customer_name);
            
            // Content
            $mail->isHTML(true);
            $mail->Subject = $email_subject;
            $mail->Body = $html_message;
            $mail->AltBody = $text_message;
            
            // Add Message-ID header to help prevent duplicate delivery
            $mail->addCustomHeader('Message-ID', "<$email_id@enderhost.in>");
            $mail->addCustomHeader('X-Order-ID', $order_id);
            
            // Log before sending
            logError("Attempting to send email to " . ADMIN_EMAIL . "...", "INFO");
            
            $send_result = $mail->send();
            $success = true;
            
            // Log success
            logError("Order notification email sent to " . ADMIN_EMAIL . " for order {$order_id}", "SUCCESS");
        } catch (Exception $e) {
            logError('Error sending email via PHPMailer: ' . $mail->ErrorInfo);
            
            // Only fall back to PHP mail() function if we haven't tried it yet
            if (!$tried_native_mail) {
                $headers = "MIME-Version: 1.0\r\n";
                $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
                $headers .= "From: EnderHOST Notifications <" . SMTP_FROM_EMAIL . ">\r\n";
                $headers .= "Reply-To: {$customer_email}\r\n";
                $headers .= "Message-ID: <$email_id@enderhost.in>\r\n";
                $headers .= "X-Order-ID: $order_id\r\n";
                
                $success = mail(ADMIN_EMAIL, $email_subject, $html_message, $headers);
                $tried_native_mail = true;
                
                // Log the attempt
                if ($success) {
                    logError("Order notification email sent to " . ADMIN_EMAIL . " for order {$order_id} using mail() fallback after PHPMailer failure", "SUCCESS");
                } else {
                    logError("Failed to send order notification email to " . ADMIN_EMAIL . " for order {$order_id} using mail() fallback after PHPMailer failure");
                }
            }
        }
    }
} else {
    // Use PHP mail() function if SMTP is disabled
    $headers = "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
    $headers .= "From: EnderHOST Notifications <" . SMTP_FROM_EMAIL . ">\r\n";
    $headers .= "Reply-To: {$customer_email}\r\n";
    // Add unique message ID to prevent duplicate emails
    $headers .= "Message-ID: <$email_id@enderhost.in>\r\n";
    $headers .= "X-Order-ID: $order_id\r\n";
    
    $success = mail(ADMIN_EMAIL, $email_subject, $html_message, $headers);
    $tried_native_mail = true;
    
    // Log the attempt
    if ($success) {
        logError("Order notification email sent to " . ADMIN_EMAIL . " for order {$order_id} using mail()", "SUCCESS");
    } else {
        logError("Failed to send order notification email to " . ADMIN_EMAIL . " for order {$order_id} using mail()");
    }
}

// Send notification to Discord webhook if configured
if (!empty(DISCORD_WEBHOOK_URL)) {
    $discord_message = [
        'content' => "New Server Order: {$server_name}",
        'embeds' => [
            [
                'title' => "New Minecraft Server Order - {$plan}",
                'description' => "Customer: {$customer_name}\nServer: {$server_name}\nBilling: {$billing_cycle_text}\nTotal Price: ₹{$total_price}",
                'color' => 3066993, // Green color
                'fields' => [
                    ['name' => 'Order ID', 'value' => $order_id, 'inline' => true],
                    ['name' => 'Discord', 'value' => $discord_username, 'inline' => true],
                    ['name' => 'Email', 'value' => $customer_email, 'inline' => true]
                ],
                'footer' => ['text' => 'EnderHOST Order System']
            ]
        ]
    ];
    
    // Add discount field if applicable
    if ($discount_code && $discount_amount) {
        $discount_display = $discount_type === 'percent' ? "{$discount_amount}%" : "₹{$discount_amount}";
        $discord_message['embeds'][0]['fields'][] = [
            'name' => 'Discount Applied',
            'value' => "Code: {$discount_code} ({$discount_display})",
            'inline' => true
        ];
    }
    
    $discord_payload = json_encode($discord_message);
    
    $discord_ch = curl_init(DISCORD_WEBHOOK_URL);
    curl_setopt($discord_ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
    curl_setopt($discord_ch, CURLOPT_POST, 1);
    curl_setopt($discord_ch, CURLOPT_POSTFIELDS, $discord_payload);
    curl_setopt($discord_ch, CURLOPT_RETURNTRANSFER, true);
    $discord_response = curl_exec($discord_ch);
    $discord_status = curl_getinfo($discord_ch, CURLINFO_HTTP_CODE);
    curl_close($discord_ch);
    
    if ($discord_status >= 200 && $discord_status < 300) {
        logError("Discord webhook notification sent for order {$order_id}", "SUCCESS");
    } else {
        logError("Failed to send Discord webhook notification for order {$order_id}. Status: {$discord_status}, Response: {$discord_response}");
    }
}

// Return result as JSON - even if email sending failed, the order was processed correctly
echo json_encode([
    'success' => true,
    'message' => 'Order processed successfully',
    'order_id' => $order_id,
    'email_sent' => $success
]);
