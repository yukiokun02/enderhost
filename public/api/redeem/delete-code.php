
<?php
header('Content-Type: application/json');

// Set error reporting
ini_set('display_errors', 0);
error_reporting(E_ALL);

// Get the request body
$json = file_get_contents('php://input');
$data = json_decode($json, true);

// Define the data file path
$codesFile = __DIR__ . '/../../data/redeem_codes.json';

// Check if codes file exists
if (!file_exists($codesFile)) {
    echo json_encode([
        'success' => false,
        'message' => 'Redeem codes database not found'
    ]);
    exit;
}

// Validate input
if (empty($data['code'])) {
    echo json_encode([
        'success' => false,
        'message' => 'Code is required'
    ]);
    exit;
}

// Load codes
$codes = json_decode(file_get_contents($codesFile), true);

// Filter out the code to delete
$updatedCodes = [];
$codeFound = false;
foreach ($codes as $code) {
    if ($code['code'] !== $data['code']) {
        $updatedCodes[] = $code;
    } else {
        $codeFound = true;
    }
}

if (!$codeFound) {
    echo json_encode([
        'success' => false,
        'message' => 'Code not found'
    ]);
    exit;
}

// Save back to file
file_put_contents($codesFile, json_encode($updatedCodes, JSON_PRETTY_PRINT));

echo json_encode([
    'success' => true,
    'message' => 'Redeem code deleted successfully'
]);
?>
