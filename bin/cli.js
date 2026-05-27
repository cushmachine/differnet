#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const PKG_ROOT = path.resolve(__dirname, "..");
const CWD = process.cwd();
const command = process.argv[2];

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function copySkills(dest, { force = false } = {}) {
  const skillsSrc = path.join(PKG_ROOT, "skills");
  const skillsDest = path.join(dest, ".claude", "skills");
  fs.mkdirSync(skillsDest, { recursive: true });

  for (const entry of fs.readdirSync(skillsSrc, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const srcDir = path.join(skillsSrc, entry.name);
    const destDir = path.join(skillsDest, entry.name);

    if (!force && fs.existsSync(destDir)) {
      const skillFile = path.join(destDir, "skill.md");
      if (fs.existsSync(skillFile)) {
        const content = fs.readFileSync(skillFile, "utf-8");
        if (!content.includes("managed: true")) {
          console.log(`  skip ${entry.name} (user-owned)`);
          continue;
        }
      }
    }

    copyDir(srcDir, destDir);
    console.log(`  ${fs.existsSync(destDir) ? "update" : "create"} ${entry.name}`);
  }
}

function copySchemas(dest) {
  const schemasSrc = path.join(PKG_ROOT, "schemas");
  const schemasDest = path.join(dest, "map", "schemas");
  fs.mkdirSync(schemasDest, { recursive: true });

  for (const file of fs.readdirSync(schemasSrc)) {
    fs.copyFileSync(path.join(schemasSrc, file), path.join(schemasDest, file));
  }
  console.log("  schemas synced");
}

if (command === "init") {
  const target = process.argv[3] || CWD;
  const absTarget = path.resolve(target);

  fs.mkdirSync(absTarget, { recursive: true });
  console.log(`Initializing company brain at ${absTarget}\n`);

  // Copy template
  const templateDir = path.join(PKG_ROOT, "template");
  for (const entry of fs.readdirSync(templateDir, { withFileTypes: true })) {
    const srcPath = path.join(templateDir, entry.name);
    const destPath = path.join(absTarget, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      if (!fs.existsSync(destPath)) {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }
  console.log("Template files created");

  // Create empty dirs
  for (const dir of ["data", "vault/integrations"]) {
    fs.mkdirSync(path.join(absTarget, dir), { recursive: true });
  }

  // Copy managed skills
  console.log("\nInstalling skills:");
  copySkills(absTarget, { force: true });

  // Copy schemas
  console.log("\nSyncing schemas:");
  copySchemas(absTarget);

  console.log("\nDone! Next steps:");
  console.log("  cd " + path.relative(CWD, absTarget));
  console.log("  Open Claude Code and run /onboarding");
  console.log("  Run `npx differnet dev` to view the dashboard");

} else if (command === "update") {
  console.log("Updating managed skills and schemas...\n");

  console.log("Skills:");
  copySkills(CWD);

  console.log("\nSchemas:");
  copySchemas(CWD);

  console.log("\nDone!");

} else if (command === "dev") {
  process.env.DIFFERNET_ROOT = CWD;
  try {
    execSync("npx next dev", {
      cwd: PKG_ROOT,
      stdio: "inherit",
      env: { ...process.env, DIFFERNET_ROOT: CWD },
    });
  } catch {
    // next dev exits on ctrl-c
  }

} else if (command === "daemon") {
  const sub = process.argv[3];
  const daemonEntry = path.join(PKG_ROOT, "daemon", "index.mjs");
  const pidFile = path.join(CWD, "data", ".daemon.pid");
  const heartbeat = path.join(CWD, "data", ".heartbeat");

  function isDaemonRunning() {
    try {
      const pid = parseInt(fs.readFileSync(pidFile, "utf-8").trim(), 10);
      process.kill(pid, 0);
      return pid;
    } catch {
      return null;
    }
  }

  function startDaemon() {
    const pid = isDaemonRunning();
    if (pid) {
      console.log(`Daemon already running (PID ${pid})`);
      return;
    }

    fs.mkdirSync(path.join(CWD, "data"), { recursive: true });
    const logFile = path.join(CWD, "data", "daemon.log");
    const out = fs.openSync(logFile, "a");
    const err = fs.openSync(logFile, "a");

    const { spawn } = require("child_process");
    const child = spawn(process.execPath, [daemonEntry], {
      detached: true,
      stdio: ["ignore", out, err],
      env: { ...process.env, DIFFERNET_ROOT: CWD },
    });
    child.unref();
    console.log(`Daemon started (PID ${child.pid})`);
    console.log(`  Logs: ${logFile}`);
  }

  function stopDaemon() {
    const pid = isDaemonRunning();
    if (!pid) {
      console.log("Daemon is not running");
      return;
    }
    process.kill(pid, "SIGTERM");
    try { fs.unlinkSync(pidFile); } catch {}
    console.log(`Daemon stopped (PID ${pid})`);
  }

  function showStatus() {
    const pid = isDaemonRunning();
    if (!pid) {
      console.log("Daemon: not running");
      return;
    }
    let lastSweep = "unknown";
    try {
      const stat = fs.statSync(heartbeat);
      const ago = Math.round((Date.now() - stat.mtimeMs) / 1000);
      lastSweep = `${ago}s ago`;
    } catch {}
    console.log(`Daemon: running (PID ${pid}), last sweep ${lastSweep}`);
  }

  if (sub === "start") {
    startDaemon();
  } else if (sub === "stop") {
    stopDaemon();
  } else if (sub === "status") {
    showStatus();
  } else if (sub === "install") {
    import(path.join(PKG_ROOT, "daemon", "lib", "service.mjs")).then(({ installService }) => {
      installService(CWD, daemonEntry);
    });
  } else if (sub === "uninstall") {
    import(path.join(PKG_ROOT, "daemon", "lib", "service.mjs")).then(({ uninstallService }) => {
      uninstallService();
    });
  } else {
    // Smart default: start if not running, show status if running
    const pid = isDaemonRunning();
    if (pid) {
      showStatus();
    } else {
      startDaemon();
    }
  }

} else {
  console.log("differnet — company brain toolkit\n");
  console.log("Commands:");
  console.log("  init [path]   Scaffold a new company brain");
  console.log("  update        Sync managed skills and schemas");
  console.log("  dev           Start the dashboard");
  console.log("  daemon        Start/manage the background daemon");
  console.log("");
  console.log("Daemon subcommands:");
  console.log("  daemon          Start if stopped, show status if running");
  console.log("  daemon start    Start the daemon");
  console.log("  daemon stop     Stop the daemon");
  console.log("  daemon status   Show daemon status");
  console.log("  daemon install  Install as system service (auto-start on login)");
  console.log("  daemon uninstall  Remove system service");
  console.log("");
}
