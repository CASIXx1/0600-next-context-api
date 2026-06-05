---
name: form-implementation
description: フォーム UI、controlled component、FormData、submit 処理、フォーム値と API payload の責務分離を実装・レビューするときに使う。
---

# Form 実装手順

## 使い方

- この skill はフォーム入力、submit、validation、フォーム値の state 管理方針を扱う。
- API 実行や API 結果の state 反映は `api-client-implementation` と併用し、`src/contexts` の Context API / custom hook に寄せる。
- 見た目や CSS module は `ui-implementation` と併用する。

## 方針

- フォーム入力値は Presentation 層で扱う。API 実行、成功/失敗 state、API payload 固有値の補完は Application 層の `src/contexts` に置く。
- controlled component は `value` と `onChange` を必ずセットし、初期値は `useState(() => createInitialFormData())` のように遅延初期化する。
- `FormData` は単純な非制御フォームなら使ってよい。入力中の validation、条件付き UI、送信前 disabled 制御、入力値共有が必要なら controlled component を優先する。
- `kind` や `children` などユーザー入力ではない API payload 固有の固定値は、フォームコンポーネントではなく context hook 側で補完する。
- submit は `async` / `await` で書き、`.then()` / `.catch()` チェーンにしない。
- 送信中は button を `disabled` にして多重送信を防ぐ。ユーザー要件がなければ、一瞬で終わる処理に過剰な loading 文言は出さない。
- 成功後に modal を閉じるなどの局所 UI 状態は、フォームの親から `onCreated` / `onCancel` のような UI callback として渡してよい。

## 実装チェック

- input/select/textarea の `name` は残す。controlled component でもブラウザ補助、テスト、将来の `FormData` 利用に役立つ。
- select の値は文字列なので、union 型へ変換する helper を置く。
- 日付 input の値は `YYYY-MM-DD` を使う。画面表示用に `YYYY/MM/DD` を使う場合は submit 前に API 形式へ正規化する。
- 成功後にフォームを再利用する場合は、初期値生成関数で state をリセットする。
- フォーム値型は API schema ではなく、画面/Application の境界型として `src/contexts` 側に置く。
