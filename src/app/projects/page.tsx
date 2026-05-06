import { ProjectList } from "@/src/components/projects/ProjectList";
import { getProjects } from "@/src/app/api/datastore";

export default async function ProjectsPage() {
  const projects = getProjects();

  return <ProjectList projects={projects} />;
}
