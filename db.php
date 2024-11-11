<?php
$host = 'localhost';      // Database host
$dbname = 'chat_app';      // Database name
$user = 'root';            // Database username
$password = '';            // Database password

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Database connection failed: " . $e->getMessage());
}
?>