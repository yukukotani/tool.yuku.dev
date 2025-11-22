# Requirements Document

## Introduction

Web ベースのシンプルな開発者向けツール集の第一弾として、JSON 整形ツールを実装します。
ユーザーはクリップボードの内容を簡単に貼り付けて、整形・シンタックスハイライトされた JSON を確認できます。
また、過去の整形履歴をサイドバーから参照できるようにし、履歴はローカルストレージに保存します。

## Requirements

### Requirement 1: JSON Formatter Interface

**User Story:** 開発者として、クリップボードにある乱雑な JSON を見やすく整形したい、そうすることでデータの構造を素早く理解したい。

#### Acceptance Criteria

1. WHEN ユーザーが `/json` にアクセスする THEN JSON 整形ツールのメイン画面が表示される
2. WHEN ユーザーが「クリップボードから貼り付け」ボタンをクリックする THEN クリップボードのテキストが入力エリアに挿入される
3. WHEN 有効な JSON が入力される THEN JSON が整形（プリティプリント）され、シンタックスハイライトされて表示される
4. WHEN 無効な JSON が入力される THEN エラーメッセージが表示される
5. WHEN ユーザーが整形された JSON をコピーするボタンをクリックする THEN 整形済み JSON がクリップボードにコピーされる

### Requirement 2: Formatting History

**User Story:** 開発者として、以前に整形した JSON データを再度参照したい、そうすることで同じデータを何度も取得・ペーストする手間を省きたい。

#### Acceptance Criteria

1. WHEN JSON が正常に整形される THEN その内容が履歴リストに追加される
2. WHEN 履歴リストの項目をクリックする THEN その JSON がメイン表示エリアに読み込まれる
3. IF 履歴がローカルストレージに存在する THEN ページロード時にサイドバーに履歴が表示される
4. WHEN 新しい履歴が追加される AND 履歴数が上限（例: 50 件）を超える THEN 最も古い履歴が削除される
5. WHEN ユーザーが履歴クリアボタンを押す THEN 全ての履歴が削除される

### Requirement 3: Navigation & Layout

**User Story:** ユーザーとして、将来的に追加される他のツールとも容易に行き来したい。

#### Acceptance Criteria

1. WHEN ユーザーがツールにアクセスする THEN サイドバー（またはナビゲーション）に「JSON Formatter」へのリンクが表示される
2. WHEN サイドバーの履歴とツール切り替えメニューが共存する THEN 明確に区別されて表示される
