import { ProjectCard } from "./ProjectCard";
import { sampleProjects } from "./projects";

export function ProjectList() {
  return (
    <section>
      <h1>プロジェクト</h1>
      <p>1 / 1 ({sampleProjects.length} 件)</p>
      <label>
        <input type="checkbox" />
        アーカイブを表示
      </label>

      <ul>
        {sampleProjects.map((project) => (
          <li key={project.id}>
            <ProjectCard project={project} />
          </li>
        ))}
      </ul>
    </section>
  );
}
