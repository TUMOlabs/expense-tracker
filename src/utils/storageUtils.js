function read(key) {
    try {
        const raw = localStorage.getItem(key);
        if (!raw) return [];
        const data = JSON.parse(raw);
        return Array.isArray(data) ? data : [];
    } catch {
        return [];
    }
}

function write(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

export function getAll(key) {
    return read(key);
}

export function getByID(key, id) {
    const items = read(key);
    return items.find((item) => item.id === id);
}

export function create(key, item) {
    const items = read(key);
    items.push({ id: crypto.randomUUID(), ...item });
    write(key, items);
    return item;
}

export function update(key, id, patch) {
    const items = read(key);
    const index = items.findIndex((item) => item.id === id);

    if (index === -1) return null;

    items[index] = { ...items[index], ...patch };
    write(key, items);
    return items[index];
}

export function remove(key, id) {
    const items = read(key);
    const next = items.filter((item) => item.id !== id);

    if (next.length === items.length) return false;

    write(key, next);
    return true;
}
