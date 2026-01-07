import { create, getByID, remove, update } from "./storageUtils";
import { getDateFromString } from "./timeUtils";

const STORAGE_KEY = "expense_tracker_transactions";

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

export const getFormData = (form) => {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    return data;
};

const populateForm = (form, transactionId) => {
    try {
        const data = getByID(STORAGE_KEY, transactionId);
        const date = getDateFromString(data.date);

        form.title.value = data.title;
        form.date.value = date;
        form.amount.value = data.amount;
        form.currency.value = data.currency;
        form.description.value = data.description;
        form.type.value = data.type;
    } catch (error) {
        console.log(error);
    }
};

export const openForm = (form, newForm, transactionId = "") => {
    const maxIndex = getHighestZIndex("#sidebar");
    form.style.zIndex = maxIndex + 1;
    form.hidden = false;

    if (!newForm) {
        populateForm(form, transactionId);
    } else {
        form.querySelector(".transaction-title").focus();
    }
};

export const saveFormData = (form, newForm, transactionId) => {
    const formData = getFormData(form);
    const date = new Date(formData.date).toISOString();
    const data = {
        ...formData,
        date,
    };
    if (newForm) {
        try {
            create(STORAGE_KEY, data);
        } catch (error) {
            console.log(error);
        }
    } else {
        try {
            update(STORAGE_KEY, transactionId, data);
        } catch (error) {
            console.log(error);
        }
    }
    closeForm(form, newForm);
    return data;
};

export const closeForm = (form, newForm) => {
    form.reset();
    if (!newForm) {
        toggleEdit(form, true);
    }
    form.style.zIndex = 100;
    form.hidden = true;
};

export const editFormData = (form) => {
    toggleEdit(form, false);
    document.querySelector("#view-transaction-title").focus();
};

export const deleteFormData = (form, transactionId) => {
    try {
        remove(STORAGE_KEY, transactionId);
    } catch (error) {
        console.log(error);
    }
    closeForm(form, false);
};
