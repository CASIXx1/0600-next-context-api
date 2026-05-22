---
name: api-client-implementation
description: フロントエンドの API client、src/requests、レスポンス型、API 結果の state 反映を実装するときに使う。
---

# API Client 実装手順

## 使い方

- この skill は API を実行するフロントエンド側の手順を扱う。
- 設計方針は `.agents/project.md` を優先する。
- backend API route、datastore、swagger は対象外。

## 調査手順

1. 対象画面の API 呼び出し箇所を読む。
2. 既存の `src/requests` 実装を読む。
3. 呼び出し条件、レスポンス利用箇所、エラー表示箇所を確認する。

## 実装手順

1. 必要な request 関数を `src/requests` に追加または更新する。
   - Infrastructure 層の型は `src/requests/<resource>/schema.ts` にまとめる。
   - `schema.ts` には request params、response、response 内のネストした shape など、API が受け取る/返す構造を表す型を置く。
   - Application 層の state 型、画面都合の派生値、エラー表示用の型は `schema.ts` に置かず、`src/contexts` 側で定義する。
2. 画面側の呼び出しを request 関数へ差し替える。
3. request 関数を呼び出す非同期処理は `async` / `await` と `try` / `catch` で書く。
   - `.then()` / `.catch()` のチェーンではなく、同期処理と同じ読み方で成功時、失敗時の分岐を表現する。
   - `useEffect` 内では async 関数を内側に定義し、`void init()` のように呼び出す。
   - `try` / `catch` は request の成功/失敗を変数に詰める範囲に絞り、`setState` は原則として `try` / `catch` の外で行う。
4. 成功時、失敗時の state 更新を Application 層でつなぐ。
5. 不要になった画面内の `fetch` 関数や型を削除する。

## 検証

- コード編集後は `npm run lint` と `npm run format` を実行する。
- request 関数のシグネチャ変更では、呼び出し箇所を `rg` で確認する。
- build 確認が必要な場合は `AGENTS.md` の Verification に従う。
