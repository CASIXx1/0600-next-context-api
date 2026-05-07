"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IoChevronBack } from "react-icons/io5";
import type { Project } from "@/src/types/project";
import { ProjectMenu } from "./ProjectMenu";
import styles from "./index.module.css";

const menuItems = [
  {
    href: "/",
    label: "ダッシュボード",
  },
  {
    href: "/tasks",
    label: "タスク",
  },
  {
    href: "/projects",
    label: "プロジェクト",
  },
];

type SidebarProps = {
  projects: Project[];
};

export function Sidebar({ projects }: SidebarProps) {
  const pathname = usePathname();
  const isProjectsPage = pathname.startsWith("/projects");

  return (
    <aside className={styles.sidebar}>
      <div className={styles.content}>
        <div className={styles.header}>
          <span className={styles.toggle}>
            <IoChevronBack aria-hidden="true" />
          </span>
        </div>
        <div className={styles.body}>
          <nav aria-label="Main navigation">
            <ul>
              {menuItems.map((item) => {
                const isActive = isActivePath(pathname, item.href);

                return (
                  <li key={item.href}>
                    <Link
                      className={`${styles.link} ${isActive ? styles.activeLink : ""}`}
                      href={item.href}
                      aria-current={isActive ? "page" : undefined}
                    >
                      {item.label}
                    </Link>
                    {item.href === "/projects" && isProjectsPage ? <ProjectMenu projects={projects} /> : null}
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>
    </aside>
  );
}

function isActivePath(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}
