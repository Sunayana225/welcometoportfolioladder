<?php
/**
 * Portfolio Contact Form Handler
 *
 * A secure, feature-rich contact form handler for portfolio websites
 * Features: Rate limiting, input validation, email sending, logging
 */

// Load configuration
$config = require_once 'config.php';

// Set headers
header('Content-Type: application/json');

// Handle CORS
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $config['security']['allowed_origins'])) {
    header('Access-Control-Allow-Origin: ' . $origin);
} else {
    header('Access-Control-Allow-Origin: null');
}

header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => $config['messages']['error_method']]);
    exit();
}

// Create data directory if it doesn't exist
$data_dir = __DIR__ . '/' . $config['paths']['data_directory'];
if (!is_dir($data_dir)) {
    mkdir($data_dir, 0755, true);
}

// Input validation and sanitization
function validateInput($data) {
    $errors = [];
    
    // Required fields
    $required_fields = ['name', 'email', 'subject', 'message'];
    foreach ($required_fields as $field) {
        if (empty($data[$field])) {
            $errors[] = ucfirst($field) . ' is required';
        }
    }
    
    // Email validation
    if (!empty($data['email']) && !filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
        $errors[] = 'Invalid email format';
    }
    
    // Length validation
    if (!empty($data['name']) && strlen($data['name']) > 100) {
        $errors[] = 'Name must be less than 100 characters';
    }
    
    if (!empty($data['subject']) && strlen($data['subject']) > 200) {
        $errors[] = 'Subject must be less than 200 characters';
    }
    
    if (!empty($data['message']) && strlen($data['message']) > 2000) {
        $errors[] = 'Message must be less than 2000 characters';
    }
    
    return $errors;
}

// Sanitize input data
function sanitizeInput($data) {
    return [
        'name' => htmlspecialchars(trim($data['name'] ?? ''), ENT_QUOTES, 'UTF-8'),
        'email' => filter_var(trim($data['email'] ?? ''), FILTER_SANITIZE_EMAIL),
        'subject' => htmlspecialchars(trim($data['subject'] ?? ''), ENT_QUOTES, 'UTF-8'),
        'message' => htmlspecialchars(trim($data['message'] ?? ''), ENT_QUOTES, 'UTF-8'),
        'phone' => htmlspecialchars(trim($data['phone'] ?? ''), ENT_QUOTES, 'UTF-8'),
        'company' => htmlspecialchars(trim($data['company'] ?? ''), ENT_QUOTES, 'UTF-8')
    ];
}

// Rate limiting (simple file-based)
function checkRateLimit($ip) {
    $rate_limit_file = 'rate_limit.json';
    $max_requests = 5; // Max requests per hour
    $time_window = 3600; // 1 hour in seconds
    
    $current_time = time();
    $rate_data = [];
    
    if (file_exists($rate_limit_file)) {
        $rate_data = json_decode(file_get_contents($rate_limit_file), true) ?: [];
    }
    
    // Clean old entries
    $rate_data = array_filter($rate_data, function($timestamp) use ($current_time, $time_window) {
        return ($current_time - $timestamp) < $time_window;
    });
    
    // Check if IP has exceeded rate limit
    $ip_requests = array_filter($rate_data, function($timestamp, $key) use ($ip) {
        return strpos($key, $ip) === 0;
    }, ARRAY_FILTER_USE_BOTH);
    
    if (count($ip_requests) >= $max_requests) {
        return false;
    }
    
    // Add current request
    $rate_data[$ip . '_' . $current_time] = $current_time;
    
    // Save rate data
    file_put_contents($rate_limit_file, json_encode($rate_data));
    
    return true;
}

// Send email using PHP mail function (basic implementation)
function sendEmail($data, $config) {
    $to = $config['to_email'];
    $subject = '[' . $config['site_name'] . '] ' . $data['subject'];
    
    $message = "
    <html>
    <head>
        <title>New Contact Form Submission</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #555; }
            .value { margin-top: 5px; padding: 10px; background: white; border-radius: 4px; border-left: 4px solid #667eea; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h2>New Contact Form Submission</h2>
                <p>You have received a new message from your portfolio website.</p>
            </div>
            <div class='content'>
                <div class='field'>
                    <div class='label'>Name:</div>
                    <div class='value'>" . $data['name'] . "</div>
                </div>
                <div class='field'>
                    <div class='label'>Email:</div>
                    <div class='value'>" . $data['email'] . "</div>
                </div>";
    
    if (!empty($data['phone'])) {
        $message .= "
                <div class='field'>
                    <div class='label'>Phone:</div>
                    <div class='value'>" . $data['phone'] . "</div>
                </div>";
    }
    
    if (!empty($data['company'])) {
        $message .= "
                <div class='field'>
                    <div class='label'>Company:</div>
                    <div class='value'>" . $data['company'] . "</div>
                </div>";
    }
    
    $message .= "
                <div class='field'>
                    <div class='label'>Subject:</div>
                    <div class='value'>" . $data['subject'] . "</div>
                </div>
                <div class='field'>
                    <div class='label'>Message:</div>
                    <div class='value'>" . nl2br($data['message']) . "</div>
                </div>
                <div class='field'>
                    <div class='label'>Submitted:</div>
                    <div class='value'>" . date('Y-m-d H:i:s') . "</div>
                </div>
            </div>
        </div>
    </body>
    </html>";
    
    $headers = [
        'MIME-Version: 1.0',
        'Content-type: text/html; charset=UTF-8',
        'From: ' . $config['from_email'],
        'Reply-To: ' . $data['email'],
        'X-Mailer: PHP/' . phpversion()
    ];
    
    return mail($to, $subject, $message, implode("\r\n", $headers));
}

// Log contact form submissions
function logSubmission($data, $ip) {
    $log_entry = [
        'timestamp' => date('Y-m-d H:i:s'),
        'ip' => $ip,
        'name' => $data['name'],
        'email' => $data['email'],
        'subject' => $data['subject']
    ];
    
    $log_file = 'contact_log.json';
    $logs = [];
    
    if (file_exists($log_file)) {
        $logs = json_decode(file_get_contents($log_file), true) ?: [];
    }
    
    $logs[] = $log_entry;
    
    // Keep only last 1000 entries
    if (count($logs) > 1000) {
        $logs = array_slice($logs, -1000);
    }
    
    file_put_contents($log_file, json_encode($logs, JSON_PRETTY_PRINT));
}

// Main processing
try {
    // Get client IP
    $client_ip = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    
    // Check rate limiting
    if (!checkRateLimit($client_ip)) {
        http_response_code(429);
        echo json_encode(['error' => 'Too many requests. Please try again later.']);
        exit();
    }
    
    // Get and decode JSON input
    $json_input = file_get_contents('php://input');
    $input_data = json_decode($json_input, true);
    
    if (json_last_error() !== JSON_ERROR_NONE) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON data']);
        exit();
    }
    
    // Sanitize input
    $data = sanitizeInput($input_data);
    
    // Validate input
    $validation_errors = validateInput($data);
    if (!empty($validation_errors)) {
        http_response_code(400);
        echo json_encode(['error' => 'Validation failed', 'details' => $validation_errors]);
        exit();
    }
    
    // Send email
    if (sendEmail($data, $config)) {
        // Log successful submission
        logSubmission($data, $client_ip);
        
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'Thank you for your message! I will get back to you soon.'
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to send email. Please try again later.']);
    }
    
} catch (Exception $e) {
    error_log('Contact form error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'An unexpected error occurred. Please try again later.']);
}
?>
