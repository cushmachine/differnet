import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";

export async function readRoutines(root) {
  const routinesDir = path.join(root, "routines");
  try {
    await fs.access(routinesDir);
  } catch {
    return [];
  }

  const entries = await fs.readdir(routinesDir);
  const routines = [];

  for (const filename of entries) {
    if (!filename.endsWith(".md")) continue;
    const raw = await fs.readFile(path.join(routinesDir, filename), "utf-8");
    const { data } = matter(raw);

    routines.push({
      slug: filename.replace(".md", ""),
      name: data.name ?? filename.replace(".md", ""),
      description: data.description ?? "",
      schedule: data.schedule ?? "",
      status: data.status ?? "draft",
      skills: data.skills ?? [],
    });
  }

  return routines;
}
