import { describe, it, expect } from "vitest";
import { detectAbnormalEntries } from "../abnormalDetection";

describe("detectAbnormalEntries", () => {
    const entries = [
        {
            id: "1",
            date: "2025-01-01",
            amount: "100",
            type: "expense",
        },
        {
            id: "2",
            date: "2025-01-02",
            amount: "100",
            type: "expense",
        },
        {
            id: "3",
            date: "2025-01-03",
            amount: "100",
            type: "expense",
        },
        {
            id: "4",
            date: "2025-01-04",
            amount: "5",
            type: "expense",
        },
        {
            id: "5",
            date: "2025-01-05",
            amount: "600",
            type: "expense",
        },
    ];

    it("flags both unusually low and high values", () => {
        const result = detectAbnormalEntries(entries, {
            windowDays: 3,
            multiplier: 2,
        });

        const reasons = result.map((r) => r.reason);

        expect(reasons).toContain("AMOUNT_BELOW_RECENT_AVERAGE");
        expect(reasons).toContain("AMOUNT_ABOVE_RECENT_AVERAGE");
    });

    it("does not flag normal values", () => {
        const result = detectAbnormalEntries(entries.slice(0, 4), {
            windowDays: 3,
            multiplier: 2,
        });

        expect(result.length).toBe(1);
        expect(result[0].reason).toBe("AMOUNT_BELOW_RECENT_AVERAGE");
    });
});
