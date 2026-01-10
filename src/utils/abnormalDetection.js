const mockTransactions = [
    {
        id: "1",
        title: "Groceries",
        date: "2025-01-01",
        amount: "100",
        currency: "amd",
        description: "",
        type: "expense",
    },
    {
        id: "2",
        title: "Groceries",
        date: "2025-01-02",
        amount: "120",
        currency: "amd",
        description: "",
        type: "expense",
    },
    {
        id: "3",
        title: "Groceries",
        date: "2025-01-03",
        amount: "110",
        currency: "amd",
        description: "",
        type: "expense",
    },
    {
        id: "4",
        title: "Groceries",
        date: "2025-01-04",
        amount: "600",
        currency: "amd",
        description: "",
        type: "expense",
    },
];

export function detectAbnormalEntries(entries, { windowDays = 3, multiplier = 2 } = {}) {
    const result = [];
    const sorted = [...entries].sort((a, b) => new Date(a.date) - new Date(b.date));

    for (let i = 0; i < sorted.length; i++) {
        const current = sorted[i];
        const currentDate = new Date(current.date);
        const windowStart = new Date(currentDate);
        windowStart.setDate(windowStart.getDate() - windowDays);

        const recent = sorted.filter((entry) => {
            const entryDate = new Date(entry.date);
            return (
                entryDate >= windowStart && entryDate < currentDate && entry.type === current.type
            );
        });

        if (recent.length < 3) continue;

        const average = recent.reduce((sum, e) => sum + Number(e.amount), 0) / recent.length;

        if (Number(current.amount) > average * multiplier) {
            result.push({
                ...current,
                isFlagged: true,
                reason: `Amount ${current.amount} is higher than ${multiplier}x recent average (${average.toFixed(
                    2
                )})`,
            });
        }
    }

    return result;
}

const detected = detectAbnormalEntries(mockTransactions);
console.log(detected);
