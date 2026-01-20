import type { Remix } from "@remix-run/dom";
import { renderToStream } from "@remix-run/dom/server";

export function render(element: Remix.RemixElement, init?: ResponseInit) {
  const stream = renderToStream(element);
  
  return new Response(stream, {
    ...init,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      ...init?.headers,
    },
  });
}
