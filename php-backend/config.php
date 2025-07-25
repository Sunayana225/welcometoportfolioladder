<?php
/**
 * Portfolio Contact Form Configuration
 * 
 * Instructions for setup:
 * 1. Update the email settings below with your actual email credentials
 * 2. For Gmail, you'll need to use an "App Password" instead of your regular password
 * 3. Enable 2-factor authentication on your Gmail account
 * 4. Generate an App Password: https://support.google.com/accounts/answer/185833
 * 5. Upload this file to your web server with PHP support
 * 6. Make sure the directory is writable for logging (chmod 755 or 777)
 */

return [
    // Email Configuration
    'email' => [
        // SMTP Settings (recommended for reliability)
        'smtp_host' => 'smtp.gmail.com',
        'smtp_port' => 587,
        'smtp_secure' => 'tls', // 'tls' or 'ssl'
        'smtp_username' => 'your-email@gmail.com', // Your Gmail address
        'smtp_password' => 'your-app-password', // Your Gmail App Password
        
        // Email Addresses
        'from_email' => 'your-email@gmail.com', // From address (should match SMTP username)
        'from_name' => 'Your Portfolio Website',
        'to_email' => 'your-email@gmail.com', // Where to receive contact form emails
        'reply_to_visitor' => true, // Whether to set visitor's email as reply-to
        
        // Email Subject
        'subject_prefix' => '[Portfolio Contact]',
    ],
    
    // Security Settings
    'security' => [
        // Rate Limiting
        'rate_limit_enabled' => true,
        'max_requests_per_hour' => 5, // Maximum submissions per IP per hour
        'rate_limit_window' => 3600, // Time window in seconds (3600 = 1 hour)
        
        // CORS Settings
        'allowed_origins' => [
            'http://localhost:3000',
            'https://your-domain.com', // Add your actual domain
            'https://www.your-domain.com'
        ],
        
        // Honeypot field (to catch bots)
        'honeypot_enabled' => true,
        'honeypot_field' => 'website_url', // Hidden field name
    ],
    
    // Validation Rules
    'validation' => [
        'name' => [
            'required' => true,
            'min_length' => 2,
            'max_length' => 100
        ],
        'email' => [
            'required' => true,
            'validate_email' => true
        ],
        'subject' => [
            'required' => true,
            'min_length' => 5,
            'max_length' => 200
        ],
        'message' => [
            'required' => true,
            'min_length' => 10,
            'max_length' => 2000
        ],
        'phone' => [
            'required' => false,
            'max_length' => 20
        ],
        'company' => [
            'required' => false,
            'max_length' => 100
        ]
    ],
    
    // Logging Settings
    'logging' => [
        'enabled' => true,
        'log_file' => 'contact_submissions.log',
        'max_log_entries' => 1000, // Keep only the last N entries
        'log_ip_addresses' => true,
        'log_user_agent' => true
    ],
    
    // Response Messages
    'messages' => [
        'success' => 'Thank you for your message! I will get back to you soon.',
        'error_general' => 'An error occurred while sending your message. Please try again.',
        'error_rate_limit' => 'Too many requests. Please wait before sending another message.',
        'error_validation' => 'Please check your input and try again.',
        'error_honeypot' => 'Spam detected.',
        'error_method' => 'Invalid request method.',
        'error_origin' => 'Request not allowed from this origin.'
    ],
    
    // File Paths (relative to this config file)
    'paths' => [
        'rate_limit_file' => 'data/rate_limit.json',
        'log_file' => 'data/contact_log.json',
        'data_directory' => 'data'
    ]
];
?>
