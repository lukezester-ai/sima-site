import { createServer } from "node:http";
import { appendFile, readFile, writeFile, mkdir, stat } from "node:fs/promises";
import { createReadStream } from "node:fs";
import { extname, join, normalize, relative } from "node:path";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { randomBytes, pbkdf2Sync } from "node:crypto";

const port = Number(process.env.PORT || 3001);
const root = dirname(fileURLToPath(import.meta.url));
const dataDir = join(root, "data");
const uploadsDir = join(root, "uploads");
const dbPath = join(dataDir, "db.json");
const inquiriesPath = join(dataDir, "contact-inquiries.json");

/** Единствен публичен контакт за запитвания (AgriNexus / SIMA). */
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
  return {
    "x-content-type-options": "nosniff",
    "referrer-policy": "strict-origin-when-cross-origin",
    "x-frame-options": "SAMEORIGIN",
    "permissions-policy": "camera=(), microphone=(), geolocation=()",
    ...headers,
  };
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
  if (a === 169 && p[1] === 254) return true;
  return false;
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

const Bulgarian = {
  weakGrowth: "Слаб или неравномерен растеж",
  waterStress: "Съмнение за воден стрес",
  disease: "Съмнение за болест или вредители",
  nutrition: "Съмнение за хранителен дефицит",
  unknown: "Неясен проблем",
};

async function ensureStorage() {
  await mkdir(dataDir, { recursive: true });
  await mkdir(uploadsDir, { recursive: true });
  try {
    await stat(dbPath);
  } catch {
    await writeFile(
      dbPath,
      JSON.stringify(
        {
          users: [],
          sessions: [],
          fields: [],
          reports: [],
          knowledge: [],
          feedback: [],
          tasks: [],
          ragChunks: [],
        },
        null,
        2
      ),
      "utf-8"
    );
  }
}

async function readDb() {
  await ensureStorage();
  const db = JSON.parse(await readFile(dbPath, "utf-8"));
  db.users ||= [];
  db.sessions ||= [];
  db.fields ||= [];
  db.reports ||= [];
  db.knowledge ||= [];
  db.feedback ||= [];
  db.tasks ||= [];
  db.ragChunks ||= [];
  return db;
}

async function writeDb(db) {
  await writeFile(dbPath, JSON.stringify(db, null, 2), "utf-8");
}

async function appendContactInquiry(record) {
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

async function readJson(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const body = Buffer.concat(chunks).toString("utf-8");
  return body ? JSON.parse(body) : {};
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
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return parseMultipart(Buffer.concat(chunks), req.headers["content-type"] || "");
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
    "Ти си AI агрономичен асистент за SIMA Field Watch модул.",
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

  const apiKey = (
    process.env.LLM_API_KEY ||
    process.env.MISTRAL_API_KEY ||
    process.env.OPENAI_API_KEY ||
    ""
  ).trim();

  let provider = explicit;
  if (!provider) {
    if (process.env.MISTRAL_API_KEY) provider = "mistral";
    else if (process.env.OPENAI_API_KEY || process.env.LLM_API_KEY) provider = "openai-compatible";
    else provider = "demo";
  }

  let baseUrl = (process.env.LLM_BASE_URL || "").trim();
  if (!baseUrl) {
    if (provider === "ollama") baseUrl = "http://127.0.0.1:11434";
    else if (provider === "mistral") baseUrl = "https://api.mistral.ai/v1";
    else baseUrl = "https://api.openai.com/v1";
  }

  const model =
    process.env.LLM_MODEL ||
    process.env.OPENAI_MODEL ||
    (provider === "ollama" ? "llama3.2" : provider === "mistral" ? "mistral-small-latest" : "gpt-5.4-mini");

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

  const response = await fetch(`${config.baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${config.apiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: config.model,
      messages: [
        {
          role: "user",
          content: [{ type: "text", text: prompt }, ...imageContentForChat(files)],
        },
      ],
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    throw new Error(`LLM API error ${response.status}: ${await response.text()}`);
  }

  const result = await response.json();
  const text = result.choices?.[0]?.message?.content;
  return normalizeLlmReport(parseJsonFromText(text));
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
  const baseUrl = (process.env.EMBEDDING_BASE_URL || process.env.LLM_BASE_URL || defaultBase).replace(/\/$/, "");

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
      "user-agent": "SIMA knowledge fetcher/0.1",
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

  /** Mistral и OpenAI-съвместими API ползват един и същ /chat/completions формат. */
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
    if (!rateLimitAllow(ip, "contact", 30, 60 * 60 * 1000)) {
      return json(res, 429, { error: "Твърде много съобщения. Опитайте по-късно." });
    }
    const body = await readJson(req);
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
    if (!rateLimitAllow(clientIp(req), "auth", 45, 15 * 60 * 1000)) {
      return json(res, 429, { error: "Твърде много опити. Изчакайте малко и опитайте отново." });
    }
    const body = await readJson(req);
    if (!body.email || !body.password) return json(res, 400, { error: "Имейл и парола са задължителни." });

    const db = await readDb();
    if (db.users.some((user) => user.email.toLowerCase() === body.email.toLowerCase())) {
      return json(res, 409, { error: "Вече има акаунт с този имейл." });
    }

    const user = {
      id: id("usr"),
      name: body.name || "Фермер",
      email: body.email.toLowerCase(),
      passwordHash: hashPassword(body.password),
      createdAt: new Date().toISOString(),
    };
    const token = id("tok");
    db.users.push(user);
    db.sessions.push({ token, userId: user.id, createdAt: new Date().toISOString() });
    await writeDb(db);
    return json(res, 201, { token, user: { id: user.id, name: user.name, email: user.email } });
  }

  if (pathname === "/api/auth/login" && req.method === "POST") {
    if (!rateLimitAllow(clientIp(req), "auth", 45, 15 * 60 * 1000)) {
      return json(res, 429, { error: "Твърде много опити. Изчакайте малко и опитайте отново." });
    }
    const body = await readJson(req);
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
    return json(res, 200, { ok: true, service: "sima-site" });
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
  const filePath = normalize(join(root, requested));
  if (!filePath.startsWith(root)) {
    res.writeHead(403, withSecurityHeaders({ "content-type": "text/plain; charset=utf-8" }));
    res.end("Forbidden");
    return;
  }

  try {
    const fileStat = await stat(filePath);
    if (!fileStat.isFile()) throw new Error("Not a file");
    res.writeHead(200, {
      ...withSecurityHeaders({
        "content-type": mimeTypes[extname(filePath).toLowerCase()] || "application/octet-stream",
      }),
    });
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

const server = createServer(async (req, res) => {
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
    console.error(error);
    json(res, 500, { error: "Вътрешна грешка в сървъра." });
  }
});

server.on("error", async (error) => {
  console.error("SIMA server listen error:", error.message || error);
  try {
    await appendFile(join(root, "server-error.log"), `${new Date().toISOString()} ${error.stack}\n`);
  } catch {
    /* ignore log write failure */
  }
  process.exit(1);
});

server.listen(port, () => {
  console.log(`SIMA running on http://localhost:${port}`);
});
