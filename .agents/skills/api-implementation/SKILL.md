---
name: api-implementation
description: Next.js API route、datastore、レスポンス設計、swagger 整合の実装手順が必要なときに使う。
---

# API 実装手順

## 使い方

- この skill は API 実装の手順を扱う。
- プロジェクト概要、構成、コンポーネント方針、型定義は repo root の `AGENTS.md` から参照される `.agents/project.md` を確認する。
- ユーザーから明示的な依頼がない限り、`src/app/api` 配下は変更しない。

## 調査手順

1. 対象の route handler を読む。
2. route が使う datastore、model、pagination などの周辺コードを読む。
3. API の公開仕様に関わる変更では `src/app/api/v1/spec/swagger.yml/swagger.yml` を確認する。
4. UI 側の表示都合だけで API model を変更しようとしていないか確認する。

## 実装時の判断

- レスポンス形式を変える場合は、既存クライアントと swagger への影響を確認する。
- pagination、filter、sort などの共通処理は既存 model や helper の責務に合わせる。
- UI 表示用のフォーマット処理は、API ドメインのロジックでない限りフロントエンド側へ寄せる。
- API レスポンスに不足がある場合も、まずフロントエンド側で吸収できる方法を検討する。

## 検証

- コード編集後は `npm run lint` と `npm run format` を実行する。
- API 変更では、該当 endpoint の手動確認または既存テストでレスポンス形状を確認する。
- swagger を更新した場合は、実装レスポンスと仕様の項目名、型、必須項目が一致しているか確認する。
