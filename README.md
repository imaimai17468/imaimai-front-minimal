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

### 入れていないもの

必要になった時点で足す。ここに挙げたものは、この構成に追加しても他の選定を崩さない。

| 分野 | 判断 |
| --- | --- |
| UI プリミティブ（shadcn/ui） | `src/components/ui/` を空けてある。`shadcn` CLI はレジストリへの通信が必要なので、通らない環境ではコンポーネントのソースを手で置く。アニメーションユーティリティが必要なら `tw-animate-css` を追加する |
| E2E | Playwright はブラウザバイナリのダウンロードが前提。それが通る環境でのみ追加する。通らない場合は Testing Library でのコンポーネントテストと手動確認に寄せる |
| グローバル状態管理 | サーバー状態は TanStack Query、URL 状態は Router の search params、ローカル状態は `useState` / `useReducer` で足りる。足りない場面が出てから Zustand などを検討する |
| i18n | 多言語化の要件が出てから。`src/entities/` のメッセージが日本語固定であることが前提になっている |
| エラー監視 | Sentry などは外部送信を伴うので、送信先の許可が取れてから |
| 未使用コード検出 | `knip` を追加すると死んだ export を落とせる。CI が 1 ステップ増える |
| Storybook / ビジュアルリグレッション | コンポーネントの数がこの規模を超えてから |

## サンプルアプリ

メモの一覧と追加だけのアプリが、選定した各ツールの担当範囲を 1 周する形で入っている。

- `src/routes/index.tsx` … ローダーが `queryClient.query` でキャッシュを埋め、コンポーネントが `useSuspenseQuery` で読む
- `src/gateways/note/` … `read.ts` が取得とクエリオプション、`write.ts` が作成。レスポンスは Zod スキーマでデコードする
- `src/components/features/note-form/` … React Hook Form と Zod、`useMutation` の成功時にキー単位で無効化
- `src/mocks/` … MSW のハンドラとインメモリのデータ。dev とテストの両方がここを叩く

削って作り始める場合は、`src/entities/note.ts`、`src/gateways/note/`、`src/components/features/`、`src/mocks/handlers.ts` の 4 か所が入れ替え対象になる。

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

MCP サーバー、プラグイン、フックを前提とするスキルは持ち込んでいない。Lighthouse や Chrome DevTools の MCP に依存していたチェック項目は、手で確認する手順に書き換えてある。

## 制限環境で引っかかる箇所

- **npm レジストリ**: `pnpm install` だけは通信が必要。社内ミラーを使う場合は `.npmrc` に `registry=` を足す
- **Vite の重複**: pnpm では `vite` のエイリアスを `pnpm-workspace.yaml` の `overrides` に書くだけでは足りず、`devDependencies` にも `"vite": "npm:@voidzero-dev/vite-plus-core@<version>"` を直接置く必要がある。置かないとプラグインの peer 解決が素の Vite を引き込み、Vite が 2 つ入った状態になる。`vite-plus` を上げるときは、この 2 か所と `vitest` のピン（`pnpm exec vp --version` が表示する版）を揃えて更新する
- **MSW のワーカー**: `public/mockServiceWorker.js` はコミット済み。`msw` を上げたら `pnpm msw:init` で再生成する。このファイルは `dist/` にもコピーされるが、`src/main.tsx` が `import.meta.env.DEV` の分岐の中でしか読み込まないので、本番バンドルに MSW 自体は入らない
- **`VITE_` 接頭辞**: `.env` の値はビルド後のバンドルから読める。資格情報を置く場所ではない
- **GitHub Actions が使えない場合**: `pnpm check`、`pnpm test`、`pnpm build` の 3 つが CI の全内容なので、手元かローカルのランナーで同じ順に実行すれば等価になる

## ライセンス

MIT
