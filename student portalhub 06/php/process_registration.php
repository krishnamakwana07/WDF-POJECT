<?php
/**
 * process_registration.php
 * Validates, sanitizes & stores student registration data in both CSV and JSON.
 */

header('Content-Type: text/html; charset=UTF-8');

// ── Allowed values (whitelist) ──────────────────────────────────────────
$allowedCourses = [
    'B.Tech Computer Science',
    'B.Tech Information Technology',
    'B.Tech Electronics & Communication',
    'B.Tech Mechanical Engineering',
    'BCA (Bachelor of Computer Applications)',
    'MCA (Master of Computer Applications)',
    'B.Sc Computer Science',
];
$allowedYears   = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
$allowedGenders = ['Male', 'Female', 'Other'];

// ── Storage paths ───────────────────────────────────────────────────────
$dataDir  = __DIR__ . '/../data';
if (!is_dir($dataDir)) { mkdir($dataDir, 0755, true); }
$csvFile  = $dataDir . '/registrations.csv';
$jsonFile = $dataDir . '/registrations.json';

// ── Only accept POST ────────────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    showResult(false, 'Invalid request method.');
}

// ── Collect & sanitize ──────────────────────────────────────────────────
$fullname = trim(htmlspecialchars($_POST['fullname'] ?? '', ENT_QUOTES, 'UTF-8'));
$email    = trim(filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL));
$mobile   = trim(preg_replace('/[^0-9]/', '', $_POST['mobile'] ?? ''));
$gender   = trim(htmlspecialchars($_POST['gender'] ?? '', ENT_QUOTES, 'UTF-8'));
$course   = trim(htmlspecialchars($_POST['course'] ?? '', ENT_QUOTES, 'UTF-8'));
$year     = trim(htmlspecialchars($_POST['year'] ?? '', ENT_QUOTES, 'UTF-8'));
$password = $_POST['password'] ?? '';
$confirm  = $_POST['confirmPassword'] ?? '';
$terms    = isset($_POST['terms']);

// ── Validate ────────────────────────────────────────────────────────────
$errors = [];

// Full Name: alphabets & spaces, 3-50 chars
if (!preg_match('/^[A-Za-z ]{3,50}$/', $fullname)) {
    $errors[] = 'Full Name must be 3-50 alphabetic characters.';
}

// Email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Please enter a valid email address.';
}

// Mobile: 10 digits, starts with 6-9
if (!preg_match('/^[6-9][0-9]{9}$/', $mobile)) {
    $errors[] = 'Mobile must be 10 digits starting with 6, 7, 8, or 9.';
}

// Gender
if (!in_array($gender, $allowedGenders, true)) {
    $errors[] = 'Please select a valid gender.';
}

// Course
if (!in_array($course, $allowedCourses, true)) {
    $errors[] = 'Please select a valid course.';
}

// Year
if (!in_array($year, $allowedYears, true)) {
    $errors[] = 'Please select a valid academic year.';
}

// Password: 8-32 chars, 1 upper, 1 lower, 1 digit, 1 special
if (!preg_match('/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,32}$/', $password)) {
    $errors[] = 'Password must be 8-32 chars with uppercase, lowercase, digit & special character.';
}

// Confirm Password
if ($password !== $confirm) {
    $errors[] = 'Passwords do not match.';
}

// Terms
if (!$terms) {
    $errors[] = 'You must accept the Terms and Conditions.';
}

// ── If errors → redirect back with message ──────────────────────────────
if (!empty($errors)) {
    showResult(false, implode('<br>', $errors));
}

// ── Check duplicate email in existing JSON ──────────────────────────────
$existing = [];
if (file_exists($jsonFile)) {
    $existing = json_decode(file_get_contents($jsonFile), true) ?: [];
    foreach ($existing as $rec) {
        if (strcasecmp($rec['email'], $email) === 0) {
            showResult(false, 'This email address is already registered.');
        }
    }
}

// ── Build record ────────────────────────────────────────────────────────
$record = [
    'id'         => count($existing) + 1,
    'fullname'   => $fullname,
    'email'      => $email,
    'mobile'     => $mobile,
    'gender'     => $gender,
    'course'     => $course,
    'year'       => $year,
    'password'   => password_hash($password, PASSWORD_DEFAULT),
    'terms'      => 'Accepted',
    'registered' => date('Y-m-d H:i:s'),
];

// ── Save to JSON ────────────────────────────────────────────────────────
$existing[] = $record;
file_put_contents($jsonFile, json_encode($existing, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

// ── Save to CSV ─────────────────────────────────────────────────────────
$csvHeader = ['ID', 'Full Name', 'Email', 'Mobile', 'Gender', 'Course', 'Year', 'Terms', 'Registered At'];
$csvRow    = [$record['id'], $fullname, $email, $mobile, $gender, $course, $year, 'Accepted', $record['registered']];

$writeHeader = !file_exists($csvFile);
$fp = fopen($csvFile, 'a');
if ($writeHeader) { fputcsv($fp, $csvHeader); }
fputcsv($fp, $csvRow);
fclose($fp);

// ── Success ─────────────────────────────────────────────────────────────
showResult(true, "Registration successful! Welcome, <strong>$fullname</strong>. Your student ID is <strong>#{$record['id']}</strong>.", $record);

// ═══════════════════════════════════════════════════════════════════════
// Helper: show styled result page
// ═══════════════════════════════════════════════════════════════════════
function showResult(bool $success, string $message, array $data = []): void {
    $bgColor   = $success ? '#d1fae5' : '#fee2e2';
    $textColor = $success ? '#065f46' : '#991b1b';
    $icon      = $success ? '&#10004;' : '&#10008;';
    $title     = $success ? 'Registration Successful' : 'Registration Failed';
    $backLink  = $success ? 'login.html' : 'register.html';
    $backText  = $success ? 'Proceed to Login &rarr;' : '&larr; Go Back & Fix Errors';

    $summaryHTML = '';
    if ($success && !empty($data)) {
        $summaryHTML = '
        <table style="width:100%;border-collapse:collapse;margin-top:16px;font-size:0.95rem;">
            <tr><td style="padding:6px 10px;font-weight:600;color:#374151;">Student ID</td><td style="padding:6px 10px;">#'.$data['id'].'</td></tr>
            <tr style="background:#f9fafb;"><td style="padding:6px 10px;font-weight:600;color:#374151;">Full Name</td><td style="padding:6px 10px;">'.htmlspecialchars($data['fullname']).'</td></tr>
            <tr><td style="padding:6px 10px;font-weight:600;color:#374151;">Email</td><td style="padding:6px 10px;">'.htmlspecialchars($data['email']).'</td></tr>
            <tr style="background:#f9fafb;"><td style="padding:6px 10px;font-weight:600;color:#374151;">Mobile</td><td style="padding:6px 10px;">'.$data['mobile'].'</td></tr>
            <tr><td style="padding:6px 10px;font-weight:600;color:#374151;">Gender</td><td style="padding:6px 10px;">'.$data['gender'].'</td></tr>
            <tr style="background:#f9fafb;"><td style="padding:6px 10px;font-weight:600;color:#374151;">Course</td><td style="padding:6px 10px;">'.htmlspecialchars($data['course']).'</td></tr>
            <tr><td style="padding:6px 10px;font-weight:600;color:#374151;">Academic Year</td><td style="padding:6px 10px;">'.$data['year'].'</td></tr>
            <tr style="background:#f9fafb;"><td style="padding:6px 10px;font-weight:600;color:#374151;">Registered At</td><td style="padding:6px 10px;">'.$data['registered'].'</td></tr>
        </table>';
    }

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
        <div style="max-width:520px;width:100%;margin:2rem auto;padding:2rem;border-radius:12px;background:{$bgColor};color:{$textColor};text-align:center;box-shadow:0 4px 20px rgba(0,0,0,.08);">
            <div style="font-size:3rem;margin-bottom:0.5rem;">{$icon}</div>
            <h2 style="margin-bottom:0.75rem;">{$title}</h2>
            <p style="margin-bottom:1rem;">{$message}</p>
            {$summaryHTML}
            <a href="../pages/{$backLink}" class="btn btn-primary" style="margin-top:1.25rem;display:inline-block;padding:0.6rem 1.5rem;text-decoration:none;">{$backText}</a>
        </div>
    </main>
</body>
</html>
HTML;
    exit;
}
