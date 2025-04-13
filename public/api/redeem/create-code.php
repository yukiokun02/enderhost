
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
$dataDir = __DIR__ . '/../../data';

// Create data directory if it doesn't exist
if (!file_exists($dataDir)) {
    mkdir($dataDir, 0755, true);
}

// Validate input
if (empty($data['code']) || !isset($data['discountAmount']) || empty($data['discountType']) || empty($data['expiryDate'])) {
    echo json_encode([
        'success' => false,
        'message' => 'Code, discount amount, discount type, and expiry date are required'
    ]);
    exit;
}

// Load existing codes
$codes = file_exists($codesFile) ? json_decode(file_get_contents($codesFile), true) : [];

// Check if code already exists
foreach ($codes as $existingCode) {
    if ($existingCode['code'] === $data['code']) {
        echo json_encode([
            'success' => false,
            'message' => 'This code already exists'
        ]);
        exit;
    }
}

// Create new redeem code
$newCode = [
    'code' => $data['code'],
    'discountAmount' => $data['discountAmount'],
    'discountType' => $data['discountType'],
    'expiryDate' => $data['expiryDate'],
    'used' => false,
    'created' => $data['created'] ?? date('c')
];

// Add to codes array
$codes[] = $newCode;

// Save back to file
file_put_contents($codesFile, json_encode($codes, JSON_PRETTY_PRINT));

echo json_encode([
    'success' => true,
    'message' => 'Redeem code created successfully'
]);
?>
