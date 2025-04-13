
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
$codeData = null;

// Look for the code
foreach ($codes as $code) {
    if (strtoupper($code['code']) === strtoupper($data['code'])) {
        $codeFound = true;
        $codeData = $code;
        break;
    }
}

if (!$codeFound) {
    echo json_encode([
        'success' => false,
        'message' => 'Invalid redeem code'
    ]);
    exit;
}

// Check if code is already used
if ($codeData['used']) {
    echo json_encode([
        'success' => false,
        'message' => 'This redeem code has already been used'
    ]);
    exit;
}

// Check if code is expired
$expiryDate = new DateTime($codeData['expiryDate']);
$currentDate = new DateTime();
if ($currentDate > $expiryDate) {
    echo json_encode([
        'success' => false,
        'message' => 'This redeem code has expired'
    ]);
    exit;
}

// Code is valid
echo json_encode([
    'success' => true,
    'message' => 'Valid redeem code',
    'discountType' => $codeData['discountType'],
    'discountAmount' => $codeData['discountAmount']
]);
?>
