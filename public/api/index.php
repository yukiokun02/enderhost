
<?php
header('Content-Type: text/html; charset=utf-8');
?>
<!DOCTYPE html>
<html>
<head>
    <title>EnderHOST API Status</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        .container {
            background-color: #f7f7f7;
            border-radius: 5px;
            padding: 20px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: #2d3748;
            border-bottom: 2px solid #e2e8f0;
            padding-bottom: 10px;
        }
        .status {
            margin: 20px 0;
            padding: 15px;
            border-radius: 4px;
        }
        .success {
            background-color: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        .warning {
            background-color: #fff3cd;
            color: #856404;
            border: 1px solid #ffeeba;
        }
        .error {
            background-color: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        th, td {
            text-align: left;
            padding: 12px;
            border-bottom: 1px solid #e2e8f0;
        }
        th {
            background-color: #edf2f7;
        }
        code {
            background-color: #edf2f7;
            padding: 2px 5px;
            border-radius: 3px;
            font-family: monospace;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>EnderHOST API Status</h1>
        
        <?php
        $dataDir = __DIR__ . '/../data';
        $usersFile = $dataDir . '/admin_users.json';
        $logsFile = $dataDir . '/activity_logs.json';
        $codesFile = $dataDir . '/redeem_codes.json';
        
        // Check data directory
        if (!file_exists($dataDir)) {
            echo '<div class="status error">Data directory not found! Please create it manually.</div>';
            $dirCreated = mkdir($dataDir, 0755, true);
            if ($dirCreated) {
                echo '<div class="status success">Data directory created successfully.</div>';
            } else {
                echo '<div class="status error">Failed to create data directory. Please check permissions.</div>';
            }
        } else {
            echo '<div class="status success">Data directory exists.</div>';
        }
        
        // Check write permissions
        if (is_writable($dataDir)) {
            echo '<div class="status success">Data directory is writable.</div>';
        } else {
            echo '<div class="status error">Data directory is not writable! Please fix permissions.</div>';
        }
        
        // Check data files
        echo '<h2>Data Files Status</h2>';
        echo '<table>';
        echo '<tr><th>File</th><th>Status</th><th>Records</th></tr>';
        
        // Users file
        echo '<tr>';
        echo '<td>admin_users.json</td>';
        if (file_exists($usersFile)) {
            $users = json_decode(file_get_contents($usersFile), true);
            echo '<td><span style="color: green;">✓ Exists</span></td>';
            echo '<td>' . count($users) . ' users</td>';
        } else {
            echo '<td><span style="color: orange;">⚠ Not created yet</span></td>';
            echo '<td>Will be created on first use</td>';
        }
        echo '</tr>';
        
        // Logs file
        echo '<tr>';
        echo '<td>activity_logs.json</td>';
        if (file_exists($logsFile)) {
            $logs = json_decode(file_get_contents($logsFile), true);
            echo '<td><span style="color: green;">✓ Exists</span></td>';
            echo '<td>' . count($logs) . ' entries</td>';
        } else {
            echo '<td><span style="color: orange;">⚠ Not created yet</span></td>';
            echo '<td>Will be created on first use</td>';
        }
        echo '</tr>';
        
        // Codes file
        echo '<tr>';
        echo '<td>redeem_codes.json</td>';
        if (file_exists($codesFile)) {
            $codes = json_decode(file_get_contents($codesFile), true);
            echo '<td><span style="color: green;">✓ Exists</span></td>';
            echo '<td>' . count($codes) . ' codes</td>';
        } else {
            echo '<td><span style="color: orange;">⚠ Not created yet</span></td>';
            echo '<td>Will be created on first use</td>';
        }
        echo '</tr>';
        
        echo '</table>';
        ?>
        
        <h2>API Endpoints</h2>
        <table>
            <tr>
                <th>Endpoint</th>
                <th>Description</th>
            </tr>
            <tr>
                <td><code>/api/admin/login.php</code></td>
                <td>Admin login</td>
            </tr>
            <tr>
                <td><code>/api/admin/init-users.php</code></td>
                <td>Initialize admin users</td>
            </tr>
            <tr>
                <td><code>/api/admin/get-users.php</code></td>
                <td>Get all admin users</td>
            </tr>
            <tr>
                <td><code>/api/admin/create-user.php</code></td>
                <td>Create new admin user</td>
            </tr>
            <tr>
                <td><code>/api/admin/change-password.php</code></td>
                <td>Change user password</td>
            </tr>
            <tr>
                <td><code>/api/admin/log-activity.php</code></td>
                <td>Log user activity</td>
            </tr>
            <tr>
                <td><code>/api/admin/get-logs.php</code></td>
                <td>Get activity logs</td>
            </tr>
            <tr>
                <td><code>/api/redeem/get-codes.php</code></td>
                <td>Get all redeem codes</td>
            </tr>
            <tr>
                <td><code>/api/redeem/create-code.php</code></td>
                <td>Create new redeem code</td>
            </tr>
            <tr>
                <td><code>/api/redeem/delete-code.php</code></td>
                <td>Delete redeem code</td>
            </tr>
        </table>
    </div>
</body>
</html>
