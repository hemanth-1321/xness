import React, { useEffect, useId, useState } from "react";

type Theme = "light" | "dark";

interface ThemeDropdownProps {
  initialTheme?: Theme;
  onChange?: (theme: Theme) => void;
}

/**
 * A minimal accessible select that toggles theme between light and dark.
 * Applies the theme by setting document.documentElement.dataset.theme,
 * falling back to toggling body classes when dataset isn't available.
 */
const ThemeDropdown: React.FC<ThemeDropdownProps> = ({
  initialTheme = "light",
  onChange,
}) => {
  const id = useId();
  const [theme, setTheme] = useState<Theme>(initialTheme);

  // If initialTheme prop changes, update internal state.
  useEffect(() => {
    setTheme(initialTheme);
  }, [initialTheme]);

  // Apply theme to the document so CSS can react to it.
  useEffect(() => {
    if (typeof document === "undefined") return;

    if (document.documentElement) {
      document.documentElement.dataset.theme = theme;
      return;
    }

    // Fallback: toggle classes on body
    if (theme === "dark") {
      document.body.classList.add("dark");
      document.body.classList.remove("light");
    } else {
      document.body.classList.add("light");
      document.body.classList.remove("dark");
    }
  }, [theme]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const next = e.target.value as Theme;
    setTheme(next);
    onChange?.(next);
  };

  return (
    <div style={{ display: "inline-block" }}>
      {/* Visually hidden label for accessibility */}
      <label
        htmlFor={id}
        style={{
          position: "absolute",
          width: 1,
          height: 1,
          padding: 0,
          margin: -1,
          overflow: "hidden",
          clip: "rect(0, 0, 0, 0)",
          whiteSpace: "nowrap",
          border: 0,
        }}
      >
        Theme
      </label>

      <select
        id={id}
        value={theme}
        onChange={handleChange}
        aria-label="Theme"
        style={{
          padding: "6px 8px",
          fontSize: 14,
          borderRadius: 6,
          border: "1px solid rgba(0,0,0,0.2)",
          background: "white",
          color: "inherit",
        }}
      >
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </div>
  );
};

export default ThemeDropdown;