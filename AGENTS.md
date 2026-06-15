# Agent Instructions

このリポジトリで作業するエージェントは、まず以下のプロジェクト情報を参照してください。

- [Project Context](.agents/project.md)

プロジェクト概要、構成、設計方針などの情報は `AGENTS.md` から参照される Markdown に置きます。

実装手順や作業フローだけを、必要に応じて対応する skill に置きます。

## Plans

- 大きい全体プランと細かい個別プランがある場合は、同じファイルに混ぜず、`.air/plans` 配下で分けて管理します。
- 全体方針、移行順序、共通ルールは `.air/plans/<topic>.md` に置きます。
- 個別対象ごとの詳細、進捗、Acceptance Criteria、Verification は `.air/plans/<topic>/` または `.air/plans/<category>/` 配下の別ファイルに置きます。
- 個別プランが複数ある場合は README などの索引ファイルを置き、詳細ファイルへのリンクと進捗を一覧化します。
- `.agents/project.md` には長期の設計方針だけを残し、作業計画や進捗の詳細は混ぜません。
- skill には実装手順や判断フローだけを置き、プロジェクト固有の長期計画や進捗管理は置きません。

## Skills

- UI 実装、デザイン再現、コンポーネントや CSS module の変更では `ui-implementation` を使います。
- Atomic Design の分類、配置、既存コンポーネント移行では `atomic-design-implementation` を使います。
- フロントエンドから API を実行する `src/requests`、レスポンス型、API 結果の state 反映では `api-client-implementation` を使います。
- フォーム UI、controlled component、FormData、submit 処理、フォーム値と API payload の責務分離では `form-implementation` を使います。

## Verification

- 変更後は原則として `npm run lint` と `npm run format` を実行します。
- build 確認が必要な場合は `npm run build` を実行します。
- この環境では sandbox 内の `npm run build` が Turbopack の制限で失敗することがあります。典型的なエラーは `creating new process` / `binding to a port` / `Operation not permitted (os error 1)` です。
- 上記の Turbopack エラーが出た場合はコード起因として扱わず、同じ `npm run build` を `sandbox_permissions: "require_escalated"` で再実行して確認します。
- sandbox 内の build が長時間無出力で止まり、`.next/lock` を保持したままになる場合は、`lsof .next/lock` で該当プロセスを確認し、必要なら権限付きでその build プロセスを停止してから `npm run build` を権限付きで再実行します。
- dev server で手動確認する場合は、3000 番ポートが既存プロセスで使われていることがあるため、原則として `npm run dev -- -p 3001` のように明示的に別ポートを指定します。
- dev server を起動して確認した場合は、確認後にそのプロセスを停止して、起動したままにしません。
