/**
 * Tests for src/lib/animations.ts
 * Covers: staggerDelay, fadeUpStagger, checkmarkStyle, typingDotDelay,
 *         approvalTransition, prefersReducedMotion, safeDuration, smoothScrollTo,
 *         checkmarkPath, checkmarkStrokeDasharray
 */

import { describe, it, expect, vi } from "vitest";
import {
  staggerDelay,
  fadeUpStagger,
  checkmarkStyle,
  checkmarkPath,
  checkmarkStrokeDasharray,
  typingDotDelay,
  approvalTransition,
  prefersReducedMotion,
  safeDuration,
  smoothScrollTo,
} from "@/lib/animations";

// ─── staggerDelay ────────────────────────────────────────────────────────────

describe("staggerDelay", () => {
  it("returns 0 for index 0", () => {
    expect(staggerDelay(0)).toBe(0);
  });

  it("returns baseMs for index 1 with default base", () => {
    expect(staggerDelay(1)).toBe(150);
  });

  it("returns index * baseMs", () => {
    expect(staggerDelay(3)).toBe(450);
    expect(staggerDelay(3, 100)).toBe(300);
  });

  it("uses a custom base delay", () => {
    expect(staggerDelay(2, 50)).toBe(100);
  });
});

// ─── fadeUpStagger ────────────────────────────────────────────────────────────

describe("fadeUpStagger", () => {
  it("returns a CSSProperties object with animation property", () => {
    const style = fadeUpStagger(0);
    expect(style).toHaveProperty("animation");
  });

  it("encodes the correct delay in the animation string", () => {
    const style = fadeUpStagger(2, 100);
    expect(style.animation).toContain("200ms");
  });

  it("delay is 0ms for index 0", () => {
    const style = fadeUpStagger(0);
    expect(style.animation).toContain("0ms");
  });

  it("uses 'both' fill mode", () => {
    const style = fadeUpStagger(1);
    expect(style.animation).toContain("both");
  });
});

// ─── checkmarkStyle / constants ───────────────────────────────────────────────

describe("checkmarkPath", () => {
  it("is the expected SVG path string", () => {
    expect(checkmarkPath).toBe("M 5 12 L 10 17 L 20 7");
  });
});

describe("checkmarkStrokeDasharray", () => {
  it("is 24", () => {
    expect(checkmarkStrokeDasharray).toBe(24);
  });
});

describe("checkmarkStyle", () => {
  it("returns strokeDashoffset: 0 when animate is false", () => {
    const style = checkmarkStyle(false);
    expect(style).toEqual({ strokeDashoffset: 0 });
  });

  it("returns animation CSS when animate is true", () => {
    const style = checkmarkStyle(true);
    expect(style).toHaveProperty("animation");
    expect(style.animation).toContain("checkmark");
  });

  it("sets strokeDasharray and strokeDashoffset when animate is true", () => {
    const style = checkmarkStyle(true);
    expect(style.strokeDasharray).toBe(24);
    expect(style.strokeDashoffset).toBe(24);
  });
});

// ─── typingDotDelay ───────────────────────────────────────────────────────────

describe("typingDotDelay", () => {
  it("returns 0ms delay for index 0", () => {
    const style = typingDotDelay(0);
    expect(style.animationDelay).toBe("0ms");
  });

  it("returns 200ms delay for index 1", () => {
    const style = typingDotDelay(1);
    expect(style.animationDelay).toBe("200ms");
  });

  it("returns 400ms delay for index 2", () => {
    const style = typingDotDelay(2);
    expect(style.animationDelay).toBe("400ms");
  });
});

// ─── approvalTransition ───────────────────────────────────────────────────────

describe("approvalTransition", () => {
  it("returns maxHeight 48px for approved status", () => {
    const style = approvalTransition("approved");
    expect(style.maxHeight).toBe("48px");
  });

  it("returns maxHeight 200px for pending status", () => {
    const style = approvalTransition("pending");
    expect(style.maxHeight).toBe("200px");
  });

  it("both states have overflow hidden", () => {
    expect(approvalTransition("approved").overflow).toBe("hidden");
    expect(approvalTransition("pending").overflow).toBe("hidden");
  });

  it("both states include a transition property", () => {
    expect(approvalTransition("approved").transition).toBeDefined();
    expect(approvalTransition("pending").transition).toBeDefined();
  });
});

// ─── prefersReducedMotion ─────────────────────────────────────────────────────

describe("prefersReducedMotion", () => {
  it("returns false when matchMedia returns matches: false (default setup mock)", () => {
    // The vitest setup already mocks matchMedia to return { matches: false }
    expect(prefersReducedMotion()).toBe(false);
  });

  it("returns true when matchMedia returns matches: true", () => {
    vi.spyOn(window, "matchMedia").mockReturnValueOnce({
      matches: true,
      media: "(prefers-reduced-motion: reduce)",
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    });

    expect(prefersReducedMotion()).toBe(true);
  });
});

// ─── safeDuration ────────────────────────────────────────────────────────────

describe("safeDuration", () => {
  it("returns the duration as-is when reduced motion is false", () => {
    // setup mock has matches: false
    expect(safeDuration(300)).toBe(300);
  });

  it("returns 0 when reduced motion is preferred", () => {
    const spy = vi.spyOn(window, "matchMedia").mockReturnValueOnce({
      matches: true,
      media: "(prefers-reduced-motion: reduce)",
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    });

    expect(safeDuration(300)).toBe(0);
    spy.mockRestore();
  });
});

// ─── smoothScrollTo ───────────────────────────────────────────────────────────

describe("smoothScrollTo", () => {
  it("calls element.scrollIntoView with smooth behavior when no reduced motion", () => {
    const mockScrollIntoView = vi.fn();
    const element = { scrollIntoView: mockScrollIntoView } as unknown as HTMLElement;

    smoothScrollTo(element);

    expect(mockScrollIntoView).toHaveBeenCalledWith({
      behavior: "smooth",
      block: "nearest",
    });
  });

  it("calls element.scrollIntoView with auto behavior when reduced motion is preferred", () => {
    const spy = vi.spyOn(window, "matchMedia").mockReturnValueOnce({
      matches: true,
      media: "(prefers-reduced-motion: reduce)",
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    });

    const mockScrollIntoView = vi.fn();
    const element = { scrollIntoView: mockScrollIntoView } as unknown as HTMLElement;

    smoothScrollTo(element);

    expect(mockScrollIntoView).toHaveBeenCalledWith({
      behavior: "auto",
      block: "nearest",
    });
    spy.mockRestore();
  });
});
