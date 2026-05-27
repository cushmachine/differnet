"use server";

import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import { revalidatePath } from "next/cache";

const ROOT = process.env.DIFFERNET_ROOT || process.cwd();

export async function updateMessageStatus(slug: string, status: string) {
  const filePath = path.join(ROOT, "inbox", `${slug}.md`);
  const raw = await fs.readFile(filePath, "utf-8");
  const { data, content } = matter(raw);

  data.status = status;

  const frontmatter = Object.entries(data)
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");

  await fs.writeFile(filePath, `---\n${frontmatter}\n---\n${content}`, "utf-8");
  revalidatePath("/inbox");
}
