import { getAll } from "./storageUtils";

export const getTransactionData = () => {
    const data = getAll(import.meta.env.VITE_TRANSACTIONS_KEY);
    const income = [];
    const expenses = [];
    const total = [];
    const incomeLabels = [];
    const expensesLabels = [];
    const totalLabels = [];

    let sum = 0;

    data.forEach((entry) => {
        if (entry.type === "income") {
            income.push(entry.amount);
            incomeLabels.push(entry.date.split("T")[0]);
            sum += parseInt(entry.amount);
            // expenses.push(null);
        } else {
            expenses.push(entry.amount);
            expensesLabels.push(entry.date.split("T")[0]);
            sum -= parseInt(entry.amount);
            // income.push(null);
        }
        total.push(sum);
        totalLabels.push(entry.date.split("T")[0]);
    });

    return {
        labels: { incomeLabels, expensesLabels, totalLabels },
        datasets: { income, expenses, total },
    };
};
