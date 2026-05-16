import { ProjectsContent } from "./ProjectsContent";

type ProjectsPageProps = {
  searchParams: Promise<{
    page?: string;
  }>;
};

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const params = await searchParams;
  const requestedPage = Math.max(1, Number(params.page) || 1);

  return <ProjectsContent requestedPage={requestedPage} />;
}
