import { Outlet } from "@tanstack/react-router";
import { useUiStore } from "./store/uiStore";

export function App() {
  const darkMode = useUiStore((s) => s.darkMode);
  const toggleDarkMode = useUiStore((s) => s.toggleDarkMode);

  return (
    // 'dark' class is applied to app-root wrapper, not document.html — tests assert on this element
    <div
      data-testid="app-root"
      className={
        darkMode
          ? "dark min-h-screen bg-gray-900 text-white"
          : "min-h-screen bg-gray-50 text-gray-900"
      }
    >
      <header className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700">
        <h1 className="text-xl font-semibold">Agent Team Starter</h1>
        <button
          type="button"
          aria-label="Toggle dark mode"
          aria-pressed={darkMode}
          onClick={toggleDarkMode}
          className="rounded border border-gray-300 px-3 py-1 text-sm dark:border-gray-600"
        >
          {darkMode ? "Light mode" : "Dark mode"}
        </button>
      </header>
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
}
