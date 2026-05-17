/**
 * Кратък smoke тест: стартира server.js на свободен порт, проверява /api/health,
 * /api/config (без Turnstile ключ) и POST /api/contact с Origin/Referer като в браузър.
 * (Node `fetch` често не праща Origin при same-origin POST — ползваме `node:http`.)
 */
import { spawn } from "node:child_process";
import { createServer } from "node:net";
import http from "node:http";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

async function getFreePort() {
  return new Promise((resolve, reject) => {
    const s = createServer();
    s.unref();
    s.on("error", reject);
    s.listen(0, "127.0.0.1", () => {
      const addr = s.address();
      const port = typeof addr === "object" && addr ? addr.port : null;
      s.close(() => (port ? resolve(port) : reject(new Error("no port"))));
    });
  });
}

/** @param {number} port */
function httpJson(port, path, { method = "GET", headers = {}, body } = {}) {
  return new Promise((resolve, reject) => {
    const payload = body != null ? Buffer.from(body, "utf-8") : null;
    const req = http.request(
      {
        hostname: "127.0.0.1",
        port,
        path,
        method,
        headers: {
          ...headers,
          ...(payload ? { "Content-Length": String(payload.length) } : {}),
        },
      },
      (res) => {
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => {
          const text = Buffer.concat(chunks).toString("utf-8");
          let json = null;
          try {
            json = text ? JSON.parse(text) : {};
          } catch {
            /* leave json null */
          }
          resolve({
            ok: res.statusCode >= 200 && res.statusCode < 300,
            status: res.statusCode,
            text,
            json,
          });
        });
      },
    );
    req.on("error", reject);
    if (payload) req.write(payload);
    req.end();
  });
}

async function waitForHealth(port, timeoutMs) {
  const deadline = Date.now() + timeoutMs;
  let lastErr = "";
  while (Date.now() < deadline) {
    try {
      const r = await httpJson(port, "/api/health");
      if (r.ok && r.json?.ok) return;
      lastErr = `${r.status} ${r.text?.slice(0, 80) || ""}`;
    } catch (e) {
      lastErr = e.message || String(e);
    }
    await new Promise((r) => setTimeout(r, 120));
  }
  throw new Error(`сървърът не отговори навреме: ${lastErr}`);
}

async function main() {
  const port = await getFreePort();
  const base = `http://127.0.0.1:${port}`;

  const child = spawn(process.execPath, ["server.js"], {
    cwd: root,
    env: { ...process.env, PORT: String(port) },
    stdio: ["ignore", "pipe", "pipe"],
  });

  const kill = () => {
    try {
      child.kill("SIGTERM");
    } catch {
      /* ignore */
    }
  };

  try {
    await waitForHealth(port, 15_000);

    const health = await httpJson(port, "/api/health");
    if (!health.ok || !health.json || health.json.service !== "sima-site") {
      throw new Error(`неочакван /api/health: ${health.text}`);
    }

    const cfg = await httpJson(port, "/api/config");
    if (!cfg.ok) throw new Error(`/api/config status ${cfg.status}`);
    if (Object.prototype.hasOwnProperty.call(cfg.json || {}, "turnstileSiteKey")) {
      throw new Error("/api/config не трябва да връща turnstileSiteKey");
    }
    if (!cfg.json?.map || typeof cfg.json.map !== "object") {
      throw new Error("/api/config трябва да връща обект map");
    }

    const opened = Date.now() - 3000;
    const contactBody = JSON.stringify({
      hp: "",
      formOpenedAt: opened,
      name: "smoke",
      email: "smoke-test@example.com",
      message: "SIMA smoke тест съобщение (поне 8 знака).",
    });
    const contact = await httpJson(port, "/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: base,
        Referer: `${base}/`,
      },
      body: contactBody,
    });
    if (!contact.ok) {
      throw new Error(`/api/contact ${contact.status}: ${contact.text}`);
    }
    if (!contact.json?.ok) {
      throw new Error(`/api/contact отговор: ${contact.text}`);
    }

    const regEmail = `smoke-${Date.now()}@example.com`;
    const regBody = JSON.stringify({
      hp: "",
      formOpenedAt: opened,
      name: "Smoke Test",
      email: regEmail,
      password: "smoke-pass-8",
    });
    const reg = await httpJson(port, "/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: base,
        Referer: `${base}/`,
      },
      body: regBody,
    });
    if (reg.status !== 201 || !reg.json?.token || !reg.json?.user?.email) {
      throw new Error(`/api/auth/register ${reg.status}: ${reg.text}`);
    }

    console.log("smoke-server: OK (health, config, contact, register).");
  } finally {
    kill();
    await new Promise((r) => setTimeout(r, 400));
    if (child.exitCode === null && !child.killed) {
      try {
        child.kill("SIGKILL");
      } catch {
        /* ignore */
      }
    }
  }
}

await main().catch((err) => {
  console.error("smoke-server:", err.message || err);
  process.exit(1);
});
