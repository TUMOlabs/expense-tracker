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
    // check and update the content of each element in the entry with corresponding form inputs
    item.childNodes.forEach((child) => {
        if (child.textContent !== payload[child.dataset.type]) {
            if (child.dataset.type === "date") {
                child.textContent = payload[child.dataset.type].split("T")[0];
            } else if (child.dataset.type === "type") {
                // switch transaction type (income/expense) and color by replacing class names
                child.textContent = payload[child.dataset.type];
                if (payload[child.dataset.type] === "income") {
                    item.classList.replace("expense", "income");
                } else {
                    item.classList.replace("income", "expense");
                }
            } else {
                child.textContent = payload[child.dataset.type];
            }
        }
    });
};
