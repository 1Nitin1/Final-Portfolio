import {
  twoline2satrec,
  propagate,
  gstime,
  eciToGeodetic,
  degreesLat,
  degreesLong,
} from "satellite.js";

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

function sendJson(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(payload));
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return sendJson(res, 405, {
      success: false,
      message: "Method not allowed",
    });
  }

  const limitParam = Number(req.query?.limit || 1200);
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
      return sendJson(res, 502, {
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

    return sendJson(res, 200, {
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
    console.error("Vercel orbit catalog failed:", error);
    return sendJson(res, 500, {
      success: false,
      message: "Server error while loading orbit catalog.",
    });
  }
}
