import { describe, expect, it } from "vitest";
import { buildClaudeNewChatLink, buildCursorDeeplinks } from "./shipDeeplinks";

describe("shipDeeplinks", () => {
  it("builds cursor web and app links with encoded text", () => {
    const { web, app } = buildCursorDeeplinks("hello & test");
    expect(web).toMatch(/^https:\/\/cursor\.com\/link\/prompt\?/);
    expect(new URL(web).searchParams.get("text")).toBe("hello & test");
    expect(new URL(app).searchParams.get("text")).toBe("hello & test");
  });

  it("builds claude new chat with q param", () => {
    const u = buildClaudeNewChatLink("review PR");
    expect(u).toMatch(/^https:\/\/claude\.ai\/new\?q=/);
    expect(decodeURIComponent(new URL(u).searchParams.get("q") ?? "")).toBe("review PR");
  });
});
