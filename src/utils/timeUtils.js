export const getDateFromString = (dateString) => {
    const dateObject = new Date(dateString);
    dateObject.setMinutes(dateObject.getMinutes() - dateObject.getTimezoneOffset());
    const date = dateObject.toISOString().split("T")[0];
    return date;
};

export const sortByDate = (data) => {
    const sorted = [...data];
    sorted.sort((a, b) => {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
    return sorted;
};

export const validateDate = (dateString) => {
    return Date.parse(dateString);
};
