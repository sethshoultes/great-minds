/**
 * Tests for src/components/shared/Skeleton.tsx
 * Covers: Skeleton (all variants), MessageSkeleton, DigestSkeleton, OnboardingDiscoverySkeleton
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Skeleton, {
  MessageSkeleton,
  DigestSkeleton,
  OnboardingDiscoverySkeleton,
} from "@/components/shared/Skeleton";

// ─── Skeleton component ────────────────────────────────────────────────────────

describe("Skeleton (text variant)", () => {
  it("renders a div with flex-col class by default", () => {
    const { container } = render(<Skeleton />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain("flex-col");
  });

  it("renders the correct number of lines", () => {
    const { container } = render(<Skeleton lines={3} />);
    // 3 skeleton lines inside the wrapper
    const lines = container.querySelectorAll(".h-4");
    expect(lines.length).toBe(3);
  });

  it("renders 1 line by default", () => {
    const { container } = render(<Skeleton />);
    const lines = container.querySelectorAll(".h-4");
    expect(lines.length).toBe(1);
  });

  it("last line has 60% width when multiple lines", () => {
    const { container } = render(<Skeleton lines={3} />);
    const lines = container.querySelectorAll<HTMLElement>(".h-4");
    const lastLine = lines[lines.length - 1];
    expect(lastLine.style.width).toBe("60%");
  });

  it("applies custom className", () => {
    const { container } = render(<Skeleton className="my-custom-class" />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain("my-custom-class");
  });
});

describe("Skeleton (circle variant)", () => {
  it("renders a circle div", () => {
    const { container } = render(<Skeleton variant="circle" />);
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain("rounded-full");
  });

  it("uses default 48px dimensions", () => {
    const { container } = render(<Skeleton variant="circle" />);
    const el = container.firstChild as HTMLElement;
    expect(el.style.width).toBe("48px");
    expect(el.style.height).toBe("48px");
  });

  it("uses custom dimensions when provided", () => {
    const { container } = render(<Skeleton variant="circle" width="64px" height="64px" />);
    const el = container.firstChild as HTMLElement;
    expect(el.style.width).toBe("64px");
    expect(el.style.height).toBe("64px");
  });
});

describe("Skeleton (image variant)", () => {
  it("renders a div with rounded-sm class", () => {
    const { container } = render(<Skeleton variant="image" />);
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain("rounded-sm");
  });

  it("uses default 200px height", () => {
    const { container } = render(<Skeleton variant="image" />);
    const el = container.firstChild as HTMLElement;
    expect(el.style.height).toBe("200px");
  });

  it("uses custom height when provided", () => {
    const { container } = render(<Skeleton variant="image" height="100px" />);
    const el = container.firstChild as HTMLElement;
    expect(el.style.height).toBe("100px");
  });
});

describe("Skeleton (card variant)", () => {
  it("renders three skeleton lines for a card", () => {
    const { container } = render(<Skeleton variant="card" />);
    const lines = container.querySelectorAll(".h-4");
    expect(lines.length).toBe(3);
  });

  it("has card-subtle class", () => {
    const { container } = render(<Skeleton variant="card" />);
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain("card-subtle");
  });
});

// ─── Composed skeletons ───────────────────────────────────────────────────────

describe("MessageSkeleton", () => {
  it("renders without crashing", () => {
    const { container } = render(<MessageSkeleton />);
    expect(container.firstChild).not.toBeNull();
  });

  it("contains multiple skeleton elements", () => {
    const { container } = render(<MessageSkeleton />);
    const skeletonLines = container.querySelectorAll(".h-4");
    expect(skeletonLines.length).toBeGreaterThan(0);
  });
});

describe("DigestSkeleton", () => {
  it("renders without crashing", () => {
    const { container } = render(<DigestSkeleton />);
    expect(container.firstChild).not.toBeNull();
  });
});

describe("OnboardingDiscoverySkeleton", () => {
  it("renders without crashing", () => {
    const { container } = render(<OnboardingDiscoverySkeleton />);
    expect(container.firstChild).not.toBeNull();
  });

  it("contains a loading pulse element", () => {
    const { container } = render(<OnboardingDiscoverySkeleton />);
    const pulseEl = container.querySelector(".loading-glow");
    expect(pulseEl).not.toBeNull();
  });
});
