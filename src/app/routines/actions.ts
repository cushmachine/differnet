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

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function toggleDaemon(): Promise<{ error?: string }> {
  const pidFile = path.join(ROOT, "data", ".daemon.pid");

  let runningPid: number | null = null;
  try {
    const pid = parseInt(fsSync.readFileSync(pidFile, "utf-8").trim(), 10);
    process.kill(pid, 0);
    runningPid = pid;
  } catch {}

  try {
    if (runningPid) {
      process.kill(runningPid, "SIGTERM");
      // Wait for process to die
      for (let i = 0; i < 10; i++) {
        await sleep(200);
        try { process.kill(runningPid, 0); } catch { break; }
      }
      try { fsSync.unlinkSync(pidFile); } catch {}
      // Remove heartbeat so status immediately shows "not running"
      try { fsSync.unlinkSync(path.join(ROOT, "data", ".heartbeat")); } catch {}
    } else {
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
      // Wait for daemon to write heartbeat so the UI picks up the new state
      await sleep(2000);
    }
  } catch (err) {
    return { error: `Failed to toggle daemon: ${(err as Error).message}` };
  }

  revalidatePath("/routines");
  revalidatePath("/");
  return {};
}
