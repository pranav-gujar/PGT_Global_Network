# PGT Global Network — Branded Email Templates

These premium, responsive HTML email templates are designed to match PGT Global Network's modern light theme (using Indigo, Royal Blue, and Slate colors). 

To apply these, copy the raw HTML code snippets below and paste them into your **Supabase Dashboard** under **Settings -> Auth -> Email Templates**.

---

## 1. Confirm Signup (Email Verification)

**Subject**: `Welcome to PGT Global Network - Verify Your Email`

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background-color: #f8fafc;
      color: #334155;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      max-width: 600px;
      margin: 40px auto;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05);
    }
    .header {
      background: linear-gradient(135deg, #312e81 0%, #1e1b4b 100%);
      padding: 40px 32px;
      text-align: center;
      position: relative;
    }
    .header h1 {
      color: #ffffff;
      font-size: 26px;
      font-weight: 800;
      margin: 0;
      letter-spacing: -0.025em;
    }
    .header p {
      color: #818cf8;
      font-size: 13px;
      margin: 8px 0 0 0;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }
    .content {
      padding: 48px 40px;
      line-height: 1.7;
    }
    .content h2 {
      font-size: 22px;
      font-weight: 800;
      color: #0f172a;
      margin-top: 0;
      margin-bottom: 20px;
      letter-spacing: -0.02em;
    }
    .content p {
      font-size: 15px;
      color: #475569;
      margin-bottom: 24px;
    }
    .cta-container {
      text-align: center;
      margin: 36px 0;
    }
    .btn {
      display: inline-block;
      background: linear-gradient(135deg, #4f46e5 0%, #2563eb 100%);
      color: #ffffff !important;
      text-decoration: none;
      padding: 16px 36px;
      border-radius: 12px;
      font-weight: 700;
      font-size: 14px;
      box-shadow: 0 6px 20px rgba(79, 70, 229, 0.2);
      transition: all 0.3s ease;
    }
    .security-notice {
      background-color: #f1f5f9;
      border-radius: 12px;
      padding: 16px 20px;
      margin-top: 32px;
    }
    .security-notice p {
      font-size: 13px;
      color: #64748b;
      margin: 0;
      line-height: 1.5;
    }
    .footer {
      background-color: #f8fafc;
      padding: 32px 40px;
      text-align: center;
      border-top: 1px solid #e2e8f0;
    }
    .footer p {
      font-size: 12px;
      color: #94a3b8;
      margin: 6px 0;
    }
    .footer a {
      color: #6366f1;
      text-decoration: none;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>PGT Global Network</h1>
      <p>Official Member Communication</p>
    </div>
    <div class="content">
      <h2>Verify Your Email Address</h2>
      <p>Hello,</p>
      <p>Welcome to the PGT Global Network community. Thank you for creating your account.</p>
      <p>To protect your credentials and activate access to your secure member portal, please verify your email address by clicking the button below:</p>
      
      <div class="cta-container">
        <a href="{{ .ConfirmationURL }}" class="btn">Verify My Email</a>
      </div>

      <p>If the button above does not work, copy and paste this verification URL directly into your browser:</p>
      <p style="word-break: break-all; font-size: 13px; color: #4f46e5; font-family: monospace; background: #e0e7ff; padding: 12px; border-radius: 8px;">{{ .ConfirmationURL }}</p>
      
      <div class="security-notice">
        <p><strong>Security Notice:</strong> This link is only valid for 24 hours. If you did not create this account, you can safely ignore this email.</p>
      </div>
    </div>
    <div class="footer">
      <p>&copy; 2026 PGT Global Network. All rights reserved.</p>
      <p>Website: <a href="https://www.pgtglobalnetwork.com">pgtglobalnetwork.com</a> &nbsp;|&nbsp; Support: <a href="mailto:office@pgtglobalnetwork.com">office@pgtglobalnetwork.com</a></p>
    </div>
  </div>
</body>
</html>
```

---

## 2. Reset Password

**Subject**: `Reset Your PGT Global Network Password`

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background-color: #f8fafc;
      color: #334155;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      max-width: 600px;
      margin: 40px auto;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05);
    }
    .header {
      background: linear-gradient(135deg, #312e81 0%, #1e1b4b 100%);
      padding: 40px 32px;
      text-align: center;
      position: relative;
    }
    .header h1 {
      color: #ffffff;
      font-size: 26px;
      font-weight: 800;
      margin: 0;
      letter-spacing: -0.025em;
    }
    .header p {
      color: #818cf8;
      font-size: 13px;
      margin: 8px 0 0 0;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }
    .content {
      padding: 48px 40px;
      line-height: 1.7;
    }
    .content h2 {
      font-size: 22px;
      font-weight: 800;
      color: #0f172a;
      margin-top: 0;
      margin-bottom: 20px;
      letter-spacing: -0.02em;
    }
    .content p {
      font-size: 15px;
      color: #475569;
      margin-bottom: 24px;
    }
    .cta-container {
      text-align: center;
      margin: 36px 0;
    }
    .btn {
      display: inline-block;
      background: linear-gradient(135deg, #4f46e5 0%, #2563eb 100%);
      color: #ffffff !important;
      text-decoration: none;
      padding: 16px 36px;
      border-radius: 12px;
      font-weight: 700;
      font-size: 14px;
      box-shadow: 0 6px 20px rgba(79, 70, 229, 0.2);
      transition: all 0.3s ease;
    }
    .security-notice {
      background-color: #f1f5f9;
      border-radius: 12px;
      padding: 16px 20px;
      margin-top: 32px;
    }
    .security-notice p {
      font-size: 13px;
      color: #64748b;
      margin: 0;
      line-height: 1.5;
    }
    .footer {
      background-color: #f8fafc;
      padding: 32px 40px;
      text-align: center;
      border-top: 1px solid #e2e8f0;
    }
    .footer p {
      font-size: 12px;
      color: #94a3b8;
      margin: 6px 0;
    }
    .footer a {
      color: #6366f1;
      text-decoration: none;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>PGT Global Network</h1>
      <p>Official Member Communication</p>
    </div>
    <div class="content">
      <h2>Reset Your Password</h2>
      <p>Hello,</p>
      <p>We received a request to reset the password for your PGT Global Network member account.</p>
      <p>To secure your profile and select a new password, click the button below:</p>
      
      <div class="cta-container">
        <a href="{{ .ConfirmationURL }}" class="btn">Reset My Password</a>
      </div>

      <p>If the button above does not work, copy and paste this verification URL directly into your browser:</p>
      <p style="word-break: break-all; font-size: 13px; color: #4f46e5; font-family: monospace; background: #e0e7ff; padding: 12px; border-radius: 8px;">{{ .ConfirmationURL }}</p>
      
      <div class="security-notice">
        <p><strong>Security Notice:</strong> If you did not initiate this request, you can safely ignore this email. Your password will remain unchanged.</p>
      </div>
    </div>
    <div class="footer">
      <p>&copy; 2026 PGT Global Network. All rights reserved.</p>
      <p>Website: <a href="https://www.pgtglobalnetwork.com">pgtglobalnetwork.com</a> &nbsp;|&nbsp; Support: <a href="mailto:office@pgtglobalnetwork.com">office@pgtglobalnetwork.com</a></p>
    </div>
  </div>
</body>
</html>
```

---

## 3. Email Change Confirmation

**Subject**: `Confirm Your PGT Global Network Email Change`

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirm Email Change</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background-color: #f8fafc;
      color: #334155;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      max-width: 600px;
      margin: 40px auto;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05);
    }
    .header {
      background: linear-gradient(135deg, #312e81 0%, #1e1b4b 100%);
      padding: 40px 32px;
      text-align: center;
      position: relative;
    }
    .header h1 {
      color: #ffffff;
      font-size: 26px;
      font-weight: 800;
      margin: 0;
      letter-spacing: -0.025em;
    }
    .header p {
      color: #818cf8;
      font-size: 13px;
      margin: 8px 0 0 0;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }
    .content {
      padding: 48px 40px;
      line-height: 1.7;
    }
    .content h2 {
      font-size: 22px;
      font-weight: 800;
      color: #0f172a;
      margin-top: 0;
      margin-bottom: 20px;
      letter-spacing: -0.02em;
    }
    .content p {
      font-size: 15px;
      color: #475569;
      margin-bottom: 24px;
    }
    .cta-container {
      text-align: center;
      margin: 36px 0;
    }
    .btn {
      display: inline-block;
      background: linear-gradient(135deg, #4f46e5 0%, #2563eb 100%);
      color: #ffffff !important;
      text-decoration: none;
      padding: 16px 36px;
      border-radius: 12px;
      font-weight: 700;
      font-size: 14px;
      box-shadow: 0 6px 20px rgba(79, 70, 229, 0.2);
      transition: all 0.3s ease;
    }
    .security-notice {
      background-color: #f1f5f9;
      border-radius: 12px;
      padding: 16px 20px;
      margin-top: 32px;
    }
    .security-notice p {
      font-size: 13px;
      color: #64748b;
      margin: 0;
      line-height: 1.5;
    }
    .footer {
      background-color: #f8fafc;
      padding: 32px 40px;
      text-align: center;
      border-top: 1px solid #e2e8f0;
    }
    .footer p {
      font-size: 12px;
      color: #94a3b8;
      margin: 6px 0;
    }
    .footer a {
      color: #6366f1;
      text-decoration: none;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>PGT Global Network</h1>
      <p>Official Member Communication</p>
    </div>
    <div class="content">
      <h2>Confirm Email Change</h2>
      <p>Hello,</p>
      <p>We received a request to update the primary email address associated with your PGT Global Network member profile.</p>
      <p>To confirm this change and verify your new email address, click the button below:</p>
      
      <div class="cta-container">
        <a href="{{ .ConfirmationURL }}" class="btn">Confirm Email Change</a>
      </div>

      <p>If the button above does not work, copy and paste this verification URL directly into your browser:</p>
      <p style="word-break: break-all; font-size: 13px; color: #4f46e5; font-family: monospace; background: #e0e7ff; padding: 12px; border-radius: 8px;">{{ .ConfirmationURL }}</p>
      
      <div class="security-notice">
        <p><strong>Security Notice:</strong> If you did not make this request, you can safely ignore this email. Your email address will remain unchanged.</p>
      </div>
    </div>
    <div class="footer">
      <p>&copy; 2026 PGT Global Network. All rights reserved.</p>
      <p>Website: <a href="https://www.pgtglobalnetwork.com">pgtglobalnetwork.com</a> &nbsp;|&nbsp; Support: <a href="mailto:office@pgtglobalnetwork.com">office@pgtglobalnetwork.com</a></p>
    </div>
  </div>
</body>
</html>
```

---

## 4. Magic Link

**Subject**: `Sign In to PGT Global Network`

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sign In to PGT</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background-color: #f8fafc;
      color: #334155;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      max-width: 600px;
      margin: 40px auto;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05);
    }
    .header {
      background: linear-gradient(135deg, #312e81 0%, #1e1b4b 100%);
      padding: 40px 32px;
      text-align: center;
      position: relative;
    }
    .header h1 {
      color: #ffffff;
      font-size: 26px;
      font-weight: 800;
      margin: 0;
      letter-spacing: -0.025em;
    }
    .header p {
      color: #818cf8;
      font-size: 13px;
      margin: 8px 0 0 0;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }
    .content {
      padding: 48px 40px;
      line-height: 1.7;
    }
    .content h2 {
      font-size: 22px;
      font-weight: 800;
      color: #0f172a;
      margin-top: 0;
      margin-bottom: 20px;
      letter-spacing: -0.02em;
    }
    .content p {
      font-size: 15px;
      color: #475569;
      margin-bottom: 24px;
    }
    .cta-container {
      text-align: center;
      margin: 36px 0;
    }
    .btn {
      display: inline-block;
      background: linear-gradient(135deg, #4f46e5 0%, #2563eb 100%);
      color: #ffffff !important;
      text-decoration: none;
      padding: 16px 36px;
      border-radius: 12px;
      font-weight: 700;
      font-size: 14px;
      box-shadow: 0 6px 20px rgba(79, 70, 229, 0.2);
      transition: all 0.3s ease;
    }
    .security-notice {
      background-color: #f1f5f9;
      border-radius: 12px;
      padding: 16px 20px;
      margin-top: 32px;
    }
    .security-notice p {
      font-size: 13px;
      color: #64748b;
      margin: 0;
      line-height: 1.5;
    }
    .footer {
      background-color: #f8fafc;
      padding: 32px 40px;
      text-align: center;
      border-top: 1px solid #e2e8f0;
    }
    .footer p {
      font-size: 12px;
      color: #94a3b8;
      margin: 6px 0;
    }
    .footer a {
      color: #6366f1;
      text-decoration: none;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>PGT Global Network</h1>
      <p>Official Member Communication</p>
    </div>
    <div class="content">
      <h2>Sign In to Your Account</h2>
      <p>Hello,</p>
      <p>We received a request to log in to your PGT Global Network member workspace.</p>
      <p>Use the secure button below to sign in instantly without needing a password:</p>
      
      <div class="cta-container">
        <a href="{{ .ConfirmationURL }}" class="btn">Sign In Instantly</a>
      </div>

      <p>If the button above does not work, copy and paste this verification URL directly into your browser:</p>
      <p style="word-break: break-all; font-size: 13px; color: #4f46e5; font-family: monospace; background: #e0e7ff; padding: 12px; border-radius: 8px;">{{ .ConfirmationURL }}</p>
      
      <div class="security-notice">
        <p><strong>Security Notice:</strong> This magic link is only valid for a single use and will expire in 15 minutes. If you did not make this request, you can safely ignore this email.</p>
      </div>
    </div>
    <div class="footer">
      <p>&copy; 2026 PGT Global Network. All rights reserved.</p>
      <p>Website: <a href="https://www.pgtglobalnetwork.com">pgtglobalnetwork.com</a> &nbsp;|&nbsp; Support: <a href="mailto:office@pgtglobalnetwork.com">office@pgtglobalnetwork.com</a></p>
    </div>
  </div>
</body>
</html>
```

---

## 5. Invite User

**Subject**: `You Are Invited to PGT Global Network`

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Accept Invitation</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background-color: #f8fafc;
      color: #334155;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      max-width: 600px;
      margin: 40px auto;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05);
    }
    .header {
      background: linear-gradient(135deg, #312e81 0%, #1e1b4b 100%);
      padding: 40px 32px;
      text-align: center;
      position: relative;
    }
    .header h1 {
      color: #ffffff;
      font-size: 26px;
      font-weight: 800;
      margin: 0;
      letter-spacing: -0.025em;
    }
    .header p {
      color: #818cf8;
      font-size: 13px;
      margin: 8px 0 0 0;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }
    .content {
      padding: 48px 40px;
      line-height: 1.7;
    }
    .content h2 {
      font-size: 22px;
      font-weight: 800;
      color: #0f172a;
      margin-top: 0;
      margin-bottom: 20px;
      letter-spacing: -0.02em;
    }
    .content p {
      font-size: 15px;
      color: #475569;
      margin-bottom: 24px;
    }
    .cta-container {
      text-align: center;
      margin: 36px 0;
    }
    .btn {
      display: inline-block;
      background: linear-gradient(135deg, #4f46e5 0%, #2563eb 100%);
      color: #ffffff !important;
      text-decoration: none;
      padding: 16px 36px;
      border-radius: 12px;
      font-weight: 700;
      font-size: 14px;
      box-shadow: 0 6px 20px rgba(79, 70, 229, 0.2);
      transition: all 0.3s ease;
    }
    .security-notice {
      background-color: #f1f5f9;
      border-radius: 12px;
      padding: 16px 20px;
      margin-top: 32px;
    }
    .security-notice p {
      font-size: 13px;
      color: #64748b;
      margin: 0;
      line-height: 1.5;
    }
    .footer {
      background-color: #f8fafc;
      padding: 32px 40px;
      text-align: center;
      border-top: 1px solid #e2e8f0;
    }
    .footer p {
      font-size: 12px;
      color: #94a3b8;
      margin: 6px 0;
    }
    .footer a {
      color: #6366f1;
      text-decoration: none;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>PGT Global Network</h1>
      <p>Official Member Communication</p>
    </div>
    <div class="content">
      <h2>You Are Invited</h2>
      <p>Hello,</p>
      <p>You have been invited to join the PGT Global Network member community.</p>
      <p>Click the button below to accept the invitation, set up your credentials, and access your secure member workspace:</p>
      
      <div class="cta-container">
        <a href="{{ .ConfirmationURL }}" class="btn">Accept Invitation</a>
      </div>

      <p>If the button above does not work, copy and paste this verification URL directly into your browser:</p>
      <p style="word-break: break-all; font-size: 13px; color: #4f46e5; font-family: monospace; background: #e0e7ff; padding: 12px; border-radius: 8px;">{{ .ConfirmationURL }}</p>
      
      <div class="security-notice">
        <p><strong>Security Notice:</strong> If you did not expect this invitation, you can safely ignore this email.</p>
      </div>
    </div>
    <div class="footer">
      <p>&copy; 2026 PGT Global Network. All rights reserved.</p>
      <p>Website: <a href="https://www.pgtglobalnetwork.com">pgtglobalnetwork.com</a> &nbsp;|&nbsp; Support: <a href="mailto:office@pgtglobalnetwork.com">office@pgtglobalnetwork.com</a></p>
    </div>
  </div>
</body>
</html>
```
