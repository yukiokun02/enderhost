
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
if (empty($data['userId']) || empty($data['newPassword']) || empty($data['currentUserId'])) {
    echo json_encode([
        'success' => false,
        'message' => 'User ID, current user ID, and new password are required'
    ]);
    exit;
}

// Find the user to update
$userIndex = -1;
$targetUsername = '';
foreach ($users as $index => $user) {
    if ($user['id'] === $data['userId']) {
        $userIndex = $index;
        $targetUsername = $user['username'];
        break;
    }
}

if ($userIndex === -1) {
    echo json_encode([
        'success' => false,
        'message' => 'User not found'
    ]);
    exit;
}

// Check if user can change this password
$isOwnPassword = $data['userId'] === $data['currentUserId'];
$isAdminChangingOthers = isset($data['isAdmin']) && $data['isAdmin'] === true;

if (!$isOwnPassword && !$isAdminChangingOthers) {
    echo json_encode([
        'success' => false,
        'message' => 'You can only change your own password'
    ]);
    exit;
}

// Update password
$users[$userIndex]['password'] = $data['newPassword'];

// Save back to file
file_put_contents($usersFile, json_encode($users, JSON_PRETTY_PRINT));

// Log activity
$activityLog = [
    'id' => time() . substr(uniqid(), -6),
    'userId' => $data['currentUserId'],
    'username' => '', // Will be filled from users array
    'action' => $isOwnPassword ? 'Changed own password' : "Changed password for user: $targetUsername",
    'timestamp' => time() * 1000, // In milliseconds for JS
    'ipAddress' => $_SERVER['REMOTE_ADDR']
];

// Find current user's username
foreach ($users as $user) {
    if ($user['id'] === $data['currentUserId']) {
        $activityLog['username'] = $user['username'];
        break;
    }
}

$logsFile = __DIR__ . '/../../data/activity_logs.json';
$logs = file_exists($logsFile) ? json_decode(file_get_contents($logsFile), true) : [];
array_unshift($logs, $activityLog); // Add to beginning
$logs = array_slice($logs, 0, 1000); // Keep only 1000 entries
file_put_contents($logsFile, json_encode($logs, JSON_PRETTY_PRINT));

echo json_encode([
    'success' => true,
    'message' => 'Password changed successfully',
    'username' => $targetUsername
]);
?>
