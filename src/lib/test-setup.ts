import * as jestDomMatches from "@testing-library/jest-dom/matchers";
import { cleanup } from "@testing-library/react";
import { toHaveNoViolations } from "jest-axe";
import "@testing-library/jest-dom";
import { afterEach, expect, vi } from "vitest";

expect.extend(jestDomMatches);
expect.extend(toHaveNoViolations);

const ResizeObserverMock = vi.fn(() => ({
  disconnect: vi.fn(),
  observe: vi.fn(),
  unobserve: vi.fn(),
}));

vi.stubGlobal("ResizeObserver", ResizeObserverMock);

Object.defineProperties(HTMLMediaElement.prototype, {
  load: { value: vi.fn() },
  pause: { value: vi.fn() },
});

afterEach(() => {
  cleanup();
});
