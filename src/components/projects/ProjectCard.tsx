import type { Project } from "@/src/types/project";

type ProjectCardProps = {
  project: Project;
};

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article>
      <h2>{project.name}</h2>
      <dl>
        <div>
          <dt>ID</dt>
          <dd>{project.id}</dd>
        </div>
        <div>
          <dt>Slug</dt>
          <dd>{project.slug}</dd>
        </div>
        <div>
          <dt>Status</dt>
          <dd>{project.status}</dd>
        </div>
        <div>
          <dt>Color</dt>
          <dd>{project.color}</dd>
        </div>
        <div>
          <dt>Goal</dt>
          <dd>{project.goal}</dd>
        </div>
        <div>
          <dt>Shouldbe</dt>
          <dd>{project.shouldbe || "未設定"}</dd>
        </div>
        <div>
          <dt>Deadline</dt>
          <dd>{project.deadline}</dd>
        </div>
        <div>
          <dt>Created At</dt>
          <dd>{project.createdAt}</dd>
        </div>
        <div>
          <dt>Updated At</dt>
          <dd>{project.updatedAt}</dd>
        </div>
        <div>
          <dt>Stats Total</dt>
          <dd>{project.stats.total}</dd>
        </div>
        <div>
          <dt>Stats Kinds</dt>
          <dd>
            milestone: {project.stats.kinds.milestone}, task: {project.stats.kinds.task}, total:{" "}
            {project.stats.kinds.total}
          </dd>
        </div>
        <div>
          <dt>Stats States</dt>
          <dd>
            scheduled: {project.stats.states.scheduled}, completed: {project.stats.states.completed}, archived:{" "}
            {project.stats.states.archived}
          </dd>
        </div>
        <div>
          <dt>Milestones</dt>
          <dd>{project.milestones.length} 件</dd>
        </div>
      </dl>
    </article>
  );
}
