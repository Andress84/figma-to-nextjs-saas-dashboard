import { describe, expect, it } from "vitest";
import {
  formatChurnPercent,
  formatCount,
  formatCurrency,
  formatDate,
  formatDateRange,
  formatDateTime,
  formatPercentagePoints,
  formatPercent,
  formatSignedPercent,
  formatTransactionAmount,
} from "./formatters";

describe("dashboard formatters", () => {
  it("formats approved US-English monetary values and counts", () => {
    expect(formatCurrency(84_720)).toBe("$84,720");
    expect(formatCurrency(1_016_640)).toBe("$1,016,640");
    expect(formatTransactionAmount(29)).toBe("$29.00");
    expect(formatCount(2_846)).toBe("2,846");
  });

  it("formats ordinary, signed, churn, and percentage-point values", () => {
    expect(formatPercent(46.6, 1)).toBe("46.6%");
    expect(formatSignedPercent(8.4, 1)).toBe("+8.4%");
    expect(formatChurnPercent(3.84)).toBe("3.84%");
    expect(formatPercentagePoints(-0.43)).toBe("-0.43 pp");
  });

  it("formats approved dates in UTC independently of the developer time zone", () => {
    expect(formatDateRange("2026-06-15", "2026-07-14")).toBe("Jun 15 – Jul 14, 2026");
    expect(formatDate("2026-05-18")).toBe("May 18, 2026");
    expect(formatDateTime("2026-07-14T10:42:00Z")).toBe("Jul 14, 10:42");
  });
});
