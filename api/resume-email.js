import nodemailer from "nodemailer";

let transporter;

function getTransporter() {
  if (transporter) {
    return transporter;
  }

  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (!smtpHost || !smtpUser || !smtpPass) {
    return null;
  }

  transporter = nodemailer.createTransport({
    host: smtpHost,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  return transporter;
}

async function sendResumeEmail({ email }) {
  const mailer = getTransporter();

  if (!mailer) {
    return {
      sent: false,
      reason: "Mailer is not configured. Set SMTP_HOST, SMTP_USER, SMTP_PASS.",
    };
  }

  const mailFrom = process.env.MAIL_FROM || process.env.SMTP_USER;
  const subject = "Your requested resume - Nitin Baranwal";
  const text = [
    "Hi there,",
    "",
    "Thanks for requesting my resume.",
    "",
    "View Resume:",
    "https://drive.google.com/file/d/1gniCu779cwb1_O3-yF54fo0YI9mmHS7o/view?usp=drivesdk",
    "",
    "Download Resume:",
    "https://drive.google.com/uc?export=download&id=1gniCu779cwb1_O3-yF54fo0YI9mmHS7o",
    "",
    "Best regards,",
    "Nitin Baranwal",
  ].join("\n");

  const html = `
    <div style="font-family: Arial, sans-serif; color: #1f2937; line-height: 1.6;">
      <h2 style="margin: 0 0 12px; color: #111827;">Resume Request</h2>
      <p style="margin: 0 0 12px;">Hi there,</p>
      <p style="margin: 0 0 12px;">Thanks for requesting my resume.</p>
      <p style="margin: 0 0 8px;">
        <a href="https://drive.google.com/file/d/1gniCu779cwb1_O3-yF54fo0YI9mmHS7o/view?usp=drivesdk" target="_blank" rel="noreferrer">View Resume</a>
      </p>
      <p style="margin: 0 0 12px;">
        <a href="https://drive.google.com/uc?export=download&id=1gniCu779cwb1_O3-yF54fo0YI9mmHS7o" target="_blank" rel="noreferrer">Download Resume</a>
      </p>
      <p style="margin: 0;">Best regards,<br />Nitin Baranwal</p>
    </div>
  `;

  await mailer.sendMail({
    from: mailFrom,
    to: email,
    subject,
    text,
    html,
  });

  return { sent: true };
}

function sendJson(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(payload));
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return sendJson(res, 405, {
      success: false,
      message: "Method not allowed",
    });
  }

  const email =
    typeof req.body?.email === "string" ? req.body.email.trim() : "";

  if (!email) {
    return sendJson(res, 400, {
      success: false,
      message: "Email is required.",
    });
  }

  if (email.length > 255) {
    return sendJson(res, 400, {
      success: false,
      message: "Email is too long.",
    });
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return sendJson(res, 400, {
      success: false,
      message: "Please enter a valid email address.",
    });
  }

  try {
    const mailResult = await sendResumeEmail({ email });

    if (!mailResult.sent) {
      return sendJson(res, 500, {
        success: false,
        message: "Resume email service is not configured yet.",
      });
    }

    return sendJson(res, 200, {
      success: true,
      message: "Resume sent successfully. Please check your inbox.",
    });
  } catch (error) {
    console.error("Vercel resume email failed:", error);
    return sendJson(res, 500, {
      success: false,
      message: "Server error while sending resume email.",
    });
  }
}
