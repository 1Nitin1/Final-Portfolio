import { Pool } from "pg";

let pool;

function getPool() {
  if (!pool) {
    pool = new Pool(
      process.env.DATABASE_URL
        ? {
            connectionString: process.env.DATABASE_URL,
            ssl:
              process.env.DB_SSL === "true"
                ? { rejectUnauthorized: false }
                : false,
          }
        : {
            host: process.env.DB_HOST || "localhost",
            port: Number(process.env.DB_PORT || 5432),
            database: process.env.DB_NAME || "contactdb",
            user: process.env.DB_USER || "postgres",
            password: String(process.env.DB_PASSWORD || ""),
            ssl:
              process.env.DB_SSL === "true"
                ? { rejectUnauthorized: false }
                : false,
          },
    );
  }

  return pool;
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

  const name = typeof req.body?.name === "string" ? req.body.name.trim() : "";
  const email =
    typeof req.body?.email === "string" ? req.body.email.trim() : "";
  const message =
    typeof req.body?.message === "string" ? req.body.message.trim() : "";

  if (!name || !email || !message) {
    return sendJson(res, 400, {
      success: false,
      message: "Name, email, and message are required.",
    });
  }

  if (name.length > 120) {
    return sendJson(res, 400, {
      success: false,
      message: "Name is too long.",
    });
  }

  if (email.length > 255) {
    return sendJson(res, 400, {
      success: false,
      message: "Email is too long.",
    });
  }

  if (message.length > 10000) {
    return sendJson(res, 400, {
      success: false,
      message: "Message is too long.",
    });
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return sendJson(res, 400, {
      success: false,
      message: "Please enter a valid email address.",
    });
  }

  const forwardedFor = req.headers["x-forwarded-for"];
  const ipAddress =
    typeof forwardedFor === "string"
      ? forwardedFor.split(",")[0].trim()
      : req.socket?.remoteAddress || null;
  const userAgent = req.headers["user-agent"] || null;

  try {
    await getPool().query(
      `INSERT INTO contacts (name, email, message, ip_address, user_agent)
       VALUES ($1, $2, $3, $4, $5)`,
      [name, email, message, ipAddress, userAgent],
    );

    return sendJson(res, 201, {
      success: true,
      message: "Message sent successfully.",
    });
  } catch (error) {
    console.error("Vercel contact insert failed:", error);

    if (error && typeof error === "object" && "code" in error) {
      if (error.code === "23514") {
        return sendJson(res, 400, {
          success: false,
          message:
            "Invalid data format. Please check your email and try again.",
        });
      }

      if (error.code === "23502") {
        return sendJson(res, 400, {
          success: false,
          message: "Required contact fields are missing.",
        });
      }
    }

    return sendJson(res, 500, {
      success: false,
      message: "Server error while saving your message.",
    });
  }
}
