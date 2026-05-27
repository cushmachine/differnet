import { readSkills, readSkill } from "@/lib/readers";
import { SkillsView } from "@/components/skills/skills-view";

export const dynamic = "force-dynamic";

export default async function SkillsPage({
  searchParams,
}: {
  searchParams: Promise<{ skill?: string }>;
}) {
  const params = await searchParams;
  const skills = await readSkills();
  const selectedSkill = params.skill
    ? await readSkill(params.skill)
    : null;

  return <SkillsView skills={skills} selectedSkill={selectedSkill} />;
}
