
<?php
header('Content-Type: application/json');

// Set error reporting
ini_set('display_errors', 0);
error_reporting(E_ALL);

// Get the request body
$json = file_get_contents('php://input');
$data = json_decode($json, true);

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

// Validate input
if (empty($data['username']) || empty($data['password']) || empty($data['group'])) {
    echo json_encode([
        'success' => false,
        'message' => 'Username, password, and group are required'
    ]);
    exit;
}

// Check if username already exists
foreach ($users as $user) {
    if ($user['username'] === $data['username']) {
        echo json_encode([
            'success' => false,
            'message' => 'Username already exists'
        ]);
        exit;
    }
}

// Generate ID
$newUserId = time() . substr(uniqid(), -6);

// Create new user
$newUser = [
    'id' => $newUserId,
    'username' => $data['username'],
    'password' => $data['password'],
    'group' => $data['group'],
    'createdBy' => $data['createdBy'] ?? 'System',
    'createdAt' => time() * 1000 // In milliseconds for JS
];

// Add to users array
$users[] = $newUser;

// Save back to file
file_put_contents($usersFile, json_encode($users, JSON_PRETTY_PRINT));

// Log activity
$activityLog = [
    'id' => time() . substr(uniqid(), -6),
    'userId' => $newUserId,
    'username' => $data['createdBy'] ?? 'System',
    'action' => 'Created new user: ' . $data['username'],
    'timestamp' => time() * 1000, // In milliseconds for JS
    'ipAddress' => $_SERVER['REMOTE_ADDR']
];

$logsFile = __DIR__ . '/../../data/activity_logs.json';
$logs = file_exists($logsFile) ? json_decode(file_get_contents($logsFile), true) : [];
array_unshift($logs, $activityLog); // Add to beginning
$logs = array_slice($logs, 0, 1000); // Keep only 1000 entries
file_put_contents($logsFile, json_encode($logs, JSON_PRETTY_PRINT));

echo json_encode([
    'success' => true,
    'message' => 'User created successfully'
]);
?>
