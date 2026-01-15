import { create, getById, remove, update } from "./storageUtils";
import { getDateFromString } from "./timeUtils";
import {
    addTransactionToList,
    removeTransactionFromList,
    updateTransactionFields,
} from "./uiUtils";
import { loadCategoriesIntoForm } from "./categoryUtils";
import { loadTagsIntoForm } from "./tagUtils";
import { addNewDataPoint, updateDataPoint } from "./chartUtils";

const transactionsKey = import.meta.env.VITE_TRANSACTIONS_KEY;

const getHighestZIndex = (id) => {
    let max = 0;
    const sidebar = document.querySelector(id);
    const children = sidebar.children;
    for (const child of children) {
        if (child.style.zIndex && parseInt(child.style.zIndex) > max) {
            max = parseInt(child.style.zIndex);
        }
    }
    return max;
};

const toggleEdit = (form, status) => {
    const fieldsets = Array.from(form.querySelectorAll("fieldset"));
    fieldsets.forEach((fieldset) => {
        fieldset.disabled = status;
    });
};

const toggleEditSaveButtons = (form, isEditing) => {
    const editBtn = form.querySelector("#view-transaction-edit-btn");
    const saveBtn = form.querySelector("#view-transaction-save-btn");

    if (!editBtn || !saveBtn) return;

    editBtn.hidden = isEditing;
    saveBtn.hidden = !isEditing;
};

export const getFormData = (form) => {
    const formData = new FormData(form);

    const impact = document.querySelector("#view-transaction-impact").innerText;
    const reason = document.querySelector("#view-transaction-reason").innerText;

    formData.append("impact", impact);
    formData.append("reason", reason);

    return Object.fromEntries(formData.entries());
};

const populateForm = (form) => {
    try {
        const data = getById(transactionsKey, form.dataset.id);
        const date = getDateFromString(data.date);

        form.title.value = data.title;
        form.date.value = date;
        form.amount.value = data.amount;
        form.currency.value = data.currency;
        form.description.value = data.description;
        form.type.value = data.type;
        form.category.value = data.category;
        form.tag.value = data.tag;
        form.reason.value = data.reason;
        form.impact.value = data.impact;
    } catch (error) {
        console.log(error);
    }
};

export const openForm = (form, transactionId = "") => {
    const maxIndex = getHighestZIndex("#sidebar");
    form.style.zIndex = maxIndex + 1;
    form.hidden = false;

    if (transactionId) {
        form.dataset.id = transactionId;
        loadCategoriesIntoForm("#view-transaction-category");
        loadTagsIntoForm("#view-transaction-tag");
        populateForm(form);
        toggleEdit(form, true);
        toggleEditSaveButtons(form, false);
    } else {
        loadCategoriesIntoForm("#add-transaction-category");
        loadTagsIntoForm("#add-transaction-tag");
        form.querySelector(".transaction-title").focus();
    }
};

export const saveFormData = (form) => {
    const formData = getFormData(form);
    const date = new Date(formData.date).toISOString();

    const data = {
        ...formData,
        date,
    };

    if (!form.dataset.id) {
        try {
            const newTransaction = create(transactionsKey, data);
            addTransactionToList(newTransaction);
            // add to charts
            addNewDataPoint(newTransaction);
        } catch (error) {
            console.log(error);
        }
    } else {
        try {
            const transactionId = form.dataset.id;
            const previous = getById(transactionsKey, transactionId);
            const updated = update(transactionsKey, transactionId, data);
            updateTransactionFields(transactionId, data);
            // update charts
            updateDataPoint(previous, updated);
        } catch (error) {
            console.log(error);
        }
    }

    toggleEditSaveButtons(form, false);
    closeForm(form);
    return data;
};

export const closeForm = (form) => {
    if (form.dataset.id) {
        toggleEdit(form, true);
        toggleEditSaveButtons(form, false);
    }
    form.style.zIndex = 100;
    form.hidden = true;
    form.reset();
};

export const editFormData = (form) => {
    toggleEdit(form, false);
    toggleEditSaveButtons(form, true);
    document.querySelector("#view-transaction-title").focus();
};

export const deleteFormData = (form) => {
    try {
        removeTransactionFromList(form.dataset.id);
        remove(transactionsKey, form.dataset.id);
    } catch (error) {
        console.log(error);
    }
    closeForm(form);
};
