export const Category = (data) => {
    const li = document.createElement("li");
    const checkbox = document.createElement("input");
    const label = document.createElement("label");

    checkbox.type = "checkbox";
    checkbox.id = "_" + data.id;

    label.htmlFor = "_" + data.id;
    label.textContent = " " + data.name;

    li.id = data.id;
    li.append(checkbox, label);

    return li;
};
