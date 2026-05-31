import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Sidebar } from "./sidebar";

vi.mock("next/navigation", () => ({
  usePathname: () => "/inbox",
}));

describe("Sidebar", () => {
  it("renders core nav and connected accounts", () => {
    render(<Sidebar />);
    expect(screen.getByText("Inbox")).toBeInTheDocument();
    expect(screen.getByText("Calendar")).toBeInTheDocument();
    expect(screen.getByText("Personal (Gmail)")).toBeInTheDocument();
    expect(screen.getByText("Work (Outlook)")).toBeInTheDocument();
  });

  it("has no Apple/iCloud account", () => {
    render(<Sidebar />);
    expect(screen.queryByText(/iCloud/i)).not.toBeInTheDocument();
  });
});
