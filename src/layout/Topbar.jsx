// src/layout/Topbar.jsx

import { useTheme } from "../context/ThemeContext";

export default function Topbar() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="topbar">

      <div>
        Personal Knowledge Hub
      </div>

      <button
        className="theme-btn"
        onClick={() =>
          setTheme(
            theme === "dark"
              ? "light"
              : "dark"
          )
        }
      >
        {theme === "dark" ? "☀️" : "🌙"}
      </button>

    </header>
  );
}