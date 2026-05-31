import { describe, it, expect } from "vitest";
import { resolveTheme, DEFAULT_THEME, THEMES } from "./theme";

describe("resolveTheme", () => {
  it("defaults to obsidian when nothing requested", () => {
    expect(resolveTheme()).toBe("obsidian");
    expect(DEFAULT_THEME).toBe("obsidian");
  });

  it("returns a known theme when explicitly requested", () => {
    expect(resolveTheme("intercom")).toBe("intercom");
    expect(resolveTheme("obsidian")).toBe("obsidian");
  });

  it("falls back to default for unknown/empty input", () => {
    expect(resolveTheme("midnight")).toBe("obsidian");
    expect(resolveTheme(null)).toBe("obsidian");
  });

  it("exposes exactly the supported themes", () => {
    expect([...THEMES]).toEqual(["obsidian", "intercom"]);
  });
});
