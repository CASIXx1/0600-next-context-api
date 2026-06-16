"use client";

import { useState } from "react";
import { IoAdd, IoClose, IoInformationCircle, IoLogOut, IoNotifications, IoPerson } from "react-icons/io5";
import { IconButton } from "@/src/components/atoms/IconButton";
import { TaskCreateForm } from "@/src/components/tasks/TaskCreateForm";
import styles from "./index.module.css";

export function Header() {
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <>
      <header className={styles.header}>
        <div className={styles.content}>
          <div className={styles.left}>
            <div className={styles.logo}>
              <h2>Turvo</h2>
            </div>
          </div>
          <div className={styles.right}>
            <nav
              className={styles.menu}
              aria-label="Header actions"
            >
              <IconButton
                className={styles.menuItem}
                ariaLabel="タスクを追加"
                onClick={() => setIsTaskFormOpen(true)}
              >
                <IoAdd aria-hidden="true" />
              </IconButton>
              <IconButton
                className={styles.menuItem}
                ariaLabel="情報"
              >
                <IoInformationCircle aria-hidden="true" />
              </IconButton>
              <IconButton
                className={styles.menuItem}
                ariaLabel="通知"
              >
                <IoNotifications aria-hidden="true" />
              </IconButton>
            </nav>
            <div className={styles.userMenuContainer}>
              <IconButton
                className={styles.avatarButton}
                ariaLabel="ユーザーメニュー"
                ariaExpanded={isUserMenuOpen}
                onClick={() => setIsUserMenuOpen((current) => !current)}
              >
                <IoPerson aria-hidden="true" />
              </IconButton>
              {isUserMenuOpen ? (
                <div className={styles.userMenu}>
                  <button type="button">
                    <IoPerson aria-hidden="true" />
                    プロフィール
                  </button>
                  <button
                    className={styles.logoutButton}
                    type="button"
                  >
                    <IoLogOut aria-hidden="true" />
                    ログアウト
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </header>

      {isTaskFormOpen ? (
        <div
          className={styles.modalOverlay}
          role="presentation"
        >
          <section
            className={styles.taskFormModal}
            role="dialog"
            aria-modal="true"
            aria-label="タスク追加フォーム"
          >
            <header className={styles.modalHeader}>
              <IconButton
                className={styles.closeButton}
                ariaLabel="閉じる"
                onClick={() => setIsTaskFormOpen(false)}
              >
                <IoClose aria-hidden="true" />
              </IconButton>
            </header>
            <div className={styles.modalBody}>
              <TaskCreateForm
                onCancel={() => setIsTaskFormOpen(false)}
                onCreated={() => setIsTaskFormOpen(false)}
              />
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}
