// Build Output API builder (release §3.1c, CF-20260529-013). @vercel/node ships
// api/*.ts with extensionless ESM imports intact → ERR_MODULE_NOT_FOUND at runtime
// (O51). This esbuild-bundles each function into a self-contained .func/index.mjs
// (all imports inlined) and emits .vc-config.json + routing config. Deploy with
// `vercel deploy --prebuilt --prod` so Vercel uses this output verbatim.
import { build } from "esbuild";
import {
  mkdirSync,
  writeFileSync,
  cpSync,
  rmSync,
  existsSync,
} from "node:fs";
import { join } from "node:path";
import { execSync } from "node:child_process";

const ROOT = process.cwd();
const OUT = join(ROOT, ".vercel/output");

// Each api/*.ts exports a Web handler `(Request) => Promise<Response>`.
const ROUTES = [
  "api/structure",
  "api/expand",
  "api/maps",
  "api/auth/guest",
  "api/billing/checkout",
  "api/billing/webhook",
];

// 1. Static front-end (Vite).
console.log("▸ vite build");
execSync("npx vite build", { stdio: "inherit", cwd: ROOT });

rmSync(OUT, { recursive: true, force: true });
mkdirSync(join(OUT, "static"), { recursive: true });
cpSync(join(ROOT, "dist"), join(OUT, "static"), { recursive: true });

// Node (req,res) adapter wrapping the Web handler. Reads the raw request body as
// bytes and passes it through unchanged so Stripe webhook signature verification
// sees the exact payload (raw body preserved; no helper body-parsing).
const adapter = (handlerAbs) => `
import handler from ${JSON.stringify(handlerAbs)};
function toHeaders(h) {
  const out = {};
  for (const [k, v] of Object.entries(h)) {
    if (v == null) continue;
    out[k] = Array.isArray(v) ? v.join(", ") : String(v);
  }
  return out;
}
export default async function (req, res) {
  try {
    const proto = req.headers["x-forwarded-proto"] || "https";
    const url = proto + "://" + (req.headers.host || "localhost") + req.url;
    let body;
    if (req.method !== "GET" && req.method !== "HEAD") {
      const chunks = [];
      for await (const c of req) chunks.push(c);
      body = Buffer.concat(chunks);
    }
    const request = new Request(url, {
      method: req.method,
      headers: toHeaders(req.headers),
      body: body && body.length ? body : undefined,
    });
    const response = await handler(request);
    res.statusCode = response.status;
    response.headers.forEach((v, k) => res.setHeader(k, v));
    const buf = Buffer.from(await response.arrayBuffer());
    res.end(buf);
  } catch (e) {
    console.error("handler error", e);
    res.statusCode = 500;
    res.setHeader("content-type", "application/json");
    res.end(JSON.stringify({ error: "internal" }));
  }
}
`;

console.log("▸ bundling functions");
for (const route of ROUTES) {
  const handlerAbs = join(ROOT, route + ".ts");
  if (!existsSync(handlerAbs)) throw new Error("missing handler: " + handlerAbs);
  const funcDir = join(OUT, "functions", route + ".func");
  mkdirSync(funcDir, { recursive: true });
  await build({
    stdin: { contents: adapter(handlerAbs), resolveDir: ROOT, loader: "js" },
    bundle: true,
    platform: "node",
    format: "esm",
    target: "node20",
    outfile: join(funcDir, "index.mjs"),
    // CJS interop shim for any bundled dep that calls require().
    banner: {
      js: "import { createRequire as _cr } from 'node:module'; const require = _cr(import.meta.url);",
    },
    logLevel: "warning",
  });
  writeFileSync(
    join(funcDir, ".vc-config.json"),
    JSON.stringify(
      {
        runtime: "nodejs20.x",
        handler: "index.mjs",
        launcherType: "Nodejs",
        shouldAddHelpers: false,
      },
      null,
      2,
    ),
  );
  console.log("  ✓ " + route);
}

// SPA fallback for non-api paths; api functions served by the filesystem handle.
writeFileSync(
  join(OUT, "config.json"),
  JSON.stringify(
    {
      version: 3,
      routes: [
        { handle: "filesystem" },
        { src: "/((?!api/).*)", dest: "/index.html" },
      ],
    },
    null,
    2,
  ),
);

console.log("Build Output API ready: " + ROUTES.length + " functions");
