// Production server for the Vite+React spike - mirrors graphiql-auth's
// app.js almost exactly (same proxy shape: /auth/*, /graphql, /meta_query
// reverse-proxied to graphql-server, this app holds no Keycloak credentials
// of its own), but serves this app's own built static assets instead of
// mounting zendro-graphiql. See graphql-server/README.md, "Acting as an
// auth backend for other origins".
const express = require("express");
const path = require("node:path");

const GQS_ORIGIN = process.env.GQS_ORIGIN || "http://localhost:3000";
const PORT = process.env.PORT || 4173;
// This app's own public origin - sent to graphql-server as the redirect_uri
// override for /auth/login and /auth/logout (see proxyAuthTo below). Must be
// registered in graphql-server's AUTH_REDIRECT_URI allowlist.
const PUBLIC_ORIGIN = process.env.PUBLIC_ORIGIN || `http://localhost:${PORT}`;

const HOP_BY_HOP_HEADERS = new Set([
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
  "host",
  "content-length",
]);

function forwardableHeaders(req, extraHeaders) {
  const headers = {};
  for (const [key, value] of Object.entries(req.headers)) {
    if (!HOP_BY_HOP_HEADERS.has(key.toLowerCase())) headers[key] = value;
  }
  return { ...headers, ...extraHeaders };
}

// Relays upstream's response as-is, including every Set-Cookie header
// individually - Headers#forEach would otherwise comma-join repeated
// headers, which isn't a valid way to send more than one cookie.
async function relay(res, upstream) {
  res.status(upstream.status);
  upstream.headers.forEach((value, key) => {
    if (key.toLowerCase() !== "set-cookie" && !HOP_BY_HOP_HEADERS.has(key.toLowerCase())) res.setHeader(key, value);
  });
  const setCookies = upstream.headers.getSetCookie?.() || [];
  if (setCookies.length > 0) res.setHeader("set-cookie", setCookies);
  res.send(Buffer.from(await upstream.arrayBuffer()));
}

function proxyTo(remoteUrl, { manualRedirect = false, extraHeaders } = {}) {
  return async (req, res) => {
    try {
      const target = new URL(remoteUrl);
      const [, search] = req.originalUrl.split("?");
      if (search) target.search = search;

      const upstream = await fetch(target, {
        method: req.method,
        headers: forwardableHeaders(req, extraHeaders),
        body: ["GET", "HEAD"].includes(req.method) ? undefined : req.body,
        redirect: manualRedirect ? "manual" : "follow",
        duplex: ["GET", "HEAD"].includes(req.method) ? undefined : "half",
      });

      await relay(res, upstream);
    } catch (err) {
      res.status(502).json({ errors: [{ message: `Failed to reach ${remoteUrl}: ${err.message}` }] });
    }
  };
}

function proxyAuthTo(authBaseUrl, redirectUri) {
  const base = authBaseUrl.replace(/\/$/, "");
  return (req, res) => {
    const extraHeaders = redirectUri ? { "x-zendro-auth-redirect-uri": redirectUri } : undefined;
    return proxyTo(`${base}${req.path}`, { manualRedirect: true, extraHeaders })(req, res);
  };
}

const app = express();

app.use("/auth", proxyAuthTo(`${GQS_ORIGIN}/auth`, `${PUBLIC_ORIGIN}/auth/callback`));

const rawBody = express.raw({ type: "*/*", limit: "1mb" });
app.all("/graphql", rawBody, proxyTo(`${GQS_ORIGIN}/graphql`));
app.post("/meta_query", rawBody, proxyTo(`${GQS_ORIGIN}/meta_query`));

// Built static assets (npm run build -> dist/), SPA fallback to index.html.
app.use(express.static(path.join(__dirname, "dist")));
app.get(/(.*)/, (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(PORT, () => console.log(`vite-spa listening on ${PORT}, proxying to ${GQS_ORIGIN}`));
