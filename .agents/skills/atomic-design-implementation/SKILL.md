---
name: atomic-design-implementation
description: Atomic Design を導入し、atoms/molecules/organisms/templates/pages の分類、既存コンポーネント移行、UI 責務分離を判断・実装するときに使う。
---

# Atomic Design 実装手順

## 使い方

- この skill は Atomic Design の分類、配置、移行判断を扱う。
- 見た目や CSS module の実装は `ui-implementation` と併用する。
- フォームは `form-implementation`、API/state 反映は `api-client-implementation` と併用する。
- 設計方針は `.agents/project.md` を優先する。

## 導入方針

- 既存 UI を一括移動しない。新規作成・変更対象から段階的に Atomic Design へ寄せる。
- 分類は見た目の小ささだけでなく、依存方向と再利用範囲で決める。
- `src/app` は App Router の page/content orchestration に限定し、Atomic Design の `pages` は原則 `src/app` で表現する。
- API 実行、Context API、router 操作、URL query 操作は atoms/molecules に入れない。必要なら organisms 以上、または route content 側に置く。
- CSS module はコンポーネント所有で同じ粒度に置く。移動時は import path と CSS module 名を合わせる。
- Atomic Design 配下のコンポーネントはディレクトリを import 境界にし、本体を `index.tsx` に置く。`Component.tsx` を `index.ts` で re-export する構成は使わない。
- atoms/molecules/organisms/templates のすべてで `index.tsx` に直接コンポーネントを定義する。`src/components/atoms/Button/index.tsx` と同じ形式に揃え、`src/components/atoms/StatIcon` のように別ファイルを `index.ts` から re-export する構成にしない。
- atoms/molecules の props では `ComponentPropsWithoutRef` を使わない。HTML 要素の属性を受ける場合は対象要素ごとの React 型を明示し、独自 props と交差させる。

## 配置

- `src/components/atoms`: 単一 UI 要素。Button、Input、Textarea、Select、IconButton、Badge、FieldLabel など。
- `src/components/molecules`: atoms を組み合わせた小さな UI。FormField、SelectField、EditableField、ConfirmPanel、Pagination など。
- `src/components/organisms`: domain data や context hook に近い大きな UI。Header、Sidebar、TaskTable、TaskDetailForm、TaskCreateForm、ProjectList など。
- `src/components/templates`: 画面レイアウトの枠。DashboardLayout、ListLayout、DetailLayout など。必要になるまで作らない。
- `src/app/<route>`: Next.js の page/content。route params/search params を受け、context hook や Provider を組み合わせる orchestration を担当する。
- domain 固有 UI を残す場合は `src/components/<domain>` を一時的な移行元として扱い、触るタイミングで Atomic Design 配下へ移す。

## 分類ルール

- atoms は domain 型、context hook、router、API client に依存しない。
- molecules は domain 型をできるだけ持たず、props で値と handler を受け取る。フォーム UI の小部品はここに置く。
- organisms は Context API / custom hook を読んでよい。ただし API client を直接生成しない。
- templates は data fetching や mutation を持たず、slot/children でレイアウトを組む。
- pages は `src/app` 側で扱い、Atomic Design 用の `pages` ディレクトリは作らない。

## 移行手順

1. 変更対象コンポーネントの責務を読む。
2. atoms/molecules に切り出せる純粋 UI を先に分離する。
3. 選んだ atom/molecule と同じ粒度の CSS module は同一作業で移動してよい。
4. domain data や context hook を読む部分は organisms に残す。
5. route params/search params、Provider 合成、navigation は `src/app/<route>/content.tsx` に残す。
6. import path を更新し、CSS module も移動先コンポーネントと同じ粒度にする。
7. 既存 UI の見た目を変えない。Atomic Design 移行とデザイン変更を同時に行わない。
8. 残った利用箇所や別種類の atom/molecule は次フェーズの作業として記録し、同じ変更に含めない。
9. 移行後は `rg` で旧 import と旧ファイル参照が残っていないか確認する。

## 判断例

- `TaskSelect`: 汎用 select UI なら molecules。タスク status 固有 option を内包するなら organisms または tasks domain に残す。
- `EditableField`: domain 非依存なら molecules。
- `TaskCreateForm`: `useCreateTask` や `useProjects` を読むなら organisms。FormField や Button は atoms/molecules に分解できる。
- `TaskDetailForm`: task detail context を読むため organisms。確認 UI は molecules の `ConfirmPanel` に切り出し可能。
- `ProjectCard`: project data に依存する domain organism。純粋な Card shell は molecule/atom に切り出し可能。
- `Header` / `Sidebar`: layout organisms。
- `Pagination`: URL 生成を props で受ける汎用 UI なら molecules。

## 禁止事項

- Atomic Design 移行を理由に `src/contexts` や `src/requests` の責務を UI コンポーネントへ戻さない。
- atoms/molecules から `src/requests`、`src/app/api`、datastore を import しない。
- 大量のファイル移動を一度に行わない。レビュー可能な単位で移行する。
- 名前だけ atoms/molecules にして責務が変わっていない移動は避ける。
