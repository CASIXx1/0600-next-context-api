import { ProjectCard } from "./ProjectCard";
import type { Project } from "@/src/types/project";

export function ProjectList({ projects }: { projects: Project[] }) {
  return (
    <section>
      <h1>プロジェクト</h1>
      <p>1 / 1 ({projects.length} 件)</p>
      <label>
        <input type="checkbox" />
        アーカイブを表示
      </label>

      <ul>
        {projects.map((project) => (
          <li key={project.id}>
            <ProjectCard project={project} />
          </li>
        ))}
      </ul>
    </section>
  );
}
