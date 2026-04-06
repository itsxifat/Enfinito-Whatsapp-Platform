// Email utility — requires nodemailer (npm install nodemailer)
// In development with no SMTP config, reset links are logged to console.

let _transporter = null

async function getTransporter() {
  if (_transporter) return _transporter
  try {
    const nodemailer = await import('nodemailer')
    _transporter = nodemailer.default.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
    return _transporter
  } catch {
    return null
  }
}

const FROM = process.env.SMTP_FROM || 'Enfinito <noreply@enfinito.app>'
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

export async function sendPasswordResetEmail(toEmail, resetToken) {
  const resetUrl = `${BASE_URL}/reset-password?token=${resetToken}`

  if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
    // Dev fallback — print link to console so dev can test without SMTP
    console.log('\n[DEV] Password reset link:', resetUrl, '\n')
    return { ok: true, dev: true }
  }

  const transport = await getTransporter()
  if (!transport) return { ok: false, error: 'Email service unavailable.' }

  try {
    await transport.sendMail({
      from: FROM,
      to: toEmail,
      subject: 'Reset your Enfinito password',
      html: `
        <div style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;background:#0a0a0a;color:#f5f5f5;border-radius:12px">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:28px">
            <div style="width:36px;height:36px;border-radius:8px;background:#25d366;display:flex;align-items:center;justify-content:center;font-size:18px;color:#000">✦</div>
            <span style="font-weight:700;font-size:16px">Enfinito</span>
          </div>
          <h2 style="font-size:20px;font-weight:700;margin-bottom:12px">Reset your password</h2>
          <p style="color:#888;font-size:14px;margin-bottom:24px;line-height:1.6">
            We received a request to reset your password. Click the button below to choose a new one. This link expires in <strong style="color:#f5f5f5">1 hour</strong>.
          </p>
          <a href="${resetUrl}" style="display:inline-block;background:#25d366;color:#000;font-weight:600;font-size:14px;padding:12px 24px;border-radius:8px;text-decoration:none">
            Reset password →
          </a>
          <p style="color:#555;font-size:12px;margin-top:28px">
            If you didn't request this, you can safely ignore this email.
          </p>
        </div>
      `,
    })
    return { ok: true }
  } catch (err) {
    console.error('[email] Failed to send password reset:', err)
    return { ok: false, error: 'Failed to send email.' }
  }
}

export async function sendApprovalEmail(toEmail, name) {
  const loginUrl = `${BASE_URL}/login`

  if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
    console.log(`\n[DEV] User approved: ${name} <${toEmail}> — login: ${loginUrl}\n`)
    return { ok: true, dev: true }
  }

  const transport = await getTransporter()
  if (!transport) return { ok: false }

  try {
    await transport.sendMail({
      from: FROM,
      to: toEmail,
      subject: 'Your Enfinito account is approved',
      html: `
        <div style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;background:#0a0a0a;color:#f5f5f5;border-radius:12px">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:28px">
            <div style="width:36px;height:36px;border-radius:8px;background:#25d366;display:flex;align-items:center;justify-content:center;font-size:18px;color:#000">✦</div>
            <span style="font-weight:700;font-size:16px">Enfinito</span>
          </div>
          <h2 style="font-size:20px;font-weight:700;margin-bottom:12px">You're approved, ${name}!</h2>
          <p style="color:#888;font-size:14px;margin-bottom:24px;line-height:1.6">
            Your Enfinito account has been approved by an administrator. You can now log in and start using the platform.
          </p>
          <a href="${loginUrl}" style="display:inline-block;background:#25d366;color:#000;font-weight:600;font-size:14px;padding:12px 24px;border-radius:8px;text-decoration:none">
            Sign in →
          </a>
        </div>
      `,
    })
    return { ok: true }
  } catch (err) {
    console.error('[email] Failed to send approval email:', err)
    return { ok: false }
  }
}
