/**
 * robots.txt и sitemap.xml през rewrite от vercel.json (CDN не минава през Node за основните страници).
 */
function withSecurityHeaders(headers = {}) {
  return {
    "x-content-type-options": "nosniff",
    "referrer-policy": "strict-origin-when-cross-origin",
    "x-frame-options": "SAMEORIGIN",
    ...headers,
  };
}

export default async function seo(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const kind = url.searchParams.get("kind") || "robots";
  const explicit = (process.env.PUBLIC_ORIGIN || "").trim().replace(/\/$/, "");
  const host = req.headers.host || "localhost";
  const origin =
    explicit || (process.env.PUBLIC_HTTPS === "1" ? `https://${host}` : `http://${host}`);

  if (kind === "sitemap") {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${origin}/</loc><changefreq>weekly</changefreq><priority>1.0</priority></url>
</urlset>`;
    res.writeHead(200, withSecurityHeaders({ "content-type": "application/xml; charset=utf-8" }));
    res.end(xml);
    return;
  }

  const body = `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`;
  res.writeHead(200, withSecurityHeaders({ "content-type": "text/plain; charset=utf-8" }));
  res.end(body);
}
