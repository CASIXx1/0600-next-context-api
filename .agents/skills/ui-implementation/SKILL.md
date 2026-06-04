---
name: ui-implementation
description: UI コンポーネント、CSS module、デザイン再現、画面表示の実装手順が必要なときに使う。
---

# UI 実装手順

## 使い方

- この skill は UI 実装の手順を扱う。
- 設計方針は `.agents/project.md` を優先する。

## デザイン再現の手順

1. まずローカルのコンポーネントと CSS module を読む。
2. 厳密な見た目合わせが必要な場合は、参照サイトと比較する。
   - 対象ページの HTML を取得する。
   - リンクされている `_next/static/css/*.css` を読む。
   - 構造が不明な場合は、関連する `_next/static/chunks/app/...` の chunk を確認する。
3. レイアウト値は根拠を持って参照サイトに合わせる。
4. 見た目を変えない範囲でアクセシビリティ改善は維持する。

## 実装時の判断

- 変更前に対象コンポーネントと周辺の CSS module を読む。
- API レスポンスに不足がある場合も、まずフロントエンド側で吸収できるかを検討する。
- `src/app/<route>` には `page.tsx`、`content.tsx`、`content.module.css` など画面 orchestration だけを置く。root route を画面名でまとめる場合は URL を変えない route group、例: `src/app/(dashboard)` を使う。
- CSS module は import するコンポーネント名に合わせる。`content.tsx` のスタイルは `content.module.css`、`page.tsx` が直接持つスタイルだけ `page.module.css` にする。
- UI 部品は原則 `src/components/<domain>` に置く。画面固有に見えても、一覧、行、フォーム部品、セレクト、ページネーション、グラフなど独立した部品は route 配下に置かない。
- UI 部品は責務ごとに 1 ファイル 1 コンポーネントで切り出し、所有する CSS module も同じ粒度で分ける。
- Pagination は `src/components/pagination` を使い、URL 生成や query 条件は `getPageHref` などの props で外から渡す。
- 画面内の固定値や magic number は意味が分かる定数にする。同じ対象の固定値は近くに並べ、`PAGE`、`LIMIT` のように関連する値は対象ごとに順序を揃える。
- 小さな純粋ヘルパーやそのファイル内だけで使う型は、可読性を損なわない範囲で近くに置いてよい。複数コンポーネントで共有する純粋ロジックは `src/lib` へ切り出す。
- table/list 行の中に dropdown や popover を置く場合は、開いている項目を親側で管理し、開いている行だけ z-index を上げる。行 hover の `transform` は stacking context を作るため、dropdown 展開中の行や背面行が前面化しないよう hover/transform 条件を分ける。
- dropdown option の選択が背面要素に抜ける場合は、`pointerdown` で先に選択を確定し、`preventDefault()` / `stopPropagation()` で背面クリックを防ぐ。`click` 側にも最低限の伝播停止を残す。

## 検証

- コード編集後は `npm run lint` と `npm run format` を実行する。
- 手動確認が必要なフロントエンド作業では `npm run dev` を起動し、ローカル URL を報告する。
