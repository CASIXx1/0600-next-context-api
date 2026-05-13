---
name: next-context-api
description: この Next.js Turvo/Real TODO プロジェクトで作業するときに使う。特に参照サイトのデザイン再現、project/sidebar/card コンポーネントの編集、共通 UI ユーティリティの変更で使う。
---

# Next Context API プロジェクト

## プロジェクト概要

- Turvo/Real TODO の UI と API を扱う Next.js App Router プロジェクト。
- デザイン参照元は `https://next-context-api.netlify.app/`。
- ユーザーが見た目の再現を求めた場合は、参照サイトで配信されている HTML/CSS の値に合わせる。
- UI 変更は既存の `src/components` と `src/app` のコンポーネント境界に沿って行う。

## 構成

- App Router のルートは `src/app` 配下に置く。
- 共通レイアウトコンポーネントは `src/components/layout` 配下に置く。
- プロジェクト一覧やカードの UI は `src/components/projects` 配下に置く。
- 小さなフロントエンド共通ヘルパーは `src/lib` 配下に置く。例: `src/lib/date/format.ts`、`src/lib/projects/color.ts`。
- API/datastore のコードは `src/app/api` 配下に置く。UI 表示用のフォーマット処理は、API ドメインのロジックでない限り API model に混ぜない。
- ユーザーから明示的な依頼がない限り、`src/app/api` 配下は変更しない。API レスポンスに不足がある場合も、まずフロントエンド側で吸収できる方法を検討する。

## デザイン再現の手順

1. まずローカルのコンポーネントと CSS module を読む。
2. 厳密な見た目合わせが必要な場合は、参照サイトと比較する。
   - 対象ページの HTML を取得する。
   - リンクされている `_next/static/css/*.css` を読む。
   - 構造が不明な場合は、関連する `_next/static/chunks/app/...` の chunk を確認する。
3. `font-size`、`font-weight`、`padding`、`margin`、`box-shadow`、色、flex/grid のレイアウト値は、根拠を持って参照サイトの値に合わせる。
4. 見た目を変えない範囲で、ローカル側のアクセシビリティ改善は維持する。例: 実際のリンク、ボタン、`aria-label`、`time dateTime`。

## コンポーネント方針

- 重複した純粋ロジックは、コンポーネント配下ではなく `src/lib` に切り出す。
- sidebar 専用 UI は `src/components/layout/sidebar` 配下に置く。
- コンポーネントを切り出した場合、そのコンポーネントが所有するスタイルなら CSS module も分ける。
- `ProjectCard` は dashboard と project list の両方から使える状態を保つ。
- 同じ値を渡す場合は、複数階層にまたがるかどうかに関係なく、props drilling ではなく Context API を使用する。
- 一時的な値を増やすより、`src/app/globals.css` の既存 CSS 変数を優先する。

## 型定義

- 型は `src/types` のような汎用置き場へ集約せず、使うページ・コンポーネント・API 境界の近くに置く。
- `project.ts` のように配置場所で文脈が明確なファイルでは、型名に `ProjectCardProject` や `SidebarProject` のような利用箇所名を重ねず、原則 `Project` のような自然な名前にする。
- Context など複数箇所へ値を提供する境界では、コンポーネント専用の `Project` 型を import alias で合成しない。Context 自身の近くに提供データの型を別で定義し、各コンポーネントは構造的に必要な subset を受け取る。

## 検証

- コード編集後は `npm run lint` と `npm run format` を実行する。
- ルート、コンポーネント、TypeScript に影響する変更では `npm run build` を実行する。
- build や dev server が sandbox のポート bind 制限で失敗した場合は、権限付きで再実行する。
- 手動確認が必要なフロントエンド作業では `npm run dev` を起動し、ローカル URL を報告する。
