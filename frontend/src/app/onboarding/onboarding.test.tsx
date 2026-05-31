import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import OnboardingPage from "./page";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

describe("OnboardingPage", () => {
  it("shows exactly two providers — Google and Microsoft, no Apple", () => {
    render(<OnboardingPage />);
    expect(screen.getByText("Google")).toBeInTheDocument();
    expect(screen.getByText("Microsoft")).toBeInTheDocument();
    expect(screen.queryByText("Apple")).not.toBeInTheDocument();
    expect(screen.queryByText(/iCloud/i)).not.toBeInTheDocument();
  });

  it("disables Continue until a provider is selected", () => {
    render(<OnboardingPage />);
    const continueBtn = screen.getByRole("button", { name: /continue/i });
    expect(continueBtn).toBeDisabled();
  });
});
