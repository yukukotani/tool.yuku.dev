import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Header } from "../ui/layout/Header";

export const Route = createRootRoute({
  component: () => (
    <>
      <Header />
      <main className="container py-6">
        <Outlet />
      </main>
    </>
  ),
});

