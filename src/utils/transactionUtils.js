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
import { z } from "zod";

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

const validateUserInput = (formData) => {
    const TransactionSchema = z.object({
        title: z.string().min(1, "Title is required"),
        date: z.coerce.date("Date is required"), // coerce to Date object
        amount: z.coerce.number("Amount is required").min(1, "Amount must be a positive number"),
        currency: z.enum(["amd", "usd", "eur"]).default("amd"),
        type: z.enum(["income", "expense"]).default("expense"),
        tag: z.string().max(100).optional(),
        category: z.string().max(100).optional(),
        description: z.string().max(500).optional(),
    });

    const data = {
        title: formData.title,
        date: formData.date,
        amount: parseInt(formData.amount),
        currency: formData.currency,
        type: formData.type,
        tag: formData.tag,
        category: formData.category,
        description: formData.description,
    };

    const result = TransactionSchema.safeParse(data);

    return result;
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

const displayErrors = (form, error) => {
    // form errors
    const errorDiv = form.querySelector(".form-errors");
    for (const msg of error.formErrors) {
        const message = document.createElement("p");
        message.textContent = msg;
        errorDiv.appendChild(message);
    }
    // form field errors
    for (const field in error.fieldErrors) {
        for (const msg in error.fieldErrors[field]) {
            const nameField = form.querySelector(`.${field}-field-name`);
            const errorField = form.querySelector(`.${field}-field-error`);
            errorField.textContent = error.fieldErrors[field][msg];
            nameField.hidden = true;
            errorField.hidden = false;
        }
    }
};

const resetErrors = (form) => {
    const fieldNames = form.querySelectorAll(`.field-name`);
    const fieldErrors = form.querySelectorAll(`.field-error`);
    for (const error of fieldErrors) {
        error.hidden = true;
        error.textContent = "";
    }
    for (const field of fieldNames) {
        field.hidden = false;
    }
};

export const saveFormData = (form) => {
    const formData = getFormData(form);
    const validated = validateUserInput(formData);
    // user input validation
    resetErrors(form);
    if (!validated.success) {
        displayErrors(form, z.flattenError(validated.error));
        return;
    }

    const date = validated.data.date.toISOString();

    const data = { ...validated.data, date };

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

    resetErrors(form);
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
