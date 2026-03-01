import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import rateLimit from "express-rate-limit";
import { Pool } from "pg";

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 3001);

const allowedOrigin = process.env.CLIENT_ORIGIN || "http://localhost:5173";

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

    return res.status(201).json({
      success: true,
      message: "Message sent successfully.",
    });
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
});

app.use((_req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

app.listen(port, () => {
  console.log(`Contact API running on http://localhost:${port}`);
});
