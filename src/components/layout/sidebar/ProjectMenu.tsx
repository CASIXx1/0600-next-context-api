import { formatDate } from "@/src/lib/date/format";
import { getProjectDisplayColor } from "@/src/lib/projects/color";
import type { Project } from "@/src/types/project";
import styles from "./ProjectMenu.module.css";

type ProjectMenuProps = {
  projects: Project[];
};

export function ProjectMenu({ projects }: ProjectMenuProps) {
  return (
    <ul className={styles.projectList}>
      {projects.map((project) => {
        const color = getProjectDisplayColor(project.color);

        return (
          <li
            className={styles.projectItem}
            key={project.id}
          >
            <span
              className={styles.projectDot}
              style={{ backgroundColor: color }}
              aria-hidden="true"
            />
            <span className={styles.projectName}>{project.name}</span>
            <time
              className={styles.projectDeadline}
              dateTime={project.deadline}
            >
              {formatDate(project.deadline)}
            </time>
          </li>
        );
      })}
    </ul>
  );
}
