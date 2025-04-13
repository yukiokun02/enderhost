
<?php
header('Content-Type: application/json');

// Set error reporting
ini_set('display_errors', 0);
error_reporting(E_ALL);

// Define the data file path
$usersFile = __DIR__ . '/../../data/admin_users.json';
$dataDir = __DIR__ . '/../../data';

// Create data directory if it doesn't exist
if (!file_exists($dataDir)) {
    mkdir($dataDir, 0755, true);
}

// Generate ID function
function generateId() {
    return time() . substr(uniqid(), -6);
}

// Check if users file exists, if not create with default admin
if (!file_exists($usersFile)) {
    $defaultAdmin = [
        'id' => generateId(),
        'username' => 'admin',
        'password' => 'admin123',
        'group' => 'admin',
        'createdAt' => time() * 1000, // In milliseconds for JS
    ];
    
    $users = [$defaultAdmin];
    file_put_contents($usersFile, json_encode($users, JSON_PRETTY_PRINT));
}

echo json_encode(['success' => true]);
?>
