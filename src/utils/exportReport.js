function buildChartSeries(entries) {
    const labels = [];
    const income = [];
    const expense = [];

    const sorted = [...entries].sort((a, b) => new Date(a.date) - new Date(b.date));

    sorted.forEach((e) => {
        labels.push(e.date);
        if (e.type === "income") {
            income.push(Number(e.amount));
            expense.push(0);
        } else {
            expense.push(Number(e.amount));
            income.push(0);
        }
    });

    return { labels, income, expense };
}

function downloadJSON(report, filename) {
    const json = JSON.stringify(report, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();

    URL.revokeObjectURL(url);
}

async function saveToDiskWithPicker(report, filename) {
    const json = JSON.stringify(report, null, 2);
    const handle = await window.showSaveFilePicker({
        suggestedName: filename,
        types: [
            {
                description: "JSON",
                accept: { "application/json": [".json"] },
            },
        ],
    });

    const writable = await handle.createWritable();
    await writable.write(json);
    await writable.close();

    return handle;
}

export async function exportReport({ entries, aggregates, anomalies }) {
    const chartSeries = buildChartSeries(entries);

    const report = {
        generatedAt: new Date().toISOString(),
        entries,
        aggregates,
        anomalies,
        chartSeries,
    };

    console.log("EXPORT REPORT");
    console.log(report);

    const filename = `expense-report-${new Date().toISOString().slice(0, 19).replaceAll(":", "-")}.json`;

    try {
        if (typeof window !== "undefined" && "showSaveFilePicker" in window) {
            await saveToDiskWithPicker(report, filename);
            console.log("Saved to disk via file picker:", filename);
            return { ok: true, method: "file-picker", filename, report };
        }
    } catch (err) {
        console.log("File picker failed, fallback to download:", err);
    }

    downloadJSON(report, filename);
    console.log("Saved to disk via download:", filename);
    return { ok: true, method: "download", filename, report };
}

const mockEntries = [
    { id: "1", date: "2025-01-01", amount: "100", type: "expense", category: "food" },
    { id: "2", date: "2025-01-01", amount: "50", type: "expense", category: "transport" },
    { id: "3", date: "2025-01-02", amount: "120", type: "expense", category: "food" },
    { id: "4", date: "2025-01-03", amount: "200", type: "income", category: "salary" },
    { id: "5", date: "2025-01-04", amount: "80", type: "expense", category: "food" },
];

const mockAggregates = {
    daily: [
        {
            period: "2025-01-01",
            windowType: "daily",
            totalsByCategory: { food: 100, transport: 50 },
            totalsByType: { income: 0, expense: 150 },
        },
    ],
    weekly: [
        {
            period: "2025-W1",
            windowType: "weekly",
            totalsByCategory: { food: 300, transport: 50 },
            totalsByType: { income: 200, expense: 350 },
        },
    ],
};

const mockAnomalies = [
    {
        id: "x1",
        date: "2025-01-04",
        amount: "5",
        type: "expense",
        isFlagged: true,
        reason: "AMOUNT_BELOW_RECENT_AVERAGE",
    },
];

exportReport({
    entries: mockEntries,
    aggregates: mockAggregates,
    anomalies: mockAnomalies,
});
