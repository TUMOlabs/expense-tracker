import { create, getAll, remove } from "./storageUtils";
import { Category } from "../components/Category";

export const loadCategories = () => {
    const data = getAll(import.meta.env.VITE_CATEGORIES_KEY);
    const list = document.querySelector("#category-list");

    if (data && list.children.length === 0) {
        data.forEach((entry) => {
            list.appendChild(Category(entry));
        });
    }
};

export const loadCategoriesIntoForm = (target) => {
    const data = getAll(import.meta.env.VITE_CATEGORIES_KEY);
    const dropdown = document.querySelector(target);

    if (data && dropdown.children.length <= 2) {
        data.forEach((entry) => {
            const option = document.createElement("option");
            option.value = entry.name;
            option.textContent = entry.name;
            option.id = entry.id;
            dropdown.appendChild(option);
        });
    }
};

export const saveCategory = () => {
    const input = document.querySelector("#category-name");
    const name = input.value.trim();

    if (name !== "") {
        const newName = create(import.meta.env.VITE_CATEGORIES_KEY, { name });
        const list = document.querySelector("#category-list");

        list.appendChild(Category(newName));
        input.value = "";
    }
};

export const removeCategories = () => {
    const list = document.querySelector("#category-list");
    const items = list.querySelectorAll("li");

    items.forEach((item) => {
        const checkbox = item.querySelector('input[type="checkbox"]');
        if (checkbox.checked) {
            remove(import.meta.env.VITE_CATEGORIES_KEY, item.id);
            list.removeChild(item);
        }
    });
};

export const openCategorySection = () => {
    const categorySection = document.querySelector("#category-section");

    if (categorySection.hidden) {
        categorySection.hidden = false;
        loadCategories();
    } else {
        categorySection.hidden = true;
    }
};
