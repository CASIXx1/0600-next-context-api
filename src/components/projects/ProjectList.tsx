import { ProjectCard } from "./ProjectCard";
import type { Project } from "@/src/types/project";
import styles from "./ProjectList.module.css";

export function ProjectList({ projects }: { projects: Project[] }) {
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
