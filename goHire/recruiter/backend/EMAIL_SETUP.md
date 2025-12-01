# EmailJS Configuration for Forgot Password Feature

## Quick Setup

To enable email sending for the forgot password feature using EmailJS, follow these steps:

### Step 1: Create EmailJS Account

1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Sign up for a free account (100 emails/month free)
3. Verify your email address

### Step 2: Add Email Service

1. Go to **Email Services** in your EmailJS dashboard
2. Click **Add New Service**
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the setup instructions for your provider
5. **Copy your Service ID** (e.g., `service_xxxxxxx`)

### Step 3: Create Email Template

1. Go to **Email Templates** in your EmailJS dashboard
2. Click **Create New Template**
3. Use this template structure:

**Subject:** `Password Reset OTP - GoHire`

**Content (HTML):**
```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
  <div style="background-color: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="margin: 0;">GoHire Password Reset</h1>
  </div>
  <div style="background-color: white; padding: 30px; border-radius: 0 0 8px 8px;">
    <p style="font-size: 16px; color: #333;">Hello {{to_name}},</p>
    <p style="font-size: 16px; color: #333;">You have requested to reset your password. Please use the following OTP to proceed:</p>
    <div style="background-color: #f3f4f6; border: 2px dashed #2563eb; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
      <p style="font-size: 32px; font-weight: bold; color: #2563eb; letter-spacing: 8px; margin: 0;">{{otp}}</p>
    </div>
    <p style="font-size: 14px; color: #666;">This OTP will expire in 10 minutes.</p>
    <p style="font-size: 14px; color: #666;">If you didn't request this password reset, please ignore this email.</p>
    <p style="font-size: 14px; color: #666; margin-top: 30px;">Best regards,<br>The GoHire Team</p>
  </div>
</div>
```

**Template Variables to use:**
- `{{to_email}}` - Recipient email
- `{{to_name}}` - Recipient name (extracted from email)
- `{{otp}}` - The 6-digit OTP code
- `{{subject}}` - Email subject
- `{{message}}` - Additional message

4. **Copy your Template ID** (e.g., `template_xxxxxxx`)

### Step 4: Get API Keys

1. Go to **Account** → **General** in EmailJS dashboard
2. Find your **Public Key** (or create a **Private Key** for backend usage)
3. **Copy your Public Key** (e.g., `xxxxxxxxxxxxx`)

### Step 5: Configure Environment Variables

Add these to your backend `.env` file:

```env
EMAILJS_SERVICE_ID=service_xxxxxxx
EMAILJS_TEMPLATE_ID=template_xxxxxxx
EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxx
EMAILJS_PRIVATE_KEY=xxxxxxxxxxxxx  # Optional but recommended for backend
```

**Note:** 
- `EMAILJS_PUBLIC_KEY` is required
- `EMAILJS_PRIVATE_KEY` is optional but recommended for backend/server-side usage
- You can use either public key or private key, but private key is more secure for backend

## Template Variables Reference

The following variables are automatically sent to your EmailJS template:

- `to_email` - The recipient's email address
- `to_name` - The recipient's name (extracted from email)
- `otp` - The 6-digit OTP code
- `subject` - Email subject line
- `message` - Additional message text

Make sure your EmailJS template uses these variable names (e.g., `{{otp}}`, `{{to_email}}`).

## Development Mode

If EmailJS credentials are **not configured**, the system will automatically:
- Log the OTP to the server console instead of sending emails
- This allows you to test the forgot password feature without EmailJS setup
- Check your server console/terminal for the OTP when testing

Example console output:
```
========================================
📧 FORGOT PASSWORD OTP (Development Mode)
========================================
Email: user@example.com
OTP: 123456
========================================
```

## Testing

1. Start your backend server
2. Check the console for email service status:
   - ✅ "EmailJS service is ready to send messages" - EmailJS is configured
   - ⚠️ "EmailJS credentials not configured" - Using console mode
3. Test the forgot password flow
4. Check your email (or server console) for the OTP

## EmailJS Free Tier Limits

- **Free Plan:** 100 emails/month
- **Paid Plans:** Start at $15/month for 1,000 emails

For production use, consider upgrading to a paid plan if you expect more than 100 password resets per month.

## Troubleshooting

### Email not sending?
1. Verify all environment variables are set correctly
2. Check that your EmailJS service is active
3. Verify template ID matches your template
4. Check EmailJS dashboard for error logs
5. Ensure your email service (Gmail, etc.) is properly connected in EmailJS

### Template variables not working?
- Make sure variable names match exactly (case-sensitive)
- Use double curly braces: `{{variable_name}}`
- Check that variables are defined in your template settings

