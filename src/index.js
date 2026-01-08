import { openForm, closeForm, saveFormData, editFormData, deleteFormData } from "./utils/formUtils";

const main = () => {
    const transactionList = document.querySelector("#transaction-list");
    const addTransactionForm = document.querySelector("#add-transaction-form");
    const viewTransactionForm = document.querySelector("#view-transaction-form");

    // new transaction
    const addNewTransaction = document.querySelector("#add-transaction-btn");
    const saveNewTransaction = document.querySelector("#add-transaction-save-btn");
    const cancelNewTransaction = document.querySelector("#add-transaction-cancel-btn");
    addNewTransaction.addEventListener("click", () => openForm(addTransactionForm, true));
    saveNewTransaction.addEventListener("click", () => saveFormData(addTransactionForm, true));
    cancelNewTransaction.addEventListener("click", () => closeForm(addTransactionForm, true));

    // event delegation: adds one listener to the parent instead of adding to each entry
    transactionList.addEventListener("click", (event) => {
        // existing transaction
        const transaction = event.target.closest(".transaction-entry");
        if (transaction) {
            const id = transaction.dataset.id;
            const saveTransaction = document.querySelector("#view-transaction-save-btn");
            const editTransaction = document.querySelector("#view-transaction-edit-btn");
            const deleteTransaction = document.querySelector("#view-transaction-delete-btn");
            const cancelTransaction = document.querySelector("#view-transaction-cancel-btn");

            saveTransaction.addEventListener("click", () =>
                saveFormData(viewTransactionForm, false)
            );
            editTransaction.addEventListener("click", () => editFormData(viewTransactionForm));
            deleteTransaction.addEventListener("click", () =>
                deleteFormData(viewTransactionForm, id)
            );
            cancelTransaction.addEventListener("click", () =>
                closeForm(viewTransactionForm, false)
            );
            openForm(viewTransactionForm, false, id);
        }
    });
};

main();
