"use client";

import { ProjectCard } from "./ProjectCard";
import { useProjects } from "@/src/contexts/projects";
import styles from "./ProjectList.module.css";

export function ProjectList() {
  const projects = useProjects();

  return (
    <ul className={styles.list}>
      {projects.map((project) => (
        <li key={project.id}>
          <ProjectCard project={project} />
        </li>
      ))}
    </ul>
  );
}
