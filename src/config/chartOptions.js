import { getTransactionData } from "../utils/dataUtils";

const { labels, datasets } = getTransactionData();

export const incomeChartOptions = {
    chartId: "#income-chart",
    // labels: labels.totalLabels,
    labels: labels.incomeLabels,
    datasets: [datasets.income],
    scaleX: "Date",
    scaleY: "Amount",
    label: "Income",
    colors: [{ borderColor: "#1a1", backgroundColor: "#aea" }],
};
export const expensesChartOptions = {
    chartId: "#expenses-chart",
    // labels: labels.totalLabels,
    labels: labels.expensesLabels,
    datasets: [datasets.expenses],
    scaleX: "Date",
    scaleY: "Amount",
    label: "Expenses",
    colors: [{ borderColor: "#a11", backgroundColor: "#eaa" }],
};

export const totalChartOptions = {
    chartId: "#total-chart",
    labels: labels.totalLabels,
    datasets: [datasets.total],
    scaleX: "Date",
    scaleY: "Amount",
    label: ["Total"],
    colors: [{ borderColor: "#11a", backgroundColor: "#aae" }],
};

export const chartOptions = {
    labels: labels.totalLabels,
    datasets: [datasets.income, datasets.expenses, datasets.total],
    scaleX: "Date",
    scaleY: "Amount",
    label: ["Income", "Expenses", "Total"],
    colors: [
        { borderColor: "#1a1", backgroundColor: "#aea" },
        { borderColor: "#a11", backgroundColor: "#eaa" },
        { borderColor: "#11a", backgroundColor: "#aae" },
    ],
};
