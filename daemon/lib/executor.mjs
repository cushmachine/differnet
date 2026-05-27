import { execSync } from "child_process";
import fs from "fs/promises";
import path from "path";
import { logActivity, updateActivityStatus } from "./db.mjs";

const SHELL_SKILLS = {
  "check-for-updates": executeCheckForUpdates,
  "check-integrations": executeCheckIntegrations,
  "sync-to-github": executeSyncToGithub,
};

export async function executeRoutine(root, db, routine, log) {
  const activityId = logActivity(db, {
    type: "routine_run",
    actor: routine.slug,
    description: `Running routine: ${routine.name}`,
    status: "running",
  });

  const start = Date.now();
  let failed = false;

  for (const skillSlug of routine.skills) {
    const result = await executeSkill(root, db, skillSlug, log);
    if (result.status === "failure") {
      failed = true;
      log(`  skill ${skillSlug} failed: ${result.error}`);
    }
  }

  const duration = Date.now() - start;
  updateActivityStatus(db, activityId, failed ? "failure" : "success", duration);
  log(`routine ${routine.slug} completed in ${duration}ms (${failed ? "with failures" : "ok"})`);
}

export async function executeSkill(root, db, skillSlug, log) {
  const handler = SHELL_SKILLS[skillSlug];
  if (!handler) {
    logActivity(db, {
      type: "skill_invocation",
      actor: skillSlug,
      description: `Skipped: no executor (LLM required)`,
      status: "skipped",
    });
    return { status: "skipped", reason: "no LLM provider" };
  }

  const activityId = logActivity(db, {
    type: "skill_invocation",
    actor: skillSlug,
    description: `Executing shell skill: ${skillSlug}`,
    status: "running",
  });

  const start = Date.now();
  try {
    const result = await handler(root, log);
    const duration = Date.now() - start;
    updateActivityStatus(db, activityId, "success", duration);
    return { status: "success", result };
  } catch (err) {
    const duration = Date.now() - start;
    updateActivityStatus(db, activityId, "failure", duration);
    return { status: "failure", error: err.message };
  }
}

async function executeCheckForUpdates(root, log) {
  const output = execSync("npm outdated differnet --json 2>/dev/null || true", {
    cwd: root,
    timeout: 30_000,
    encoding: "utf-8",
  });
  const data = JSON.parse(output || "{}");
  if (data.differnet) {
    const msg = `differnet update available: ${data.differnet.current} → ${data.differnet.latest}`;
    log(msg);
    await writeInboxMessage(root, "update-available", {
      subject: "Differnet update available",
      body: `A new version of differnet is available.\n\nCurrent: ${data.differnet.current}\nLatest: ${data.differnet.latest}\n\nRun \`npx differnet update\` to get the latest managed skills and schemas.`,
    });
    return msg;
  }
  log("differnet is up to date");
  return "up to date";
}

async function executeCheckIntegrations(root, log) {
  const intDir = path.join(root, "vault", "integrations");
  let files;
  try {
    files = await fs.readdir(intDir);
  } catch {
    log("no integrations directory");
    return "no integrations";
  }

  const results = [];
  for (const file of files) {
    if (!file.endsWith(".yml")) continue;
    const raw = await fs.readFile(path.join(intDir, file), "utf-8");
    const match = raw.match(/health_endpoint:\s*(.+)/);
    if (!match) continue;

    const endpoint = match[1].trim();
    if (!endpoint.startsWith("https://") && !endpoint.startsWith("http://")) continue;

    const name = file.replace(".yml", "");
    try {
      const resp = await fetch(endpoint, {
        method: "HEAD",
        signal: AbortSignal.timeout(10_000),
      });
      const status = resp.ok ? "connected" : "error";
      log(`  ${name}: ${status} (${resp.status})`);
      results.push({ name, status });
    } catch {
      log(`  ${name}: unreachable`);
      results.push({ name, status: "error" });
    }
  }
  return results;
}

async function executeSyncToGithub(root, log) {
  const status = execSync("git status --porcelain", {
    cwd: root,
    timeout: 10_000,
    encoding: "utf-8",
  }).trim();

  if (!status) {
    log("nothing to commit");
    return "clean";
  }

  // Only stage safe directories — never vault/ or data/
  const safeDirs = ["map", "routines", "memory", "inbox", ".claude"];
  for (const dir of safeDirs) {
    try {
      execSync(`git add "${dir}/"`, { cwd: root, timeout: 5_000, encoding: "utf-8" });
    } catch {}
  }
  execSync("git add settings.yml CLAUDE.md .gitignore package.json 2>/dev/null || true", {
    cwd: root,
    timeout: 5_000,
    encoding: "utf-8",
  });

  const staged = execSync("git diff --cached --stat", {
    cwd: root, timeout: 5_000, encoding: "utf-8",
  }).trim();

  if (!staged) {
    log("nothing safe to commit");
    return "clean";
  }

  execSync('git commit -m "Auto-sync from differnet daemon"', {
    cwd: root,
    timeout: 30_000,
    encoding: "utf-8",
  });

  execSync("git push", {
    cwd: root,
    timeout: 60_000,
    encoding: "utf-8",
    killSignal: "SIGKILL",
  });

  log("synced to github");
  return "pushed";
}

async function writeInboxMessage(root, slug, { subject, body }) {
  const inboxDir = path.join(root, "inbox");
  await fs.mkdir(inboxDir, { recursive: true });
  const date = new Date().toISOString().split("T")[0];
  const safeName = slug.replace(/[^a-z0-9-]/g, "");
  const filename = `${date}-${safeName}.md`;
  const content = `---\nsubject: "${subject}"\nstatus: unread\ncreated: ${new Date().toISOString()}\n---\n\n${body}\n`;
  await fs.writeFile(path.join(inboxDir, filename), content, "utf-8");
}
