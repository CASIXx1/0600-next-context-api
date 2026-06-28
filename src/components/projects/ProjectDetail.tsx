import { TextInput } from "@/src/components/atoms/TextInput";
import { DetailField } from "@/src/components/molecules/DetailField";
import { IconList } from "@/src/components/molecules/IconList";
import { useProject } from "@/src/contexts/projects";
import { formatDate } from "@/src/lib/date/format";
import styles from "./ProjectDetail.module.css";

const PROJECT_BASE_PATH = "/projects/";
const PROJECT_SLUG_INPUT_ID = "project-detail-slug";

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
        <DetailField label="ゴール: ">
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
        </DetailField>

        <DetailField label="あるべき姿: ">
          <p className={styles.text}>{project.shouldbe}</p>
        </DetailField>

        <div className={styles.border} />

        <DetailField
          label="スラッグ: "
          labelHtmlFor={PROJECT_SLUG_INPUT_ID}
        >
          <p className={`${styles.text} ${styles.slug}`}>
            <span className={styles.slugBasePath}>{PROJECT_BASE_PATH}</span>
            <TextInput
              id={PROJECT_SLUG_INPUT_ID}
              className={styles.slugInput}
              type="text"
              value={project.slug}
              aria-label="プロジェクトスラッグ"
              readOnly
            />
          </p>
        </DetailField>

        <div className={styles.detailRow}>
          <IconList
            variant="detail"
            items={[
              {
                name: "calendar",
                value: project.stats.states.scheduled,
                ariaLabel: `予定数: ${project.stats.states.scheduled}`,
              },
              {
                name: "check",
                value: project.stats.states.completed,
                ariaLabel: `完了数: ${project.stats.states.completed}`,
              },
              {
                name: "archive",
                value: project.stats.states.archived,
                ariaLabel: `アーカイブ数: ${project.stats.states.archived}`,
              },
            ]}
          />
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
