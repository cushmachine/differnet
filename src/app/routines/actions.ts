"use server";

import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import { revalidatePath } from "next/cache";

const ROOT = process.env.DIFFERNET_ROOT || process.cwd();

export async function toggleRoutineStatus(slug: string) {
  const filePath = path.join(ROOT, "routines", `${slug}.md`);
  const raw = await fs.readFile(filePath, "utf-8");
  const { data, content } = matter(raw);

  data.status = data.status === "active" ? "paused" : "active";

  const frontmatter = Object.entries(data)
    .map(([k, v]) => {
      if (Array.isArray(v)) return `${k}:\n${v.map((i) => `  - ${i}`).join("\n")}`;
      return `${k}: ${v}`;
    })
    .join("\n");

  await fs.writeFile(filePath, `---\n${frontmatter}\n---\n${content}`, "utf-8");
  revalidatePath("/routines");
}
