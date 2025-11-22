import { Link } from "@tanstack/react-router";
import { Code2, Home } from "lucide-react";
import { cn } from "../../libs/utils";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <Code2 className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">
              DevTools
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              to="/"
              activeProps={{ className: "text-foreground" }}
              inactiveProps={{ className: "text-foreground/60" }}
              className="transition-colors hover:text-foreground/80"
            >
              Home
            </Link>
            <Link
              to="/json"
              activeProps={{ className: "text-foreground" }}
              inactiveProps={{ className: "text-foreground/60" }}
              className="transition-colors hover:text-foreground/80"
            >
              JSON Formatter
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

