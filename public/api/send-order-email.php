
<?php
/**
 * EnderHOST Order Email Notification Script
 * This script handles sending email notifications when a customer places an order
 */

// Allow cross-origin requests
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

// Function to sanitize input
function sanitize_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

// Check if this is a POST request
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

// Get JSON data from the request body
$json_data = file_get_contents('php://input');
$data = json_decode($json_data, true);

// Check if data was provided and properly decoded
if (!$data) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid JSON data']);
    exit();
}

// Extract and sanitize data
$customer_name = isset($data['customerName']) ? sanitize_input($data['customerName']) : 'Unknown';
$customer_email = isset($data['customerEmail']) ? sanitize_input($data['customerEmail']) : 'Unknown';
$customer_phone = isset($data['customerPhone']) ? sanitize_input($data['customerPhone']) : 'Not provided';
$server_name = isset($data['serverName']) ? sanitize_input($data['serverName']) : 'Unknown';
$plan = isset($data['plan']) ? sanitize_input($data['plan']) : 'Unknown';
$plan_price = isset($data['planPrice']) ? sanitize_input($data['planPrice']) : 'Unknown';
$order_date = isset($data['orderDate']) ? date('Y-m-d H:i:s', strtotime($data['orderDate'])) : date('Y-m-d H:i:s');

// Prepare email content
$admin_email = ADMIN_EMAIL; // From config.php
$subject = "New Minecraft Server Order - " . $server_name;

// HTML email body
$html_message = "
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #000; color: #fff; padding: 15px; text-align: center; }
        .header h1 { margin: 0; color: #fff; }
        .header h1 span { color: #00C853; }
        .content { padding: 20px; border: 1px solid #ddd; border-top: none; }
        .order-details { background-color: #f9f9f9; padding: 15px; margin-bottom: 20px; }
        .footer { font-size: 12px; text-align: center; margin-top: 30px; color: #777; }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background-color: #f2f2f2; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1>Ender<span>HOST</span> - New Order</h1>
        </div>
        <div class='content'>
            <h2>New Minecraft Server Order Received</h2>
            <p>A new server order has been placed. The customer has been directed to the payment page.</p>
            
            <div class='order-details'>
                <h3>Order Details:</h3>
                <table>
                    <tr>
                        <th>Server Name:</th>
                        <td>{$server_name}</td>
                    </tr>
                    <tr>
                        <th>Plan:</th>
                        <td>{$plan}</td>
                    </tr>
                    <tr>
                        <th>Price:</th>
                        <td>₹{$plan_price}</td>
                    </tr>
                    <tr>
                        <th>Order Date:</th>
                        <td>{$order_date}</td>
                    </tr>
                </table>
            </div>
            
            <h3>Customer Information:</h3>
            <table>
                <tr>
                    <th>Name:</th>
                    <td>{$customer_name}</td>
                </tr>
                <tr>
                    <th>Email:</th>
                    <td>{$customer_email}</td>
                </tr>
                <tr>
                    <th>Phone:</th>
                    <td>{$customer_phone}</td>
                </tr>
            </table>
            
            <p style='margin-top: 30px;'>
                <b>Note:</b> This is just a notification that the customer has reached the payment page. 
                Await payment confirmation before setting up the server.
            </p>
        </div>
        <div class='footer'>
            <p>This is an automated message from the EnderHOST ordering system.</p>
            <p>&copy; " . date('Y') . " EnderHOST. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
";

// Plain text alternative for email clients that don't support HTML
$text_message = "
NEW MINECRAFT SERVER ORDER

Server Name: {$server_name}
Plan: {$plan}
Price: ₹{$plan_price}
Order Date: {$order_date}

CUSTOMER INFORMATION:
Name: {$customer_name}
Email: {$customer_email}
Phone: {$customer_phone}

Note: This is just a notification that the customer has reached the payment page. 
Await payment confirmation before setting up the server.

© " . date('Y') . " EnderHOST. All rights reserved.
";

// Set up email headers
$headers = "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=UTF-8\r\n";
$headers .= "From: EnderHOST Notifications <" . SMTP_FROM_EMAIL . ">\r\n";
$headers .= "Reply-To: {$customer_email}\r\n";

// Send email
$success = false;

if (USE_SMTP) {
    // Use SMTP if configured in config.php
    require_once 'lib/PHPMailer/src/Exception.php';
    require_once 'lib/PHPMailer/src/PHPMailer.php';
    require_once 'lib/PHPMailer/src/SMTP.php';
    
    $mail = new PHPMailer\PHPMailer\PHPMailer(true);
    
    try {
        // Server settings
        $mail->isSMTP();
        $mail->Host = SMTP_HOST;
        $mail->SMTPAuth = true;
        $mail->Username = SMTP_USER;
        $mail->Password = SMTP_PASS;
        $mail->SMTPSecure = PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = SMTP_PORT;
        
        // Recipients
        $mail->setFrom(SMTP_FROM_EMAIL, SMTP_FROM_NAME);
        $mail->addAddress($admin_email);
        $mail->addReplyTo($customer_email, $customer_name);
        
        // Content
        $mail->isHTML(true);
        $mail->Subject = $subject;
        $mail->Body = $html_message;
        $mail->AltBody = $text_message;
        
        $mail->send();
        $success = true;
    } catch (Exception $e) {
        error_log('Error sending email: ' . $mail->ErrorInfo);
        $success = false;
    }
} else {
    // Use PHP mail() function
    $success = mail($admin_email, $subject, $html_message, $headers);
}

// Send response
if ($success) {
    http_response_code(200);
    echo json_encode(['success' => true, 'message' => 'Order notification email sent successfully']);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to send order notification email']);
}
?>
