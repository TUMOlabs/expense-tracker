import { openForm, closeForm, saveFormData, editFormData, deleteFormData } from "./utils/formUtils";
import { getAll } from "./utils/storageUtils";
import { Transaction } from "./components/Transaction";

let currentActiveId = null;

const renderList = () => {
    const data = getAll(import.meta.env.VITE_TRANSACTIONS_KEY);
    const list = document.querySelector("#transaction-list");
    data.forEach((entry) => {
        list.appendChild(Transaction(entry));
    });
};

const init = () => {
    renderList();

    const transactionList = document.querySelector("#transaction-list");
    const addTransactionForm = document.querySelector("#add-transaction-form");
    const viewTransactionForm = document.querySelector("#view-transaction-form");

    // new transaction
    const addNewTransaction = document.querySelector("#add-transaction-btn");
    const saveNewTransaction = document.querySelector("#add-transaction-save-btn");
    const cancelNewTransaction = document.querySelector("#add-transaction-cancel-btn");
    addNewTransaction.addEventListener("click", () => openForm(addTransactionForm));
    saveNewTransaction.addEventListener("click", () => saveFormData(addTransactionForm));
    cancelNewTransaction.addEventListener("click", () => closeForm(addTransactionForm));

    // event delegation: adds one listener to the parent instead of adding to each entry
    transactionList.addEventListener("click", (event) => {
        // existing transaction
        const transaction = event.target.closest(".transaction-entry");
        if (transaction) {
            currentActiveId = transaction.dataset.id;
            openForm(viewTransactionForm, currentActiveId);
        }
    });
    // existing transaction
    const saveTransaction = document.querySelector("#view-transaction-save-btn");
    const editTransaction = document.querySelector("#view-transaction-edit-btn");
    const deleteTransaction = document.querySelector("#view-transaction-delete-btn");
    const cancelTransaction = document.querySelector("#view-transaction-cancel-btn");

    saveTransaction.addEventListener("click", () => saveFormData(viewTransactionForm));
    editTransaction.addEventListener("click", () => editFormData(viewTransactionForm));
    deleteTransaction.addEventListener("click", () => deleteFormData(viewTransactionForm));
    cancelTransaction.addEventListener("click", () => closeForm(viewTransactionForm));
};

init();
