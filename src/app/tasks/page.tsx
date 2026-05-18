import { TasksContent } from "./TasksContent";

type TasksPageProps = {
  searchParams: Promise<{
    limit?: string;
    page?: string;
  }>;
};

export default async function TasksPage({ searchParams }: TasksPageProps) {
  const params = await searchParams;
  const requestedPage = Math.max(1, Number(params.page) || 1);
  const requestedLimit = [20, 50, 100].includes(Number(params.limit)) ? Number(params.limit) : 20;

  return (
    <TasksContent
      requestedLimit={requestedLimit}
      requestedPage={requestedPage}
    />
  );
}
