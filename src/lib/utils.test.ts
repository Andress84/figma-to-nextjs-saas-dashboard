import { describe, expect, it } from "vitest";
import { cn } from "./utils";

describe("cn", () => {
  it("joins truthy class names and ignores empty values", () => {
    expect(cn("page", false, undefined, "page-active", null)).toBe("page page-active");
  });
});
