import { createServer } from "node:http";
import { appendFile, readFile, writeFile, mkdir, stat } from "node:fs/promises";
import { createReadStream, readFileSync, existsSync } from "node:fs";
import { basename, dirname, extname, join, normalize, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { randomBytes, pbkdf2Sync } from "node:crypto";

const root = dirname(fileURLToPath(import.meta.url));

/** Минимален .env loader — без външна зависимост. Не презаписва вече зададени променливи. */
function loadDotEnvFile(path) {
  if (!existsSync(path)) return;
  try {
    const raw = readFileSync(path, "utf-8");
    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq <= 0) continue;
      const key = trimmed.slice(0, eq).trim();
      if (!/^[A-Z_][A-Z0-9_]*$/i.test(key) || process.env[key] !== undefined) continue;
      let value = trimmed.slice(eq + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      process.env[key] = value;
    }
  } catch (error) {
    console.warn(`[env] не успях да заредя ${path}: ${error.message}`);
  }
}

if (!process.env.VERCEL) {
  loadDotEnvFile(join(root, ".env"));
  loadDotEnvFile(join(root, ".env.local"));
}

const port = Number(process.env.PORT || 3001);
const isVercel = Boolean(process.env.VERCEL);
/** Локално: data/ и uploads/. На Vercel: само /tmp (данните не са постоянни между деплой и скалиране). */
const dataDir = isVercel ? join("/tmp", "geo-data") : join(root, "data");
const uploadsDir = isVercel ? join("/tmp", "geo-uploads") : join(root, "uploads");
const publicRoot = normalize(join(root, "public"));
const serverErrorLogPath = isVercel ? join("/tmp", "geo-server-error.log") : join(root, "server-error.log");
const dbPath = join(dataDir, "db.json");
const inquiriesPath = join(dataDir, "contact-inquiries.json");

/**
 * Persistent storage през Vercel KV (Upstash REST).
 * Ако KV_REST_API_URL и KV_REST_API_TOKEN са налични — данните живеят там
 * (преживяват deploy и scaling). Иначе пада обратно към локален файл (`data/`),
 * което е удобно за dev. На Vercel без KV данните се пишат в /tmp и изчезват.
 */
const kvRestUrl = (process.env.KV_REST_API_URL || "").replace(/\/+$/, "");
const kvRestToken = process.env.KV_REST_API_TOKEN || "";
const kvEnabled = Boolean(kvRestUrl && kvRestToken);
const KV_DB_KEY = process.env.KV_DB_KEY || "geo:db";
const KV_INQUIRIES_KEY = process.env.KV_INQUIRIES_KEY || "geo:contact-inquiries";

/** Изпълнява една Upstash REST команда; връща `result` или хвърля. */
async function kvCommand(args) {
  if (!kvEnabled) throw new Error("KV not configured");
  const res = await fetch(kvRestUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${kvRestToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(args),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`KV ${res.status} ${res.statusText}: ${text.slice(0, 200)}`);
  }
  const data = await res.json();
  if (data && Object.prototype.hasOwnProperty.call(data, "error")) {
    throw new Error(`KV error: ${data.error}`);
  }
  return data?.result;
}

async function kvGetJson(key) {
  const raw = await kvCommand(["GET", key]);
  if (raw == null) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

async function kvSetJson(key, value) {
  await kvCommand(["SET", key, JSON.stringify(value)]);
}

/** Единствен публичен контакт за запитвания (AgriNexus Geo). */
const CONTACT_EMAIL = "info@agrinexus.eu";

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".webmanifest": "application/manifest+json; charset=utf-8",
};

function withSecurityHeaders(headers = {}) {
  const base = {
    "x-content-type-options": "nosniff",
    "referrer-policy": "strict-origin-when-cross-origin",
    "x-frame-options": "SAMEORIGIN",
    "permissions-policy": "camera=(), microphone=(), geolocation=()",
  };
  if (process.env.PUBLIC_HTTPS === "1") {
    base["strict-transport-security"] = "max-age=15552000; includeSubDomains";
  }
  return { ...base, ...headers };
}

/** Cache-Control стойности за статика (по тип). HTML и manifest без кеш. */
function cacheControlFor(filePath) {
  const ext = extname(filePath).toLowerCase();
  if (ext === ".html" || ext === ".webmanifest") return "no-cache";
  if (basename(filePath) === "sw.js") return "no-cache";
  /** Критичен клиентски код — без дълъг кеш, за да влизат hotfix-ове веднага след deploy. */
  if (ext === ".js" && (basename(filePath) === "script.js" || basename(filePath) === "i18n.js")) {
    return "no-cache";
  }
  if ([".css", ".js", ".png", ".jpg", ".jpeg", ".webp", ".svg", ".ico"].includes(ext)) {
    return "public, max-age=86400, must-revalidate";
  }
  return "public, max-age=300";
}

function clientIp(req) {
  const xf = req.headers["x-forwarded-for"];
  if (typeof xf === "string" && xf.length) {
    return xf.split(",")[0].trim().slice(0, 64);
  }
  return (req.socket?.remoteAddress || "unknown").replace(/^::ffff:/, "");
}

const rateBuckets = new Map();

function rateLimitAllow(ip, bucket, max = 40, windowMs = 15 * 60 * 1000) {
  const key = `${bucket}:${ip}`;
  const now = Date.now();
  let b = rateBuckets.get(key);
  if (!b || now > b.resetAt) {
    b = { count: 0, resetAt: now + windowMs };
    rateBuckets.set(key, b);
  }
  b.count += 1;
  return b.count <= max;
}

/** Разрешени Origin-и за публични POST от браузъра (срещу директни bot заявки без сайт). */
function collectAllowedOrigins(req) {
  const set = new Set();
  const hostHeader = String(req.headers.host || "")
    .trim()
    .toLowerCase();
  /** Пълен Host (вкл. порт), за да съвпада с Origin/Referer при dev (напр. localhost:3001). */
  if (hostHeader) {
    set.add(`https://${hostHeader}`);
    set.add(`http://${hostHeader}`);
  }
  const pub = (process.env.PUBLIC_ORIGIN || "").trim().replace(/\/$/, "").toLowerCase();
  if (pub) set.add(pub);
  for (const raw of String(process.env.GEO_ALLOWED_ORIGINS || "").split(",")) {
    const p = raw.trim().replace(/\/$/, "").toLowerCase();
    if (p) set.add(p);
  }
  return set;
}

function trustedBrowserOrigin(req) {
  if (process.env.GEO_RELAX_BROWSER_ORIGIN === "1") return true;
  const allowed = collectAllowedOrigins(req);
  if (allowed.size === 0) return false;
  const origin = String(req.headers.origin || "")
    .trim()
    .toLowerCase();
  if (origin && allowed.has(origin)) return true;
  const ref = String(req.headers.referer || "").trim();
  if (!ref) return false;
  try {
    const u = new URL(ref);
    const base = `${u.protocol}//${u.host}`.toLowerCase();
    if (allowed.has(base)) return true;
  } catch {
    /* ignore */
  }
  return false;
}

/**
 * Honeypot + минимално време от отваряне на формата (срещу скриптове без реален UI).
 * Клиентът изпраща `hp` (празно) и `formOpenedAt` (timestamp ms при зареждане на формата).
 */
function antiBotFormMetaError(body) {
  const hp = String(body?.hp ?? body?.website ?? body?.company ?? "").trim();
  if (hp) {
    return { status: 400, error: "Заявката не бе приета." };
  }
  const opened = Number(body?.formOpenedAt);
  if (!Number.isFinite(opened)) {
    return { status: 400, error: "Презаредете страницата и опитайте отново." };
  }
  const age = Date.now() - opened;
  const minMs = Math.max(800, Math.min(30_000, Number(process.env.GEO_FORM_MIN_MS || 1300)));
  const maxMs = Math.max(60_000, Number(process.env.GEO_FORM_MAX_MS || 24 * 60 * 60 * 1000));
  if (age < minMs) {
    return { status: 400, error: "Моля, изчакайте момент преди изпращане." };
  }
  if (age > maxMs) {
    return { status: 400, error: "Сесията изтече. Презаредете страницата." };
  }
  return null;
}

function isBlockedOutboundIpv4(host) {
  const m = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.exec(host);
  if (!m) return false;
  const p = [Number(m[1]), Number(m[2]), Number(m[3]), Number(m[4])];
  if (p.some((x) => x > 255 || Number.isNaN(x))) return true;
  const [a, b] = p;
  if (a === 0 || a === 10 || a === 127) return true;
  if (a === 169 && p[1] === 254) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 192 && p[1] === 168) return true;
  if (a === 100 && b >= 64 && b <= 127) return true;
  return false;
}

/**
 * Публична конфигурация за картата (отива към браузъра).
 * НЕ включва LLM ключове, а tile URL обикновено съдържа API ключ — той е
 * заключен по domain в dashboard-а на доставчика (MapTiler/Mapbox/Stadia/OWM).
 */
function publicMapConfig() {
  const tileUrl =
    (process.env.MAP_TILE_URL || "").trim() ||
    "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
  const tileAttribution =
    (process.env.MAP_TILE_ATTRIBUTION || "").trim() ||
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
  const maxZoom = Math.max(1, Math.min(24, Number(process.env.MAP_MAX_ZOOM || 19)));

  const satelliteTileUrl = (process.env.MAP_SATELLITE_TILE_URL || "").trim() || null;
  const satelliteAttribution = satelliteTileUrl
    ? (process.env.MAP_SATELLITE_ATTRIBUTION || "").trim() || tileAttribution
    : null;
  const satelliteMaxZoom = satelliteTileUrl
    ? Math.max(1, Math.min(24, Number(process.env.MAP_SATELLITE_MAX_ZOOM || 19)))
    : null;

  const terrainTileUrl = (process.env.MAP_TERRAIN_TILE_URL || "").trim() || null;
  const terrain = terrainTileUrl
    ? {
        tileUrl: terrainTileUrl,
        encoding: ((process.env.MAP_TERRAIN_ENCODING || "terrarium").trim().toLowerCase()) === "mapbox"
          ? "mapbox"
          : "terrarium",
        attribution:
          (process.env.MAP_TERRAIN_ATTRIBUTION || "").trim() ||
          "Terrain tiles via configured provider",
        maxZoom: Math.max(1, Math.min(20, Number(process.env.MAP_TERRAIN_MAX_ZOOM || 15))),
      }
    : null;

  return {
    tileUrl,
    tileAttribution,
    maxZoom,
    satelliteTileUrl,
    satelliteAttribution,
    satelliteMaxZoom,
    terrain,
    weather: buildWeatherMapConfig(),
  };
}

/**
 * Подготвя метео radar overlay конфигурация за фронтенда.
 * - openweathermap: 5 слоя (precipitation/clouds/temp/wind/pressure), API ключ от OPENWEATHERMAP_API_KEY.
 * - rainviewer: само радар, без ключ; клиентът дърпа timestamp от RainViewer API.
 * - none: изключено.
 */
function buildWeatherMapConfig() {
  const explicit = (process.env.WEATHER_PROVIDER || "").trim().toLowerCase();
  const owmKey = (process.env.OPENWEATHERMAP_API_KEY || "").trim();
  let provider = explicit;
  if (!provider) provider = owmKey ? "openweathermap" : "none";
  if (provider === "none" || provider === "off" || provider === "disabled") return null;

  const requested = (process.env.WEATHER_LAYERS || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

  if (provider === "openweathermap") {
    if (!owmKey) return null;
    const owmAttribution = '&copy; <a href="https://openweathermap.org/">OpenWeatherMap</a>';
    const definitions = {
      precipitation: { id: "precipitation", endpoint: "precipitation_new" },
      clouds: { id: "clouds", endpoint: "clouds_new" },
      temp: { id: "temp", endpoint: "temp_new" },
      wind: { id: "wind", endpoint: "wind_new" },
      pressure: { id: "pressure", endpoint: "pressure_new" },
    };
    const ids = requested.length ? requested : ["precipitation", "clouds"];
    const layers = ids
      .map((id) => definitions[id])
      .filter(Boolean)
      .map((def) => ({
        id: def.id,
        tileUrl: `https://tile.openweathermap.org/map/${def.endpoint}/{z}/{x}/{y}.png?appid=${owmKey}`,
        attribution: owmAttribution,
        opacity: 0.6,
        refreshSeconds: 0,
      }));
    if (!layers.length) return null;
    return { provider, layers };
  }

  if (provider === "rainviewer") {
    return {
      provider,
      timestampsApi: "https://api.rainviewer.com/public/weather-maps.json",
      refreshSeconds: 300,
      layers: [
        {
          id: "precipitation",
          tileUrlTemplate:
            "https://tilecache.rainviewer.com{path}/256/{z}/{x}/{y}/2/1_1.png",
          attribution: '&copy; <a href="https://www.rainviewer.com/">RainViewer</a>',
          opacity: 0.7,
          minzoom: 0,
          maxzoom: 10,
        },
      ],
    };
  }

  return null;
}

/** Намалява SSRF при изтегляне на URL от името на потребителя. */
function assertSafeOutboundUrl(rawUrl) {
  let u;
  try {
    u = new URL(rawUrl);
  } catch {
    throw new Error("Невалиден URL.");
  }
  if (u.username || u.password) throw new Error("URL с credentials не са позволени.");
  const proto = u.protocol.toLowerCase();
  if (proto !== "http:" && proto !== "https:") throw new Error("Само http/https.");
  const host = u.hostname.toLowerCase();
  if (host === "localhost" || host.endsWith(".localhost") || host.endsWith(".local")) {
    throw new Error("Локални домейни не са позволени.");
  }
  if (host === "::1" || host === "0:0:0:0:0:0:0:1") throw new Error("Локални адреси не са позволени.");
  if (host.includes(":")) throw new Error("IPv6 адреси не се поддържат за това изтегляне.");
  if (isBlockedOutboundIpv4(host)) throw new Error("Частни или резервирани IP адреси не са позволени.");
  const blockedHosts = new Set(["metadata.google.internal", "metadata.goog", "metadata.azure.com"]);
  if (blockedHosts.has(host)) throw new Error("Този хост не е позволен.");
  return u.href;
}

const EMPTY_DB = () => ({
  users: [],
  sessions: [],
  fields: [],
  reports: [],
  knowledge: [],
  feedback: [],
  tasks: [],
  ragChunks: [],
});

function normalizeDb(db) {
  const d = db && typeof db === "object" ? db : EMPTY_DB();
  d.users ||= [];
  d.sessions ||= [];
  d.fields ||= [];
  d.reports ||= [];
  d.knowledge ||= [];
  d.feedback ||= [];
  d.tasks ||= [];
  d.ragChunks ||= [];
  return d;
}

async function ensureStorage() {
  await mkdir(dataDir, { recursive: true });
  await mkdir(uploadsDir, { recursive: true });
  if (kvEnabled) return;
  try {
    await stat(dbPath);
  } catch {
    await writeFile(dbPath, JSON.stringify(EMPTY_DB(), null, 2), "utf-8");
  }
}

async function readDb() {
  await ensureStorage();
  if (kvEnabled) {
    try {
      const value = await kvGetJson(KV_DB_KEY);
      return normalizeDb(value);
    } catch (err) {
      console.error("[kv] readDb failed, falling back to file:", err.message);
    }
  }
  try {
    return normalizeDb(JSON.parse(await readFile(dbPath, "utf-8")));
  } catch {
    return normalizeDb(null);
  }
}

async function writeDb(db) {
  const normalized = normalizeDb(db);
  if (kvEnabled) {
    try {
      await kvSetJson(KV_DB_KEY, normalized);
      return;
    } catch (err) {
      console.error("[kv] writeDb failed, falling back to file:", err.message);
    }
  }
  await writeFile(dbPath, JSON.stringify(normalized, null, 2), "utf-8");
}

async function appendContactInquiry(record) {
  if (kvEnabled) {
    try {
      const existing = (await kvGetJson(KV_INQUIRIES_KEY)) || [];
      const list = Array.isArray(existing) ? existing : [];
      list.unshift(record);
      await kvSetJson(KV_INQUIRIES_KEY, list.slice(0, 2000));
      return;
    } catch (err) {
      console.error("[kv] appendContactInquiry failed, falling back to file:", err.message);
    }
  }
  await mkdir(dataDir, { recursive: true });
  let list = [];
  try {
    list = JSON.parse(await readFile(inquiriesPath, "utf-8"));
  } catch {
    /* нов файл */
  }
  if (!Array.isArray(list)) list = [];
  list.unshift(record);
  await writeFile(inquiriesPath, JSON.stringify(list.slice(0, 2000), null, 2), "utf-8");
}

function json(res, status, body) {
  res.writeHead(
    status,
    withSecurityHeaders({ "content-type": "application/json; charset=utf-8" })
  );
  res.end(JSON.stringify(body));
}

function id(prefix) {
  return `${prefix}_${randomBytes(12).toString("hex")}`;
}

function hashPassword(password, salt = randomBytes(16).toString("hex")) {
  const hash = pbkdf2Sync(password, salt, 100000, 32, "sha256").toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password, stored) {
  const [salt, hash] = stored.split(":");
  return hashPassword(password, salt).split(":")[1] === hash;
}

/** Защита срещу DoS чрез голямо тяло на заявката. */
const MAX_JSON_BYTES = Math.max(1024, Number(process.env.MAX_JSON_BYTES || 1_000_000));
const MAX_MULTIPART_BYTES = Math.max(
  16 * 1024,
  Number(process.env.MAX_UPLOAD_BYTES || 25 * 1024 * 1024)
);

class PayloadTooLargeError extends Error {
  constructor(limit) {
    super(`Заявката надвишава позволения размер от ${limit} байта.`);
    this.name = "PayloadTooLargeError";
    this.statusCode = 413;
  }
}

async function readBodyBuffer(req, maxBytes) {
  const chunks = [];
  let total = 0;
  for await (const chunk of req) {
    total += chunk.length;
    if (total > maxBytes) {
      throw new PayloadTooLargeError(maxBytes);
    }
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

async function readJson(req) {
  const buffer = await readBodyBuffer(req, MAX_JSON_BYTES);
  if (!buffer.length) return {};
  const body = buffer.toString("utf-8");
  return JSON.parse(body);
}

function getToken(req) {
  const auth = req.headers.authorization || "";
  if (auth.startsWith("Bearer ")) return auth.slice(7);
  return "";
}

async function requireUser(req, res) {
  const token = getToken(req);
  const db = await readDb();
  const session = db.sessions.find((item) => item.token === token);
  if (!session) {
    json(res, 401, { error: "Не сте влезли в системата." });
    return null;
  }
  const user = db.users.find((item) => item.id === session.userId);
  if (!user) {
    json(res, 401, { error: "Невалидна сесия." });
    return null;
  }
  return { db, user };
}

function parseMultipart(buffer, contentType) {
  const boundaryMatch = contentType.match(/boundary=(?:"([^"]+)"|([^;]+))/i);
  if (!boundaryMatch) return { fields: {}, files: [] };

  const boundary = `--${boundaryMatch[1] || boundaryMatch[2]}`;
  const body = buffer.toString("binary");
  const parts = body.split(boundary).slice(1, -1);
  const fields = {};
  const files = [];

  for (const part of parts) {
    const trimmed = part.replace(/^\r\n/, "").replace(/\r\n$/, "");
    const splitIndex = trimmed.indexOf("\r\n\r\n");
    if (splitIndex === -1) continue;

    const rawHeaders = trimmed.slice(0, splitIndex);
    const content = trimmed.slice(splitIndex + 4);
    const disposition = rawHeaders.match(/content-disposition:\s*form-data;\s*name="([^"]+)"(?:;\s*filename="([^"]*)")?/i);
    if (!disposition) continue;

    const name = disposition[1];
    const filename = disposition[2];
    const type = rawHeaders.match(/content-type:\s*([^\r\n]+)/i)?.[1] || "application/octet-stream";
    const contentBuffer = Buffer.from(content, "binary");

    if (filename) {
      files.push({ field: name, filename, type, buffer: contentBuffer });
    } else {
      fields[name] = contentBuffer.toString("utf-8");
    }
  }

  return { fields, files };
}

async function readMultipart(req) {
  const buffer = await readBodyBuffer(req, MAX_MULTIPART_BYTES);
  return parseMultipart(buffer, req.headers["content-type"] || "");
}

function strategyFor(concern) {
  const strategies = {
    "weak-growth": {
      priority: "Разграничете локален проблем от общ сезонен риск.",
      actions: [
        "Маркирайте слабите зони и ги сравнете със здравите участъци.",
        "Проверете почвена структура, уплътняване, влага и пропуски при сеитба.",
        "Направете оглед в 2-3 представителни точки от проблемната зона.",
      ],
      monitoring: "Следете дали слабите зони се разширяват през следващите 5-7 дни.",
    },
    "water-stress": {
      priority: "Насочете водата точно, без излишен разход.",
      actions: [
        "Проверете влагата в проблемните и нормалните участъци.",
        "Съпоставете симптомите с последните валежи и поливки.",
        "Приоритизирайте зоните, където водният стрес съвпада със слаб растеж.",
      ],
      monitoring: "Следете симптомите сутрин и привечер, когато растението показва по-ясно стрес.",
    },
    disease: {
      priority: "Потвърдете риска рано, преди да се вземе решение за третиране.",
      actions: [
        "Направете близки снимки на листа, стъбла и границата между здрава и засегната зона.",
        "Проверете дали проблемът се разпространява петнисто, линейно или равномерно.",
        "Съберете данни за последни обработки и метеорологични условия.",
      ],
      monitoring: "Следете дали петната се разширяват след влажни или топли дни.",
    },
    nutrition: {
      priority: "Избягвайте торене на сляпо и насочете правилния ресурс.",
      actions: [
        "Проверете дали симптомите следват релеф, почвен тип или предишна обработка.",
        "Сравнете различни части на растението и възраст на листата.",
        "Обмислете почвена или листна проба от проблемната и контролна зона.",
      ],
      monitoring: "Следете дали пожълтяването се усилва или остава стабилно по зони.",
    },
    unknown: {
      priority: "Първо подредете картината, после изберете точната намеса.",
      actions: [
        "Съберете общи снимки от високо и близки снимки от проблемните участъци.",
        "Опишете кога е забелязан проблемът и дали се влошава.",
        "Разделете полето на нормална, съмнителна и силно засегната зона.",
      ],
      monitoring: "Следете връзката с валеж, жега, обработка или конкретна операция.",
    },
  };
  return strategies[concern] || strategies.unknown;
}

function buildFieldWatchPrompt(fields, files, knowledge = [], rag = { lines: [], mode: "none" }) {
  const knowledgeText = knowledge.length
    ? knowledge
        .map((item, index) => {
          return `Източник ${index + 1}: ${item.title || item.source || "вътрешна бележка"}\n${item.text.slice(0, 1600)}`;
        })
        .join("\n\n")
    : "Няма намерени релевантни вътрешни знания.";

  const ragText =
    rag.lines?.length > 0
      ? rag.lines
          .map((item, index) => `Откъс ${index + 1} (${item.title}):\n${item.text}`)
          .join("\n\n")
      : "Няма индексирани RAG откъси за това запитване.";

  const prompt = [
    "Ти си AI агрономичен асистент за AgriNexus Geo Field Watch модул.",
    "Дай кратък JSON доклад на български със свойства: state, priority, actions, monitoring.",
    "actions трябва да е масив от 4 конкретни действия.",
    "Използвай вътрешната база знания и RAG откъсите само като помощен контекст; не измисляй факти извън тях.",
    "Ако информацията не стига, кажи какво трябва да се провери на терен или с лабораторна проба.",
    `Поле: ${fields.fieldName || "неуточнено"}`,
    `Площ: ${fields.area || "неуточнена"}`,
    `Култура: ${fields.crop || "неуточнена"}`,
    `Етап: ${fields.stage || "неуточнен"}`,
    `Проблем: ${fields.concern || "неуточнен"}`,
    `Бележка: ${fields.notes || "няма"}`,
    `Файлове: ${files.map((file) => `${file.filename} (${file.type})`).join(", ") || "няма"}`,
    `Вътрешна база знания:\n${knowledgeText}`,
    `RAG контекст (режим: ${rag.mode}):\n${ragText}`,
  ].join("\n");
  return prompt;
}

function parseJsonFromText(text) {
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    return match ? JSON.parse(match[0]) : null;
  }
}

function normalizeLlmReport(report) {
  if (!report) return null;
  return {
    state: String(report.state || ""),
    priority: String(report.priority || ""),
    actions: Array.isArray(report.actions) ? report.actions.map(String).slice(0, 6) : [],
    monitoring: String(report.monitoring || ""),
  };
}

function llmConfig() {
  const explicit = (process.env.LLM_PROVIDER || "").toLowerCase().trim();
  if (explicit === "demo") {
    return { provider: "demo", baseUrl: "", apiKey: "", model: "" };
  }

  const zaiKey = (process.env.ZAI_API_KEY || "").trim();
  const apiKey = (
    process.env.LLM_API_KEY ||
    zaiKey ||
    process.env.MISTRAL_API_KEY ||
    process.env.OPENAI_API_KEY ||
    ""
  ).trim();

  let provider = explicit;
  if (!provider) {
    if (zaiKey) provider = "zai";
    else if (process.env.MISTRAL_API_KEY) provider = "mistral";
    else if (process.env.OPENAI_API_KEY || process.env.LLM_API_KEY) provider = "openai-compatible";
    else provider = "demo";
  }

  let baseUrl = (process.env.LLM_BASE_URL || "").trim();
  if (!baseUrl) {
    if (provider === "ollama") baseUrl = "http://127.0.0.1:11434";
    else if (provider === "zai") baseUrl = "https://api.z.ai/api/paas/v4";
    else if (provider === "mistral") baseUrl = "https://api.mistral.ai/v1";
    else baseUrl = "https://api.openai.com/v1";
  }

  const model =
    process.env.LLM_MODEL ||
    process.env.OPENAI_MODEL ||
    (provider === "ollama"
      ? "llama3.2"
      : provider === "zai"
        ? "glm-5.1"
        : provider === "mistral"
          ? "mistral-small-latest"
          : "gpt-4o-mini");

  if (provider === "demo" || (provider !== "ollama" && !apiKey)) {
    return { provider: "demo", baseUrl: baseUrl.replace(/\/$/, ""), apiKey: "", model };
  }

  return { provider, baseUrl: baseUrl.replace(/\/$/, ""), apiKey, model };
}

function imageContentForChat(files) {
  return files
    .filter((file) => file.type.startsWith("image/"))
    .slice(0, 4)
    .map((file) => ({
      type: "image_url",
      image_url: { url: `data:${file.type};base64,${file.buffer.toString("base64")}` },
    }));
}

async function callOpenAiCompatibleLlm(config, prompt, files) {
  if (!config.apiKey) return null;

  const messages = [
    {
      role: "system",
      content:
        "Отговори само с валиден JSON обект (без markdown). Полета: state, priority, actions (масив), monitoring.",
    },
    {
      role: "user",
      content: [{ type: "text", text: prompt }, ...imageContentForChat(files)],
    },
  ];

  const maxTokens = Number(process.env.LLM_MAX_TOKENS) || 4096;
  const temperature = Number(process.env.LLM_TEMPERATURE);
  const useJsonFormat = config.provider !== "zai";

  const buildBody = (withJsonFormat) => {
    const body = {
      model: config.model,
      messages,
      max_tokens: Number.isFinite(maxTokens) ? maxTokens : 4096,
    };
    if (Number.isFinite(temperature)) body.temperature = temperature;
    else if (config.provider === "zai") body.temperature = 0.7;
    if (withJsonFormat) body.response_format = { type: "json_object" };
    if (config.provider === "zai" && process.env.LLM_THINKING === "1") {
      body.thinking = { type: "enabled" };
    }
    return body;
  };

  let response = await fetch(`${config.baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${config.apiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify(buildBody(useJsonFormat)),
  });

  if (!response.ok && useJsonFormat) {
    response = await fetch(`${config.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${config.apiKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify(buildBody(false)),
    });
  }

  if (!response.ok) {
    throw new Error(`LLM API error ${response.status}: ${await response.text()}`);
  }

  const result = await response.json();
  const text = result.choices?.[0]?.message?.content;
  return normalizeLlmReport(parseJsonFromText(text));
}

function normalizePortalChatMessages(raw) {
  if (!Array.isArray(raw)) return [];
  const out = [];
  for (const item of raw.slice(-24)) {
    const role = item?.role === "assistant" ? "assistant" : item?.role === "user" ? "user" : null;
    if (!role) continue;
    const content = String(item.content || "")
      .trim()
      .slice(0, 6000);
    if (!content) continue;
    out.push({ role, content });
  }
  return out;
}

function buildPortalChatSystemPrompt({ fieldsSummary, knowledge = [], rag = { lines: [], mode: "none" } }) {
  const knowledgeText = knowledge.length
    ? knowledge
        .map((item, index) => {
          return `Източник ${index + 1}: ${item.title || item.source || "бележка"}\n${String(item.text || "").slice(0, 1200)}`;
        })
        .join("\n\n")
    : "Няма релевантни записи в базата знания.";

  const ragText =
    rag.lines?.length > 0
      ? rag.lines.map((item, index) => `Откъс ${index + 1} (${item.title}):\n${item.text}`).join("\n\n")
      : "Няма RAG откъси за този въпрос.";

  return [
    "Ти си AgriNexus Geo AI агрономичен асистент в портала на фермера.",
    "Отговаряй на български, кратко и практично — с конкретни следващи стъпки на терен.",
    "Не измисляй нормативни актове или цифри; ако липсва информация, кажи какво да се провери.",
    "Можеш да споменеш Field Watch, полета, задачи и базата знания на потребителя.",
    fieldsSummary ? `Полета на потребителя: ${fieldsSummary}` : "Потребителят все още няма регистрирани полета.",
    `Вътрешна база знания:\n${knowledgeText}`,
    `RAG контекст (режим: ${rag.mode}):\n${ragText}`,
  ].join("\n\n");
}

async function callPortalChatLlm(config, messages, systemPrompt) {
  if (!config.apiKey && config.provider !== "ollama") return null;

  const maxTokens = Number(process.env.LLM_MAX_TOKENS) || 2048;
  const temperature = Number(process.env.LLM_TEMPERATURE);

  if (config.provider === "ollama") {
    const response = await fetch(`${config.baseUrl}/api/chat`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        model: config.model,
        stream: false,
        messages: [{ role: "system", content: systemPrompt }, ...messages],
      }),
    });
    if (!response.ok) {
      throw new Error(`Ollama API error ${response.status}: ${await response.text()}`);
    }
    const result = await response.json();
    return String(result.message?.content || "").trim();
  }

  const body = {
    model: config.model,
    messages: [{ role: "system", content: systemPrompt }, ...messages],
    max_tokens: Number.isFinite(maxTokens) ? maxTokens : 2048,
  };
  if (Number.isFinite(temperature)) body.temperature = temperature;
  else if (config.provider === "zai") body.temperature = 0.7;

  if (config.provider === "zai" && process.env.LLM_THINKING === "1") {
    body.thinking = { type: "enabled" };
  }

  const response = await fetch(`${config.baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${config.apiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`LLM API error ${response.status}: ${await response.text()}`);
  }

  const result = await response.json();
  return String(result.choices?.[0]?.message?.content || "").trim();
}

async function callOllamaLlm(config, prompt) {
  const response = await fetch(`${config.baseUrl}/api/chat`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      model: config.model,
      stream: false,
      format: "json",
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!response.ok) {
    throw new Error(`Ollama API error ${response.status}: ${await response.text()}`);
  }

  const result = await response.json();
  return normalizeLlmReport(parseJsonFromText(result.message?.content));
}

function textScore(text, queryWords) {
  const lower = text.toLowerCase();
  return queryWords.reduce((score, word) => score + (lower.includes(word) ? 1 : 0), 0);
}

function retrieveKnowledge(db, userId, fields) {
  const query = [
    fields.crop,
    fields.concern,
    fields.stage,
    fields.notes,
    fields.fieldName,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase()
    .split(/\W+/u)
    .filter((word) => word.length > 3);

  return db.knowledge
    .filter((item) => !item.userId || item.userId === userId)
    .map((item) => ({
      ...item,
      score: textScore(`${item.title} ${item.source} ${item.text}`, query),
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}

function ragEmbeddingConfig() {
  const mistralKey = (process.env.MISTRAL_API_KEY || "").trim();
  const apiKey = (
    process.env.EMBEDDING_API_KEY ||
    process.env.LLM_API_KEY ||
    mistralKey ||
    process.env.OPENAI_API_KEY ||
    ""
  ).trim();

  const llmProv = (process.env.LLM_PROVIDER || "").toLowerCase();
  const inferMistral =
    Boolean(mistralKey) || llmProv === "mistral" || (process.env.LLM_BASE_URL || "").includes("mistral.ai");

  const defaultBase = inferMistral ? "https://api.mistral.ai/v1" : "https://api.openai.com/v1";
  let baseUrl = (process.env.EMBEDDING_BASE_URL || process.env.LLM_BASE_URL || defaultBase).replace(/\/$/, "");
  /** Z.AI chat API няма embeddings — не ползвай paas/v4 базата за RAG без отделен EMBEDDING_BASE_URL. */
  if (!process.env.EMBEDDING_BASE_URL && (llmProv === "zai" || baseUrl.includes("z.ai"))) {
    baseUrl = defaultBase;
  }

  const defaultModel =
    inferMistral || baseUrl.includes("mistral.ai") ? "mistral-embed" : "text-embedding-3-small";
  const model = process.env.RAG_EMBEDDING_MODEL || defaultModel;

  return { apiKey, baseUrl, model };
}

function chunkText(raw, maxLen = 900, overlap = 90) {
  const text = String(raw || "")
    .replace(/\s+/g, " ")
    .trim();
  if (!text) return [];
  if (text.length <= maxLen) return [text];
  const chunks = [];
  let i = 0;
  while (i < text.length) {
    let end = Math.min(i + maxLen, text.length);
    if (end < text.length) {
      const slice = text.slice(i, end);
      const lastSpace = slice.lastIndexOf(" ");
      if (lastSpace > maxLen * 0.45) end = i + lastSpace;
    }
    const piece = text.slice(i, end).trim();
    if (piece) chunks.push(piece);
    if (end >= text.length) break;
    i = Math.max(end - overlap, i + 1);
  }
  return chunks;
}

function cosineSimilarity(a, b) {
  if (!a?.length || !b?.length || a.length !== b.length) return -1;
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  const denom = Math.sqrt(na) * Math.sqrt(nb);
  return denom === 0 ? 0 : dot / denom;
}

async function fetchEmbeddingVectors(cfg, inputs) {
  if (!cfg.apiKey || !inputs.length) return null;
  const out = [];
  const batchSize = 16;
  for (let i = 0; i < inputs.length; i += batchSize) {
    const batch = inputs.slice(i, i + batchSize);
    const response = await fetch(`${cfg.baseUrl}/embeddings`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${cfg.apiKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({ model: cfg.model, input: batch }),
    });
    if (!response.ok) {
      throw new Error(`Embeddings API ${response.status}: ${await response.text()}`);
    }
    const data = await response.json();
    const sorted = [...data.data].sort((a, b) => a.index - b.index);
    for (const row of sorted) out.push(row.embedding);
  }
  return out;
}

async function ingestRagText(db, userId, title, source, fullText) {
  db.ragChunks ||= [];
  const maxDoc = Math.min(String(fullText).length, 120000);
  const chunks = chunkText(String(fullText).slice(0, maxDoc), 900, 90);
  const maxPerIngest = Math.min(chunks.length, Number(process.env.RAG_MAX_CHUNKS_PER_INGEST || 48));
  const slice = chunks.slice(0, maxPerIngest);
  if (!slice.length) return 0;

  const cfg = ragEmbeddingConfig();
  let vectors = null;
  if (cfg.apiKey) {
    try {
      vectors = await fetchEmbeddingVectors(cfg, slice);
    } catch (error) {
      console.warn("[RAG] ingest embeddings:", error.message);
    }
  }

  const now = new Date().toISOString();
  for (let i = 0; i < slice.length; i++) {
    db.ragChunks.unshift({
      id: id("rag"),
      userId,
      title: `${title || "Документ"} · част ${i + 1}`,
      source: source || "ingest",
      text: slice[i],
      embedding: vectors?.[i] ?? null,
      createdAt: now,
    });
  }

  const cap = Math.max(100, Number(process.env.RAG_INDEX_MAX_CHUNKS || 8000));
  if (db.ragChunks.length > cap) {
    db.ragChunks = db.ragChunks.slice(0, cap);
  }
  return slice.length;
}

async function retrieveRagContext(db, userId, fields) {
  db.ragChunks ||= [];
  const topK = Math.max(1, Math.min(12, Number(process.env.RAG_TOP_K || 6)));
  const candidates = db.ragChunks.filter((c) => !c.userId || c.userId === userId);
  if (!candidates.length) {
    return { lines: [], mode: "none", picked: 0 };
  }

  const queryText = [
    fields.fieldName,
    fields.area,
    fields.crop,
    fields.concern,
    fields.stage,
    fields.notes,
  ]
    .filter(Boolean)
    .join("\n")
    .slice(0, 8000);

  const queryWords = queryText
    .toLowerCase()
    .split(/\W+/u)
    .filter((w) => w.length > 3);

  const withEmb = candidates.filter((c) => Array.isArray(c.embedding) && c.embedding.length > 0);
  const cfg = ragEmbeddingConfig();

  if (cfg.apiKey && withEmb.length > 0 && queryText.trim()) {
    try {
      const qv = (await fetchEmbeddingVectors(cfg, [queryText]))[0];
      const scored = withEmb
        .map((c) => ({ c, score: cosineSimilarity(qv, c.embedding) }))
        .sort((a, b) => b.score - a.score)
        .slice(0, topK);
      const lines = scored.map(({ c }) => ({
        title: c.title,
        text: c.text.slice(0, 1400),
      }));
      return { lines, mode: "embedding", picked: lines.length };
    } catch (error) {
      console.warn("[RAG] retrieval embedding:", error.message);
    }
  }

  const scored = candidates
    .map((c) => ({
      c,
      score: textScore(`${c.title} ${c.text}`, queryWords),
    }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);

  const lines = scored.map(({ c }) => ({
    title: c.title,
    text: c.text.slice(0, 1400),
  }));

  return {
    lines,
    mode: scored.length ? "keyword" : "none",
    picked: lines.length,
  };
}

function stripHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function fetchKnowledgeFromUrl(url) {
  assertSafeOutboundUrl(url);
  const response = await fetch(url, {
    headers: {
      "user-agent": "AgriNexus Geo knowledge fetcher/0.1",
    },
  });
  if (!response.ok) throw new Error(`Неуспешно изтегляне: ${response.status}`);
  const contentType = response.headers.get("content-type") || "";
  const raw = await response.text();
  return contentType.includes("html") ? stripHtml(raw) : raw.replace(/\s+/g, " ").trim();
}

function demoWeather(location) {
  return {
    source: "demo",
    location,
    summary: "Демо прогноза: умерени условия, без критичен риск.",
    days: [
      { date: "Днес", tempMin: 12, tempMax: 24, rain: 0.4, wind: 14 },
      { date: "Утре", tempMin: 13, tempMax: 26, rain: 0.1, wind: 18 },
      { date: "След 2 дни", tempMin: 15, tempMax: 28, rain: 2.2, wind: 21 },
    ],
    recommendations: [
      "Подходящ прозорец за оглед: сутрин до 10:30 или след 18:00.",
      "При вятър над 18 km/h избягвайте пръскане с чувствителни препарати.",
      "Следете зоните със слаб растеж след евентуален валеж.",
    ],
  };
}

async function fetchWeather(location) {
  const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1&language=bg&format=json`;
  const geoResponse = await fetch(geoUrl);
  if (!geoResponse.ok) throw new Error("Геокодирането не успя.");
  const geo = await geoResponse.json();
  const place = geo.results?.[0];
  if (!place) throw new Error("Мястото не е намерено.");

  const forecastUrl = [
    "https://api.open-meteo.com/v1/forecast",
    `?latitude=${place.latitude}`,
    `&longitude=${place.longitude}`,
    "&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max",
    "&forecast_days=5",
    "&timezone=auto",
  ].join("");
  const forecastResponse = await fetch(forecastUrl);
  if (!forecastResponse.ok) throw new Error("Прогнозата не успя.");
  const forecast = await forecastResponse.json();

  const days = forecast.daily.time.map((date, index) => ({
    date,
    tempMin: forecast.daily.temperature_2m_min[index],
    tempMax: forecast.daily.temperature_2m_max[index],
    rain: forecast.daily.precipitation_sum[index],
    wind: forecast.daily.wind_speed_10m_max[index],
  }));

  const maxWind = Math.max(...days.map((day) => day.wind));
  const maxRain = Math.max(...days.map((day) => day.rain));
  const recommendations = [
    maxWind > 18
      ? "Има дни с по-силен вятър. Планирайте пръскане в по-тихи прозорци."
      : "Вятърът изглежда умерен за стандартни полеви дейности.",
    maxRain > 5
      ? "Очакват се валежи. Проверете полетата след дъжда за промяна в проблемните зони."
      : "Няма силен валеж в близките дни според прогнозата.",
    "Сравнете метео условията със симптомите от Field Watch доклада.",
  ];

  return {
    source: "open-meteo",
    location: `${place.name}${place.admin1 ? `, ${place.admin1}` : ""}`,
    summary: `Прогноза за ${place.name}: ${days.length} дни, максимум ${Math.max(...days.map((day) => day.tempMax))}°C.`,
    days,
    recommendations,
  };
}

async function analyzeWithLLM(fields, files, knowledge = [], rag = { lines: [], mode: "none" }) {
  const config = llmConfig();
  if (config.provider === "demo") return null;

  const prompt = buildFieldWatchPrompt(fields, files, knowledge, rag);
  if (config.provider === "ollama") {
    return {
      report: await callOllamaLlm(config, prompt),
      mode: `llm:${config.provider}:${config.model}`,
    };
  }

  /** Mistral, Z.AI и OpenAI-съвместими API ползват /chat/completions. */
  return {
    report: await callOpenAiCompatibleLlm(config, prompt, files),
    mode: `llm:${config.provider}:${config.model}`,
  };
}

async function saveUploadFiles(userId, reportId, files) {
  const dir = join(uploadsDir, userId, reportId);
  await mkdir(dir, { recursive: true });

  const saved = [];
  for (const file of files) {
    const cleanName = file.filename.replace(/[^\p{L}\p{N}_. -]/gu, "_").slice(0, 120);
    const filename = `${Date.now()}-${cleanName}`;
    const path = join(dir, filename);
    await writeFile(path, file.buffer);
    saved.push({
      id: id("file"),
      filename: cleanName,
      type: file.type,
      size: file.buffer.length,
      path: relative(root, path),
    });
  }
  return saved;
}

async function handleApi(req, res, pathname) {
  if (pathname === "/api/contact" && req.method === "POST") {
    const ip = clientIp(req);
    if (!rateLimitAllow(ip, "contact", 12, 60 * 60 * 1000)) {
      return json(res, 429, { error: "Твърде много съобщения. Опитайте по-късно." });
    }
    const body = await readJson(req);
    if (!trustedBrowserOrigin(req)) {
      return json(res, 403, { error: "Заявката не е разрешена от този източник." });
    }
    const botErr = antiBotFormMetaError(body);
    if (botErr) return json(res, botErr.status, { error: botErr.error });
    const name = String(body.name || "").trim().slice(0, 200);
    const email = String(body.email || "").trim().slice(0, 254);
    const message = String(body.message || "").trim().slice(0, 8000);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return json(res, 400, { error: "Въведете валиден имейл." });
    }
    if (message.length < 8) {
      return json(res, 400, { error: "Моля, опишете по-подробно запитването (поне 8 знака)." });
    }
    await appendContactInquiry({
      id: id("inq"),
      name: name || "—",
      email,
      message,
      ip,
      createdAt: new Date().toISOString(),
      destinationInbox: CONTACT_EMAIL,
    });
    return json(res, 200, { ok: true });
  }

  if (pathname === "/api/auth/register" && req.method === "POST") {
    if (!trustedBrowserOrigin(req)) {
      return json(res, 403, { error: "Заявката не е разрешена от този източник." });
    }
    if (!rateLimitAllow(clientIp(req), "auth", 45, 15 * 60 * 1000)) {
      return json(res, 429, { error: "Твърде много опити. Изчакайте малко и опитайте отново." });
    }
    const body = await readJson(req);
    const botErr = antiBotFormMetaError(body);
    if (botErr) return json(res, botErr.status, { error: botErr.error });
    const email = String(body.email || "")
      .trim()
      .toLowerCase()
      .slice(0, 254);
    const password = String(body.password || "");
    if (!email || !password) return json(res, 400, { error: "Имейл и парола са задължителни." });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return json(res, 400, { error: "Въведете валиден имейл." });
    }
    if (password.length < 8) {
      return json(res, 400, { error: "Паролата трябва да е поне 8 знака." });
    }

    const db = await readDb();
    if (db.users.some((user) => user.email.toLowerCase() === email)) {
      return json(res, 409, { error: "Вече има акаунт с този имейл." });
    }

    const user = {
      id: id("usr"),
      name: String(body.name || "Фермер").trim().slice(0, 200) || "Фермер",
      email,
      passwordHash: hashPassword(password),
      createdAt: new Date().toISOString(),
    };
    const token = id("tok");
    db.users.push(user);
    db.sessions.push({ token, userId: user.id, createdAt: new Date().toISOString() });
    await writeDb(db);
    return json(res, 201, { token, user: { id: user.id, name: user.name, email: user.email } });
  }

  if (pathname === "/api/auth/login" && req.method === "POST") {
    if (!trustedBrowserOrigin(req)) {
      return json(res, 403, { error: "Заявката не е разрешена от този източник." });
    }
    if (!rateLimitAllow(clientIp(req), "auth", 45, 15 * 60 * 1000)) {
      return json(res, 429, { error: "Твърде много опити. Изчакайте малко и опитайте отново." });
    }
    const body = await readJson(req);
    const botErr = antiBotFormMetaError(body);
    if (botErr) return json(res, botErr.status, { error: botErr.error });
    const db = await readDb();
    const user = db.users.find((item) => item.email.toLowerCase() === String(body.email || "").toLowerCase());
    if (!user || !verifyPassword(body.password || "", user.passwordHash)) {
      return json(res, 401, { error: "Грешен имейл или парола." });
    }
    const token = id("tok");
    db.sessions.push({ token, userId: user.id, createdAt: new Date().toISOString() });
    await writeDb(db);
    return json(res, 200, { token, user: { id: user.id, name: user.name, email: user.email } });
  }

  if (pathname === "/api/me" && req.method === "GET") {
    const auth = await requireUser(req, res);
    if (!auth) return;
    return json(res, 200, { user: { id: auth.user.id, name: auth.user.name, email: auth.user.email } });
  }

  if (pathname === "/api/auth/logout" && req.method === "POST") {
    const token = getToken(req);
    if (!token) return json(res, 200, { ok: true });
    const db = await readDb();
    const nextSessions = db.sessions.filter((session) => session.token !== token);
    if (nextSessions.length !== db.sessions.length) {
      db.sessions = nextSessions;
      await writeDb(db);
    }
    return json(res, 200, { ok: true });
  }

  if (pathname === "/api/health" && req.method === "GET") {
    return json(res, 200, { ok: true, service: "agrinexus-geo" });
  }

  if (pathname === "/api/config" && req.method === "GET") {
    const ip = clientIp(req);
    if (!rateLimitAllow(ip, "config", 240, 15 * 60 * 1000)) {
      return json(res, 429, { error: "Твърде много заявки. Опитайте по-късно." });
    }
    return json(res, 200, { map: publicMapConfig() });
  }

  if (pathname === "/api/fields" && req.method === "GET") {
    const auth = await requireUser(req, res);
    if (!auth) return;
    return json(res, 200, { fields: auth.db.fields.filter((field) => field.userId === auth.user.id) });
  }

  if (pathname === "/api/fields" && req.method === "POST") {
    const auth = await requireUser(req, res);
    if (!auth) return;
    const body = await readJson(req);
    const field = {
      id: id("fld"),
      userId: auth.user.id,
      name: body.name || "Неназовано поле",
      area: body.area || "неуточнена площ",
      crop: body.crop || "Култура",
      boundary: body.boundary || null,
      createdAt: new Date().toISOString(),
    };
    auth.db.fields.unshift(field);
    await writeDb(auth.db);
    return json(res, 201, { field });
  }

  if (pathname === "/api/reports" && req.method === "GET") {
    const auth = await requireUser(req, res);
    if (!auth) return;
    return json(res, 200, { reports: auth.db.reports.filter((report) => report.userId === auth.user.id) });
  }

  const reportStatusMatch = pathname.match(/^\/api\/reports\/([^/]+)\/status$/);
  if (reportStatusMatch && req.method === "PATCH") {
    const auth = await requireUser(req, res);
    if (!auth) return;
    const report = auth.db.reports.find((item) => item.id === reportStatusMatch[1] && item.userId === auth.user.id);
    if (!report) return json(res, 404, { error: "Докладът не е намерен." });
    const body = await readJson(req);
    const allowed = ["draft", "ai_analysis", "expert_review", "confirmed", "sent", "verified"];
    report.status = allowed.includes(body.status) ? body.status : report.status;
    await writeDb(auth.db);
    return json(res, 200, { report });
  }

  if (pathname === "/api/tasks" && req.method === "GET") {
    const auth = await requireUser(req, res);
    if (!auth) return;
    return json(res, 200, { tasks: auth.db.tasks.filter((task) => task.userId === auth.user.id) });
  }

  if (pathname === "/api/weather" && req.method === "GET") {
    const auth = await requireUser(req, res);
    if (!auth) return;
    const url = new URL(req.url, `http://${req.headers.host}`);
    const location = url.searchParams.get("location") || "Пловдив";
    try {
      return json(res, 200, { weather: await fetchWeather(location) });
    } catch {
      return json(res, 200, { weather: demoWeather(location) });
    }
  }

  const taskStatusMatch = pathname.match(/^\/api\/tasks\/([^/]+)\/status$/);
  if (taskStatusMatch && req.method === "PATCH") {
    const auth = await requireUser(req, res);
    if (!auth) return;
    const task = auth.db.tasks.find((item) => item.id === taskStatusMatch[1] && item.userId === auth.user.id);
    if (!task) return json(res, 404, { error: "Задачата не е намерена." });
    const body = await readJson(req);
    task.status = body.status === "done" ? "done" : "open";
    task.updatedAt = new Date().toISOString();
    await writeDb(auth.db);
    return json(res, 200, { task });
  }

  const feedbackMatch = pathname.match(/^\/api\/reports\/([^/]+)\/feedback$/);
  if (feedbackMatch && req.method === "POST") {
    const auth = await requireUser(req, res);
    if (!auth) return;
    const reportId = feedbackMatch[1];
    const report = auth.db.reports.find((item) => item.id === reportId && item.userId === auth.user.id);
    if (!report) return json(res, 404, { error: "Докладът не е намерен." });

    const body = await readJson(req);
    const rating = Math.max(1, Math.min(5, Number(body.rating || 3)));
    const outcome = String(body.outcome || "").slice(0, 2000);
    const correction = String(body.correction || "").slice(0, 2000);
    const helped = Boolean(body.helped);

    const feedback = {
      id: id("fbk"),
      reportId,
      userId: auth.user.id,
      rating,
      helped,
      outcome,
      correction,
      createdAt: new Date().toISOString(),
    };

    report.feedback = feedback;
    auth.db.feedback.unshift(feedback);
    auth.db.knowledge.unshift({
      id: id("knw"),
      userId: auth.user.id,
      title: `Проверен резултат: ${report.fieldName}`,
      source: `feedback:${feedback.id}`,
      text: [
        `Култура: ${report.crop}`,
        `Първоначален проблем: ${report.concern}`,
        `Даден приоритет: ${report.priority}`,
        `Оценка от фермера: ${rating}/5`,
        `Помогна ли: ${helped ? "да" : "не"}`,
        `Реален резултат: ${outcome || "няма описание"}`,
        `Корекция за следващ анализ: ${correction || "няма корекция"}`,
      ].join("\n"),
      createdAt: new Date().toISOString(),
    });

    await writeDb(auth.db);
    return json(res, 201, { feedback, report });
  }

  if (pathname === "/api/knowledge" && req.method === "GET") {
    const auth = await requireUser(req, res);
    if (!auth) return;
    return json(res, 200, {
      knowledge: auth.db.knowledge.filter((item) => !item.userId || item.userId === auth.user.id),
    });
  }

  if (pathname === "/api/knowledge" && req.method === "POST") {
    const auth = await requireUser(req, res);
    if (!auth) return;
    const body = await readJson(req);
    if (!body.text) return json(res, 400, { error: "Текстът е задължителен." });

    const item = {
      id: id("knw"),
      userId: auth.user.id,
      title: body.title || "Вътрешна бележка",
      source: body.source || "manual",
      text: String(body.text).slice(0, 12000),
      createdAt: new Date().toISOString(),
    };
    auth.db.knowledge.unshift(item);
    let ragChunksAdded = 0;
    if (body.ragIndex) {
      try {
        ragChunksAdded = await ingestRagText(auth.db, auth.user.id, item.title, item.source, item.text);
      } catch (error) {
        console.warn("[RAG] knowledge ingest:", error.message);
      }
    }
    await writeDb(auth.db);
    return json(res, 201, { item, ragChunksAdded });
  }

  if (pathname === "/api/knowledge/fetch" && req.method === "POST") {
    const auth = await requireUser(req, res);
    if (!auth) return;
    const body = await readJson(req);
    if (!body.url || !/^https?:\/\//i.test(body.url)) {
      return json(res, 400, { error: "Въведете валиден http/https URL." });
    }

    const text = await fetchKnowledgeFromUrl(body.url);
    const item = {
      id: id("knw"),
      userId: auth.user.id,
      title: body.title || body.url,
      source: body.url,
      text: text.slice(0, 12000),
      createdAt: new Date().toISOString(),
    };
    auth.db.knowledge.unshift(item);
    let ragChunksAdded = 0;
    if (body.ragIndex) {
      try {
        ragChunksAdded = await ingestRagText(auth.db, auth.user.id, item.title, body.url, item.text);
      } catch (error) {
        console.warn("[RAG] knowledge fetch ingest:", error.message);
      }
    }
    await writeDb(auth.db);
    return json(res, 201, { item, ragChunksAdded });
  }

  if (pathname === "/api/rag/status" && req.method === "GET") {
    const auth = await requireUser(req, res);
    if (!auth) return;
    auth.db.ragChunks ||= [];
    const mine = auth.db.ragChunks.filter((c) => !c.userId || c.userId === auth.user.id);
    const embedded = mine.filter((c) => Array.isArray(c.embedding) && c.embedding.length > 0);
    const cfg = ragEmbeddingConfig();
    return json(res, 200, {
      chunksTotal: mine.length,
      chunksEmbedded: embedded.length,
      retrievalEnabled: Boolean(cfg.apiKey && embedded.length > 0),
    });
  }

  if (pathname === "/api/rag/ingest" && req.method === "POST") {
    const auth = await requireUser(req, res);
    if (!auth) return;
    const body = await readJson(req);
    let text = body.text ? String(body.text) : "";
    if (body.url && /^https?:\/\//i.test(body.url)) {
      try {
        text = await fetchKnowledgeFromUrl(body.url);
      } catch (error) {
        return json(res, 400, { error: error.message || "Неуспешно изтегляне на URL." });
      }
    }
    if (!text.trim()) return json(res, 400, { error: "Нужен е текст или валиден URL." });
    const title = body.title || "RAG документ";
    const source = body.url || body.source || "manual-ingest";
    try {
      const ragChunksAdded = await ingestRagText(auth.db, auth.user.id, title, source, text.slice(0, 120000));
      await writeDb(auth.db);
      return json(res, 201, { ragChunksAdded });
    } catch (error) {
      console.warn("[RAG] ingest:", error.message);
      return json(res, 500, { error: error.message || "RAG индексиране не успя." });
    }
  }

  if (pathname === "/api/chat" && req.method === "POST") {
    const auth = await requireUser(req, res);
    if (!auth) return;
    const ip = clientIp(req);
    if (!rateLimitAllow(ip, "chat", 40, 15 * 60 * 1000)) {
      return json(res, 429, { error: "Твърде много съобщения. Изчакайте малко и опитайте пак." });
    }

    const body = await readJson(req);
    const messages = normalizePortalChatMessages(body.messages);
    if (!messages.length || messages[messages.length - 1].role !== "user") {
      return json(res, 400, { error: "Изпратете поне едно потребителско съобщение." });
    }

    const config = llmConfig();
    if (config.provider === "demo") {
      return json(res, 503, {
        error: "AI чатът изисква LLM ключ (напр. ZAI_API_KEY). Вижте LLM-CONFIG.md.",
      });
    }

    const lastUser = messages.filter((m) => m.role === "user").pop()?.content || "";
    const queryFields = {
      fieldName: "",
      area: "",
      crop: "",
      concern: "",
      stage: "",
      notes: lastUser,
    };

    const knowledge = retrieveKnowledge(auth.db, auth.user.id, queryFields);
    let ragContext = { lines: [], mode: "none", picked: 0 };
    try {
      ragContext = await retrieveRagContext(auth.db, auth.user.id, queryFields);
    } catch (ragErr) {
      console.warn("[chat] RAG:", ragErr.message);
    }

    const userFields = auth.db.fields.filter((f) => f.userId === auth.user.id);
    const fieldsSummary = userFields.length
      ? userFields
          .slice(0, 12)
          .map((f) => `${f.name || "поле"} (${f.area || "площ?"}, ${f.crop || "култура?"})`)
          .join("; ")
      : "";

    const systemPrompt = buildPortalChatSystemPrompt({ fieldsSummary, knowledge, rag: ragContext });

    try {
      const reply = await callPortalChatLlm(config, messages, systemPrompt);
      if (!reply) {
        return json(res, 502, { error: "Празен отговор от AI модела." });
      }
      return json(res, 200, {
        response: reply,
        model: config.model,
        provider: config.provider,
        retrieval: { mode: ragContext.mode, items: ragContext.picked },
      });
    } catch (error) {
      console.error("[chat]", error);
      return json(res, 502, {
        error: error instanceof Error ? error.message : "Грешка при AI чат заявка.",
      });
    }
  }

  if (pathname === "/api/field-watch/analyze" && req.method === "POST") {
    const auth = await requireUser(req, res);
    if (!auth) return;
    const { fields, files } = await readMultipart(req);
    const reportId = id("rpt");
    const savedFiles = await saveUploadFiles(auth.user.id, reportId, files);

    let ai = null;
    let aiMode = "demo";
    let ragContext = { lines: [], mode: "none", picked: 0 };
    try {
      const knowledge = retrieveKnowledge(auth.db, auth.user.id, fields);
      ragContext = await retrieveRagContext(auth.db, auth.user.id, fields);
      const llmResult = await analyzeWithLLM(fields, files, knowledge, ragContext);
      if (llmResult?.report) {
        ai = llmResult.report;
        aiMode = llmResult.mode;
      }
    } catch (error) {
      aiMode = "demo";
      console.warn(error.message);
    }

    const fallback = strategyFor(fields.concern);
    const report = {
      id: reportId,
      userId: auth.user.id,
      fieldName: fields.fieldName || "Неназовано поле",
      area: fields.area || "неуточнена площ",
      crop: fields.crop || "Култура",
      concern: fields.concern || "unknown",
      stage: fields.stage || "активна вегетация",
      notes: fields.notes || "",
      files: savedFiles,
      aiMode,
      rag: { mode: ragContext.mode, snippets: ragContext.picked },
      date: new Date().toLocaleDateString("bg-BG"),
      createdAt: new Date().toISOString(),
      status: "expert_review",
      state:
        ai?.state ||
        `${fields.fieldName || "Полето"} (${fields.area || "неуточнена площ"}) е анализирано по подадените данни и теренни бележки.`,
      priority: ai?.priority || fallback.priority,
      actions: ai?.actions || fallback.actions,
      monitoring: ai?.monitoring || fallback.monitoring,
    };

    auth.db.reports.unshift(report);
    report.tasks = report.actions.map((action) => {
      const task = {
        id: id("tsk"),
        userId: auth.user.id,
        reportId: report.id,
        fieldName: report.fieldName,
        title: action,
        status: "open",
        createdAt: new Date().toISOString(),
      };
      auth.db.tasks.unshift(task);
      return task;
    });
    auth.db.knowledge.unshift({
      id: id("knw"),
      userId: auth.user.id,
      title: `Научено от доклад: ${report.fieldName}`,
      source: `report:${report.id}`,
      text: [
        `Култура: ${report.crop}`,
        `Проблем: ${report.concern}`,
        `Приоритет: ${report.priority}`,
        `Действия: ${report.actions.join("; ")}`,
        `Наблюдение: ${report.monitoring}`,
      ].join("\n"),
      createdAt: new Date().toISOString(),
    });
    await writeDb(auth.db);
    return json(res, 201, { report });
  }

  return json(res, 404, { error: "Няма такъв API маршрут." });
}

async function serveStatic(req, res, pathname) {
  const requested = pathname === "/" ? "/index.html" : decodeURIComponent(pathname);
  const relative = requested.replace(/^\/+/, "");
  const filePath = normalize(join(publicRoot, relative));
  if (!filePath.startsWith(publicRoot)) {
    res.writeHead(403, withSecurityHeaders({ "content-type": "text/plain; charset=utf-8" }));
    res.end("Forbidden");
    return;
  }

  try {
    const fileStat = await stat(filePath);
    if (!fileStat.isFile()) throw new Error("Not a file");
    res.writeHead(
      200,
      withSecurityHeaders({
        "content-type": mimeTypes[extname(filePath).toLowerCase()] || "application/octet-stream",
        "cache-control": cacheControlFor(filePath),
      })
    );
    createReadStream(filePath).pipe(res);
  } catch {
    res.writeHead(404, withSecurityHeaders({ "content-type": "text/plain; charset=utf-8" }));
    res.end("Not found");
  }
}

await ensureStorage();

function publicSiteOrigin(req) {
  const explicit = (process.env.PUBLIC_ORIGIN || "").trim().replace(/\/$/, "");
  if (explicit) return explicit;
  const host = req.headers.host || `localhost:${port}`;
  const proto = process.env.PUBLIC_HTTPS === "1" ? "https" : "http";
  return `${proto}://${host}`;
}

async function mainHttpHandler(req, res) {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathname = url.pathname;

    if (pathname === "/robots.txt" && req.method === "GET") {
      const origin = publicSiteOrigin(req);
      const body = `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`;
      res.writeHead(200, withSecurityHeaders({ "content-type": "text/plain; charset=utf-8" }));
      res.end(body);
      return;
    }

    if (pathname === "/sitemap.xml" && req.method === "GET") {
      const origin = publicSiteOrigin(req);
      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${origin}/</loc><changefreq>weekly</changefreq><priority>1.0</priority></url>
</urlset>`;
      res.writeHead(200, withSecurityHeaders({ "content-type": "application/xml; charset=utf-8" }));
      res.end(xml);
      return;
    }

    if (pathname.startsWith("/api/")) {
      await handleApi(req, res, pathname);
      return;
    }
    await serveStatic(req, res, pathname);
  } catch (error) {
    if (error instanceof PayloadTooLargeError) {
      return json(res, 413, { error: error.message });
    }
    if (error instanceof SyntaxError) {
      return json(res, 400, { error: "Невалиден JSON в тялото на заявката." });
    }
    console.error(error);
    json(res, 500, { error: "Вътрешна грешка в сървъра." });
  }
}

const server = createServer(mainHttpHandler);

if (!isVercel) {
  server.on("error", async (error) => {
    if (error.code === "EADDRINUSE") {
      console.error(
        `AgriNexus Geo: порт ${port} вече е зает. Спрете другия процес или задайте PORT=<свободен_порт>.`
      );
    } else {
      console.error("AgriNexus Geo server listen error:", error.message || error);
    }
    try {
      await appendFile(serverErrorLogPath, `${new Date().toISOString()} ${error.stack}\n`);
    } catch {
      /* ignore log write failure */
    }
    process.exit(1);
  });

  server.listen(port, () => {
    console.log(`AgriNexus Geo running on http://localhost:${port}`);
    console.log(`AgriNexus Geo storage: ${kvEnabled ? `Vercel KV (key=${KV_DB_KEY})` : `file (${dbPath})`}`);
  });

  let shuttingDown = false;
  function gracefulShutdown(signal) {
    if (shuttingDown) return;
    shuttingDown = true;
    console.log(`AgriNexus Geo: ${signal} получен — спирам приема на нови връзки…`);
    server.close((err) => {
      if (err) {
        console.error("AgriNexus Geo: грешка при затваряне:", err.message || err);
        process.exit(1);
      }
      console.log("AgriNexus Geo: готово, чао.");
      process.exit(0);
    });
    setTimeout(() => {
      console.warn("AgriNexus Geo: принудително изключване след 10s.");
      process.exit(1);
    }, 10_000).unref();
  }

  process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
  process.on("SIGINT", () => gracefulShutdown("SIGINT"));

  process.on("unhandledRejection", (reason) => {
    console.error("AgriNexus Geo: unhandledRejection:", reason);
  });
}

export default mainHttpHandler;
