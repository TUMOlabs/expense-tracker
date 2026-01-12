export const Transaction = (data) => {
    const transaction = document.createElement("li");

    const title = document.createElement("span");
    const type = document.createElement("span");
    const amount = document.createElement("span");
    const currency = document.createElement("span");
    const date = document.createElement("span");
    const category = document.createElement("span");
    const tag = document.createElement("span");
    // const flag = document.createElement("span");
    // const reason = document.createElement("span");
    // const impact = document.createElement("span");
    // const description = document.createElement("span");

    // fill ui elements with data
    title.textContent = data.title;
    type.textContent = data.type;
    amount.textContent = data.amount;
    currency.textContent = data.currency;
    date.textContent = data.date.split("T")[0];
    category.textContent = data.category === "none" ? "" : data.category;
    tag.textContent = data.tag === "none" ? "" : data.tag;
    // flag.textContent = data.flag;
    // reason.textContent = data.reason;
    // impact.textContent = data.impact;
    // description.textContent = data.description;

    // set "data-type" attribute
    title.dataset.type = "title";
    type.dataset.type = "type";
    amount.dataset.type = "amount";
    currency.dataset.type = "currency";
    date.dataset.type = "date";
    category.dataset.type = "category";
    tag.dataset.type = "tag";
    // flag.dataset.type = "flag";
    // reason.dataset.type = "reason";
    // impact.dataset.type = "impact";
    // description.dataset.type = "description";

    // compile the component
    transaction.append(
        title,
        type,
        amount,
        currency,
        date,
        category,
        tag
        // flag,
        // reason,
        // impact,
        // description
    );

    // data.type class for color coding (income/expense)
    transaction.classList.add("transaction-entry", data.type);
    // set "data-id" attribute to transaction id
    transaction.dataset.id = data.id;

    return transaction;
};
