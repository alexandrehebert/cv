import { mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputDirs = [
  path.join(rootDir, "public", "pdf"),
  path.join(rootDir, "dist", "pdf"),
  path.join(rootDir, ".vercel", "output", "static", "pdf"),
];
const port = Number(process.env.PDF_PREVIEW_PORT || 4323);
const baseUrl = `http://127.0.0.1:${port}`;
const chromeCandidates = [
  process.env.PDF_CHROME_PATH,
  process.env.CHROME_PATH,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
].filter(Boolean);

async function resolveBrowserConfig() {
  for (const candidate of chromeCandidates) {
    if (candidate && existsSync(candidate)) {
      return {
        executablePath: candidate,
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      };
    }
  }

  let chromium;
  try {
    ({ default: chromium } = await import("@sparticuz/chromium"));
  } catch {
    // Ignore import errors and throw a unified message below.
  }

  if (chromium) {
    const executablePath = await chromium.executablePath();
    if (executablePath && existsSync(executablePath)) {
      return {
        executablePath,
        headless: chromium.headless ?? true,
        defaultViewport: chromium.defaultViewport,
        args: [...new Set([...chromium.args, "--no-sandbox", "--disable-setuid-sandbox"])],
      };
    }
  }

  throw new Error(
    "No Chrome/Chromium executable found. Set PDF_CHROME_PATH or add @sparticuz/chromium for serverless builds."
  );
}

async function waitForServer(url, timeoutMs = 30000) {
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    try {
      const response = await fetch(url, { method: "GET" });
      if (response.ok) return;
    } catch {
      // keep polling
    }

    await delay(500);
  }

  throw new Error(`Timed out waiting for preview server at ${url}`);
}

async function main() {
  for (const outputDir of outputDirs) {
    await mkdir(outputDir, { recursive: true });
  }

  const preview = spawn("pnpm", ["exec", "astro", "dev", "--host", "127.0.0.1", "--port", String(port), "--strictPort"], {
    cwd: rootDir,
    stdio: ["ignore", "pipe", "pipe"],
    env: {
      ...process.env,
      CI: "true",
    },
  });

  preview.stdout.on("data", (chunk) => process.stdout.write(chunk));
  preview.stderr.on("data", (chunk) => process.stderr.write(chunk));

  const shutdown = () => {
    if (!preview.killed) {
      preview.kill("SIGTERM");
    }
  };

  process.on("exit", shutdown);
  process.on("SIGINT", () => {
    shutdown();
    process.exit(130);
  });
  process.on("SIGTERM", () => {
    shutdown();
    process.exit(143);
  });

  await waitForServer(`${baseUrl}/en-preview`);

  const browserConfig = await resolveBrowserConfig();
  const browser = await puppeteer.launch(browserConfig);

  try {
    for (const locale of ["en", "fr"]) {
      const page = await browser.newPage();
      await page.goto(`${baseUrl}/${locale}-preview`, { waitUntil: "networkidle0" });
      for (const outputDir of outputDirs) {
        await page.pdf({
          path: path.join(outputDir, `${locale}.pdf`),
          format: "A4",
          printBackground: true,
          margin: { top: 0, right: 0, bottom: 0, left: 0 },
        });
      }
      await page.close();
      console.log(`Generated ${locale}.pdf`);
    }
  } finally {
    await browser.close();
    shutdown();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
