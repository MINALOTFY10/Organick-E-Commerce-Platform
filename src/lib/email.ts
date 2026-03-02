import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";

// In DEVELOPMENT (no SMTP_HOST configured) we automatically create a free
// Ethereal (https://ethereal.email/) test account and log a preview URL to
// the console — no .env setup needed.
//
// In PRODUCTION set these env vars:
//   SMTP_HOST      e.g. smtp.gmail.com
//   SMTP_PORT      e.g. 587
//   SMTP_SECURE    "true" for port 465, "false" otherwise
//   SMTP_USER      your SMTP username / email address
//   SMTP_PASS      your SMTP password / app password
//   EMAIL_FROM     the "from" address shown to recipients

// Cached Ethereal transporter so we only create one test account per server startup
let _etherealTransporter: Transporter | null = null;

async function getTransporter(): Promise<Transporter> {
  // If real SMTP credentials are provided, use them every time
  if (process.env.SMTP_HOST) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === "true",
      auth:
        process.env.SMTP_USER && process.env.SMTP_PASS
          ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
          : undefined,
    });
  }

  // No SMTP config → fall back to an auto-created Ethereal test account
  if (!_etherealTransporter) {
    const testAccount = await nodemailer.createTestAccount();
    _etherealTransporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: { user: testAccount.user, pass: testAccount.pass },
    });
    if (process.env.NODE_ENV !== "production") {
      console.log(
        "\n[email] ⚠️  No SMTP_HOST configured — using Ethereal test account.\n" +
          `[email] Test account: ${testAccount.user}\n` +
          "[email] Preview URLs will be logged below each send.\n"
      );
    }
  }

  return _etherealTransporter;
}

const FROM_ADDRESS =
  process.env.EMAIL_FROM || '"Organick" <noreply@organick.com>';

export async function sendVerificationOtpEmail({
  to,
  otp,
}: {
  to: string;
  otp: string;
}) {
  const transporter = await getTransporter();

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Verify your email — Organick</title>
</head>
<body style="margin:0;padding:0;background:#F9F8F4;font-family:sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F9F8F4;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="580" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.08);">
          <!-- Header -->
          <tr>
            <td style="background:#2C5F2E;padding:32px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:700;letter-spacing:-0.5px;">🌿 Organick</h1>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px;text-align:center;">
              <h2 style="margin:0 0 8px;color:#2C5F2E;font-size:22px;">Verify your email address</h2>
              <p style="margin:0 0 32px;color:#555;line-height:1.6;">
                Enter the 6-digit code below to confirm your Organick account.
              </p>
              <!-- OTP block -->
              <div style="display:inline-block;background:#F4F9F4;border:2px dashed #97BC62;border-radius:12px;padding:20px 40px;margin-bottom:28px;">
                <span style="font-size:40px;font-weight:800;letter-spacing:12px;color:#2C5F2E;font-family:monospace;">${otp}</span>
              </div>
              <p style="margin:0 0 8px;color:#888;font-size:13px;line-height:1.6;">
                This code expires in <strong>10 minutes</strong>. If you didn&rsquo;t create an Organick account,
                you can safely ignore this email.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#f5f5f0;padding:20px 40px;text-align:center;">
              <p style="margin:0;color:#aaa;font-size:12px;">
                &copy; ${new Date().getFullYear()} Organick Foods. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const info = await transporter.sendMail({
    from: FROM_ADDRESS,
    to,
    subject: `${otp} — Your Organick verification code`,
    html,
    text: `Your Organick verification code is: ${otp}\n\nThis code expires in 10 minutes.\nIf you didn't create an account, ignore this email.`,
  });

  // In dev (Ethereal), log a clickable preview URL so you can see the email instantly
  const previewUrl = nodemailer.getTestMessageUrl(info);
  if (previewUrl && process.env.NODE_ENV !== "production") {
    console.log(`\n[email] ✉️  Verification OTP sent to: ${to}`);
    console.log(`[email] 👉 Preview URL: ${previewUrl}\n`);
  }
}

export async function sendPasswordResetEmail({
  to,
  resetUrl,
}: {
  to: string;
  resetUrl: string;
}) {
  const transporter = await getTransporter();

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Reset your password — Organick</title>
</head>
<body style="margin:0;padding:0;background:#F9F8F4;font-family:sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F9F8F4;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="580" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.08);">
          <!-- Header -->
          <tr>
            <td style="background:#2C5F2E;padding:32px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:700;letter-spacing:-0.5px;">🌿 Organick</h1>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <h2 style="margin:0 0 16px;color:#2C5F2E;font-size:22px;">Reset your password</h2>
              <p style="margin:0 0 24px;color:#555;line-height:1.6;">
                We received a request to reset the password for your Organick account.
                Click the button below to choose a new password.
              </p>
              <table cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
                <tr>
                  <td style="background:#97BC62;border-radius:8px;">
                    <a href="${resetUrl}"
                       style="display:inline-block;padding:14px 32px;color:#ffffff;font-weight:700;font-size:15px;text-decoration:none;letter-spacing:0.3px;">
                      Reset Password
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin:0 0 8px;color:#888;font-size:13px;line-height:1.6;">
                This link expires in <strong>1 hour</strong>. If you didn&rsquo;t request a password reset,
                you can safely ignore this email &mdash; your password won&rsquo;t change.
              </p>
              <p style="margin:0;color:#aaa;font-size:12px;word-break:break-all;">
                Or copy and paste this URL into your browser:<br/>
                <a href="${resetUrl}" style="color:#97BC62;">${resetUrl}</a>
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#f5f5f0;padding:20px 40px;text-align:center;">
              <p style="margin:0;color:#aaa;font-size:12px;">
                &copy; ${new Date().getFullYear()} Organick Foods. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const info = await transporter.sendMail({
    from: FROM_ADDRESS,
    to,
    subject: "Reset your Organick password",
    html,
    text: `Reset your Organick password\n\nClick the link below to choose a new password:\n${resetUrl}\n\nThis link expires in 1 hour. If you didn't request this, ignore this email.`,
  });

  const previewUrl = nodemailer.getTestMessageUrl(info);
  if (previewUrl && process.env.NODE_ENV !== "production") {
    console.log(`\n[email] ✉️  Password reset email sent to: ${to}`);
    console.log(`[email] 👉 Preview URL: ${previewUrl}\n`);
  }
}
