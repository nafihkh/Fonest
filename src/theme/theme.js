export function applyTheme(theme) {
  const root = document.documentElement;

  if (theme === "system") {
    const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
    if (prefersDark) root.classList.add("dark");
    else root.classList.remove("dark");
    return prefersDark ? "dark" : "light";
  }

  if (theme === "dark") {
    root.classList.add("dark");
    return "dark";
  }

  root.classList.remove("dark");
  return "light";
}