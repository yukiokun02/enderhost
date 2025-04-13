
<?php
header('Content-Type: application/json');

// Set error reporting
ini_set('display_errors', 0);
error_reporting(E_ALL);

// Define the data file path
$usersFile = __DIR__ . '/../../data/admin_users.json';

// Check if users file exists
if (!file_exists($usersFile)) {
    echo json_encode([
        'success' => false,
        'message' => 'User database not found'
    ]);
    exit;
}

// Load users
$users = json_decode(file_get_contents($usersFile), true);

// Mask passwords for security
foreach ($users as &$user) {
    $user['password'] = '********';
}

echo json_encode([
    'success' => true,
    'users' => $users
]);
?>
