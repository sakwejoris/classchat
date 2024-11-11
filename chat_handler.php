<?php
// Database configuration
define('DB_HOST', 'localhost');
define('DB_USER', 'your_db_user');
define('DB_PASS', 'your_db_password');
define('DB_NAME', 'your_db_name');

// Create a connection to the database
$connection = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

// Check for a connection error
if ($connection->connect_error) {
    die("Database connection failed: " . $connection->connect_error);
}

// Check if 'action' parameter is set in the POST request
$action = isset($_POST['action']) ? $_POST['action'] : '';

if ($action === 'send') {
    // Store a new message in the database
    $sender = $_POST['sender'];
    $receiver = $_POST['receiver'];
    $message = $_POST['message'];

    // Insert the message into the database
    $stmt = $connection->prepare("INSERT INTO messages (sender, receiver, message) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $sender, $receiver, $message);

    if ($stmt->execute()) {
        echo json_encode(['status' => 'success', 'message' => 'Message sent successfully']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Failed to send message']);
    }

    $stmt->close();

} elseif ($action === 'fetch') {
    // Retrieve messages between two users
    $sender = $_POST['sender'];
    $receiver = $_POST['receiver'];

    // Select messages where sender and receiver match either direction
    $stmt = $connection->prepare("SELECT sender, receiver, message, timestamp FROM messages WHERE (sender = ? AND receiver = ?) OR (sender = ? AND receiver = ?) ORDER BY timestamp ASC");
    $stmt->bind_param("ssss", $sender, $receiver, $receiver, $sender);
    $stmt->execute();
    $result = $stmt->get_result();

    $messages = [];
    while ($row = $result->fetch_assoc()) {
        $messages[] = $row;
    }

    echo json_encode($messages);

    $stmt->close();
}

$connection->close();

