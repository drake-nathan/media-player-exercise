// @ts-check
import { eslintConfig, prettierConfig } from "js-style-kit";

export const eslint = eslintConfig({
  react: {
    framework: "vite",
  },
  testing: {
    framework: "vitest",
  },
  typescript: "tsconfig.eslint.json",
});

export const prettier = prettierConfig({});
