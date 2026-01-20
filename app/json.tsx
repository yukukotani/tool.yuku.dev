import type { InferRouteHandler } from '@remix-run/fetch-router'
import { routes } from './routes.ts'
import { render } from './utils/render.ts'
import { Layout } from './layout.tsx'
import { JsonEditor } from './assets/JsonEditor.tsx'

export const JsonPage: InferRouteHandler<typeof routes.json> = () => {
  return render(
    <Layout>
      <div
        css={{
          display: "flex",
          height: "calc(100vh - 3.5rem - 3rem)",
          flexDirection: "column",
          gap: "1.5rem",
          "@media (min-width: 1024px)": {
            flexDirection: "row",
          },
        }}
      >
        <main
          css={{
            flex: 1,
            minHeight: 0,
          }}
        >
          <JsonEditor />
        </main>
      </div>
    </Layout>
  );
};
