# EmailJS OTP Template Setup Guide

## Template Variable Names

Use these exact variable names in your EmailJS template:

1. **`{{recipient_email}}`** - The user's email address
2. **`{{recipient_name}}`** - The user's name (extracted from email)
3. **`{{otp_code}}`** - The 6-digit OTP code
4. **`{{otp_expiry}}`** - OTP expiration time in minutes (e.g., "10")
5. **`{{app_name}}`** - Application name (e.g., "GoHire")

## EmailJS Template HTML

Copy and paste this HTML into your EmailJS template editor:

```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
  <div style="background-color: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="margin: 0;">{{app_name}} Password Reset</h1>
  </div>
  <div style="background-color: white; padding: 30px; border-radius: 0 0 8px 8px;">
    <p style="font-size: 16px; color: #333;">Hello {{recipient_name}},</p>
    <p style="font-size: 16px; color: #333;">You have requested to reset your password. Please use the following One-Time Password (OTP) to proceed:</p>
    <div style="background-color: #f3f4f6; border: 2px dashed #2563eb; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
      <p style="font-size: 32px; font-weight: bold; color: #2563eb; letter-spacing: 8px; margin: 0;">{{otp_code}}</p>
    </div>
    <p style="font-size: 14px; color: #666;">This OTP will expire in {{otp_expiry}} minutes.</p>
    <p style="font-size: 14px; color: #666;">If you didn't request this password reset, please ignore this email.</p>
    <p style="font-size: 14px; color: #666; margin-top: 30px;">Best regards,<br>The {{app_name}} Team</p>
  </div>
</div>
```

## Email Subject Line

Use this for the email subject:
```
Password Reset OTP - {{app_name}}
```

Or simply:
```
One-Time Password for Password Reset
```

## Steps to Create Template in EmailJS

1. **Go to EmailJS Dashboard**
   - Visit: https://dashboard.emailjs.com/admin/templates
   - Click "Create New Template"

2. **Template Settings**
   - **Template Name**: "Password Reset OTP"
   - **Subject**: `Password Reset OTP - {{app_name}}`
   - **Content**: Paste the HTML above

3. **Add Template Variables**
   In the template editor, make sure these variables are recognized:
   - `{{recipient_email}}`
   - `{{recipient_name}}`
   - `{{otp_code}}`
   - `{{otp_expiry}}`
   - `{{app_name}}`

4. **Save and Copy Template ID**
   - Save the template
   - Copy the Template ID (e.g., `template_xxxxxxx`)
   - This will be used in your `.env` file

5. **Update Environment Variables**
   After creating the template, update your `.env` file:
   ```env
   EMAILJS_SERVICE_ID=service_xxxxxxx
   EMAILJS_TEMPLATE_ID=template_xxxxxxx  # Your new template ID
   EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxx
   EMAILJS_PRIVATE_KEY=xxxxxxxxxxxxx
   ```

## Testing

After setting up:
1. Restart your backend server
2. Test the forgot password flow
3. Check your email for the OTP

## Template Variables Summary

| Variable Name | Description | Example Value |
|--------------|-------------|---------------|
| `recipient_email` | User's email address | `user@example.com` |
| `recipient_name` | User's name | `user` (from email) |
| `otp_code` | 6-digit OTP | `123456` |
| `otp_expiry` | Expiry time in minutes | `10` |
| `app_name` | Application name | `GoHire` |

