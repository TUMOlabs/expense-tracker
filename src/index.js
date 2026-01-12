import {
    openForm,
    closeForm,
    saveFormData,
    editFormData,
    deleteFormData,
} from "./utils/transactionUtils";
import { getAll } from "./utils/storageUtils";
import { Transaction } from "./components/Transaction";
import { getChart } from "./charts";
import { incomeChartOptions, expensesChartOptions, totalChartOptions } from "./config/chartOptions";
import {
    loadCategories,
    openCategorySection,
    removeCategories,
    saveCategory,
} from "./utils/categoryUtils";
import { loadTags, openTagSection, removeTags, saveTag } from "./utils/tagUtils";

import { exportReport } from "./utils/exportReport";
import { aggregateEntries } from "./utils/aggregation";
import { detectAbnormalEntries } from "./utils/abnormalDetection";
import { sortTransactions } from "./utils/sortUtils";

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
        const transaction = event.target.closest(".transaction-entry");
        if (transaction) {
            currentActiveId = transaction.dataset.id;
            openForm(viewTransactionForm, currentActiveId);
        }
    });

    const saveTransaction = document.querySelector("#view-transaction-save-btn");
    const editTransaction = document.querySelector("#view-transaction-edit-btn");
    const deleteTransaction = document.querySelector("#view-transaction-delete-btn");
    const cancelTransaction = document.querySelector("#view-transaction-cancel-btn");

    saveTransaction.addEventListener("click", () => saveFormData(viewTransactionForm));
    editTransaction.addEventListener("click", () => editFormData(viewTransactionForm));
    deleteTransaction.addEventListener("click", () => deleteFormData(viewTransactionForm));
    cancelTransaction.addEventListener("click", () => closeForm(viewTransactionForm));

    // charts
    // sort
    const amountSortAsc = document.querySelector("#amount-sort-asc");
    const amountSortDesc = document.querySelector("#amount-sort-desc");
    const dateSortAsc = document.querySelector("#date-sort-asc");
    const dateSortDesc = document.querySelector("#date-sort-desc");
    const categorySortAsc = document.querySelector("#category-sort-asc");
    const categorySortDesc = document.querySelector("#category-sort-desc");

    amountSortAsc.addEventListener("click", () => sortTransactions("amount", "asc"));
    amountSortDesc.addEventListener("click", () => sortTransactions("amount", "desc"));
    dateSortAsc.addEventListener("click", () => sortTransactions("date", "asc"));
    dateSortDesc.addEventListener("click", () => sortTransactions("date", "desc"));
    categorySortAsc.addEventListener("click", () => sortTransactions("category", "asc"));
    categorySortDesc.addEventListener("click", () => sortTransactions("category", "desc"));

    getChart(incomeChartOptions);
    getChart(expensesChartOptions);
    getChart(totalChartOptions);

    const exportBtn = document.querySelector("#export-report-btn");

    if (exportBtn) {
        exportBtn.addEventListener("click", async () => {
            const entries = getAll(import.meta.env.VITE_TRANSACTIONS_KEY);

            const aggregates = {
                daily: aggregateEntries(entries, "daily"),
                weekly: aggregateEntries(entries, "weekly"),
            };

            const anomalies = detectAbnormalEntries(entries);

            await exportReport({
                entries,
                aggregates,
                anomalies,
            });
        });
    }
};

init();
