import { TasksContent } from "./TasksContent";

type TasksPageProps = {
  searchParams: Promise<{
    page?: string;
  }>;
};

export default async function TasksPage({ searchParams }: TasksPageProps) {
  const params = await searchParams;
  const requestedPage = Math.max(1, Number(params.page) || 1);

  return <TasksContent requestedPage={requestedPage} />;
}
