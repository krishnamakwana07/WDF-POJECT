<?php
/**
 * db_connect.php
 * MySQL Database Connection for StudentHub
 * Uses MySQLi with prepared statements
 */

// ── Database Configuration ──────────────────────────────────
define('DB_HOST',   'localhost');
define('DB_USER',   'root');
define('DB_PASS',   '');           // Change in production
define('DB_NAME',   'studenthub_db');

// ── Create Connection ───────────────────────────────────────
$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

// ── Check Connection ────────────────────────────────────────
if ($conn->connect_error) {
    die("Database connection failed: " . $conn->connect_error);
}

// Set charset to UTF-8
$conn->set_charset("utf8mb4");
?>
