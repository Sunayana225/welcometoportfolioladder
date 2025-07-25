# Portfolio Contact Form PHP Backend

This directory contains a secure PHP backend for handling contact form submissions from your generated portfolio websites.

## Features

- ✅ **Secure Input Validation** - Validates and sanitizes all input data
- ✅ **Rate Limiting** - Prevents spam by limiting submissions per IP
- ✅ **Email Sending** - Sends formatted HTML emails with contact details
- ✅ **CORS Support** - Properly configured for cross-origin requests
- ✅ **Logging** - Tracks all submissions for monitoring
- ✅ **Honeypot Protection** - Basic bot detection
- ✅ **Responsive Design** - Beautiful HTML email templates

## Setup Instructions

### 1. Server Requirements

- PHP 7.4 or higher
- Web server (Apache, Nginx, etc.)
- Mail function enabled OR SMTP access

### 2. Configuration

1. **Edit `config.php`** and update the following:

```php
// Update email settings
'smtp_username' => 'your-email@gmail.com',
'smtp_password' => 'your-app-password', // Gmail App Password
'to_email' => 'your-email@gmail.com',

// Update allowed origins
'allowed_origins' => [
    'https://your-domain.com',
    'https://www.your-domain.com'
],
```

2. **For Gmail Setup:**
   - Enable 2-Factor Authentication
   - Generate an App Password: [Google Support](https://support.google.com/accounts/answer/185833)
   - Use the App Password in the config (not your regular password)

### 3. Upload to Server

1. Upload the entire `php-backend` folder to your web server
2. Make sure the directory is writable (for logging):
   ```bash
   chmod 755 php-backend
   chmod 755 php-backend/data
   ```

### 4. Test the Setup

You can test the contact form by sending a POST request:

```bash
curl -X POST https://your-domain.com/php-backend/contact.php \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "subject": "Test Message",
    "message": "This is a test message from the contact form."
  }'
```

### 5. Integration with Portfolio

When generating portfolios, the contact form will automatically use this endpoint:

```javascript
// Contact form submission
const response = await fetch('https://your-domain.com/php-backend/contact.php', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: formData.name,
    email: formData.email,
    subject: formData.subject,
    message: formData.message,
    phone: formData.phone, // optional
    company: formData.company // optional
  })
});
```

## File Structure

```
php-backend/
├── contact.php          # Main contact form handler
├── config.php           # Configuration file
├── README.md           # This file
└── data/               # Created automatically
    ├── rate_limit.json # Rate limiting data
    └── contact_log.json # Submission logs
```

## Security Features

### Rate Limiting
- Limits submissions to 5 per hour per IP address
- Configurable in `config.php`
- Uses file-based storage (can be upgraded to Redis/database)

### Input Validation
- Required field validation
- Email format validation
- Length limits on all fields
- HTML entity encoding to prevent XSS

### CORS Protection
- Only allows requests from configured domains
- Prevents unauthorized cross-origin requests

### Honeypot Protection
- Hidden field to catch automated bots
- Configurable field name

## Customization

### Email Template
The email template can be customized in the `sendEmail()` function in `contact.php`. The current template includes:

- Professional HTML design
- Gradient header matching portfolio themes
- All form fields formatted nicely
- Timestamp and sender information

### Validation Rules
Update validation rules in `config.php`:

```php
'validation' => [
    'name' => [
        'required' => true,
        'min_length' => 2,
        'max_length' => 100
    ],
    // ... other fields
]
```

### Response Messages
Customize all response messages in `config.php`:

```php
'messages' => [
    'success' => 'Your custom success message',
    'error_general' => 'Your custom error message',
    // ... other messages
]
```

## Troubleshooting

### Common Issues

1. **Email not sending:**
   - Check SMTP credentials in `config.php`
   - Verify Gmail App Password is correct
   - Check server mail logs

2. **CORS errors:**
   - Add your domain to `allowed_origins` in `config.php`
   - Ensure HTTPS is used in production

3. **Rate limiting too strict:**
   - Adjust `max_requests_per_hour` in `config.php`
   - Clear rate limit data: delete `data/rate_limit.json`

4. **Permission errors:**
   - Ensure web server can write to the `data` directory
   - Check file permissions: `chmod 755 php-backend`

### Logs

Check the following for debugging:
- `data/contact_log.json` - All submissions
- Server error logs
- PHP error logs

## Production Recommendations

1. **Use HTTPS** - Always use SSL/TLS in production
2. **Database Storage** - Consider upgrading to database storage for high traffic
3. **Email Service** - Use services like SendGrid, Mailgun for better deliverability
4. **Monitoring** - Set up monitoring for the contact form endpoint
5. **Backup** - Regular backups of logs and configuration

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review server error logs
3. Test with the curl command provided
4. Ensure all configuration is correct

## License

This contact form handler is part of the Portfolio Maker project and follows the same license terms.
