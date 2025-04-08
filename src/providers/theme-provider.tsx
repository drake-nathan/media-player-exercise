import { createContext, useContext, useEffect, useState } from "react";
import { z } from "zod";

const themeSchema = z.enum(["dark", "light", "system"]);
type Theme = z.infer<typeof themeSchema>;

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

interface ThemeProviderState {
  setTheme: (theme: Theme) => void;
  theme: Theme;
}

const initialState: ThemeProviderState = {
  setTheme: () => null,
  theme: "system",
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export const ThemeProvider = ({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) => {
  const getInitialTheme = () => {
    const storedTheme = localStorage.getItem(storageKey);

    if (storedTheme) {
      const result = themeSchema.safeParse(storedTheme);

      if (result.success) {
        return result.data;
      }
    }
    // if the stored theme is invalid, return the default theme
    return defaultTheme;
  };

  const [theme, setTheme] = useState<Theme>(getInitialTheme());

  useEffect(() => {
    const root = window.document.documentElement;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const applyTheme = () => {
      root.classList.remove("light", "dark");

      if (theme === "system") {
        const systemTheme = mediaQuery.matches ? "dark" : "light";
        root.classList.add(systemTheme);
        return;
      }

      root.classList.add(theme);
    };

    // Initial application
    applyTheme();

    // Add event listener for system theme changes
    const handleSystemThemeChange = () => {
      if (theme === "system") {
        applyTheme();
      }
    };

    mediaQuery.addEventListener("change", handleSystemThemeChange);

    return () => {
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
    };
  }, [theme]);

  const value = {
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
    theme,
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
};

// this is fine because we don't need fast refresh for this file
// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  // valid check here, ts doesn't know how react works
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
};
