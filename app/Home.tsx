import type { InferRouteHandler } from '@remix-run/fetch-router'
import { routes } from './routes.ts'
import { render } from './utils/render.ts'
import { Layout } from './layout.tsx'

export const Home: InferRouteHandler<typeof routes.home> = () => {
  return render(
    <Layout>
      <div
        css={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "2rem",
          padding: "5rem 0",
          textAlign: "center",
        }}
      >
        <h1
          css={{
            fontSize: "2.25rem",
            fontWeight: "bold",
            letterSpacing: "-0.025em",
          }}
        >
          Developer Tools
        </h1>
        <p
          css={{
            fontSize: "1.25rem",
            color: "#6b7280",
            maxWidth: "600px",
          }}
        >
          シンプルで高速、プライバシー重視の開発者向けツール。
          すべてのデータはブラウザ内で処理されます。
        </p>
        <div css={{ display: "flex", gap: "1rem" }}>
          <a
            href={routes.json.href()}
            css={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "0.375rem",
              backgroundColor: "#1f2937",
              padding: "0.75rem 2rem",
              fontSize: "0.875rem",
              fontWeight: 500,
              color: "#ffffff",
              boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
              transition: "background-color 0.2s",
              "&:hover": {
                backgroundColor: "#374151",
              },
            }}
          >
            JSON Formatter を開く
          </a>
        </div>
      </div>
    </Layout>
  );
};
