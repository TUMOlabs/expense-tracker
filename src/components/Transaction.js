export const Transaction = (data) => {
    const transaction = document.createElement("li");

    const title = document.createElement("div");
    const amount = document.createElement("div");
    const currency = document.createElement("div");
    const type = document.createElement("div");
    const date = document.createElement("div");
    const description = document.createElement("div");

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

    transaction.className = "transaction-entry";
    transaction.dataset.id = data.id;

    return transaction;
};
