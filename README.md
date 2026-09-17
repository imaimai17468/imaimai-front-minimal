# imaimai-front-minimal

フロントエンド開発の最小構成テンプレート。サーバーは持たず、API は Mock Service Worker が答える。

追加ツールの導入や外部サービスへの接続が通しにくい環境でも、フロントエンドの開発サイクル（実装、型、Lint、テスト、ビルド、コミット前チェック）と AI コーディングエージェントの運用が成立することを条件に選定している。具体的には次の 3 つを満たす。

- MCP サーバー、プラグイン、フックのいずれも使えないセッションで、同じ品質ゲートが回る
- チェックはすべて `package.json` の script として実行できる。人間もエージェントも同じコマンドを叩く
- 依存は npm レジストリから入るものだけ。ブラウザバイナリや専用 CLI のダウンロードを前提にしない

## クイックスタート

```bash
pnpm install     # 依存と lefthook のインストール
pnpm dev         # http://localhost:5173 で MSW 経由のモック API と一緒に起動
pnpm check       # フォーマット、Lint、型チェック
pnpm test        # Vitest（カバレッジのブランチゲート込み）
pnpm build       # 本番ビルド
```

Node は `.node-version`、pnpm は `package.json` の `packageManager` で固定している。

## スタック

| 分野 | 採用 | 理由 |
| --- | --- | --- |
| UI | React 19 | 前提 |
| ツールチェーン | Vite+ (`vp`) | dev サーバー、ビルド、Vitest、Oxlint、Oxfmt、型チェックが 1 つのパッケージと 1 つの設定ファイルに入る。個別に 5 つ入れて整合を取る作業がなくなる |
| パッケージマネージャ | pnpm | 前提。`packageManager` で版を固定 |
| ルーティング | TanStack Router | ファイルベースでルートが型として出る。ローダーが TanStack Query のキャッシュを直接埋められる |
| サーバー状態 | TanStack Query | 前提。再取得、キャッシュ、無効化をアプリ側に書かずに済む |
| API モック | MSW | 前提。dev とテストで同じハンドラを使うので、モックとテストのモックが二重管理にならない |
| 入力検証 | Zod | API レスポンスの境界デコードとフォーム検証を同じスキーマ言語で書ける |
| フォーム | React Hook Form + `@hookform/resolvers` | 再レンダリングを入力ごとに起こさない。Zod スキーマをそのまま resolver に渡せる |
| スタイル | Tailwind CSS v4 (`@tailwindcss/vite`) | トークンを CSS 変数で持てる。`.claude/rules/design.md` がそのトークン設計を前提に書かれている |
| テスト | Vitest + Testing Library + jsdom | `vp test` が Vitest を内蔵している。DOM を人の操作で駆動する |
| Lint / フォーマット | Oxlint / Oxfmt（Vite+ 同梱） | ESLint と Prettier を別々に入れる構成より設定が 1 か所で済み、実行が速い |
| 型 | TypeScript 7 + `vp check` の型認識 Lint | 型エラーと Lint が同じコマンドで出る |
| コミット前チェック | lefthook | pre-commit で staged ファイルの Lint とフォーマット確認、pre-push で `pnpm check` と `pnpm test` |
| CI | GitHub Actions | `pnpm check` / `pnpm test` / `pnpm build` の 3 ステップだけ。使えない環境では同じ 3 コマンドを手元で回せば等価 |

## AI コーディングエージェント向けの資産

| ファイル | 内容 |
| --- | --- |
| `AGENTS.md` | 指示の本体。ワークフロー、完了前に回すコマンド、型システムを迂回しない規約、コミットと PR の作法 |
| `CLAUDE.md` | `AGENTS.md` への参照 1 行 |
| `.claude/rules/data-fetching.md` | 1 本の読み書きを端から端まで（`apiFetch`、gateway の分割、デコード、クエリキー、無効化、モックハンドラの責任） |
| `.claude/rules/react.md` | React の純粋性、useEffect を使わない判断、コンポーネント分割、テスト可能な形、モジュール配置 |
| `.claude/rules/design.md` | デザイントークン、色、タイポグラフィ、余白、アニメーション |
| `.claude/rules/prose.md` | 返答、コミットメッセージ、コメント、ドキュメントの文章規約 |
| `.cursor/rules/*.mdc` | 上記 4 本へのシンボリックリンク。Cursor から同じ規約が読まれる |
| `.claude/agents/code-reviewer.md` | コミット前レビュー。未コミットの diff を読み、検出 → 重複排除 → 反証 → 報告の 4 段で回す |
| `.claude/skills/ticket-work/` | チケット単位の作業手順 7 ステップ |
| `.claude/skills/launch-checklist/` | 公開前チェックリスト（セキュリティ、SEO、OGP、パフォーマンス、a11y） |
| `.claude/skills/motion-craft/` | アニメーションとモーションの設計基準 |
| `.claude/skills/empirical-prompt-tuning/` | プロンプトやスキルを実測で改善する手順 |
| `.claude/settings.json` | 読み取り系と `pnpm` script の許可リストのみ。フックは設定していない |

## ライセンス

MIT
