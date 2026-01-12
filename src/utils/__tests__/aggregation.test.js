import { describe, it, expect } from "vitest";
import { aggregateEntries } from "../aggregation";

describe("aggregateEntries", () => {
    const entries = [
        {
            id: "1",
            date: "2025-01-01",
            amount: "100",
            type: "expense",
            category: "food",
        },
        {
            id: "2",
            date: "2025-01-01",
            amount: "50",
            type: "expense",
            category: "transport",
        },
        {
            id: "3",
            date: "2025-01-02",
            amount: "200",
            type: "income",
            category: "salary",
        },
    ];

    it("aggregates daily totals by category and type", () => {
        const result = aggregateEntries(entries, "daily");

        expect(result).toHaveLength(2);

        const day1 = result.find((r) => r.period === "2025-01-01");
        expect(day1.totalsByCategory.food).toBe(100);
        expect(day1.totalsByCategory.transport).toBe(50);
        expect(day1.totalsByType.expense).toBe(150);
        expect(day1.totalsByType.income).toBe(0);
    });

    it("aggregates weekly totals", () => {
        const result = aggregateEntries(entries, "weekly");

        expect(result).toHaveLength(1);

        const week = result[0];
        expect(week.totalsByType.expense).toBe(150);
        expect(week.totalsByType.income).toBe(200);
    });
});
