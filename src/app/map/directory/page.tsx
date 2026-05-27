import { readDirectory } from "@/lib/readers";
import { DirectoryView } from "./directory-view";

export const dynamic = "force-dynamic";

export default async function DirectoryPage() {
  const { entries } = await readDirectory();
  return <DirectoryView entries={entries} />;
}
