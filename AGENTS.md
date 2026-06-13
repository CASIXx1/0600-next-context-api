# Agent Instructions

このリポジトリで作業するエージェントは、まず以下のプロジェクト情報を参照してください。

- [Project Context](.agents/project.md)

プロジェクト概要、構成、設計方針などの情報は `AGENTS.md` から参照される Markdown に置きます。

実装手順や作業フローだけを、必要に応じて対応する skill に置きます。

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
