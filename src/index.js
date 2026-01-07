import { openForm, closeForm, saveFormData, editFormData, deleteFormData } from "./utils/formUtils";

const main = () => {
    const addMeetingForm = document.querySelector("#add-transaction-form");
    const viewMeetingForm = document.querySelector("#view-transaction-form");

    // new transaction
    const addNewTransaction = document.querySelector("#add-transaction-btn");
    const saveNewTransaction = document.querySelector("#add-transaction-save-btn");
    const cancelNewTransaction = document.querySelector("#add-transaction-cancel-btn");
    addNewTransaction.addEventListener("click", () => openForm(addMeetingForm, true));
    saveNewTransaction.addEventListener("click", () => saveFormData(addMeetingForm, true));
    cancelNewTransaction.addEventListener("click", () => closeForm(addMeetingForm, true));

    // existing transaction
    const viewTransaction = document.querySelector("#view-transaction-btn");
    const saveTransaction = document.querySelector("#view-transaction-save-btn");
    const editTransaction = document.querySelector("#view-transaction-edit-btn");
    const deleteTransaction = document.querySelector("#view-transaction-delete-btn");
    const cancelTransaction = document.querySelector("#view-transaction-cancel-btn");

    viewTransaction.addEventListener("click", () =>
        openForm(viewMeetingForm, false, viewTransaction.dataset.id)
    );
    saveTransaction.addEventListener("click", () =>
        saveFormData(viewMeetingForm, false, viewTransaction.dataset.id)
    );
    editTransaction.addEventListener("click", () => editFormData(viewMeetingForm));
    deleteTransaction.addEventListener("click", () =>
        deleteFormData(viewMeetingForm, viewTransaction.dataset.id)
    );
    cancelTransaction.addEventListener("click", () => closeForm(viewMeetingForm, false));
};

main();
