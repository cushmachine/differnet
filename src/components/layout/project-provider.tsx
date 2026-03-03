"use client";

import { useState } from "react";
import { ProjectContext } from "@/data/projects";

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [activeProject, setActiveProject] = useState("startups");

  return (
    <ProjectContext value={{ activeProject, setActiveProject }}>
      {children}
    </ProjectContext>
  );
}
