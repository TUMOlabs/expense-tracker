import { getAll } from "./storageUtils";
import { Transaction } from "../components/Transaction";

const rerenderList = (data) => {
    const list = document.querySelector("#transaction-list");
    const listHeader = document.querySelector("#transaction-list-header");
    const fragment = document.createDocumentFragment();

    data.forEach((entry) => {
        fragment.appendChild(Transaction(entry));
    });

    list.replaceChildren(listHeader, fragment);
};

export const sortTransactions = (field, order) => {
    const records = getAll(import.meta.env.VITE_TRANSACTIONS_KEY);

    if (order === "asc") {
        if (field === "amount") {
            records.sort((a, b) => parseInt(a[field]) - parseInt(b[field]));
        } else if (field === "date") {
            records.sort((a, b) => new Date(a[field]).getTime() - new Date(b[field]).getTime());
        } else {
            records.sort((a, b) => a[field].localeCompare(b[field]));
        }
    } else {
        if (field === "amount") {
            records.sort((a, b) => parseInt(b[field]) - parseInt(a[field]));
        } else if (field === "date") {
            records.sort((a, b) => new Date(b[field]).getTime() - new Date(a[field]).getTime());
        } else {
            records.sort((a, b) => b[field].localeCompare(a[field]));
        }
    }
    rerenderList(records);
};
