export type Project = {
  id: string;
  name: string;
  color: string;
  goal: string;
  shouldbe: string;
  deadline: string;
  stats: {
    kinds: {
      milestone: number;
      task: number;
    };
  };
};
