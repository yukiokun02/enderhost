
<?php
header('Content-Type: application/json');

// Set error reporting
ini_set('display_errors', 0);
error_reporting(E_ALL);

// Define the data file path
$logsFile = __DIR__ . '/../../data/activity_logs.json';

if (!file_exists($logsFile)) {
    echo json_encode([
        'success' => true,
        'logs' => []
    ]);
    exit;
}

// Load logs
$logs = json_decode(file_get_contents($logsFile), true);

// Apply filters
$limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 0;
$userId = isset($_GET['userId']) ? $_GET['userId'] : null;

if ($userId) {
    $filteredLogs = [];
    foreach ($logs as $log) {
        if ($log['userId'] === $userId) {
            $filteredLogs[] = $log;
        }
    }
    $logs = $filteredLogs;
}

if ($limit > 0) {
    $logs = array_slice($logs, 0, $limit);
}

echo json_encode([
    'success' => true,
    'logs' => $logs
]);
?>
