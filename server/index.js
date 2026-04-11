import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import rateLimit from "express-rate-limit";
import nodemailer from "nodemailer";
import { Pool } from "pg";
import {
  twoline2satrec,
  propagate,
  gstime,
  eciToGeodetic,
  degreesLat,
  degreesLong,
} from "satellite.js";

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 3001);

const allowedOrigin = process.env.CLIENT_ORIGIN || "http://localhost:5173";
const defaultMailTo = "nitinkumarbaranawal@gmail.com";

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

async function sendContactNotification({
  name,
  email,
  message,
  ipAddress,
  userAgent,
}) {
  const mailer = getTransporter();

  if (!mailer) {
    return {
      sent: false,
      reason: "Mailer is not configured. Set SMTP_HOST, SMTP_USER, SMTP_PASS.",
    };
  }

  const mailTo = process.env.MAIL_TO || defaultMailTo;
  const mailFrom = process.env.MAIL_FROM || process.env.SMTP_USER;
  const submittedAt = new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
    timeZoneName: "short",
  }).format(new Date());

  const subject = `New Portfolio Contact Message from ${name}`;
  const text = [
    "New contact form submission",
    "",
    `Name: ${name}`,
    `Email: ${email}`,
    `Submitted at: ${submittedAt}`,
    `IP Address: ${ipAddress || "Unavailable"}`,
    `User Agent: ${userAgent || "Unavailable"}`,
    "",
    "Message:",
    message,
  ].join("\n");

  const html = `
    <div style="font-family: Arial, sans-serif; color: #1f2937; line-height: 1.6;">
      <h2 style="margin: 0 0 12px; color: #111827;">📩 New Portfolio Contact Submission</h2>
      <p style="margin: 0 0 14px;">You received a new message through your portfolio contact form.</p>

      <table style="border-collapse: collapse; width: 100%; max-width: 700px; margin-bottom: 14px;">
        <tr>
          <td style="padding: 8px; border: 1px solid #e5e7eb; background: #f9fafb;"><strong>Name</strong></td>
          <td style="padding: 8px; border: 1px solid #e5e7eb;">${name}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #e5e7eb; background: #f9fafb;"><strong>Email</strong></td>
          <td style="padding: 8px; border: 1px solid #e5e7eb;">${email}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #e5e7eb; background: #f9fafb;"><strong>Submitted At</strong></td>
          <td style="padding: 8px; border: 1px solid #e5e7eb;">${submittedAt}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #e5e7eb; background: #f9fafb;"><strong>IP Address</strong></td>
          <td style="padding: 8px; border: 1px solid #e5e7eb;">${ipAddress || "Unavailable"}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #e5e7eb; background: #f9fafb;"><strong>User Agent</strong></td>
          <td style="padding: 8px; border: 1px solid #e5e7eb;">${userAgent || "Unavailable"}</td>
        </tr>
      </table>

      <h3 style="margin: 0 0 8px; color: #111827;">Message</h3>
      <div style="padding: 12px; border: 1px solid #e5e7eb; background: #f8fafc; border-radius: 8px; white-space: pre-wrap;">${message}</div>
    </div>
  `;

  await mailer.sendMail({
    from: mailFrom,
    to: mailTo,
    replyTo: email,
    subject,
    text,
    html,
  });

  const resumePdfUrl =
    "https://drive.google.com/uc?export=download&id=13r3uT4NFg6SApoWRpcuo1IGNv7GhzwLz";

  const autoReplySubject = "Thanks for reaching out — Nitin Baranwal";
  const autoReplyText = [
    `Hi ${name},`,
    "",
    "Thanks for reaching out through my portfolio.",
    "",
    "I am Nitin Baranwal, a Computer Science student and developer focused on modern web development, 3D experiences, and AI/ML learning.",
    "",
    "This is an automated message to confirm that I received your inquiry.",
    "I will be sure to reply within the next 48 business hours.",
    "",
    "I have attached my resume for your reference.",
    "",
    "Best regards,",
    "Nitin Baranwal",
  ].join("\n");

  const autoReplyHtml = `
    <div style="font-family: Arial, sans-serif; color: #1f2937; line-height: 1.6;">
      <h2 style="margin: 0 0 12px; color: #111827;">Thanks for reaching out</h2>
      <p style="margin: 0 0 10px;">Hi ${name},</p>
      <p style="margin: 0 0 10px;">Thanks for contacting me through my portfolio.</p>
      <p style="margin: 0 0 10px;">I am Nitin Baranwal, a Computer Science student and developer focused on modern web development, 3D experiences, and AI/ML learning.</p>
      <p style="margin: 0 0 10px;">This is an automated confirmation that your message has been received.</p>
      <p style="margin: 0 0 10px;"><strong>I will be sure to reply within the next 48 business hours.</strong></p>
      <p style="margin: 0 0 10px;">My resume is attached for your reference.</p>
      <p style="margin: 0;">Best regards,<br />Nitin Baranwal</p>
    </div>
  `;

  await mailer.sendMail({
    from: mailFrom,
    to: email,
    subject: autoReplySubject,
    text: autoReplyText,
    html: autoReplyHtml,
    attachments: [
      {
        filename: "Nitin-Baranwal-Resume.pdf",
        path: resumePdfUrl,
        contentType: "application/pdf",
      },
    ],
  });

  return { sent: true };
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
  const resumePdfUrl =
    "https://drive.google.com/uc?export=download&id=13r3uT4NFg6SApoWRpcuo1IGNv7GhzwLz";
  const subject = "Your requested resume - Nitin Baranwal";
  const text = [
    "Hi,",
    "",
    "Thanks for requesting my resume.",
    "",
    "This is an automated email from my portfolio. I have attached my latest resume as a PDF.",
    "I am Nitin Baranwal, a Computer Science student and developer focused on web development, 3D experiences, and AI/ML.",
    "",
    "If the attachment does not open, you can use this backup link:",
    "https://drive.google.com/file/d/13r3uT4NFg6SApoWRpcuo1IGNv7GhzwLz/view?usp=drivesdk",
    "",
    "Best regards,",
    "Nitin Baranwal",
  ].join("\n");

  const html = `
    <div style="font-family: Arial, sans-serif; color: #1f2937; line-height: 1.6;">
      <h2 style="margin: 0 0 12px; color: #111827;">Resume Request</h2>
      <p style="margin: 0 0 10px;">Hi,</p>
      <p style="margin: 0 0 10px;">Thanks for requesting my resume.</p>
      <p style="margin: 0 0 10px;">This is an automated email from my portfolio. My latest resume is attached as a PDF.</p>
      <p style="margin: 0 0 10px;">I am Nitin Baranwal, a Computer Science student and developer focused on web development, 3D experiences, and AI/ML.</p>
      <p style="margin: 0 0 10px;">If the attachment does not open, use this backup link: <a href="https://drive.google.com/file/d/13r3uT4NFg6SApoWRpcuo1IGNv7GhzwLz/view?usp=drivesdk" target="_blank" rel="noreferrer">View Resume</a></p>
      <p style="margin: 0;">Best regards,<br />Nitin Baranwal</p>
    </div>
  `;

  await mailer.sendMail({
    from: mailFrom,
    to: email,
    subject,
    text,
    html,
    attachments: [
      {
        filename: "Nitin-Baranwal-Resume.pdf",
        path: resumePdfUrl,
        contentType: "application/pdf",
      },
    ],
  });

  return { sent: true };
}

const pool = new Pool(
  process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl:
          process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
      }
    : {
        host: process.env.DB_HOST || "localhost",
        port: Number(process.env.DB_PORT || 5432),
        database: process.env.DB_NAME || "contactdb",
        user: process.env.DB_USER || "postgres",
        password: process.env.DB_PASSWORD || "",
        ssl:
          process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
      },
);

app.use(
  cors({
    origin: allowedOrigin,
    methods: ["GET", "POST"],
    credentials: false,
  }),
);
app.use(express.json({ limit: "20kb" }));

const contactLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 8,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please wait a few minutes and try again.",
  },
});

function parseTleTextToRecords(tleText, typeLabel) {
  const lines = tleText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const records = [];
  for (let index = 0; index < lines.length - 1; index += 3) {
    const name = lines[index] || "UNKNOWN";
    const line1 = lines[index + 1];
    const line2 = lines[index + 2];

    if (!line1?.startsWith("1 ") || !line2?.startsWith("2 ")) {
      continue;
    }

    records.push({
      name,
      line1,
      line2,
      type: typeLabel,
    });
  }

  return records;
}

function toLiveGeodeticPoint(record, atTime) {
  try {
    const satrec = twoline2satrec(record.line1, record.line2);
    const positionAndVelocity = propagate(satrec, atTime);

    if (!positionAndVelocity?.position) {
      return null;
    }

    const gmst = gstime(atTime);
    const geodetic = eciToGeodetic(positionAndVelocity.position, gmst);
    const lat = degreesLat(geodetic.latitude);
    const lon = degreesLong(geodetic.longitude);
    const altitudeKm = Number(geodetic.height || 0);

    if (
      !Number.isFinite(lat) ||
      !Number.isFinite(lon) ||
      !Number.isFinite(altitudeKm)
    ) {
      return null;
    }

    return {
      id: `${record.type}-${record.line1.slice(2, 7).trim()}-${record.line2.slice(-5).trim()}`,
      type: record.type,
      name: record.name,
      lat,
      lon,
      altitudeKm,
    };
  } catch {
    return null;
  }
}

async function fetchTextWithTimeout(url, timeoutMs = 10000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) {
      throw new Error(`Upstream status ${response.status} for ${url}`);
    }
    return await response.text();
  } finally {
    clearTimeout(timeoutId);
  }
}

app.get("/api/orbits", async (req, res) => {
  const limitParam = Number(req.query?.limit || 2400);
  const limit = Math.min(
    Math.max(Number.isFinite(limitParam) ? limitParam : 1200, 100),
    3000,
  );

  const activeUrl =
    "https://celestrak.org/NORAD/elements/gp.php?GROUP=active&FORMAT=tle";
  const debrisUrl =
    "https://celestrak.org/NORAD/elements/gp.php?GROUP=cosmos-1408-debris&FORMAT=tle";

  try {
    const [activeResult, debrisResult] = await Promise.allSettled([
      fetchTextWithTimeout(activeUrl, 10000),
      fetchTextWithTimeout(debrisUrl, 10000),
    ]);

    const activeTleText =
      activeResult.status === "fulfilled" ? activeResult.value : "";
    const debrisTleText =
      debrisResult.status === "fulfilled" ? debrisResult.value : "";

    if (!activeTleText && !debrisTleText) {
      return res.status(502).json({
        success: false,
        message: "Unable to fetch orbital catalog data from upstream sources.",
      });
    }

    const satelliteRecords = parseTleTextToRecords(activeTleText, "satellite");
    const debrisRecords = parseTleTextToRecords(debrisTleText, "debris");

    const now = new Date();
    const points = [];
    const satelliteQuota = Math.max(Math.floor(limit * 0.7), 1);
    const debrisQuota = Math.max(Math.floor(limit * 0.3), 1);

    for (let index = 0; index < satelliteRecords.length; index += 1) {
      if (
        points.filter((point) => point.type === "satellite").length >=
        satelliteQuota
      ) {
        break;
      }

      const point = toLiveGeodeticPoint(satelliteRecords[index], now);
      if (point) {
        points.push(point);
      }
    }

    for (let index = 0; index < debrisRecords.length; index += 1) {
      if (
        points.filter((point) => point.type === "debris").length >= debrisQuota
      ) {
        break;
      }

      const point = toLiveGeodeticPoint(debrisRecords[index], now);
      if (point) {
        points.push(point);
      }
    }

    const fallbackPool = [...satelliteRecords, ...debrisRecords];
    for (let index = 0; index < fallbackPool.length; index += 1) {
      if (points.length >= limit) {
        break;
      }

      const point = toLiveGeodeticPoint(fallbackPool[index], now);
      if (point && !points.some((item) => item.id === point.id)) {
        points.push(point);
      }
    }

    return res.status(200).json({
      success: true,
      at: now.toISOString(),
      counts: {
        total: points.length,
        satellites: points.filter((point) => point.type === "satellite").length,
        debris: points.filter((point) => point.type === "debris").length,
      },
      points,
    });
  } catch (error) {
    console.error("Error loading orbit catalog:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while loading orbit catalog.",
    });
  }
});

app.get("/api/health", (_req, res) => {
  res.status(200).json({ success: true, message: "API is running" });
});

app.post("/api/contact", contactLimiter, async (req, res) => {
  const name = typeof req.body?.name === "string" ? req.body.name.trim() : "";
  const email =
    typeof req.body?.email === "string" ? req.body.email.trim() : "";
  const message =
    typeof req.body?.message === "string" ? req.body.message.trim() : "";

  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: "Name, email, and message are required.",
    });
  }

  if (name.length > 120) {
    return res.status(400).json({
      success: false,
      message: "Name is too long.",
    });
  }

  if (email.length > 255) {
    return res.status(400).json({
      success: false,
      message: "Email is too long.",
    });
  }

  if (message.length > 10000) {
    return res.status(400).json({
      success: false,
      message: "Message is too long.",
    });
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return res.status(400).json({
      success: false,
      message: "Please enter a valid email address.",
    });
  }

  const forwardedFor = req.headers["x-forwarded-for"];
  const ipAddress =
    typeof forwardedFor === "string"
      ? forwardedFor.split(",")[0].trim()
      : req.socket.remoteAddress || null;
  const userAgent = req.get("user-agent") || null;

  try {
    await pool.query(
      `INSERT INTO contacts (name, email, message, ip_address, user_agent)
       VALUES ($1, $2, $3, $4, $5)`,
      [name, email, message, ipAddress, userAgent],
    );
  } catch (error) {
    console.error("Error saving contact form:", error);

    if (error && typeof error === "object" && "code" in error) {
      if (error.code === "23514") {
        return res.status(400).json({
          success: false,
          message:
            "Invalid data format. Please check your email and try again.",
        });
      }

      if (error.code === "23502") {
        return res.status(400).json({
          success: false,
          message: "Required contact fields are missing.",
        });
      }
    }

    return res.status(500).json({
      success: false,
      message: "Server error while saving your message.",
    });
  }

  try {
    const mailResult = await sendContactNotification({
      name,
      email,
      message,
      ipAddress,
      userAgent,
    });

    if (!mailResult.sent) {
      return res.status(500).json({
        success: false,
        message:
          mailResult.reason ||
          "Message was saved, but email notification is not configured.",
      });
    }

    return res.status(201).json({
      success: true,
      message: "Message sent successfully. Notification email delivered.",
    });
  } catch (error) {
    console.error("Error sending contact notification email:", error);
    return res.status(502).json({
      success: false,
      message:
        "Message was saved, but sending email notification failed. Check SMTP credentials and provider settings.",
    });
  }
});

app.post("/api/resume-email", contactLimiter, async (req, res) => {
  const email =
    typeof req.body?.email === "string" ? req.body.email.trim() : "";

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email is required.",
    });
  }

  if (email.length > 255) {
    return res.status(400).json({
      success: false,
      message: "Email is too long.",
    });
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return res.status(400).json({
      success: false,
      message: "Please enter a valid email address.",
    });
  }

  try {
    const mailResult = await sendResumeEmail({ email });

    if (!mailResult.sent) {
      return res.status(500).json({
        success: false,
        message: "Resume email service is not configured yet.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Resume sent successfully. Please check your inbox.",
    });
  } catch (error) {
    console.error("Error sending resume email:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while sending resume email.",
    });
  }
});

app.use((_req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

app.listen(port, () => {
  console.log(`Contact API running on http://localhost:${port}`);
});
