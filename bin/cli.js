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

} else {
  console.log("differnet — company brain toolkit\n");
  console.log("Commands:");
  console.log("  init [path]   Scaffold a new company brain");
  console.log("  update        Sync managed skills and schemas");
  console.log("  dev           Start the dashboard");
  console.log("");
}
