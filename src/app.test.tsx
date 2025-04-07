import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";

import { App } from "./App";

describe("App", () => {
  it("renders app", () => {
    render(<App />);

    expect(
      screen.getByRole("heading", { name: "Playlists" }),
    ).toBeInTheDocument();
  });

  it("has no accessibility errors", async () => {
    const { container } = render(<App />);
    const results = await axe(container, {
      rules: {
        // Disable the rule for invalid aria attribute values
        // This is needed because Radix UI Tabs component generates aria-controls with spaces
        'aria-valid-attr-value': { enabled: false },
      },
    });

    expect(results).toHaveNoViolations();
  });
});
