
<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

// Set error reporting
ini_set('display_errors', 0);
error_reporting(E_ALL);

// Define the data file path
$codesFile = __DIR__ . '/../../data/redeem_codes.json';

if (!file_exists($codesFile)) {
    echo json_encode([
        'success' => true,
        'codes' => []
    ]);
    exit;
}

// Load codes
$codes = json_decode(file_get_contents($codesFile), true);

echo json_encode([
    'success' => true,
    'codes' => $codes
]);
?>
