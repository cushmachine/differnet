"use client";

import { createContext, useContext } from "react";
import type { Project } from "@/types";

export const projects: Project[] = [
  { id: "startups", name: "Startups" },
  { id: "collider", name: "Collider" },
];

export interface ProjectContextValue {
  activeProject: string;
  setActiveProject: (id: string) => void;
}

export const ProjectContext = createContext<ProjectContextValue>({
  activeProject: "startups",
  setActiveProject: () => {},
});

export function useProject() {
  return useContext(ProjectContext);
}
