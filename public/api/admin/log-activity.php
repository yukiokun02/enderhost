<?php
header('Content-Type: application/json');

// Set error reporting
ini_set('display_errors', 0);
error_reporting(E_ALL);

// Get the request body
$json = file_get_contents('php://input');
$data = json_decode($json, true);

// Define the data file path
$logsFile = __DIR__ . '/../../data/activity_logs.json';
$dataDir = __DIR__ . '/../../data';

// Create data directory if it doesn't exist
if (!file_exists($dataDir)) {
    mkdir($dataDir, 0755, true);
}

// Validate input
if (empty($data['userId']) || empty($data['username']) || empty($data['action'])) {
    echo json_encode([
        'success' => false,
        'message' => 'User ID, username, and action are required'
    ]);
    exit;
}

// Load existing logs
$logs = file_exists($logsFile) ? json_decode(file_get_contents($logsFile), true) : [];

// Create new log entry
$newLog = [
    'id' => time() . substr(uniqid(), -6),
    'userId' => $data['userId'],
    'username' => $data['username'],
    'action' => $data['action'],
    'timestamp' => $data['timestamp'] ?? (time() * 1000), // In milliseconds for JS
    'ipAddress' => $_SERVER['REMOTE_ADDR']
];

// Add to beginning of logs array
array_unshift($logs, $newLog);

// Keep only the last 1000 entries to avoid file size issues
$logs = array_slice($logs, 0, 1000);

// Save back to file
file_put_contents($logsFile, json_encode($logs, JSON_PRETTY_PRINT));

echo json_encode([
    'success' => true
]);
?>
