# Design Document: JSON Formatter

## Overview

JSON 整形ツールは、開発者がクリップボードの内容を素早く整形・確認できる Web アプリケーションです。
React + Bun の構成で動作し、**TanStack Router** を用いて `/json` でアクセス可能にします。
メインナビゲーションはヘッダーに配置し、ツール固有の履歴はサイドバーに表示します。
UI コンポーネントライブラリとして **shadcn/ui** を採用します。

## Architecture

### System Overview

- **Frontend Framework**: React 19
- **Runtime/Server**: Bun (serving static assets + SPA fallback)
- **Routing**: `TanStack Router` (Client-side routing with type safety)
- **State Persistence**: `localStorage` (Browser)
- **UI Component Library**: `shadcn/ui` (Radix UI + Tailwind CSS)

### Directory Structure (Feature Sliced)

```
src/
  features/
    json-formatter/
      components/
        JsonEditor.tsx (Input/Output view)
        HistoryList.tsx
        ActionToolbar.tsx
      hooks/
        useJsonHistory.ts
      routes/
        json-route.tsx (Route definition)
  libs/
    local-storage/
      useLocalStorage.ts
  ui/ (General UI Components & Layouts)
    layout/
      Header.tsx (Global Navigation)
      Sidebar.tsx (Tool History container)
      MainLayout.tsx
    components/ (shadcn/ui components)
      button.tsx
      textarea.tsx
      scroll-area.tsx
      ...
  routes/
    __root.tsx
    index.tsx
  main.tsx (Entry point)
```

## Components and Interfaces

### 1. Main Layout

アプリ全体のレイアウトを管理します。

- **Header**: ツール間の切り替え（Home, JSON Formatter, etc.）
- **Sidebar**: ページごとにコンテンツを出し分けられるように設計（JSON Formatter ページでは履歴を表示）
- **Content Area**: メインの作業領域

### 2. JSON Formatter Feature (`/json`)

- **State**:
  - `input`: string (現在の入力テキスト)
  - `output`: string | null (整形済み JSON、エラー時は null またはエラーメッセージ)
  - `history`: Array<{ id: string, timestamp: number, content: string }>

### 3. Features

#### Clipboard Integration

- `navigator.clipboard.readText()` を使用してクリップボードから読み取り。
- `navigator.clipboard.writeText()` を使用して整形結果をコピー。
- 権限エラー時のフォールバックとして、テキストエリアへの手動ペーストも許容。

#### JSON Processing

- `JSON.parse()` と `JSON.stringify(obj, null, 2)` を使用。
- エラーハンドリングを行い、パースエラー時はユーザーに通知。

#### History Management

- 最大保存件数: 50 件
- 重複排除: 内容が完全に一致する最新のものは追加しない（あるいはタイムスタンプのみ更新）。
- サイドバーにリスト表示。

## Data Models

### HistoryItem

```typescript
interface HistoryItem {
  id: string; // UUID or timestamp-based ID
  timestamp: number; // Created at
  content: string; // The raw JSON content
  preview: string; // Short preview text (first N chars)
}
```

## Error Handling

- **Invalid JSON**: パースエラー時は、エラー位置やメッセージを表示エリア（またはトースト/アラート）に表示。
- **Clipboard Access Denied**: 権限がない場合、手動ペーストを促すメッセージを表示するか、単にボタンが動作しない理由を明示する。

## Testing Strategy

- **Unit Tests**:
  - JSON 整形ロジックのテスト
  - History 管理ロジック（追加、削除、制限）のテスト
- **Component Tests**:
  - ボタンクリック時のイベントハンドラ呼び出し確認
  - エラー時の表示確認

## Library Decisions

- **Routing**: `TanStack Router`
  - Type-safe routing のために採用。
- **UI**: `shadcn/ui`
  - モダンでカスタマイズ可能なコンポーネントセット。Tailwind CSS ベース。
- **Icons**: `lucide-react`
  - shadcn/ui との相性が良いため。
- **Syntax Highlighting**: `react-syntax-highlighter` or similar simple component.
  - メンテナンス性と React 19 対応を考慮。
