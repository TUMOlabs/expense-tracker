import { getAll } from "./storageUtils";
import { Transaction } from "../components/Transaction";
import { Tag } from "../components/Tag";

const rerenderList = (data) => {
    const list = document.querySelector("#transaction-list");
    const listHeader = document.querySelector("#transaction-list-header");
    const fragment = document.createDocumentFragment();

    data.forEach((entry) => {
        fragment.appendChild(Transaction(entry));
    });

    list.replaceChildren(listHeader, fragment);
};

export const filterTagSelection = () => {
    const tagFilterSection = document.querySelector("#tag-filter-section");
    const dateFilterSection = document.querySelector("#date-filter-section");
    const categoryFilterSection = document.querySelector("#category-filter-section");

    if (!tagFilterSection.hidden) {
        tagFilterSection.hidden = true;
        return;
    }

    if (!dateFilterSection.hidden || !categoryFilterSection.hidden) {
        dateFilterSection.hidden = true;
        categoryFilterSection.hidden = true;
    }

    const data = getAll(import.meta.env.VITE_TAGS_KEY);
    const list = document.querySelector("#tag-filter-list");

    if (data && list.children.length === 0) {
        data.forEach((entry) => {
            list.appendChild(Tag(entry));
        });
    }

    tagFilterSection.hidden = false;
};

const getSelectedTags = () => {
    const list = document.querySelector("#tag-filter-list");
    const items = list.querySelectorAll("li");
    const selected = [];

    items.forEach((item) => {
        const checkbox = item.querySelector('input[type="checkbox"]');
        if (checkbox.checked) {
            selected.push(item.textContent.trim().toLowerCase());
        }
    });
    return selected;
};

export const filterTransactionsByTag = () => {
    const records = getAll(import.meta.env.VITE_TRANSACTIONS_KEY);
    const selectedTags = getSelectedTags();

    if (selectedTags.length) {
        const filtered = records.filter((record) => {
            return selectedTags.includes(record.tag.trim().toLowerCase());
        });

        rerenderList(filtered);
    } else {
        rerenderList(records);
    }

    const tagFilterSection = document.querySelector("#tag-filter-section");
    tagFilterSection.hidden = true;
};

export const filterCategorySelection = () => {
    const categoryFilterSection = document.querySelector("#category-filter-section");
    const tagFilterSection = document.querySelector("#tag-filter-section");
    const dateFilterSection = document.querySelector("#date-filter-section");

    if (!categoryFilterSection.hidden) {
        categoryFilterSection.hidden = true;
        return;
    }

    if (!dateFilterSection.hidden || !tagFilterSection.hidden) {
        dateFilterSection.hidden = true;
        tagFilterSection.hidden = true;
    }

    const data = getAll(import.meta.env.VITE_CATEGORIES_KEY);
    const list = document.querySelector("#category-filter-list");

    if (data && list.children.length === 0) {
        data.forEach((entry) => {
            list.appendChild(Tag(entry));
        });
    }

    categoryFilterSection.hidden = false;
};

const getSelectedCategories = () => {
    const list = document.querySelector("#category-filter-list");
    const items = list.querySelectorAll("li");
    const selected = [];

    items.forEach((item) => {
        const checkbox = item.querySelector('input[type="checkbox"]');
        if (checkbox.checked) {
            selected.push(item.textContent.trim().toLowerCase());
        }
    });
    return selected;
};

export const filterTransactionsByCategory = () => {
    const records = getAll(import.meta.env.VITE_TRANSACTIONS_KEY);
    const selectedCategories = getSelectedCategories();

    if (selectedCategories.length) {
        const filtered = records.filter((record) => {
            return selectedCategories.includes(record.category.trim().toLowerCase());
        });

        rerenderList(filtered);
    } else {
        rerenderList(records);
    }

    const categoryFilterSection = document.querySelector("#category-filter-section");
    categoryFilterSection.hidden = true;
};

export const filterDateSelection = () => {
    const dateFilterSection = document.querySelector("#date-filter-section");
    const categoryFilterSection = document.querySelector("#category-filter-section");
    const tagFilterSection = document.querySelector("#tag-filter-section");

    if (!dateFilterSection.hidden) {
        dateFilterSection.hidden = true;
        return;
    }

    if (!categoryFilterSection.hidden || !tagFilterSection.hidden) {
        categoryFilterSection.hidden = true;
        tagFilterSection.hidden = true;
    }

    dateFilterSection.hidden = false;
};

const getSelectedDates = () => {
    const form = document.querySelector("#date-filter-form");
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    return data;
};

export const filterTransactionsByDate = () => {
    const records = getAll(import.meta.env.VITE_TRANSACTIONS_KEY);
    const selectedDates = getSelectedDates();
    if (selectedDates.from && selectedDates.to) {
        const filtered = records.filter((record) => {
            const from = new Date(selectedDates.from).getTime();
            const to = new Date(selectedDates.to).getTime();
            const current = new Date(record.date).getTime();
            return from <= current && current <= to;
        });
        rerenderList(filtered);
    }

    const dateFilterSection = document.querySelector("#date-filter-section");
    dateFilterSection.hidden = true;
};
