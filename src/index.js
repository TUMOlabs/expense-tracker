import {
    openForm,
    closeForm,
    saveFormData,
    editFormData,
    deleteFormData,
} from "./utils/transactionUtils";
import { getAll } from "./utils/storageUtils";
import { Transaction } from "./components/Transaction";
import { getChart, getTotalChart } from "./charts";
import { incomeChartOptions, expensesChartOptions, totalChartOptions } from "./config/chartOptions";
import {
    loadCategories,
    openCategorySection,
    removeCategories,
    saveCategory,
} from "./utils/categoryUtils";

import { loadTags, openTagSection, removeTags, saveTag } from "./utils/tagUtils";

// currently selected transaction id. passed to a form as data-id
let currentActiveId = null;

const renderList = () => {
    const data = getAll(import.meta.env.VITE_TRANSACTIONS_KEY);
    const list = document.querySelector("#transaction-list");
    const fragment = document.createDocumentFragment();

    data.forEach((entry) => {
        fragment.appendChild(Transaction(entry));
    });

    list.appendChild(fragment);
};

const init = () => {
    renderList();
    loadCategories();
    loadTags();

    // category
    const newCategory = document.querySelector("#new-category-btn");
    const addCategory = document.querySelector("#category-add-btn");
    const removeCategory = document.querySelector("#category-remove-btn");
    const closeCategorySection = document.querySelector("#category-close-btn");

    newCategory.addEventListener("click", openCategorySection);
    addCategory.addEventListener("click", saveCategory);
    removeCategory.addEventListener("click", removeCategories);
    closeCategorySection.addEventListener("click", openCategorySection);

    // tag
    const newTag = document.querySelector("#new-tag-btn");
    const addTag = document.querySelector("#tag-add-btn");
    const removeTag = document.querySelector("#tag-remove-btn");
    const closeTagSection = document.querySelector("#tag-close-btn");

    newTag.addEventListener("click", openTagSection);
    addTag.addEventListener("click", saveTag);
    removeTag.addEventListener("click", removeTags);
    closeTagSection.addEventListener("click", openTagSection);

    // transaction
    const transactionList = document.querySelector("#transaction-list");
    const addTransactionForm = document.querySelector("#add-transaction-form");
    const viewTransactionForm = document.querySelector("#view-transaction-form");

    // new transaction
    const newTransaction = document.querySelector("#new-transaction-btn");
    const saveNewTransaction = document.querySelector("#add-transaction-save-btn");
    const cancelNewTransaction = document.querySelector("#add-transaction-cancel-btn");

    newTransaction.addEventListener("click", () => openForm(addTransactionForm));
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

    getChart(incomeChartOptions);
    getChart(expensesChartOptions);
    getChart(totalChartOptions);

    // getTotalChart("#transaction-chart",chartOptions);
};

init();
