import { IoArchive, IoCalendarClearOutline, IoCheckmark } from "react-icons/io5";
import { TextInput } from "@/src/components/atoms/TextInput";
import { useProject } from "@/src/contexts/projects";
import { formatDate } from "@/src/lib/date/format";
import styles from "./ProjectDetail.module.css";

const PROJECT_BASE_PATH = "/projects/";

export function ProjectDetail() {
  const project = useProject();
  const color = project.color;
  const daysUntilDeadline = calculateDaysUntil(project.deadline);

  return (
    <article
      className={styles.project}
      style={{ borderLeftColor: color }}
    >
      <header className={styles.header}>
        <h1
          className={styles.title}
          style={{ color }}
        >
          {project.status === "archived" ? "（アーカイブ）" : null}
          {project.name}
        </h1>
        <div className={styles.menu} />
      </header>

      <div className={styles.projectBody}>
        <div className={styles.field}>
          <label className={styles.label}>
            <span className={styles.labelText}>ゴール: </span>
          </label>
          <div className={styles.goalContainer}>
            <p className={styles.deadline}>
              <span className={styles.fromText}>あと {daysUntilDeadline} 日</span>
              <time
                className={styles.fromDate}
                dateTime={project.deadline}
              >
                ({formatDate(project.deadline)})
              </time>
            </p>
            <p className={`${styles.text} ${styles.goal}`}>{project.goal}</p>
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>
            <span className={styles.labelText}>あるべき姿: </span>
          </label>
          <p className={styles.text}>{project.shouldbe}</p>
        </div>

        <div className={styles.border} />

        <div className={styles.field}>
          <label className={styles.label}>スラッグ: </label>
          <p className={`${styles.text} ${styles.slug}`}>
            <span className={styles.slugBasePath}>{PROJECT_BASE_PATH}</span>
            <TextInput
              className={styles.slugInput}
              type="text"
              value={project.slug}
              aria-label="プロジェクトスラッグ"
              readOnly
            />
          </p>
        </div>

        <div className={styles.field}>
          <ul className={styles.stats}>
            <li>
              <div className={styles.stat}>
                <IoCalendarClearOutline
                  className={styles.statIcon}
                  aria-hidden="true"
                />
                {project.stats.states.scheduled}
              </div>
            </li>
            <li>
              <div className={styles.stat}>
                <IoCheckmark
                  className={styles.statIcon}
                  aria-hidden="true"
                />
                {project.stats.states.completed}
              </div>
            </li>
            <li>
              <div className={`${styles.stat} ${styles.lastStat}`}>
                <IoArchive
                  className={styles.statIcon}
                  aria-hidden="true"
                />
                {project.stats.states.archived}
              </div>
            </li>
          </ul>
        </div>
      </div>
    </article>
  );
}

function calculateDaysUntil(value: string) {
  const deadline = new Date(value);
  const today = new Date();
  const millisecondsPerDay = 1000 * 60 * 60 * 24;
  const difference = deadline.getTime() - today.getTime();

  return Math.max(0, Math.ceil(difference / millisecondsPerDay));
}
