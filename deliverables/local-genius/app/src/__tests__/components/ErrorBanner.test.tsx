/**
 * Tests for src/components/shared/ErrorBanner.tsx
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ErrorBanner from "@/components/shared/ErrorBanner";

describe("ErrorBanner", () => {
  it("renders the error message", () => {
    render(<ErrorBanner message="Something went wrong" />);
    expect(screen.getByText("Something went wrong")).toBeDefined();
  });

  it("has role='alert' for accessibility", () => {
    render(<ErrorBanner message="Error!" />);
    const banner = screen.getByRole("alert");
    expect(banner).toBeDefined();
  });

  it("does not render Retry button when onRetry is not provided", () => {
    render(<ErrorBanner message="Error" />);
    expect(screen.queryByText("Retry")).toBeNull();
  });

  it("renders Retry button when onRetry is provided", () => {
    const onRetry = vi.fn();
    render(<ErrorBanner message="Error" onRetry={onRetry} />);
    expect(screen.getByText("Retry")).toBeDefined();
  });

  it("calls onRetry when Retry button is clicked", () => {
    const onRetry = vi.fn();
    render(<ErrorBanner message="Error" onRetry={onRetry} />);
    fireEvent.click(screen.getByText("Retry"));
    expect(onRetry).toHaveBeenCalledOnce();
  });

  it("does not render Dismiss button when onDismiss is not provided", () => {
    render(<ErrorBanner message="Error" />);
    expect(screen.queryByLabelText("Dismiss error")).toBeNull();
  });

  it("renders Dismiss button when onDismiss is provided", () => {
    const onDismiss = vi.fn();
    render(<ErrorBanner message="Error" onDismiss={onDismiss} />);
    expect(screen.getByLabelText("Dismiss error")).toBeDefined();
  });

  it("calls onDismiss when Dismiss button is clicked", () => {
    const onDismiss = vi.fn();
    render(<ErrorBanner message="Error" onDismiss={onDismiss} />);
    fireEvent.click(screen.getByLabelText("Dismiss error"));
    expect(onDismiss).toHaveBeenCalledOnce();
  });

  it("renders both Retry and Dismiss when both handlers provided", () => {
    render(
      <ErrorBanner
        message="Error"
        onRetry={vi.fn()}
        onDismiss={vi.fn()}
      />
    );
    expect(screen.getByText("Retry")).toBeDefined();
    expect(screen.getByLabelText("Dismiss error")).toBeDefined();
  });

  it("renders the error icon SVG", () => {
    const { container } = render(<ErrorBanner message="Error" />);
    const svg = container.querySelector("svg");
    expect(svg).not.toBeNull();
  });
});
