<?php
include 'db.php';  // Include the database connection

// Check if required fields are sent
if (isset($_POST['sender']) && isset($_POST['receiver']) && isset($_POST['message'])) {
    $sender = $_POST['sender'];
    $receiver = $_POST['receiver'];
    $message = $_POST['message'];

    // Insert message into the database
    $sql = "INSERT INTO messages (sender, receiver, message) VALUES (:sender, :receiver, :message)";
    $stmt = $pdo->prepare($sql);

    try {
        $stmt->execute([
            ':sender' => $sender,
            ':receiver' => $receiver,
            ':message' => $message
        ]);
        echo json_encode(["status" => "success", "message" => "Message sent successfully"]);
    } catch (Exception $e) {
        echo json_encode(["status" => "error", "message" => "Failed to send message"]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Invalid request"]);
}
?>
