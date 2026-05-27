"use server";

import fs from "fs/promises";
import path from "path";
import yaml from "js-yaml";
import { revalidatePath } from "next/cache";

const ROOT = process.env.DIFFERNET_ROOT || process.cwd();

export async function togglePageVisibility(pageId: string) {
  const settingsPath = path.join(ROOT, "settings.yml");
  let settings: Record<string, unknown> = {};

  try {
    const raw = await fs.readFile(settingsPath, "utf-8");
    settings = (yaml.load(raw) as Record<string, unknown>) ?? {};
  } catch {
    // file doesn't exist yet
  }

  const hidden = (settings.hidden_pages as string[]) ?? [];

  if (hidden.includes(pageId)) {
    settings.hidden_pages = hidden.filter((p) => p !== pageId);
  } else {
    settings.hidden_pages = [...hidden, pageId];
  }

  const output = yaml.dump(settings, { flowLevel: 2 });
  await fs.writeFile(settingsPath, output, "utf-8");
  revalidatePath("/settings");
  revalidatePath("/");
}
