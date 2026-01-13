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

// currently selected transaction id. passed to a form as data-id
import { exportReport } from "./utils/exportReport";
import { aggregateEntries } from "./utils/aggregation";
import { detectAbnormalEntries } from "./utils/abnormalDetection";
import { sortTransactions } from "./utils/sortUtils";

import {
    filterCategorySelection,
    filterTransactionsByCategory,
    filterTagSelection,
    filterTransactionsByTag,
    filterDateSelection,
    filterTransactionsByDate,
} from "./utils/filterUtils";

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

const setSortUI = (group, dir) => {
    const ascBtn = document.querySelector(`#${group}-sort-asc`);
    const descBtn = document.querySelector(`#${group}-sort-desc`);

    if (!ascBtn || !descBtn) return;

    const activate = (btn) => {
        btn.classList.add("sort-active");
        btn.classList.remove("sort-inactive");
    };

    const deactivate = (btn) => {
        btn.classList.remove("sort-active");
        btn.classList.add("sort-inactive");
    };

    if (dir === "asc") {
        activate(ascBtn);
        deactivate(descBtn);
    } else {
        activate(descBtn);
        deactivate(ascBtn);
    }
};

const resetOtherSorts = (currentGroup) => {
    ["amount", "date", "category"].forEach((group) => {
        if (group === currentGroup) return;

        const ascBtn = document.querySelector(`#${group}-sort-asc`);
        const descBtn = document.querySelector(`#${group}-sort-desc`);

        ascBtn?.classList.remove("sort-active", "sort-inactive");
        descBtn?.classList.remove("sort-active", "sort-inactive");
    });
};

// charts
export const incomeChart = getChart(incomeChartOptions);
export const expensesChart = getChart(expensesChartOptions);
export const totalChart = getChart(totalChartOptions);

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

    const newTransaction = document.querySelector("#new-transaction-btn");
    const saveNewTransaction = document.querySelector("#add-transaction-save-btn");
    const cancelNewTransaction = document.querySelector("#add-transaction-cancel-btn");

    newTransaction.addEventListener("click", () => openForm(addTransactionForm));
    saveNewTransaction.addEventListener("click", () => saveFormData(addTransactionForm));
    cancelNewTransaction.addEventListener("click", () => closeForm(addTransactionForm));

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

    // sort
    const amountSortAsc = document.querySelector("#amount-sort-asc");
    const amountSortDesc = document.querySelector("#amount-sort-desc");
    const dateSortAsc = document.querySelector("#date-sort-asc");
    const dateSortDesc = document.querySelector("#date-sort-desc");
    const categorySortAsc = document.querySelector("#category-sort-asc");
    const categorySortDesc = document.querySelector("#category-sort-desc");

    amountSortAsc.addEventListener("click", () => {
        resetOtherSorts("amount");
        setSortUI("amount", "asc");
        sortTransactions("amount", "asc");
    });

    amountSortDesc.addEventListener("click", () => {
        resetOtherSorts("amount");
        setSortUI("amount", "desc");
        sortTransactions("amount", "desc");
    });

    dateSortAsc.addEventListener("click", () => {
        resetOtherSorts("date");
        setSortUI("date", "asc");
        sortTransactions("date", "asc");
    });

    dateSortDesc.addEventListener("click", () => {
        resetOtherSorts("date");
        setSortUI("date", "desc");
        sortTransactions("date", "desc");
    });

    categorySortAsc.addEventListener("click", () => {
        resetOtherSorts("category");
        setSortUI("category", "asc");
        sortTransactions("category", "asc");
    });

    categorySortDesc.addEventListener("click", () => {
        resetOtherSorts("category");
        setSortUI("category", "desc");
        sortTransactions("category", "desc");
    });

    // filter
    const categoryFilter = document.querySelector("#category-filter");
    const categoryFilterButton = document.querySelector("#category-filter-btn");
    const tagFilter = document.querySelector("#tag-filter");
    const tagFilterButton = document.querySelector("#tag-filter-btn");
    const dateFilter = document.querySelector("#date-filter");
    const dateFilterButton = document.querySelector("#date-filter-btn");

    categoryFilter.addEventListener("click", () => filterCategorySelection());
    categoryFilterButton.addEventListener("click", () => filterTransactionsByCategory());
    tagFilter.addEventListener("click", () => filterTagSelection());
    tagFilterButton.addEventListener("click", () => filterTransactionsByTag());
    dateFilter.addEventListener("click", () => filterDateSelection());
    dateFilterButton.addEventListener("click", () => filterTransactionsByDate());

    // export
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
