import { Transaction } from "../components/Transaction";

export const addTransactionToList = (data) => {
    const list = document.querySelector("#transaction-list");
    const transaction = Transaction(data);

    list.appendChild(transaction);
};

export const removeTransactionFromList = (transactionId) => {
    const item = document.querySelector(`[data-id="${transactionId}"]`);
    if (item) item.remove();
};

export const updateTransactionFields = (transactionId, payload) => {
    const item = document.querySelector(`[data-id="${transactionId}"]`);
    item.childNodes.forEach((child) => {
        if (child.dataset.type && child.textContent !== payload[child.dataset.type]) {
            child.textContent = payload[child.dataset.type];
        }
    });
};
