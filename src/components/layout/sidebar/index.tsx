"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
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

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isProjectsPage = pathname.startsWith("/projects");

  return (
    <aside className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ""}`}>
      <div className={styles.content}>
        <div className={styles.header}>
          <button
            className={styles.toggle}
            type="button"
            aria-label={isCollapsed ? "サイドバーを開く" : "サイドバーを閉じる"}
            aria-expanded={!isCollapsed}
            onClick={() => setIsCollapsed((current) => !current)}
          >
            {isCollapsed ? <IoChevronForward aria-hidden="true" /> : <IoChevronBack aria-hidden="true" />}
          </button>
        </div>
        <div
          className={styles.body}
          hidden={isCollapsed}
        >
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
                    {item.href === "/projects" && isProjectsPage ? <ProjectMenu /> : null}
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
