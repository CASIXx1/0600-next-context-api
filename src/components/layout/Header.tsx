export function Header() {
  return (
    <header>
      <div>
        <h1>Turvo</h1>
      </div>
      <nav aria-label="Header actions">
        <button
          type="button"
          aria-label="追加"
        >
          +
        </button>
        <button
          type="button"
          aria-label="情報"
        >
          i
        </button>
        <button
          type="button"
          aria-label="通知"
        >
          bell
        </button>
        <button
          type="button"
          aria-label="ユーザーメニュー"
        >
          user
        </button>
      </nav>
    </header>
  );
}
