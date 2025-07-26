# Contact Form Setup with Formspree

Your portfolio includes a contact form that uses Formspree to handle form submissions. Follow these simple steps to make it work:

## Quick Setup (5 minutes)

### 1. Sign up for Formspree
- Go to [https://formspree.io](https://formspree.io)
- Create a free account (allows 50 submissions per month)
- Click "New Form" to create a form

### 2. Get Your Form ID (Step-by-Step)
- After signing up, click **"New Form"** button
- Give your form a name (e.g., "Portfolio Contact Form")
- Click **"Create Form"**
- You'll see your form endpoint URL: `https://formspree.io/f/YOUR-FORM-ID`
- Your Form ID is the part after `/f/` (e.g., `xpzgkqyw`)
- **Copy this Form ID** - you'll need it in the next step

**Example**: If your URL is `https://formspree.io/f/xpzgkqyw`, then `xpzgkqyw` is your Form ID

### 3. Update Your Portfolio
- Open your `index.html` file
- Find this line: `<form class="contact-form" action="https://formspree.io/f/your-form-id" method="POST">`
- Replace `your-form-id` with your actual Formspree ID
- Example: `<form class="contact-form" action="https://formspree.io/f/xpzgkqyw" method="POST">`

### 4. Test Your Form
- Upload your portfolio to your web hosting
- Fill out the contact form and submit it
- Check your email - you should receive the message!

## Features Included

✅ **Spam Protection** - Formspree includes built-in spam filtering  
✅ **Email Notifications** - Get emails when someone contacts you  
✅ **Mobile Friendly** - Works perfectly on all devices  
✅ **No Backend Required** - No PHP or server setup needed  
✅ **Free Plan Available** - 50 submissions per month at no cost  

## Customization Options

### Add More Fields
You can add additional fields to your form by adding them to the HTML:

```html
<div class="form-group">
    <input type="tel" name="phone" placeholder="Phone Number">
</div>
<div class="form-group">
    <input type="text" name="company" placeholder="Company">
</div>
```

### Custom Thank You Page
Add a hidden input to redirect users after submission:

```html
<input type="hidden" name="_next" value="https://yourdomain.com/thank-you.html">
```

### Custom Subject Line
Add a hidden input to customize the email subject:

```html
<input type="hidden" name="_subject" value="New contact from portfolio">
```

## Troubleshooting

**Form not working?**
- Make sure you replaced `your-form-id` with your actual Formspree ID
- Check that your website is uploaded to a web server (not just opened locally)
- Verify your Formspree account is active

**Not receiving emails?**
- Check your spam folder
- Verify the email address in your Formspree account
- Make sure you confirmed your Formspree account via email

## Alternative: Contact Information Only

If you prefer not to use a contact form, you can replace the entire form section with just your contact information:

```html
<div class="contact-info-only">
    <h3>Get In Touch</h3>
    <p>Feel free to reach out to me directly:</p>
    <div class="contact-details">
        <div class="contact-detail">
            <i class="fas fa-envelope"></i>
            <a href="mailto:your-email@example.com">your-email@example.com</a>
        </div>
        <div class="contact-detail">
            <i class="fas fa-phone"></i>
            <a href="tel:+1234567890">+1 (234) 567-890</a>
        </div>
    </div>
</div>
```

## Support

- **Formspree Documentation**: [https://help.formspree.io](https://help.formspree.io)
- **Formspree Support**: Available through their website
- **Portfolio Maker**: This form setup is included with all generated portfolios

---

**Note**: Remember to replace `your-form-id` in the form action URL with your actual Formspree ID for the contact form to work properly.
