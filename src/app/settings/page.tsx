import { readSettings } from "@/lib/readers";
import { SettingsView } from "./settings-view";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const settings = await readSettings();
  return <SettingsView settings={settings} />;
}
