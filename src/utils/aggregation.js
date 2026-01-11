const mockTransactions = [
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
        amount: "120",
        type: "expense",
        category: "food",
    },
    {
        id: "4",
        date: "2025-01-03",
        amount: "200",
        type: "income",
        category: "salary",
    },
    {
        id: "5",
        date: "2025-01-04",
        amount: "80",
        type: "expense",
        category: "food",
    },
];

function getWeekKey(dateString) {
    const date = new Date(dateString);
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const dayOfYear = Math.floor((date - startOfYear) / (24 * 60 * 60 * 1000)) + 1;
    const week = Math.ceil((dayOfYear + startOfYear.getDay()) / 7);
    return `${date.getFullYear()}-W${week}`;
}

export function aggregateEntries(entries, period = "daily") {
    const buckets = {};

    entries.forEach((entry) => {
        const key = period === "weekly" ? getWeekKey(entry.date) : entry.date;

        if (!buckets[key]) {
            buckets[key] = {
                period: key,
                windowType: period,
                totalsByCategory: {},
                totalsByType: {
                    income: 0,
                    expense: 0,
                },
            };
        }

        const amount = Number(entry.amount);
        const category = entry.category || "uncategorized";

        if (!buckets[key].totalsByCategory[category]) {
            buckets[key].totalsByCategory[category] = 0;
        }

        buckets[key].totalsByCategory[category] += amount;
        buckets[key].totalsByType[entry.type] += amount;
    });

    return Object.values(buckets);
}

const dailyAggregation = aggregateEntries(mockTransactions, "daily");
const weeklyAggregation = aggregateEntries(mockTransactions, "weekly");

console.log("DAILY AGGREGATION");
console.log(dailyAggregation);

console.log("WEEKLY AGGREGATION");
console.log(weeklyAggregation);
