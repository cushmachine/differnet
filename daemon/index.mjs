import fs from "fs";
import path from "path";
import { Daemon } from "./lib/daemon.mjs";

const root = process.env.DIFFERNET_ROOT;
if (!root) {
  console.error("DIFFERNET_ROOT not set. Usage: DIFFERNET_ROOT=/path/to/brain node daemon/index.mjs");
  process.exit(1);
}

const absRoot = path.resolve(root);
const dataDir = path.join(absRoot, "data");
fs.mkdirSync(dataDir, { recursive: true });

// PID lockfile — check before writing
const pidPath = path.join(dataDir, ".daemon.pid");
try {
  const existingPid = fs.readFileSync(pidPath, "utf-8").trim();
  if (existingPid) {
    try {
      process.kill(parseInt(existingPid, 10), 0);
      console.error(`Daemon already running (PID ${existingPid})`);
      process.exit(1);
    } catch {
      // stale PID, process doesn't exist — safe to proceed
    }
  }
} catch {
  // no PID file — safe to proceed
}

fs.writeFileSync(pidPath, String(process.pid));

function cleanup() {
  try { fs.unlinkSync(pidPath); } catch {}
}
process.on("exit", cleanup);

const daemon = new Daemon(absRoot);
await daemon.start();
