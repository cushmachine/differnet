"use server";

import fs from "fs/promises";
import fsSync from "fs";
import path from "path";
import matter from "gray-matter";
import { revalidatePath } from "next/cache";

const ROOT = process.env.DIFFERNET_ROOT || process.cwd();

function validateSlug(slug: string): void {
  if (slug.includes("/") || slug.includes("\\") || slug.includes("..")) {
    throw new Error("Invalid slug");
  }
}

export async function toggleRoutineStatus(slug: string) {
  validateSlug(slug);
  const filePath = path.join(ROOT, "routines", `${slug}.md`);

  const raw = await fs.readFile(filePath, "utf-8");
  const { data, content } = matter(raw);

  data.status = data.status === "active" ? "paused" : "active";

  const rebuilt = matter.stringify(content, data);
  await fs.writeFile(filePath, rebuilt, "utf-8");
  revalidatePath("/routines");
}

export async function toggleDaemon(): Promise<{ error?: string }> {
  const pidFile = path.join(ROOT, "data", ".daemon.pid");

  let running = false;
  try {
    const pid = parseInt(fsSync.readFileSync(pidFile, "utf-8").trim(), 10);
    process.kill(pid, 0);
    running = true;
  } catch {}

  try {
    if (running) {
      const pid = parseInt(fsSync.readFileSync(pidFile, "utf-8").trim(), 10);
      process.kill(pid, "SIGTERM");
      try { fsSync.unlinkSync(pidFile); } catch {}
    } else {
      // Next.js server runs from the package root (via npm run dev or npx differnet dev)
      const daemonEntry = path.join(process.cwd(), "daemon", "index.mjs");
      const logFile = path.join(ROOT, "data", "daemon.log");

      fsSync.mkdirSync(path.join(ROOT, "data"), { recursive: true });

      const { spawn } = await import("child_process");
      const out = fsSync.openSync(logFile, "a");
      const err = fsSync.openSync(logFile, "a");
      const child = spawn(process.execPath, [daemonEntry], {
        detached: true,
        stdio: ["ignore", out, err],
        env: { PATH: process.env.PATH, HOME: process.env.HOME, DIFFERNET_ROOT: ROOT },
      });
      child.unref();
    }
  } catch (err) {
    return { error: "Failed to toggle daemon" };
  }

  revalidatePath("/routines");
  revalidatePath("/");
  return {};
}
