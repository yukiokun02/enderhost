
<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

// Set error reporting
ini_set('display_errors', 0);
error_reporting(E_ALL);

// Get the request body
$json = file_get_contents('php://input');
$data = json_decode($json, true);

// Define the data file path
$codesFile = __DIR__ . '/../../data/redeem_codes.json';

// Validate input
if (empty($data['code'])) {
    echo json_encode([
        'success' => false,
        'message' => 'Redeem code is required'
    ]);
    exit;
}

// Check if codes file exists
if (!file_exists($codesFile)) {
    echo json_encode([
        'success' => false,
        'message' => 'No valid redeem codes found'
    ]);
    exit;
}

// Load codes
$codes = json_decode(file_get_contents($codesFile), true);
$codeFound = false;
$updatedCodes = [];

// Update the code to mark it as used
foreach ($codes as $code) {
    if (strtoupper($code['code']) === strtoupper($data['code'])) {
        $code['used'] = true;
        $code['usedAt'] = date('c');
        $codeFound = true;
    }
    $updatedCodes[] = $code;
}

if (!$codeFound) {
    echo json_encode([
        'success' => false,
        'message' => 'Invalid redeem code'
    ]);
    exit;
}

// Save back to file
file_put_contents($codesFile, json_encode($updatedCodes, JSON_PRETTY_PRINT));

echo json_encode([
    'success' => true,
    'message' => 'Redeem code marked as used'
]);
?>
