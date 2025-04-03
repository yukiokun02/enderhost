
<?php
/**
 * Payment Success Page for EnderHOST QR Payment System
 * This is a simplified version that doesn't interact with payment gateways
 */

// Start session to retrieve stored data
session_start();

// Load configuration
require_once 'config.php';

// Function to sanitize input
function sanitize_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

// Log access to this page
if (defined('ENABLE_ERROR_LOGGING') && ENABLE_ERROR_LOGGING) {
    $log_message = date('Y-m-d H:i:s') . " [INFO] User accessed payment success page. IP: " . $_SERVER['REMOTE_ADDR'];
    file_put_contents(ERROR_LOG_PATH, $log_message . PHP_EOL, FILE_APPEND);
}

// Initialize variables
$payment_verified = true; // In QR system, we assume payment is verified through Discord
$error_message = '';

// Get purchase data from session
$purchase_data = isset($_SESSION['server_purchase']) ? $_SESSION['server_purchase'] : [];

// Get order ID from session if available
$order_id = isset($_SESSION['enderhost_order_id']) ? $_SESSION['enderhost_order_id'] : 'Not Available';

// Clear sensitive session data
unset($_SESSION['payment_request_id']);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment Instructions - EnderHOST</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
</head>
<body class="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center p-4">
    <div class="max-w-md w-full bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div class="p-6">
            <div class="flex items-center justify-center mb-6">
                <img src="/lovable-uploads/e1341b42-612c-4eb3-b5f9-d6ac7e41acf3.png" alt="EnderHOST Logo" class="w-10 h-10 mr-3">
                <span class="text-2xl font-bold">
                    <span class="text-white">Ender</span>
                    <span class="text-green-500">HOST</span>
                </span>
            </div>
            
            <div class="text-center">
                <div class="w-20 h-20 bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                
                <h2 class="text-2xl font-bold mb-4">Next Steps</h2>
                
                <?php if (isset($_SESSION['server_purchase'])): ?>
                    <p class="text-gray-300 mb-6">
                        Thank you for choosing <span class="font-semibold"><?php echo htmlspecialchars($_SESSION['server_purchase']['plan']); ?></span> plan.
                    </p>
                <?php endif; ?>

                <?php if (!empty($order_id) && $order_id !== 'Not Available'): ?>
                    <div class="bg-gray-700 p-3 rounded-md mb-4">
                        <p class="text-sm text-gray-300">Your order ID:</p>
                        <p class="font-mono text-white"><?php echo htmlspecialchars($order_id); ?></p>
                        <p class="text-xs text-gray-400 mt-1">Please save this for reference</p>
                    </div>
                <?php endif; ?>
                
                <div class="bg-gray-700 rounded-lg p-4 mb-6 text-left">
                    <h3 class="font-bold text-green-500 mb-2">Payment Instructions:</h3>
                    <ol class="list-decimal pl-5 space-y-2 text-gray-300">
                        <li>Scan the QR code on the previous page to make your payment</li>
                        <li>Take a screenshot of your payment confirmation</li>
                        <li>Join our Discord server and create a ticket</li>
                        <li>Share the screenshot with your order details</li>
                        <li>Our team will set up your server and provide access details</li>
                    </ol>
                </div>
                
                <div class="flex flex-col space-y-4">
                    <a href="https://discord.gg/bsGPB9VpUY" target="_blank" class="bg-green-700 hover:bg-green-600 text-white font-medium py-2 px-4 rounded transition-colors flex items-center justify-center">
                        <img src="/lovable-uploads/6b690be5-a7fe-4753-805d-0441a00e0182.png" alt="Discord" class="w-5 h-5 mr-2">
                        Join Our Discord Server
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                    </a>
                    
                    <a href="/" class="bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded transition-colors">
                        Return to Homepage
                    </a>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
