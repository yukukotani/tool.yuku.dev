import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="flex flex-col items-center justify-center gap-8 py-20 text-center">
      <h1 className="text-4xl font-bold tracking-tight">
        Developer Tools
      </h1>
      <p className="text-xl text-muted-foreground max-w-[600px]">
        Simple, fast, and privacy-focused tools for developers.
        No data leaves your browser.
      </p>
      <div className="flex gap-4">
        <Link
          to="/json"
          className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
        >
          Open JSON Formatter
        </Link>
      </div>
    </div>
  );
}

