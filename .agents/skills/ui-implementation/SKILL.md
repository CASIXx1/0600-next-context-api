---
name: ui-implementation
description: UI コンポーネント、CSS module、デザイン再現、画面表示の実装手順が必要なときに使う。
---

# UI 実装手順

## 使い方

- この skill は UI 実装の手順を扱う。
- プロジェクト概要、構成、コンポーネント方針、型定義は repo root の `AGENTS.md` から参照される `.agents/project.md` を確認する。

## デザイン再現の手順

1. まずローカルのコンポーネントと CSS module を読む。
2. 厳密な見た目合わせが必要な場合は、参照サイトと比較する。
   - 対象ページの HTML を取得する。
   - リンクされている `_next/static/css/*.css` を読む。
   - 構造が不明な場合は、関連する `_next/static/chunks/app/...` の chunk を確認する。
3. `font-size`、`font-weight`、`padding`、`margin`、`box-shadow`、色、flex/grid のレイアウト値は、根拠を持って参照サイトの値に合わせる。
4. 見た目を変えない範囲で、ローカル側のアクセシビリティ改善は維持する。例: 実際のリンク、ボタン、`aria-label`、`time dateTime`。

## 実装時の判断

- 変更前に対象コンポーネントと周辺の CSS module を読む。
- 既存の配置や命名に迷う場合は `.agents/project.md` の方針を優先する。
- API レスポンスに不足がある場合も、まずフロントエンド側で吸収できるかを検討する。

## 検証

- コード編集後は `npm run lint` と `npm run format` を実行する。
- 手動確認が必要なフロントエンド作業では `npm run dev` を起動し、ローカル URL を報告する。
