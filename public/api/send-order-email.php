<?php
/**
 * DEPRECATED: This file is no longer in use.
 * Email sending functionality has been integrated into process-order.php
 * Keeping this file for reference only.
 */

// Original email sending code commented out
/*
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

// Rest of the original email sending code...
*/

// Return error if someone tries to access this file directly
if ($_SERVER['REQUEST_METHOD'] !== 'OPTIONS') {
    echo json_encode([
        'success' => false, 
        'message' => 'This endpoint is deprecated. Please use process-order.php instead.'
    ]);
}
