import { create, getAll, remove } from "./storageUtils";
import { Tag } from "../components/Tag";

export const loadTags = () => {
    const data = getAll(import.meta.env.VITE_TAGS_KEY);
    const list = document.querySelector("#tag-list");

    if (data && list.children.length === 0) {
        data.forEach((entry) => {
            list.appendChild(Tag(entry));
        });
    }
};

export const loadTagsIntoForm = (target) => {
    const data = getAll(import.meta.env.VITE_TAGS_KEY);
    const dropdown = document.querySelector(target);

    if (data && dropdown.children.length <= 2) {
        console.log(target);
        data.forEach((entry) => {
            const option = document.createElement("option");
            option.value = entry.name;
            option.textContent = entry.name;
            option.id = entry.id;
            dropdown.appendChild(option);
        });
    }
};

export const saveTag = () => {
    const input = document.querySelector("#tag-name");
    const name = input.value.trim();

    if (name !== "") {
        const newName = create(import.meta.env.VITE_TAGS_KEY, { name });
        const list = document.querySelector("#tag-list");

        list.appendChild(Tag(newName));
        input.value = "";
    }
};

export const removeTags = () => {
    const list = document.querySelector("#tag-list");
    const items = list.querySelectorAll("li");

    items.forEach((item) => {
        const checkbox = item.querySelector('input[type="checkbox"]');
        if (checkbox.checked) {
            remove(import.meta.env.VITE_TAGS_KEY, item.id);
            list.removeChild(item);
        }
    });
};

export const openTagSection = () => {
    const tagSection = document.querySelector("#tag-section");

    if (tagSection.hidden) {
        tagSection.hidden = false;
        loadTags();
    } else {
        tagSection.hidden = true;
    }
};
