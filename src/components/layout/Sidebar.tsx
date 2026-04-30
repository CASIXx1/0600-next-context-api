import Link from "next/link";

export function Sidebar() {
  return (
    <aside>
      <nav aria-label="Main navigation">
        <ul>
          <li>
            <Link href="/">ダッシュボード</Link>
          </li>
          <li>
            <Link href="/tasks">タスク</Link>
          </li>
          <li>
            <Link href="/projects">プロジェクト</Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
