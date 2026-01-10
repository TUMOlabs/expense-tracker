export const Transaction = (data) => {
    const transaction = document.createElement("li");

    const title = document.createElement("span");
    const amount = document.createElement("span");
    const currency = document.createElement("span");
    const type = document.createElement("span");
    const date = document.createElement("span");
    const description = document.createElement("span");

    title.textContent = data.title;
    amount.textContent = data.amount;
    currency.textContent = data.currency;
    type.textContent = data.type;
    date.textContent = data.date;
    description.textContent = data.description;

    title.dataset.type = "title";
    amount.dataset.type = "amount";
    currency.dataset.type = "currency";
    type.dataset.type = "type";
    date.dataset.type = "date";
    description.dataset.type = "description";

    transaction.appendChild(title);
    transaction.appendChild(amount);
    transaction.appendChild(currency);
    transaction.appendChild(type);
    transaction.appendChild(date);
    transaction.appendChild(description);

    transaction.classList.add("transaction-entry", data.type);
    transaction.dataset.id = data.id;

    return transaction;
};
