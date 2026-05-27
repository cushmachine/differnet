import fs from "fs";
import path from "path";
import os from "os";
import { execSync } from "child_process";

export function installService(root, daemonPath) {
  const platform = process.platform;
  if (platform === "darwin") {
    return installLaunchd(root, daemonPath);
  } else if (platform === "linux") {
    return installSystemd(root, daemonPath);
  } else {
    console.error(`Unsupported platform: ${platform}. Use 'npx differnet daemon start' to run manually.`);
    return false;
  }
}

export function uninstallService() {
  const platform = process.platform;
  if (platform === "darwin") {
    return uninstallLaunchd();
  } else if (platform === "linux") {
    return uninstallSystemd();
  }
  return false;
}

export function isServiceInstalled() {
  const platform = process.platform;
  if (platform === "darwin") {
    return fs.existsSync(launchdPlistPath());
  } else if (platform === "linux") {
    return fs.existsSync(systemdUnitPath());
  }
  return false;
}

// --- macOS launchd ---

function launchdPlistPath() {
  return path.join(os.homedir(), "Library", "LaunchAgents", "com.differnet.daemon.plist");
}

function installLaunchd(root, daemonPath) {
  const dataDir = path.join(root, "data");
  fs.mkdirSync(dataDir, { recursive: true });

  // Write a shell wrapper that sources the user's profile to resolve nvm/fnm/volta
  const wrapperPath = path.join(dataDir, ".daemon-wrapper.sh");
  const shell = process.env.SHELL || "/bin/zsh";
  const rcFile = shell.includes("zsh") ? "~/.zshrc" : "~/.bashrc";

  fs.writeFileSync(
    wrapperPath,
    `#!/bin/bash
# Source user profile to resolve node path (nvm/fnm/volta)
[ -f ${rcFile} ] && source ${rcFile} 2>/dev/null
exec node "${daemonPath}"
`,
    { mode: 0o755 }
  );

  const plist = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>com.differnet.daemon</string>
  <key>ProgramArguments</key>
  <array>
    <string>${wrapperPath}</string>
  </array>
  <key>EnvironmentVariables</key>
  <dict>
    <key>DIFFERNET_ROOT</key>
    <string>${root}</string>
  </dict>
  <key>RunAtLoad</key>
  <true/>
  <key>KeepAlive</key>
  <true/>
  <key>StandardOutPath</key>
  <string>${path.join(dataDir, "daemon.log")}</string>
  <key>StandardErrorPath</key>
  <string>${path.join(dataDir, "daemon.log")}</string>
</dict>
</plist>`;

  const plistPath = launchdPlistPath();
  fs.mkdirSync(path.dirname(plistPath), { recursive: true });
  fs.writeFileSync(plistPath, plist);

  try {
    execSync(`launchctl load "${plistPath}"`, { stdio: "pipe" });
  } catch {
    execSync(`launchctl bootstrap gui/${process.getuid()} "${plistPath}"`, { stdio: "pipe" });
  }

  console.log("Daemon installed as macOS launch agent");
  console.log(`  Plist: ${plistPath}`);
  console.log(`  Logs:  ${path.join(dataDir, "daemon.log")}`);
  return true;
}

function uninstallLaunchd() {
  const plistPath = launchdPlistPath();
  if (!fs.existsSync(plistPath)) {
    console.log("No daemon service found to uninstall");
    return false;
  }

  try {
    execSync(`launchctl unload "${plistPath}"`, { stdio: "pipe" });
  } catch {
    try {
      execSync(`launchctl bootout gui/${process.getuid()} "${plistPath}"`, { stdio: "pipe" });
    } catch {}
  }

  fs.unlinkSync(plistPath);
  console.log("Daemon service uninstalled");
  return true;
}

// --- Linux systemd ---

function systemdUnitPath() {
  return path.join(os.homedir(), ".config", "systemd", "user", "differnet-daemon.service");
}

function installSystemd(root, daemonPath) {
  const dataDir = path.join(root, "data");
  fs.mkdirSync(dataDir, { recursive: true });

  const nodePath = process.execPath;
  const unit = `[Unit]
Description=Differnet Daemon
After=network.target

[Service]
Type=simple
ExecStart=${nodePath} ${daemonPath}
Environment=DIFFERNET_ROOT=${root}
Restart=always
RestartSec=10

[Install]
WantedBy=default.target
`;

  const unitPath = systemdUnitPath();
  fs.mkdirSync(path.dirname(unitPath), { recursive: true });
  fs.writeFileSync(unitPath, unit);

  execSync("systemctl --user daemon-reload", { stdio: "pipe" });
  execSync("systemctl --user enable differnet-daemon", { stdio: "pipe" });
  execSync("systemctl --user start differnet-daemon", { stdio: "pipe" });

  console.log("Daemon installed as systemd user service");
  console.log(`  Unit: ${unitPath}`);
  console.log(`  Logs: journalctl --user -u differnet-daemon`);
  return true;
}

function uninstallSystemd() {
  const unitPath = systemdUnitPath();
  if (!fs.existsSync(unitPath)) {
    console.log("No daemon service found to uninstall");
    return false;
  }

  try {
    execSync("systemctl --user stop differnet-daemon", { stdio: "pipe" });
    execSync("systemctl --user disable differnet-daemon", { stdio: "pipe" });
  } catch {}

  fs.unlinkSync(unitPath);
  execSync("systemctl --user daemon-reload", { stdio: "pipe" });
  console.log("Daemon service uninstalled");
  return true;
}
