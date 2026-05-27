import styles from "./DashboardStatList.module.css";

type DashboardStat = {
  label: string;
  value: number;
};

type DashboardStatListProps = {
  stats: DashboardStat[];
};

export function DashboardStatList({ stats }: DashboardStatListProps) {
  return (
    <ul className={styles.list}>
      {stats.map((stat) => (
        <li
          className={styles.item}
          key={stat.label}
        >
          <p className={styles.label}>{stat.label}</p>
          <p className={styles.value}>{stat.value}</p>
        </li>
      ))}
    </ul>
  );
}
