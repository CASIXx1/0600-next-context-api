import styles from "./Header.module.css";

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <h1>Turvo</h1>
      </div>
      <nav
        className={styles.actions}
        aria-label="Header actions"
      >
        <button
          className={styles.action}
          type="button"
          aria-label="追加"
        >
          +
        </button>
        <button
          className={styles.action}
          type="button"
          aria-label="情報"
        >
          i
        </button>
        <button
          className={styles.action}
          type="button"
          aria-label="通知"
        >
          bell
        </button>
        <button
          className={styles.avatarButton}
          type="button"
          aria-label="ユーザーメニュー"
        >
          user
        </button>
      </nav>
    </header>
  );
}
