import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./globals.css";
import { App } from "./App.tsx";
import { ThemeProvider } from "./components/theme-provider.tsx";

const root = document.getElementById("root");

if (!root) {
  throw new Error("Root element not found.");
}

createRoot(root).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="media-player-theme">
      <App />
    </ThemeProvider>
  </StrictMode>,
);
