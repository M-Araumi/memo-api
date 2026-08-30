# memo-api

## 概要

TypeScriptとHonoを使用して作成したメモ管理APIです。

メモの作成・取得・更新・削除をREST APIとして実装し、データの永続化にはSQLiteを使用しています。

APIの実装ではORMを使用せず、SQLを直接記述することで、SQLやデータベースの基本的な仕組みを理解することを目的としています。

## 使用技術

| カテゴリ            | 技術             | バージョン   |
| --------------- | -------------- | ------- |
| Runtime         | Node.js        | 24.14.0 |
| Language        | TypeScript     | 7.0.2   |
| Framework       | Hono           | 4.13.2  |
| Database        | SQLite         | -       |
| Database Driver | better-sqlite3 | 13.0.3  |
| Test            | Vitest         | 4.1.10  |
| Package Manager | npm            | 11.9.0  |

## 機能

以下のメモ管理機能を実装しています。

* メモ一覧取得
* メモ詳細取得
* メモ新規作成
* メモ更新
* メモ削除
* 入力値バリデーション
* エラーハンドリング
* SQLiteによるデータ永続化

## ディレクトリ構成

```text
memo-api/
├── src/
│   ├── app.ts
│   ├── index.ts
│   ├── db/
│   │   ├── database.ts
│   │   └── memoSql.ts
│   ├── types/
│   │   └── types.ts
│   └── validators/
│       └── memoValidator.ts
├── __tests__/
│   └── memo.test.ts
├── docs/
│   ├── database-design.md
│   └── week03.md
├── memo.db
├── package.json
├── package-lock.json
├── tsconfig.json
└── README.md
```

### 各ディレクトリ・ファイルの役割

* `src/app.ts`

  * HonoによるAPIのルーティングとリクエスト処理を担当
* `src/index.ts`

  * サーバーの起動処理を担当
* `src/db/database.ts`

  * SQLiteデータベースへの接続を管理
* `src/db/memoSql.ts`

  * メモに対するSQL処理を担当
* `src/types/`

  * データ型を定義
* `src/validators/`

  * 入力値のバリデーション処理を担当
* `__tests__/`

  * APIのテストコードを配置
* `docs/`

  * データベース設計や学習内容を記録

## データベース

SQLiteを使用してメモを永続化しています。

`memos`テーブルには以下の項目を定義しています。

| カラム        | 型    | 説明   |
| ---------- | ---- | ---- |
| id         | TEXT | メモID |
| title      | TEXT | タイトル |
| memo_text  | TEXT | 本文   |
| created_at | TEXT | 作成日時 |
| updated_at | TEXT | 更新日時 |

メモIDには`crypto.randomUUID()`で生成したUUIDを使用しています。

データベースへのアクセスには`better-sqlite3`を使用し、ORMを使用せずSQLを直接記述しています。

## 設計方針

### SQLを直接記述する

データベース操作にはORMを使用せず、SQLを直接記述しています。

SQLの基本構文やデータベースとのデータのやり取りを理解することを目的としています。

### 処理ごとに責務を分離する

APIのルーティング処理とデータベース操作、バリデーション処理を分離しています。

これにより、それぞれの処理の役割を明確にし、コードの可読性や保守性を高めています。

### エラーレスポンスを統一する

APIでエラーが発生した場合は、エラーコードとメッセージを含むJSON形式でレスポンスを返すようにしています。

### SQLiteによるデータ永続化

これまでのメモリ上でのデータ管理からSQLiteによるデータ管理へ変更し、サーバーを再起動してもメモデータが保持される構成としています。

## テスト

Vitestを使用してAPIのテストを実施しています。

以下のケースをテストしています。

* メモ一覧取得
* ID指定取得
* メモ新規作成
* メモ更新
* メモ削除
* 不正な入力
* 存在しないID
* 想定外エラー時のレスポンス形式

テストは以下のコマンドで実行できます。

```bash
npm test
```

## セットアップ

### 1. リポジトリをクローン

```bash
git clone https://github.com/M-Araumi/memo-api.git
cd memo-api
```

### 2. パッケージをインストール

```bash
npm install
```

### 3. 開発サーバーを起動

```bash
npm run dev
```

サーバーは`http://localhost:3000`で起動します。

## ビルド

TypeScriptをコンパイルする場合は以下を実行します。

```bash
npm run build
```

ビルド後は以下のコマンドで起動できます。

```bash
npm start
```

## 今後の改善予定

* APIとデータベース処理のさらなる責務分離
* エラーハンドリングの共通化
* バリデーション処理のさらなる整理
* テストケースの追加
* Next.jsのフロントエンドとのAPI連携
