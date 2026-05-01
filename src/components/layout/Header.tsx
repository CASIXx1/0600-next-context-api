"use client";

import { useState } from "react";
import { IoAdd, IoClose, IoInformationCircle, IoLogOut, IoNotifications, IoPerson } from "react-icons/io5";
import styles from "./Header.module.css";

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
              <button
                className={styles.menuItem}
                type="button"
                aria-label="タスクを追加"
                onClick={() => setIsTaskFormOpen(true)}
              >
                <IoAdd aria-hidden="true" />
              </button>
              <button
                className={styles.menuItem}
                type="button"
                aria-label="情報"
              >
                <IoInformationCircle aria-hidden="true" />
              </button>
              <button
                className={styles.menuItem}
                type="button"
                aria-label="通知"
              >
                <IoNotifications aria-hidden="true" />
              </button>
            </nav>
            <div className={styles.userMenuContainer}>
              <button
                className={styles.avatarButton}
                type="button"
                aria-label="ユーザーメニュー"
                aria-expanded={isUserMenuOpen}
                onClick={() => setIsUserMenuOpen((current) => !current)}
              >
                <IoPerson aria-hidden="true" />
              </button>
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
            aria-label="タスク追加フォーム"
          >
            <header className={styles.modalHeader}>
              <h2>タスクを追加</h2>
              <button
                className={styles.closeButton}
                type="button"
                aria-label="閉じる"
                onClick={() => setIsTaskFormOpen(false)}
              >
                <IoClose aria-hidden="true" />
              </button>
            </header>
          </section>
        </div>
      ) : null}
    </>
  );
}
