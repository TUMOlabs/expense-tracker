import { Transaction } from "../components/Transaction";

export const addTransactionToList = (data) => {
    const list = document.querySelector("#transaction-list");
    const transaction = Transaction(data);

    list.appendChild(transaction);
};
