import Link from "next/link";
import { IoCalendarClear } from "react-icons/io5";
import { IconList } from "@/src/components/molecules/IconList";
import { formatDate } from "@/src/lib/date/format";
import type { Project } from "@/src/contexts/projects";
import styles from "./ProjectCard.module.css";

type ProjectCardProps = {
  project: Project;
};

export function ProjectCard({ project }: ProjectCardProps) {
  const color = project.color;

  return (
    <article
      className={styles.card}
      style={{ borderLeftColor: color }}
    >
      <Link
        className={styles.link}
        href={`/projects/${project.slug}`}
      >
        <header className={styles.header}>
          <h2
            className={styles.title}
            style={{ color }}
          >
            {project.name}
          </h2>
          <p className={styles.deadline}>
            <IoCalendarClear
              className={styles.deadlineIcon}
              aria-hidden="true"
              color={color}
              size="10px"
              style={{ color }}
            />
            <time dateTime={project.deadline}>{formatDate(project.deadline)}</time>
          </p>
        </header>

        <div className={styles.body}>
          <p className={styles.goal}>{project.goal}</p>
          {project.shouldbe ? <p className={styles.shouldbe}>{project.shouldbe}</p> : null}
        </div>

        <footer className={styles.footer}>
          <IconList
            color={color}
            items={[
              {
                name: "milestone",
                value: project.stats.kinds.milestone,
                ariaLabel: `マイルストーン数: ${project.stats.kinds.milestone}`,
              },
              {
                name: "document",
                value: project.stats.kinds.task,
                ariaLabel: `タスク数: ${project.stats.kinds.task}`,
              },
            ]}
          />
        </footer>
      </Link>
    </article>
  );
}
