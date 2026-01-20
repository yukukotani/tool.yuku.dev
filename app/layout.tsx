import type { Remix } from "@remix-run/dom";

import { routes } from "./routes.ts";

export function Document({
  title = "Developer Tools",
  children,
}: {
  title?: string;
  children?: Remix.RemixNode;
}) {
  return (
    <html lang="ja">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script
          type="module"
          async
          src={routes.assets.href({ path: "entry.js" })}
        />
        <title>{title}</title>
        <style>{`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            background-color: #ffffff;
            color: #1f2937;
            line-height: 1.5;
          }

          a {
            color: inherit;
            text-decoration: none;
          }
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  );
}

export function Layout({ children }: { children?: Remix.RemixNode }) {
  return (
    <Document>
      <header
        css={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          width: "100%",
          borderBottom: "1px solid #e5e7eb",
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(8px)",
        }}
      >
        <div
          css={{
            maxWidth: "1400px",
            margin: "0 auto",
            padding: "0 2rem",
            display: "flex",
            height: "3.5rem",
            alignItems: "center",
          }}
        >
          <div css={{ marginRight: "1rem", display: "flex" }}>
            <a
              href={routes.home.href()}
              css={{
                marginRight: "1.5rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <svg
                css={{ height: "1.5rem", width: "1.5rem" }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                />
              </svg>
              <span css={{ fontWeight: "bold", display: "none", "@media (min-width: 640px)": { display: "inline-block" } }}>
                DevTools
              </span>
            </a>
            <nav
              css={{
                display: "flex",
                alignItems: "center",
                gap: "1.5rem",
                fontSize: "0.875rem",
                fontWeight: 500,
              }}
            >
              <a
                href={routes.home.href()}
                css={{
                  color: "#6b7280",
                  transition: "color 0.2s",
                  "&:hover": {
                    color: "#1f2937",
                  },
                }}
              >
                Home
              </a>
              <a
                href={routes.json.href()}
                css={{
                  color: "#6b7280",
                  transition: "color 0.2s",
                  "&:hover": {
                    color: "#1f2937",
                  },
                }}
              >
                JSON Formatter
              </a>
            </nav>
          </div>
        </div>
      </header>
      <main
        css={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "1.5rem 2rem",
        }}
      >
        <div>{children}</div>
      </main>
    </Document>
  );
}
