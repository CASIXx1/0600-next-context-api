# Next Context API Project Context

## プロジェクト概要

- Turvo/Real TODO の UI と API を扱う Next.js App Router プロジェクト。
- デザイン参照元は `https://next-context-api.netlify.app/`。

## 構成

- App Router のルートは `src/app` 配下に置く。
- 共通レイアウトコンポーネントは `src/components/layout` 配下に置く。
- プロジェクト一覧やカードの UI は `src/components/projects` 配下に置く。
- 小さなフロントエンド共通ヘルパーは `src/lib` 配下に置く。
- API/datastore のコードは `src/app/api` 配下に置く。
- ユーザーから明示的な依頼がない限り、`src/app/api` 配下は変更しない。API レスポンスに不足がある場合も、まずフロントエンド側で吸収できる方法を検討する。
- SSR などの Next.js のサーバー描画機能は原則として使わず、既存のクライアント側実装方針に沿って実装する。

## レイヤードアーキテクチャ方針

- 厳密なディレクトリ分割より、依存方向と責務分離を優先する。
- Presentation 層は `src/app`、`src/components` に置く。
- Application 層は `src/contexts` に置く。画面固有の条件値、エラー表示、API 結果の state 反映もこの層の責務とする。
- Domain 層は必要になった時点で `src/domain` に置く。
- Infrastructure 層は `src/requests` に置く。
- API backend は `src/app/api` 配下に置き、フロントエンドのレイヤーから直接 import しない。
- 依存方向は原則として `presentation -> application -> domain -> infrastructure` とする。逆方向の依存や、UI から datastore/model への直接参照は避ける。
- `src/requests` には画面固有の固定値を持たせない。
- 更新系 API は、成功時に API レスポンスを state に反映する。楽観的更新は明示的に判断する。
- Infrastructure 層の API 境界型は `src/requests/<resource>/schema.ts` にまとめる。request params、response、response 内のネストした shape など、API が受け取る/返す構造を表す型を置く。
- Application 層の状態型、画面都合の派生値、エラー表示用の型は `schema.ts` に置かず、`src/contexts` 側で定義する。

## コンポーネント方針

- 重複した純粋ロジックは、コンポーネント配下ではなく `src/lib` に切り出す。
- sidebar 専用 UI は `src/components/layout/sidebar` 配下に置く。
- コンポーネントを切り出した場合、そのコンポーネントが所有するスタイルなら CSS module も分ける。
- `ProjectCard` は dashboard と project list の両方から使える状態を保つ。
- 複数階層で同じ値を使う場合は Context API を優先する。

## 型定義

- 型は `src/types` のような汎用置き場へ集約せず、使うページ・コンポーネント・API 境界の近くに置く。
- `src/requests` 配下の型ファイル名は原則 `schema.ts` とし、API schema ではない型まで混ぜない。
- `project.ts` のように配置場所で文脈が明確なファイルでは、型名に `ProjectCardProject` や `SidebarProject` のような利用箇所名を重ねず、原則 `Project` のような自然な名前にする。
