# Next Context API Project Context

## プロジェクト概要

- Turvo/Real TODO の UI と API を扱う Next.js App Router プロジェクト。
- デザイン参照元は `https://next-context-api.netlify.app/`。
- UI 変更は既存の `src/components` と `src/app` のコンポーネント境界に沿って行う。

## 構成

- App Router のルートは `src/app` 配下に置く。
- 共通レイアウトコンポーネントは `src/components/layout` 配下に置く。
- プロジェクト一覧やカードの UI は `src/components/projects` 配下に置く。
- 小さなフロントエンド共通ヘルパーは `src/lib` 配下に置く。例: `src/lib/date/format.ts`、`src/lib/projects/color.ts`。
- API/datastore のコードは `src/app/api` 配下に置く。
- UI 表示用のフォーマット処理は、API ドメインのロジックでない限り API model に混ぜない。
- ユーザーから明示的な依頼がない限り、`src/app/api` 配下は変更しない。API レスポンスに不足がある場合も、まずフロントエンド側で吸収できる方法を検討する。

## コンポーネント方針

- 重複した純粋ロジックは、コンポーネント配下ではなく `src/lib` に切り出す。
- sidebar 専用 UI は `src/components/layout/sidebar` 配下に置く。
- コンポーネントを切り出した場合、そのコンポーネントが所有するスタイルなら CSS module も分ける。
- `ProjectCard` は dashboard と project list の両方から使える状態を保つ。
- 同じ値を渡す場合は、複数階層にまたがるかどうかに関係なく、props drilling ではなく Context API を使用する。

## 型定義

- 型は `src/types` のような汎用置き場へ集約せず、使うページ・コンポーネント・API 境界の近くに置く。
- `project.ts` のように配置場所で文脈が明確なファイルでは、型名に `ProjectCardProject` や `SidebarProject` のような利用箇所名を重ねず、原則 `Project` のような自然な名前にする。
