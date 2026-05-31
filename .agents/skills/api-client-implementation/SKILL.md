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
   - 複数 resource で共通する API 境界型は `src/requests/schema.ts` に置く。
   - 一覧 API の response は `ListResponse<T>` のようなジェネリクスで表現し、共通の `PageInfo` を使う。
   - request は `src/requests/<resource>/client.ts` の resource client にまとめる。
   - `fetchProjects.ts` のような処理名ファイルにはしない。
   - resource client は `ProjectsClient`、`TasksClient` のように命名する。
   - HTTP 実行は `HttpRequester` に委譲する。
   - resource client は `private requester = new HttpRequester()` を持つ。
   - `HttpRequester` は `get` / `patch` など method 別 helper を公開する。
   - `fetch`、query string、JSON body、headers、`AbortController` は `HttpRequester` に集約する。
   - AbortError 判定は `HttpRequester` の低レベル `request` 内で行う。
   - `HttpRequester` の低レベル `request` は外から直接呼ばせない。
   - Infrastructure 層の型は `src/requests/<resource>/schema.ts` にまとめる。
   - resource 固有の `schema.ts` には resource の entity shape、request params、個別 response など、API が受け取る/返す構造を表す型を置く。
   - AbortError 判定 helper など、request 共通の中断処理は `src/requests/abort.ts` に置く。
   - `AbortableRequestResult` は `src/requests/abort.ts` の helper で生成する。
   - `status: "success"` などの result 直書きは避ける。
   - Abort 時は `undefined` ではなく `status: "aborted"` で返す。
   - resource client は `abort()` を公開し、`requester.abort()` に委譲する。
   - `src/contexts` に `AbortController` や signal を置かない。
   - Application 層の state 型、画面都合の派生値、エラー表示用の型は `schema.ts` に置かず、`src/contexts` 側で定義する。
2. 画面側の呼び出しを request 関数へ差し替える。
3. request 関数を呼び出す非同期処理は `async` / `await` と `try` / `catch` で書く。
   - `.then()` / `.catch()` のチェーンではなく、同期処理と同じ読み方で成功時、失敗時の分岐を表現する。
   - `useEffect` 内では async 関数を内側に定義し、`void init()` のように呼び出す。
   - `useEffect` 内の request は resource client を生成して実行し、cleanup 関数には `client.abort()` を明示的に書く。
   - `AbortError` は通常の通信失敗として扱わず、state 更新せずに抜ける。
   - context 側では `let` で次の state を詰め替えない。
   - `result.status === "success" ? ... : ...` で state 用の値を `const` 定義する。
   - `setState` は作成した `const` を渡す形にする。
   - 分岐は必要最小限にし、error message も `const` で決める。
4. 成功時、失敗時の state 更新を Application 層でつなぐ。
5. 不要になった画面内の `fetch` 関数や型を削除する。

## 検証

- コード編集後は `npm run lint` と `npm run format` を実行する。
- request 関数のシグネチャ変更では、呼び出し箇所を `rg` で確認する。
- build 確認が必要な場合は `AGENTS.md` の Verification に従う。
