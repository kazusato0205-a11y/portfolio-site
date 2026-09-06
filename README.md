# Portfolio Site

エンジニアを目指して学習中の **Haruna Endo** が制作した、自身の経歴・スキル・開発実績をまとめたポートフォリオサイトです。掲載内容を自分で更新できるよう、管理者向けのコンテンツ管理（CMS）機能を備えています。

## このプロジェクトで見てほしいポイント

- **フロントエンドとバックエンドの分離構成**（Next.js App Router + Express + Prisma）
- **Firebase Authentication による管理画面の保護** — 未認証で `/admin/*` にアクセスした場合、リダイレクトではなく **HTTP 404** を返す（管理画面の存在自体を隠す）
- **公開ページ／管理ページのレイアウト分離**（App Router のルートグループ）
- **画像アップロード**（multipart → サーバーでファイル保存、DB でメタデータ管理）
- **フロント／API 双方でのバリデーション**、共通フェッチ関数による API アクセスの一元化

> 掲載中のプロフィール画像・実績（Works）の画像は、データベースとローカルの `backend/public/uploads/` に保存されており、リポジトリには含まれません。`git clone` した環境では管理画面から登録し直す必要があります。

## 1. 要件定義

### 1.1 目的

- 自身のプログラミングスキルおよび制作物を外部（企業の採用担当者など）にアピールするため。
- 管理画面を通じて、掲載コンテンツを動的に更新可能にするため。

### 1.2 ターゲット層

- 採用担当者
- 現場のエンジニア・面接官

### 1.3 機能要件

#### パブリックエリア（一般ユーザー向けページ）

- **トップページ**
  - **プロフィールセクション:** 自己紹介文、画像
  - **実績（Works）セクション:** 制作物の一覧・詳細表示
  - **スキル（Skills）セクション:** 習得言語やフレームワークの一覧
- **コンタクトページ**
  - 問い合わせフォーム（※詳細な仕様は要検討）

#### プライベートエリア（管理者向けページ）

- **管理画面**
  - トップページのコンテンツ（プロフィール、実績、スキル）の編集・更新機能
  - 画像データの登録・更新機能（DBへの保存、または外部ストレージの利用）
- **認証・認可機能（Firebase Authentication）**
  - 管理者としてログインしたユーザーのみが管理画面にアクセス可能
  - **未認証ユーザーへの制御:** 認証されていないユーザーが管理画面のURLへアクセスした際、セキュリティ保護のためリダイレクトではなく **HTTPステータスコード 404（Not Found）** で応答する。

---

## 2. 技術スタック

課題要件に基づき、以下の技術を選択して開発を行います。

### 2.1 フロントエンド

- **言語:** TypeScript
- **フレームワーク:** Next.js (App Router)

### 2.2 バックエンド

- **言語:** TypeScript
- **フレームワーク:** Express.js
- **ORM:** Prisma
- **データベース:** PostgreSQL（またはMySQL）
- **構成:** フロントエンドアプリのサーバー機能（Next.jsのAPI Routes / Server Actionsなど）を経由してバックエンドアプリにアクセスする。

### 2.3 認証・インフラ

- **認証・認可:** Firebase Authentication（個人アカウント利用）
- **画像保持:** データベース（またはAWS S3などのストレージ）
- **環境変数管理:** FirebaseのConfig情報などはすべて環境変数（`.env`）で管理し、リポジトリには含めない。

---

## 3. 画面構成（ルーティング案）

- `/` : トップページ（プロフィール、実績、スキル、コンタクト）
- `/admin/login` : 管理者ログインページ
- `/admin/dashboard` : 管理画面（コンテンツ編集・画像アップロード）
  - ※未認証時は404を返す制御を実装

---

## 4. 起動手順

### 4.1 前提条件

以下がインストール済みであること。

- [Node.js](https://nodejs.org/) v20 以上
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

---

### 4.2 環境変数の設定

各ディレクトリの `.env.example` をコピーして作成し、値を埋めます。

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

#### `backend/.env`

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/portfolio_db"

FIREBASE_PROJECT_ID="your-project-id"
FIREBASE_CLIENT_EMAIL="your-client-email"
FIREBASE_PRIVATE_KEY="your-private-key"
```

#### `frontend/.env.local`

```env
BACKEND_URL="http://localhost:4000/api"

NEXT_PUBLIC_FIREBASE_API_KEY="your-api-key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-project.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
NEXT_PUBLIC_FIREBASE_APP_ID="your-app-id"
```

> ⚠️ `.env` と `.env.local` は `.gitignore` に含まれています。リポジトリにはコミットしないでください。

---

### 4.3 初回セットアップ

```bash
# 1. 依存パッケージをインストール
cd frontend && npm install
cd ../backend && npm install

# 2. データベースを起動（Docker）
cd .. && docker compose up -d

# 3. DBにテーブルを作成（マイグレーション）
cd backend && npm run db:migrate

# 4. Prisma クライアントを生成
npm run db:generate
```

---

### 4.4 開発サーバーの起動

プロジェクトルートで以下を実行すると、バックエンドとフロントエンドを **1コマンド** で同時起動できます。

```bash
npm run dev
# → backend:  http://localhost:4000
# → frontend: http://localhost:3000
```

> 個別に起動したい場合は各ディレクトリで `npm run dev` を実行してください。

---

### 4.5 起動確認

| URL | 内容 |
|---|---|
| `http://localhost:3000` | トップページ（一般向け） |
| `http://localhost:3000/contact` | コンタクトページ |
| `http://localhost:3000/admin/login` | 管理者ログインページ |
| `http://localhost:3000/admin/dashboard` | 管理ダッシュボード（要ログイン） |
| `http://localhost:4000/health` | バックエンド稼働確認 |

---

## 5. ディレクトリ構成

```
portfolio-site/
├── docker-compose.yml               # PostgreSQL をDockerで起動する設定
├── README.md                        # プロジェクト概要・要件定義（このファイル）
├── TASKS.md                         # 開発タスク一覧・進捗管理
│
├── frontend/                        # Next.js（画面側）
│   ├── proxy.ts                      # ルート保護（/admin/* への未認証アクセスを 404 で遮断）※Next.js 16 では middleware.ts ではなく proxy.ts が規約
│   ├── next.config.ts               # Next.js 設定（外部画像ドメイン許可等）
│   │
│   ├── app/                         # App Router のページ・API ルート
│   │   ├── layout.tsx               # ルートレイアウト（html/body のみ・Header/Footer なし）
│   │   ├── globals.css              # グローバルスタイル
│   │   │
│   │   ├── (marketing)/             # ルートグループ：一般公開ページ（URL に影響しない）
│   │   │   ├── layout.tsx           # 公開ページ共通レイアウト（Header・Footer を配置）
│   │   │   ├── page.tsx             # トップページ（Profile・Works・Skills を表示）
│   │   │   └── contact/
│   │   │       └── page.tsx         # コンタクトページ（問い合わせフォーム UI）
│   │   │
│   │   ├── admin/                   # 管理者エリア（middleware で認証保護）
│   │   │   ├── layout.tsx           # 管理画面レイアウト（Header/Footer なし）
│   │   │   ├── login/
│   │   │   │   └── page.tsx         # 管理者ログインページ（Firebase 認証）
│   │   │   └── dashboard/
│   │   │       ├── page.tsx         # 管理ダッシュボード（コンテンツ一覧・編集）
│   │   │       └── actions.ts       # Server Actions（プロフィール・実績・スキル・画像の CRUD）
│   │   │
│   │   └── api/
│   │       ├── auth/session/
│   │       │   └── route.ts         # POST: セッションクッキー発行 / DELETE: 削除
│   │       └── health/
│   │           └── route.ts         # GET: バックエンド接続確認
│   │
│   ├── components/                  # 再利用可能な UI コンポーネント
│   │   ├── Header.tsx               # ナビゲーションバー（公開ページ用）
│   │   ├── Footer.tsx               # フッター（公開ページ用）
│   │   ├── ProfileSection.tsx       # トップページ：プロフィール表示
│   │   ├── WorksSection.tsx         # トップページ：実績カードグリッド表示
│   │   ├── SkillsSection.tsx        # トップページ：スキル一覧（カテゴリ別）
│   │   └── admin/
│   │       ├── LogoutButton.tsx     # Firebase サインアウト＋クッキー削除ボタン
│   │       ├── ProfileEditForm.tsx  # プロフィール編集フォーム
│   │       ├── WorksEditSection.tsx # 実績の一覧・追加・削除
│   │       ├── SkillsEditSection.tsx# スキルの一覧・追加・削除
│   │       └── ImagesSection.tsx    # 画像のアップロード・アバター設定・削除
│   │
│   └── lib/                         # ユーティリティ・外部サービス連携
│       ├── api/
│       │   └── backend.ts           # Express API への共通フェッチ関数
│       ├── firebase/
│       │   └── client.ts            # Firebase 初期化（ブラウザ用クライアント SDK）
│       └── hooks/
│           └── useAuth.ts           # ログイン状態を監視するカスタムフック
│
└── backend/                         # Express.js（API サーバー側）
    ├── prisma/
    │   └── schema.prisma            # DB テーブル設計（Profile・Work・Skill・Image）
    └── src/
        ├── index.ts                 # Express サーバー起動・全ルーターの登録
        ├── lib/
        │   ├── prisma.ts            # Prisma クライアント初期化（DB 接続管理）
        │   ├── firebase-admin.ts    # Firebase Admin SDK 初期化（サーバー用）
        │   └── paths.ts             # アップロードディレクトリの絶対パス定義
        └── routes/
            ├── profile.ts           # GET・POST・PUT  /api/profile
            ├── works.ts             # GET・POST・PUT・DELETE  /api/works
            ├── skills.ts            # GET・POST・PUT・DELETE  /api/skills
            └── images.ts            # GET・POST・DELETE  /api/images
```
