export type StatsType = "completed" | "todo";

export type StatsDataPoint = {
  date: number;
  value: number;
};

export type Stats = {
  label: string;
  type: StatsType;
  data: StatsDataPoint[];
};

export type StatsResponse = {
  data: Stats[];
};
