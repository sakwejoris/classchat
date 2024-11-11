<?php
include 'db.php';

$sql = "SELECT * FROM messages ORDER BY timestamp DESC";
$stmt = $pdo->query($sql);

$messages = $stmt->fetchAll(PDO::FETCH_ASSOC);

foreach ($messages as $msg) {
    echo "<p><strong>{$msg['sender']} to {$msg['receiver']}:</strong> {$msg['message']} <em>({$msg['timestamp']})</em></p>";
}

