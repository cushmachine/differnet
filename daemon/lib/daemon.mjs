import fs from "fs";
import fsP from "fs/promises";
import path from "path";
import { initDatabase, logActivity, recoverCrashedEntries, getLastRun } from "./db.mjs";
import { readRoutines } from "./routines.mjs";
import { isDue } from "./schedule.mjs";
import { executeRoutine } from "./executor.mjs";

export class Daemon {
  constructor(root) {
    this.root = root;
    this.db = null;
    this.tickInterval = null;
  }

  async start() {
    this.validateRoot();

    this.db = initDatabase(path.join(this.root, "data", "differnet.db"));

    const recovered = recoverCrashedEntries(this.db);
    if (recovered > 0) this.log(`recovered ${recovered} crashed entries`);

    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    this.log(`daemon started (timezone: ${tz})`);

    logActivity(this.db, {
      type: "daemon_event",
      actor: "daemon",
      description: `Daemon started (timezone: ${tz})`,
    });

    await this.tick();
    this.tickInterval = setInterval(() => this.tick(), 60_000);

    process.on("SIGTERM", () => this.stop());
    process.on("SIGINT", () => this.stop());
  }

  async stop() {
    if (this.tickInterval) {
      clearInterval(this.tickInterval);
      this.tickInterval = null;
    }

    logActivity(this.db, {
      type: "daemon_event",
      actor: "daemon",
      description: "Daemon stopped",
    });
    this.log("daemon stopped");

    this.db.close();
    process.exit(0);
  }

  async tick() {
    try {
      await this.touchHeartbeat();

      const routines = await readRoutines(this.root);
      for (const routine of routines) {
        try {
          if (routine.status !== "active") continue;
          if (!routine.schedule) continue;

          const lastRun = getLastRun(this.db, routine.slug);
          if (isDue(routine.schedule, lastRun)) {
            this.log(`routine due: ${routine.slug}`);
            await executeRoutine(this.root, this.db, routine, (msg) => this.log(msg));
          }
        } catch (err) {
          this.log(`routine ${routine.slug} error: ${err.message}`);
        }
      }
    } catch (err) {
      this.log(`tick error: ${err.message}`);
    }
  }

  async touchHeartbeat() {
    const hb = path.join(this.root, "data", ".heartbeat");
    const now = new Date();
    try {
      await fsP.utimes(hb, now, now);
    } catch {
      await fsP.writeFile(hb, "", "utf-8");
    }
  }

  validateRoot() {
    if (!fs.existsSync(this.root)) {
      console.error(`DIFFERNET_ROOT does not exist: ${this.root}`);
      process.exit(1);
    }
    if (!fs.existsSync(path.join(this.root, "routines"))) {
      console.error(`No routines/ directory in ${this.root}. Is this a differnet content directory?`);
      process.exit(1);
    }
  }

  log(msg) {
    const ts = new Date().toISOString().replace("T", " ").slice(0, 19);
    console.log(`[${ts}] ${msg}`);
  }
}
