<?php
/**
 * process_contact.php
 * Validates, sanitizes & stores contact form messages in CSV and JSON.
 */

header('Content-Type: text/html; charset=UTF-8');

// ── Storage ─────────────────────────────────────────────────────────────
$dataDir  = __DIR__ . '/../data';
if (!is_dir($dataDir)) { mkdir($dataDir, 0755, true); }
$csvFile  = $dataDir . '/contact_messages.csv';
$jsonFile = $dataDir . '/contact_messages.json';

$allowedSubjects = ['general', 'technical', 'feedback', 'complaint'];

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    showContactResult(false, 'Invalid request method.');
}

// ── Sanitize ────────────────────────────────────────────────────────────
$name    = trim(htmlspecialchars($_POST['name'] ?? '', ENT_QUOTES, 'UTF-8'));
$email   = trim(filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL));
$subject = trim(htmlspecialchars($_POST['subject'] ?? '', ENT_QUOTES, 'UTF-8'));
$message = trim(htmlspecialchars($_POST['message'] ?? '', ENT_QUOTES, 'UTF-8'));

// ── Validate ────────────────────────────────────────────────────────────
$errors = [];

if (!preg_match('/^[A-Za-z ]{3,50}$/', $name)) {
    $errors[] = 'Full Name must be 3-50 alphabetic characters.';
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Please enter a valid email address.';
}
if (!in_array($subject, $allowedSubjects, true)) {
    $errors[] = 'Please select a valid subject.';
}
if (strlen($message) < 10 || strlen($message) > 1000) {
    $errors[] = 'Message must be between 10 and 1000 characters.';
}

if (!empty($errors)) {
    showContactResult(false, implode('<br>', $errors));
}

// ── Build record ────────────────────────────────────────────────────────
$existing = [];
if (file_exists($jsonFile)) {
    $existing = json_decode(file_get_contents($jsonFile), true) ?: [];
}

$record = [
    'id'        => count($existing) + 1,
    'name'      => $name,
    'email'     => $email,
    'subject'   => $subject,
    'message'   => $message,
    'submitted' => date('Y-m-d H:i:s'),
];

// ── Save JSON ───────────────────────────────────────────────────────────
$existing[] = $record;
file_put_contents($jsonFile, json_encode($existing, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

// ── Save CSV ────────────────────────────────────────────────────────────
$csvHeader = ['ID', 'Name', 'Email', 'Subject', 'Message', 'Submitted At'];
$csvRow    = [$record['id'], $name, $email, $subject, $message, $record['submitted']];

$writeHeader = !file_exists($csvFile);
$fp = fopen($csvFile, 'a');
if ($writeHeader) { fputcsv($fp, $csvHeader); }
fputcsv($fp, $csvRow);
fclose($fp);

showContactResult(true, "Thank you, <strong>$name</strong>! Your message (Ticket #<strong>{$record['id']}</strong>) has been received. We'll respond within 24 hours.");

// ═══════════════════════════════════════════════════════════════════════
function showContactResult(bool $success, string $message): void {
    $bgColor   = $success ? '#d1fae5' : '#fee2e2';
    $textColor = $success ? '#065f46' : '#991b1b';
    $icon      = $success ? '&#10004;' : '&#10008;';
    $title     = $success ? 'Message Sent Successfully' : 'Submission Failed';
    $backText  = $success ? '&larr; Back to Contact Page' : '&larr; Go Back & Fix Errors';

    echo <<<HTML
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{$title} - StudentHub</title>
    <link rel="stylesheet" href="../css/style.css">
</head>
<body>
    <main class="site-main" style="display:flex;align-items:center;justify-content:center;min-height:80vh;">
        <div style="max-width:480px;width:100%;margin:2rem auto;padding:2rem;border-radius:12px;background:{$bgColor};color:{$textColor};text-align:center;box-shadow:0 4px 20px rgba(0,0,0,.08);">
            <div style="font-size:3rem;margin-bottom:0.5rem;">{$icon}</div>
            <h2 style="margin-bottom:0.75rem;">{$title}</h2>
            <p>{$message}</p>
            <a href="../pages/contact.html" class="btn btn-primary" style="margin-top:1.25rem;display:inline-block;padding:0.6rem 1.5rem;text-decoration:none;">{$backText}</a>
        </div>
    </main>
</body>
</html>
HTML;
    exit;
}
