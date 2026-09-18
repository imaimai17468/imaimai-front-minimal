# imaimai-front-minimal

フロントエンド開発の最小構成テンプレート。Next.js App Router をベースとし、API は Mock Service Worker が答える。

追加ツールの導入や外部サービスへの接続が通しにくい環境でも、フロントエンドの開発サイクル（実装、型、Lint、テスト、ビルド、コミット前チェック）と AI コーディングエージェントの運用が成立することを条件に選定している。具体的には次の 3 つを満たす。

- MCP サーバー、プラグイン、フックのいずれも使えないセッションで、同じ品質ゲートが回る
- チェックはすべて `package.json` の script として実行できる。人間もエージェントも同じコマンドを叩く
- 依存は npm レジストリから入るものだけ。ブラウザバイナリや専用 CLI のダウンロードを前提にしない

## 想定する制約環境

エージェント実行環境として想定する最も厳しいケースは、以下の制約がすべて揃ったセッションである。このリポジトリはその環境でも開発サイクルが止まらないように選定している。

| 制約 | このリポジトリの対応 |
| --- | --- |
| MCP サーバーなし | ファイル読み書き・シェル実行はエージェント組み込みツールで完結する。外部 MCP プロバイダに依存する手順はない |
| プラグインなし | スキルとルールは `.claude/` 以下のテキストファイルで管理する。プラグイン機能を前提にしない |
| フックなし | pre-commit / pre-push は lefthook が担う。エージェントセッション側のフック設定を前提にしない |
| モデル・推論レベルの制限 | AGENTS.md の指示は特定のモデルや高推論設定を前提にしない。どのモデルでも同じコマンドと手順で動く |
| ブラウザ自動化なし | ビジュアル確認は不可として扱う。DOM は Testing Library で人の操作に近い形で駆動し、`pnpm build` でバンドル上の問題を拾う |
| ネットワーク制限 | 依存は npm レジストリから入るものだけ。プライベートレジストリ・社内 CDN・ブラウザバイナリのダウンロードを前提にしない |
| Web ツールなし | 外部ドキュメントを参照できない場合は `node_modules/` 以下のソースを典拠にする。AGENTS.md の「Degraded Environments」セクションが手順を定める |

## クイックスタート

```bash
pnpm install              # 依存のインストール（ignore-scripts により audit も自動実行）
pnpm exec lefthook install  # git フックを登録（ignore-scripts のため手動で一度だけ実行）
pnpm dev         # http://localhost:3000 で MSW 経由のモック API と一緒に起動
pnpm check       # フォーマット、Lint、型チェック
pnpm test        # Vitest（カバレッジのブランチゲート込み）
pnpm doctor      # React Doctor のプロジェクト診断（出力が無ければ検出なし）
pnpm build       # 本番ビルド
```

Node は `.node-version`、pnpm は `package.json` の `packageManager` で固定している。

## スタック

「最小構成」は追加ツールや外部サービスへの依存を最小にする、という意味であってスタックを削ぎ落とした、という意味ではない。Next.js 自体は大きなフレームワークだが、エコシステムが広く社内で扱える人が多い技術でなければ採用申請が通りにくい環境を想定している。選定の軸は軽さではなく、制約の多い組織でも承認を得やすく、かつ開発サイクルが止まらないことにある。

| 分野 | 採用 | 理由 |
| --- | --- | --- |
| UI | React 19 | 前提 |
| ツールチェーン | Next.js | App Router、Server Components、インクリメンタルビルドが 1 パッケージに入る |
| パッケージマネージャ | pnpm | 前提。`packageManager` で版を固定 |
| ルーティング | Next.js App Router | ファイルベース。Server Components と Client Components の境界をルート単位で決められる |
| サーバー状態 | TanStack Query | 前提。再取得、キャッシュ、無効化をアプリ側に書かずに済む |
| API モック | MSW | 前提。dev とテストで同じハンドラを使うので、モックとテストのモックが二重管理にならない |
| 入力検証 | Zod | API レスポンスの境界デコードとフォーム検証を同じスキーマ言語で書ける |
| フォーム | React Hook Form + `@hookform/resolvers` | 再レンダリングを入力ごとに起こさない。Zod スキーマをそのまま resolver に渡せる |
| スタイル | Tailwind CSS v4 (`@tailwindcss/postcss`) | トークンを CSS 変数で持てる。`.claude/rules/design.md` がそのトークン設計を前提に書かれている |
| テスト | Vitest + Testing Library + jsdom | `pnpm test` が `vitest run --coverage` を呼ぶ。DOM を人の操作で駆動する |
| Lint / フォーマット | Oxlint / Oxfmt | ESLint と Prettier を別々に入れる構成より設定が 1 か所で済み、実行が速い |
| 型 | TypeScript 7 + `tsc --noEmit` | `pnpm check` が Oxlint と oxfmt と合わせて型エラーを出す |
| React の静的診断 | React Doctor + `oxlint-plugin-react-doctor` | クリーンアップ漏れの effect、再レンダリング、a11y、セキュリティなど 1 ファイルで判定できる規則は Oxlint プラグインとして `pnpm check` の中で出る。循環 import、未使用の依存と export、pnpm のインストール設定のような複数ファイルにまたがる診断は `pnpm doctor` が出す |
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
| `.claude/skills/empirical-prompt-tuning/` | プロンプトやスキルを実測で改善する手順 |
| `.claude/skills/security-audit/` | セキュリティ監査スキル。ガイダンスモード（質問・調査）とフル監査モード（6 フェーズ・レポート生成）を持つ。明示的な監査依頼でのみフルモードが走る |
| `.claude/settings.json` | 読み取り系と `pnpm` script の許可リストのみ。フックは設定していない |

## ライセンス

MIT
