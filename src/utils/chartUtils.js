import { getAll } from "./storageUtils";
import { incomeChart, expensesChart, totalChart } from "../index";

const updateAllCharts = () => {
    incomeChart.update();
    expensesChart.update();
    totalChart.update();
};

export const getChartData = () => {
    const entries = getAll(import.meta.env.VITE_TRANSACTIONS_KEY);
    const incomeData = [];
    const expensesData = [];
    const totalData = [];
    const labels = [];
    let income = 0;
    let expenses = 0;
    let total = 0;

    entries.forEach((data) => {
        const date = data.date.split("T")[0];
        const amount = parseInt(data.amount);

        if (data.type === "income") {
            income = amount;
            expenses = null;
            total += amount;
        } else {
            income = null;
            expenses = amount;
            total -= amount;
        }
        incomeData.push({ x: date, y: income, id: data.id });
        expensesData.push({ x: date, y: expenses, id: data.id });
        totalData.push({ x: date, y: total, id: data.id });

        labels.push(date);
    });

    return {
        labels,
        datasets: { income: incomeData, expenses: expensesData, total: totalData },
    };
};

export const addNewDataPoint = (data) => {
    const totalData = totalChart.data.datasets[0].data;
    const totalLast = totalData[totalData.length - 1];
    // get the last total value
    let total = totalLast?.y ?? 0;
    let income = 0;
    let expenses = 0;

    const date = data.date.split("T")[0];
    const amount = parseInt(data.amount);

    if (data.type === "income") {
        income = amount;
        expenses = null;
        total += amount;
    } else {
        income = null;
        expenses = amount;
        total -= amount;
    }
    // add new datapoints to charts
    incomeChart.data.datasets[0].data.push({ x: date, y: income, id: data.id });
    expensesChart.data.datasets[0].data.push({ x: date, y: expenses, id: data.id });
    totalData.push({ x: date, y: total, id: data.id });

    // all charts reference the same labels array. no need to push to each chart labels separately
    totalChart.data.labels.push(date);

    updateAllCharts();
};

export const recalculateTotal = (totalData, pointIndex, amount) => {
    for (let i = pointIndex; i < totalData.length; ++i) {
        totalData[i].y += amount * 2;
    }
};

export const updateDataPoint = (previous, updated) => {
    const incomeData = incomeChart.data.datasets[0].data;
    const expensesData = expensesChart.data.datasets[0].data;
    const totalData = totalChart.data.datasets[0].data;
    const previousAmount = parseInt(previous.amount);
    const updatedAmount = parseInt(updated.amount);
    const pointIndex = totalData.findIndex((point) => point.id === previous.id);
    let total = 0;
    // update labels
    if (previous.date !== updated.date) {
        const newLabel = updated.date.split("T")[0];
        // issue: this pushes a new datapoint with the old label to the dataset
        // totalChart.data.labels[pointIndex] = newLabel;
        // issue: this requires a page reload to update
        totalChart.data.labels.forEach((label, index) => (index === pointIndex ? newLabel : label));
    }
    // update data
    if (previous.type === "income" && updated.type === "expense") {
        incomeData[pointIndex].y = null;
        expensesData[pointIndex].y = updatedAmount;
        total = -updatedAmount;
    } else if (previous.type === "expense" && updated.type === "income") {
        incomeData[pointIndex].y = updatedAmount;
        expensesData[pointIndex].y = null;
        total = updatedAmount;
    } else if (previous.type === "income") {
        incomeData[pointIndex].y = updatedAmount;
        total = updatedAmount - previousAmount;
    } else {
        expensesData[pointIndex].y = updatedAmount;
        total = -(updatedAmount - previousAmount);
    }
    // add/subtract new total to every y value starting from pointIndex
    recalculateTotal(totalData, pointIndex, total);
    updateAllCharts();
};
